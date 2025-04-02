from fastapi import FastAPI
from src.api import courses, chatbot, reports
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Twygo API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Incluir rotas
app.include_router(courses.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API da Twygo!"}
