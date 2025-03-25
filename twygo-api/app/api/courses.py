from datetime import datetime
import os
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.encoders import jsonable_encoder
from app.models.course import Course, CourseUpdate, Lesson
from app.services.course import create_course, get_active_courses, get_course_by_id, update_course, delete_course
from fastapi.responses import StreamingResponse
from bson import ObjectId
from app.db.mongo import get_db
import gridfs
import tempfile
import whisper
import ffmpeg

router = APIRouter()
db, fs = get_db()



@router.post("/courses/")
async def add_course(
    title: str = Form(...),
    description: str = Form(...),
    end_date: str = Form(...),
    video: UploadFile = File(...)
):
    """Endpoint para cadastrar um curso, salvar vídeo no MongoDB GridFS e transcrever o áudio"""
    
    # Salvar vídeo no GridFS
    video_content = await video.read()
    video_size_mb = len(video_content) / (1024 * 1024)
    video.file.seek(0)
    video_id = fs.put(video.file, filename=video.filename)

    # Criar arquivo temporário para o vídeo
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        temp_video.write(video_content)
        video_path = temp_video.name

    # Extrair áudio e transcrever
    audio_path = video_path.replace(".mp4", ".wav")
    ffmpeg.input(video_path).output(audio_path, format="wav", ac=1, ar="16000").run(overwrite_output=True)

    model = whisper.load_model("small") 
    result = model.transcribe(audio_path)
    
    # Criar curso no banco
    course_data = Course(
        title=title,
        description=description,
        end_date=datetime.strptime(end_date, "%Y-%m-%d"),
        transcript=result["text"],
        video_size_mb=video_size_mb,
        video_id=str(video_id)
    )
    
    # Remover arquivos temporários
    os.unlink(video_path)
    os.unlink(audio_path)
    
    course_id = create_course(course_data)
    return {
        "id": course_id,
        "message": "Curso criado com sucesso",
        "video_id": str(video_id),
        "transcription": result["text"]
    }

@router.get("/courses/")
async def list_active_courses():
    courses = get_active_courses()
    return {"active_courses": courses}

@router.get("/courses/{course_id}")
async def get_course(course_id: str):
    course = get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return jsonable_encoder({**course, "_id": str(course["_id"])})


@router.put("/courses/{course_id}")
async def edit_course(course_id: str, course_data: CourseUpdate):
    update_dict = course_data.dict(exclude_unset=True)
    result = update_course(course_id, update_dict)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return {"message": "Curso atualizado com sucesso"}

@router.delete("/courses/{course_id}")
async def remove_course(course_id: str):
    """Remove o curso, suas aulas e vídeos associados"""
    # Buscar o curso
    course = db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Deletar todas as aulas associadas e seus vídeos
    lessons = db.lessons.find({"course_id": ObjectId(course_id)})
    for lesson in lessons:
        if "video_id" in lesson and lesson["video_id"]:
            try:
                fs.delete(ObjectId(lesson["video_id"]))
            except gridfs.errors.NoFile:
                pass  # Ignorar se o vídeo não existir
        db.lessons.delete_one({"_id": lesson["_id"]})

    # Deletar o curso
    result = delete_course(course_id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Deletar o vídeo do curso (se ainda existir, para compatibilidade com o código antigo)
    if "video_id" in course and course["video_id"]:
        try:
            fs.delete(ObjectId(course["video_id"]))
        except gridfs.errors.NoFile:
            pass

    return {"message": "Curso, aulas e vídeos removidos com sucesso"}

@router.get("/courses/{course_id}/video")
async def get_video(course_id: str):
    """Retorna o vídeo de um curso pelo GridFS"""
    course = db.courses.find_one({"_id": ObjectId(course_id)})
    if not course or "video_id" not in course:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    try:
        video_file = fs.get(ObjectId(course["video_id"]))
        return StreamingResponse(video_file, media_type="video/mp4")
    except gridfs.errors.NoFile:
        raise HTTPException(status_code=404, detail="Arquivo de vídeo não encontrado no GridFS")
    
@router.post("/courses/{course_id}/lessons/")
async def add_lesson(
    course_id: str,
    title: str = Form(...),
    description: str = Form(...),
    video: UploadFile = File(...)
):
    """Endpoint para cadastrar uma aula em um curso com transcrição de áudio"""
    # Verificar se o curso existe
    course = db.courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Salvar o vídeo no GridFS
    video_content = await video.read()
    video_size_mb = len(video_content) / (1024 * 1024)
    video.file.seek(0)
    video_id = fs.put(video.file, filename=video.filename)

    # Criar arquivo temporário para o vídeo
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
        temp_video.write(video_content)
        video_path = temp_video.name

    # Extrair áudio e transcrever
    audio_path = video_path.replace(".mp4", ".wav")
    ffmpeg.input(video_path).output(audio_path, format="wav", ac=1, ar="16000").run(overwrite_output=True)

    model = whisper.load_model("small")
    transcription_result = model.transcribe(audio_path)  # Renomeei para evitar conflito

    # Criar a aula
    lesson_data = Lesson(
        title=title,
        description=description,
        video_id=str(video_id),
        video_size_mb=video_size_mb,
        transcript=transcription_result["text"]  # Usando o resultado da transcrição
    ).dict()

    # Adicionar o course_id à aula
    lesson_data["course_id"] = ObjectId(course_id)

    # Inserir a aula na coleção lessons
    insert_result = db.lessons.insert_one(lesson_data)  # Renomeei para evitar conflito
    
    # Remover arquivos temporários
    os.unlink(video_path)
    os.unlink(audio_path)

    return {
        "id": str(insert_result.inserted_id),
        "message": "Aula adicionada com sucesso",
        "video_id": str(video_id),
        "transcription": transcription_result["text"]  # Usando o resultado correto
    }

@router.get("/courses/{course_id}/lessons/")
async def list_course_lessons(course_id: str):
    """Endpoint para listar todas as aulas de um curso"""
    # Verificar se o curso existe
    if not db.courses.find_one({"_id": ObjectId(course_id)}):
        raise HTTPException(status_code=404, detail="Curso não encontrado")

    # Buscar todas as aulas do curso
    lessons = db.lessons.find({"course_id": ObjectId(course_id)})
    return {"lessons": [jsonable_encoder({**lesson, "_id": str(lesson["_id"]), "course_id": str(lesson["course_id"])}) for lesson in lessons]}