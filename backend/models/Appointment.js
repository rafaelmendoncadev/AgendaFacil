const { v4: uuidv4 } = require('uuid');

class Appointment {
  constructor(database) {
    this.db = database;
  }

  async create({ user_id, title, description, date, time }) {
    const id = uuidv4();
    
    await this.db.run(
      'INSERT INTO appointments (id, user_id, title, description, date, time) VALUES (?, ?, ?, ?, ?, ?)',
      [id, user_id, title, description || '', date, time]
    );
    
    return this.findById(id);
  }

  async findById(id) {
    const rows = await this.db.query('SELECT * FROM appointments WHERE id = ?', [id]);
    return rows.length > 0 ? this.formatAppointment(rows[0]) : null;
  }

  async findByUserId(userId, filters = {}) {
    let sql = 'SELECT * FROM appointments WHERE user_id = ?';
    const params = [userId];

    if (filters.date) {
      sql += ' AND date = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY date ASC, time ASC';

    const rows = await this.db.query(sql, params);
    return rows.map(row => this.formatAppointment(row));
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
    if (updateData.date !== undefined) {
      updateFields.push('date = ?');
      params.push(updateData.date);
    }
    if (updateData.time !== undefined) {
      updateFields.push('time = ?');
      params.push(updateData.time);
    }

    if (updateFields.length === 0) {
      return this.findByUserAndId(id, userId);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id, userId);

    const sql = `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`;
    
    const result = await this.db.run(sql, params);
    
    if (result.changes === 0) {
      return null;
    }

    return this.findByUserAndId(id, userId);
  }

  async delete(id, userId) {
    const result = await this.db.run(
      'DELETE FROM appointments WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    return result.changes > 0;
  }

  async findByUserAndId(id, userId) {
    const rows = await this.db.query(
      'SELECT * FROM appointments WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0 ? this.formatAppointment(rows[0]) : null;
  }

  formatAppointment(appointmentData) {
    return {
      id: appointmentData.id,
      user_id: appointmentData.user_id,
      title: appointmentData.title,
      description: appointmentData.description,
      date: appointmentData.date,
      time: appointmentData.time,
      created_at: appointmentData.created_at,
      updated_at: appointmentData.updated_at
    };
  }

  toDict(appointmentData) {
    return {
      id: appointmentData.id,
      user_id: appointmentData.user_id,
      title: appointmentData.title,
      description: appointmentData.description,
      date: appointmentData.date,
      time: appointmentData.time,
      created_at: appointmentData.created_at,
      updated_at: appointmentData.updated_at
    };
  }
}

module.exports = Appointment;