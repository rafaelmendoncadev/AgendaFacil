const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(database) {
    this.db = database;
  }

  async create({ name, email, password }) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    
    try {
      await this.db.run(
        'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
        [id, name, email, passwordHash]
      );
      
      return this.findById(id);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed: users.email')) {
        throw new Error('Este e-mail já está cadastrado');
      }
      throw error;
    }
  }

  async findById(id) {
    const rows = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length > 0 ? this.formatUser(rows[0]) : null;
  }

  async findByEmail(email) {
    const rows = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? this.formatUser(rows[0]) : null;
  }

  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }

  formatUser(userData) {
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password_hash: userData.password_hash,
      created_at: userData.created_at
    };
  }

  toDict(userData) {
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      created_at: userData.created_at
    };
  }
}

module.exports = User;