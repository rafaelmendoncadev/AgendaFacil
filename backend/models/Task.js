const { v4: uuidv4 } = require('uuid');

class Task {
  constructor(database) {
    this.db = database;
  }

  async create({ user_id, title, description, priority = 'medium', status = 'pending', due_date }) {
    const id = uuidv4();
    
    await this.db.run(
      'INSERT INTO tasks (id, user_id, title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, user_id, title, description || '', priority, status, due_date]
    );
    
    return this.findById(id);
  }

  async findById(id) {
    const rows = await this.db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows.length > 0 ? this.formatTask(rows[0]) : null;
  }

  async findByUserId(userId, filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await this.db.query(sql, params);
    return rows.map(row => this.formatTask(row));
  }

  async update(id, userId, updateData) {
    const updateFields = [];
    const params = [];

    if (updateData.title !== undefined) {
      updateFields.push('title = ?');
      params.push(updateData.title);
    }
    if (updateData.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updateData.description);
    }
    if (updateData.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(updateData.priority)) {
        throw new Error('Prioridade inválida');
      }
      updateFields.push('priority = ?');
      params.push(updateData.priority);
    }
    if (updateData.status !== undefined) {
      if (!['pending', 'in_progress', 'completed'].includes(updateData.status)) {
        throw new Error('Status inválido');
      }
      updateFields.push('status = ?');
      params.push(updateData.status);
    }
    if (updateData.due_date !== undefined) {
      updateFields.push('due_date = ?');
      params.push(updateData.due_date);
    }

    if (updateFields.length === 0) {
      return this.findByUserAndId(id, userId);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, userId);

    const sql = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
    
    const result = await this.db.run(sql, params);
    
    if (result.changes === 0) {
      return null;
    }

    return this.findByUserAndId(id, userId);
  }

  async delete(id, userId) {
    const result = await this.db.run(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return result.changes > 0;
  }

  async findByUserAndId(id, userId) {
    const rows = await this.db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0 ? this.formatTask(rows[0]) : null;
  }

  formatTask(taskData) {
    return {
      id: taskData.id,
      user_id: taskData.user_id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      due_date: taskData.due_date,
      created_at: taskData.created_at,
      updated_at: taskData.updated_at
    };
  }

  toDict(taskData) {
    return {
      id: taskData.id,
      user_id: taskData.user_id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      due_date: taskData.due_date,
      created_at: taskData.created_at,
      updated_at: taskData.updated_at
    };
  }
}

module.exports = Task;