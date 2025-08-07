const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'instance', 'agenda_facil.db');
    
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
      } else {
        console.log('Conectado ao banco de dados SQLite.');
      }
    });

    // Habilitar foreign keys
    this.db.run('PRAGMA foreign_keys = ON;');
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Conexão com o banco de dados fechada.');
          resolve();
        }
      });
    });
  }
}

module.exports = Database;