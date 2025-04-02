# reports.py
from fastapi import APIRouter, HTTPException
from src.db.mongo import get_db
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter()
db, _ = get_db()

@router.get("/reports/video-size")
async def get_video_size_report(
    course_id: Optional[str] = None,
    lesson_id: Optional[str] = None,
    scope: Optional[str] = None
):
    """
    Relatório de tamanho de vídeos com filtros:
    - course_id: ID do curso (opcional)
    - lesson_id: ID de uma lição específica (opcional)
    - scope: 'intro' (apenas vídeo introdutório), 'lessons' (apenas lições), 'full' (tudo) (opcional)
    Se nenhum filtro for fornecido, retorna todos os cursos e lições.
    """
    
    # Validação inicial
    if lesson_id and not course_id:
        raise HTTPException(status_code=400, detail="É necessário especificar course_id quando lesson_id é fornecido")
    
    if scope and scope not in ["intro", "lessons", "full"]:
        raise HTTPException(status_code=400, detail="Scope deve ser 'intro', 'lessons' ou 'full'")

    # Caso 1: Relatório de uma lição específica
    if lesson_id:
        lesson = db.lessons.find_one({"_id": ObjectId(lesson_id), "course_id": ObjectId(course_id)})
        if not lesson:
            raise HTTPException(status_code=404, detail="Lição não encontrada")
        return {
            "type": "lesson",
            "lesson_id": lesson_id,
            "course_id": course_id,
            "title": lesson["title"],
            "video_size_mb": lesson["video_size_mb"],
            "generated_at": datetime.utcnow().isoformat()
        }

    # Caso 2: Relatório de um curso específico
    if course_id:
        course = db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            raise HTTPException(status_code=404, detail="Curso não encontrado")

        report = {
            "type": "course",
            "course_id": course_id,
            "course_title": course["title"],
            "generated_at": datetime.utcnow().isoformat()
        }

        intro_size = course["video_size_mb"]
        lessons = list(db.lessons.find({"course_id": ObjectId(course_id)}))
        lessons_size = sum(lesson["video_size_mb"] for lesson in lessons)

        if scope == "intro":
            report["video_size_mb"] = intro_size
            report["details"] = {"intro_video_size_mb": intro_size}
        elif scope == "lessons":
            report["video_size_mb"] = lessons_size
            report["details"] = {
                "lessons_count": len(lessons),
                "lessons_size_mb": lessons_size,
                "lessons": [{"id": str(l["_id"]), "title": l["title"], "size_mb": l["video_size_mb"]} for l in lessons]
            }
        else:  # scope == "full" ou None
            total_size = intro_size + lessons_size
            report["video_size_mb"] = total_size
            report["details"] = {
                "intro_video_size_mb": intro_size,
                "lessons_count": len(lessons),
                "lessons_size_mb": lessons_size,
                "lessons": [{"id": str(l["_id"]), "title": l["title"], "size_mb": l["video_size_mb"]} for l in lessons]
            }
        
        return report

    # Caso 3: Nenhum filtro - retorna todos os cursos e lições
    if not course_id and not lesson_id and not scope:
        courses = list(db.courses.find())
        if not courses:
            return {
                "type": "general",
                "message": "Nenhum curso encontrado",
                "data": [],
                "generated_at": datetime.utcnow().isoformat()
            }

        report_data = []
        total_size_all = 0

        for course in courses:
            course_id = str(course["_id"])
            intro_size = course["video_size_mb"]
            lessons = list(db.lessons.find({"course_id": ObjectId(course_id)}))
            lessons_size = sum(lesson["video_size_mb"] for lesson in lessons)
            total_course_size = intro_size + lessons_size

            course_data = {
                "course_id": course_id,
                "course_title": course["title"],
                "total_size_mb": total_course_size,
                "intro_video_size_mb": intro_size,
                "lessons": [
                    {
                        "lesson_id": str(lesson["_id"]),
                        "title": lesson["title"],
                        "video_size_mb": lesson["video_size_mb"]
                    }
                    for lesson in lessons
                ]
            }
            report_data.append(course_data)
            total_size_all += total_course_size

        return {
            "type": "general",
            "total_size_mb": total_size_all,
            "courses_count": len(courses),
            "data": report_data,
            "generated_at": datetime.utcnow().isoformat()
        }

    # Caso 4: Relatório geral com scope
    courses = list(db.courses.find())
    total_intro_size = sum(course["video_size_mb"] for course in courses)
    lessons = list(db.lessons.find())
    total_lessons_size = sum(lesson["video_size_mb"] for lesson in lessons)
    
    report = {
        "type": "general",
        "generated_at": datetime.utcnow().isoformat()
    }
    
    if scope == "intro":
        report["video_size_mb"] = total_intro_size
        report["details"] = {
            "courses_count": len(courses),
            "intro_videos_size_mb": total_intro_size
        }
    elif scope == "lessons":
        report["video_size_mb"] = total_lessons_size
        report["details"] = {
            "lessons_count": len(lessons),
            "lessons_size_mb": total_lessons_size
        }
    else:  # scope == "full"
        total_size = total_intro_size + total_lessons_size
        report["video_size_mb"] = total_size
        report["details"] = {
            "courses_count": len(courses),
            "intro_videos_size_mb": total_intro_size,
            "lessons_count": len(lessons),
            "lessons_size_mb": total_lessons_size
        }
    
    return report