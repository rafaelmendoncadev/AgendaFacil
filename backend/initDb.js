const Database = require('./config/database');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const db = new Database();
  
  try {
    console.log('Criando tabelas...');

    // Criar tabela de usuários
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de compromissos
    await db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de tarefas
    await db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Criar índices para melhor performance
    await db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)');

    console.log('Banco de dados inicializado com sucesso!');
    return db; // Mantém a conexão aberta
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    await db.close(); // Fecha a conexão em caso de erro
    throw error;
  }
}

if (require.main === module) {
  initDatabase().catch(err => {
    console.error('Erro ao inicializar banco de dados:', err);
  });
}

module.exports = initDatabase;