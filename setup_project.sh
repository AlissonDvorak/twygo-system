#!/bin/bash

# Nome do projeto
PROJECT_NAME="twygo-api"

# Criar diretório do projeto
mkdir -p $PROJECT_NAME/app/{api,models,services,db,config}

# Criar arquivos dentro das pastas
touch $PROJECT_NAME/app/api/{__init__.py,courses.py,chatbot.py,reports.py}
touch $PROJECT_NAME/app/models/{__init__.py,course.py}
touch $PROJECT_NAME/app/services/{__init__.py,chatbot.py,course.py}
touch $PROJECT_NAME/app/db/{__init__.py,mongo.py}
touch $PROJECT_NAME/app/config/{__init__.py,settings.py}
touch $PROJECT_NAME/app/main.py

# Criar arquivos na raiz
touch $PROJECT_NAME/.env
touch $PROJECT_NAME/requirements.txt
touch $PROJECT_NAME/Dockerfile
touch $PROJECT_NAME/README.md

# Mensagem de sucesso
echo "Estrutura de projeto criada em '$PROJECT_NAME'"