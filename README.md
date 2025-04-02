# Twygo Project

Bem-vindo ao **Twygo Project**, uma plataforma educacional que combina um backend em **FastAPI** com um frontend em **Angular** para gerenciar cursos e lições. O backend utiliza **MongoDB** para armazenar dados, incluindo vídeos salvos no **GridFS**, e oferece funcionalidades como transcrição de áudio com **Whisper**, relatórios de tamanho de vídeo e um **chatbot** integrado. O frontend proporciona uma interface amigável para visualizar cursos, adicionar lições e interagir com o conteúdo.

Este projeto é **dockerizado** para facilitar a execução e o desenvolvimento, integrando backend, frontend e MongoDB em um único ambiente via **Docker Compose**.

## 📂 Estrutura do Projeto

```bash
twygo-project/
├── twygo-api/          # Backend em FastAPI
│   ├── app/
│   │   ├── api/       # Endpoints da API (cursos, relatórios, chatbot)
│   │   ├── models/    # Modelos de dados (Pydantic)
│   │   ├── services/  # Lógica de negócios
│   │   ├── db/        # Conexão com MongoDB
│   │   ├── config/    # Configurações
│   │   └── main.py    # Ponto de entrada do FastAPI
│   ├── requirements.txt
│   └── Dockerfile
├── twygo-front/        # Frontend em Angular
│   ├── src/           # Código-fonte do Angular
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile
├── docker-compose.yml  # Configuração do Docker Compose
└── README.md           # Este arquivo
```

## 🔧 Componentes

- **Backend (twygo-api):** Desenvolvido em Python com FastAPI, gerencia cursos e lições, salva vídeos no MongoDB GridFS, transcreve áudio com Whisper e fornece relatórios.
- **Frontend (twygo-front):** Construído em Angular, exibe cursos, permite adicionar lições e reproduzir vídeos, com gráficos interativos usando Chart.js.
- **MongoDB:** Banco de dados NoSQL para armazenar cursos, lições e arquivos de vídeo.

## ✅ Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Como Executar

### 1️⃣ Clone o Repositório

```bash
git clone <url-do-repositorio>
cd twygo-project
```

### 2️⃣ Inicie os Serviços

Na raiz do projeto (`twygo-project/`), execute:

```bash
docker-compose up --build
```

O `--build` garante que as imagens do backend e frontend sejam reconstruídas. Isso inicia os serviços:
- **Backend (FastAPI)**
- **Frontend (Angular)**
- **MongoDB**

### 3️⃣ Acesse a Aplicação

- **Frontend:** [http://localhost:4200](http://localhost:4200)
- **Backend (API):** [http://localhost:8000](http://localhost:8000)
- **MongoDB (opcional):** `mongodb://admin:secret@localhost:27017`

### 4️⃣ Parar os Serviços

Para parar os containers:
```bash
docker-compose down
```

Ou, para remover os volumes (dados do MongoDB):
```bash
docker-compose down -v
```

## 🛠️ Funcionalidades

- **Gerenciamento de Cursos:** Crie, edite e delete cursos com vídeos introdutórios.
- **Gerenciamento de Lições:** Adicione e remova lições com transcrição automática de áudio.
- **Relatórios:** Visualize relatórios de tamanho de vídeo com gráficos (barras e pizza).
- **Chatbot:** Interaja com um chatbot integrado aos cursos e lições.
- **Dockerizado:** Tudo configurado para rodar com um único comando.

## ⚠️ Notas

- O backend usa credenciais padrão do MongoDB (`admin:secret`). Para produção, altere-as no `docker-compose.yml` e no código.
- Durante o desenvolvimento, os volumes mapeados no backend (`./twygo-api:/app`) permitem alterações em tempo real no código Python.

## 🤝 Contribuição

Sinta-se à vontade para abrir **issues** ou **pull requests** com melhorias ou correções!


