#!/bin/bash
echo "🏗️ Building AgendaFácil for Production..."

# Construir o frontend React
echo "📦 Building React frontend..."
cd frontend
npm ci
CI=false npm run build

# Voltar para o diretório raiz
cd ..

# Instalar dependências do backend
echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

echo "✅ Build completed successfully!"
echo "📁 Static files are in: frontend/build/"
echo "🚀 Ready for deployment!"