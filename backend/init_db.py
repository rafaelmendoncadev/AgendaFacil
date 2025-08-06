#!/usr/bin/env python3
"""
Script de inicialização do banco de dados para produção
"""
import os
from app import app, db

def init_database():
    """Inicializa o banco de dados com as tabelas necessárias"""
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        print("✅ Banco de dados inicializado com sucesso!")
        
        # Verificar se as tabelas foram criadas
        tables = db.engine.table_names()
        print(f"📋 Tabelas criadas: {', '.join(tables)}")

if __name__ == '__main__':
    init_database()