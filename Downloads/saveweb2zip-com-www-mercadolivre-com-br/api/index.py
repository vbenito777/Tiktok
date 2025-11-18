"""
Vercel Serverless Function para o backend FastAPI
"""
from mangum import Mangum
import sys
import os

# Adicionar o diretório raiz ao path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, 'backend')

# Adicionar paths necessários
sys.path.insert(0, root_dir)
sys.path.insert(0, backend_dir)

# Importar o app do FastAPI
from backend.main import app

# Wrapper para Vercel Serverless Functions
handler = Mangum(app, lifespan="off")

