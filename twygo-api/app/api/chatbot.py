from fastapi import APIRouter
from app.services.chatbot import ask_chatbot

router = APIRouter()

@router.post("/chatbot/")
async def chatbot_response(prompt: str):
    response = ask_chatbot(prompt)
    return {"response": response}
