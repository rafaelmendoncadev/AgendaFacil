#!/usr/bin/env python3
"""
Script de verificação pré-deploy para Railway
Verifica se todas as configurações estão corretas antes do deploy
"""

import os
import sys
import json
from pathlib import Path

def check_file_exists(file_path, description):
    """Verifica se um arquivo existe"""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} - ARQUIVO NÃO ENCONTRADO")
        return False

def check_railway_config():
    """Verifica configuração do railway.json"""
    print("\n🔍 Verificando railway.json...")
    
    if not check_file_exists('railway.json', 'Configuração Railway'):
        return False
    
    try:
        with open('railway.json', 'r') as f:
            config = json.load(f)
        
        # Verificar campos obrigatórios
        required_fields = ['build', 'deploy']
        for field in required_fields:
            if field in config:
                print(f"✅ Campo '{field}' encontrado")
            else:
                print(f"❌ Campo '{field}' não encontrado")
                return False
        
        # Verificar comando de build
        build_cmd = config.get('build', {}).get('buildCommand', '')
        if 'CI=false' in build_cmd:
            print("✅ Build configurado com CI=false")
        else:
            print("⚠️  Build pode falhar sem CI=false")
        
        return True
    except json.JSONDecodeError:
        print("❌ railway.json contém JSON inválido")
        return False

def check_backend_files():
    """Verifica arquivos do backend"""
    print("\n🔍 Verificando arquivos do backend...")
    
    backend_files = [
        ('backend/app.py', 'Aplicação Flask principal'),
        ('backend/models.py', 'Modelos do banco de dados'),
        ('backend/requirements.txt', 'Dependências Python'),
        ('backend/wsgi.py', 'Ponto de entrada WSGI'),
        ('backend/init_db.py', 'Script de inicialização do BD'),
        ('backend/.env.example', 'Exemplo de variáveis de ambiente')
    ]
    
    all_ok = True
    for file_path, description in backend_files:
        if not check_file_exists(file_path, description):
            all_ok = False
    
    return all_ok

def check_frontend_files():
    """Verifica arquivos do frontend"""
    print("\n🔍 Verificando arquivos do frontend...")
    
    frontend_files = [
        ('frontend/package.json', 'Configuração do React'),
        ('frontend/src/App.tsx', 'Componente principal React'),
        ('frontend/.env.example', 'Exemplo de variáveis de ambiente')
    ]
    
    all_ok = True
    for file_path, description in frontend_files:
        if not check_file_exists(file_path, description):
            all_ok = False
    
    return all_ok

def check_requirements():
    """Verifica se todas as dependências estão listadas"""
    print("\n🔍 Verificando requirements.txt...")
    
    if not os.path.exists('backend/requirements.txt'):
        print("❌ requirements.txt não encontrado")
        return False
    
    with open('backend/requirements.txt', 'r') as f:
        requirements = f.read()
    
    required_packages = [
        'Flask',
        'Flask-SQLAlchemy',
        'Flask-CORS',
        'Flask-JWT-Extended',
        'bcrypt',
        'python-dotenv',
        'psycopg2-binary',
        'gunicorn'
    ]
    
    all_ok = True
    for package in required_packages:
        if package in requirements:
            print(f"✅ {package} encontrado")
        else:
            print(f"❌ {package} não encontrado")
            all_ok = False
    
    return all_ok

def check_environment_variables():
    """Verifica exemplos de variáveis de ambiente"""
    print("\n🔍 Verificando exemplos de variáveis de ambiente...")
    
    env_files = [
        'backend/.env.example',
        'frontend/.env.example'
    ]
    
    all_ok = True
    for env_file in env_files:
        if os.path.exists(env_file):
            print(f"✅ {env_file} encontrado")
            with open(env_file, 'r') as f:
                content = f.read()
                if 'production' in content.lower():
                    print(f"✅ {env_file} contém configurações de produção")
        else:
            print(f"❌ {env_file} não encontrado")
            all_ok = False
    
    return all_ok

def main():
    """Função principal de verificação"""
    print("🚀 VERIFICAÇÃO PRÉ-DEPLOY - RAILWAY")
    print("=" * 50)
    
    checks = [
        check_railway_config,
        check_backend_files,
        check_frontend_files,
        check_requirements,
        check_environment_variables
    ]
    
    all_passed = True
    for check in checks:
        if not check():
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 TODAS AS VERIFICAÇÕES PASSARAM!")
        print("✅ Projeto pronto para deploy na Railway")
        print("\n📋 Próximos passos:")
        print("1. git add . && git commit -m 'Ready for deploy'")
        print("2. git push origin main")
        print("3. Configurar na Railway com PostgreSQL")
        print("4. Definir variáveis: FLASK_ENV=production, JWT_SECRET_KEY")
        return 0
    else:
        print("❌ ALGUMAS VERIFICAÇÕES FALHARAM")
        print("🔧 Corrija os problemas antes do deploy")
        return 1

if __name__ == '__main__':
    sys.exit(main())