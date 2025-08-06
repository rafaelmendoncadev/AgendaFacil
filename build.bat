@echo off
echo 🏗️ Building AgendaFácil for Production...

echo 📦 Building React frontend...
cd frontend
call npm ci
set CI=false && call npm run build

cd ..

echo 🐍 Installing Python dependencies...
cd backend
pip install -r requirements.txt

echo ✅ Build completed successfully!
echo 📁 Static files are in: frontend/build/
echo 🚀 Ready for deployment!