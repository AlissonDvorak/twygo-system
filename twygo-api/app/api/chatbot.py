from fastapi import APIRouter, HTTPException
from app.services.chatbot import ask_chatbot
from app.db.mongo import get_db
from bson import ObjectId

router = APIRouter()
db, _ = get_db()  # Conexão com o banco de dados

@router.post("/chatbot/")
async def chatbot_response(
    prompt: str,
    course_id: str = None,
    lesson_id: str = None
):
    """
    Endpoint para interagir com o chatbot, que atua como assistente de professor.
    Responde perguntas com base no conteúdo do curso ou aula, incluindo descrição, transcrição e metadados.
    - prompt: O texto enviado pelo usuário.
    - course_id: ID do curso (opcional).
    - lesson_id: ID da aula (opcional).
    """
    # Instrução inicial para o chatbot
    system_prompt = (
        "Você é um assistente de professor que ajuda alunos a entender o conteúdo de cursos. "
        "Responda às perguntas com base no contexto fornecido (descrição, transcrição e metadados do vídeo) "
        "e forneça explicações claras, úteis e educativas."
    )

    # Variáveis para armazenar o contexto
    description = ""
    transcript = ""
    metadata_context = ""

    # Buscar descrição, transcript e metadados do curso
    if course_id:
        course = db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")
        description = course.get("description", "")
        transcript = course.get("transcript", "")
        file_metadata = db.fs.files.find_one({"_id": ObjectId(course["video_id"])})
        if file_metadata:
            metadata_context = (
                f"Metadados: Tamanho: {file_metadata['length']} bytes, "
                f"Data de upload: {file_metadata['uploadDate']}"
            )

    # Buscar descrição, transcript e metadados da aula
    elif lesson_id:
        lesson = db.lessons.find_one({"_id": ObjectId(lesson_id)})
        if not lesson:
            raise HTTPException(status_code=404, detail="Aula não encontrada")
        description = lesson.get("description", "")
        transcript = lesson.get("transcript", "")
        file_metadata = db.fs.files.find_one({"_id": ObjectId(lesson["video_id"])})
        if file_metadata:
            metadata_context = (
                f"Metadados: Tamanho: {file_metadata['length']} bytes, "
                f"Data de upload: {file_metadata['uploadDate']}"
            )

    # Montar o prompt completo com instrução, descrição, transcrição, metadados e pergunta
    full_prompt = (
        f"{system_prompt}\n\n"
        f"Descrição do curso/aula: {description}\n\n"
        f"Transcrição do vídeo: {transcript}\n\n"
        f"{metadata_context}\n\n"
        f"Pergunta do aluno: {prompt}"
    )

    # Chamar o serviço do chatbot com o prompt completo
    response = ask_chatbot(full_prompt)
    return {"response": response}