from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv(override=True)
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def ask_chatbot(prompt: str):
    print(os.getenv("OPENAI_API_KEY"))
    """
    Função que interage com a API da OpenAI para gerar respostas.
    O chatbot atua como assistente de professor, usando o contexto fornecido no prompt.
    """
    # Separar o prompt em partes (system_prompt e user_prompt)
    # O prompt recebido já contém o system_prompt e o contexto combinados
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um assistente de professor que ajuda alunos a entender o conteúdo de cursos. Responda de forma clara, educativa e útil."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=100  # Aumentei o limite de tokens para respostas mais completas
    )
    return response.choices[0].message.content.strip()