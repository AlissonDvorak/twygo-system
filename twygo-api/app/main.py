from fastapi import FastAPI
from app.api import courses, chatbot

app = FastAPI(title="Twygo API", version="1.0")

# Incluir rotas
app.include_router(courses.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API da Twygo!"}
