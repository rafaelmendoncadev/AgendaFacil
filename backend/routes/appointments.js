const express = require('express');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar compromissos
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const filters = {};
    
    if (date) {
      // Validar formato da data
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
      }
      filters.date = date;
    }

    const appointmentModel = new Appointment(req.db);
    const appointments = await appointmentModel.findByUserId(req.userId, filters);
    
    res.json({
      appointments: appointments.map(app => appointmentModel.toDict(app))
    });
    
  } catch (error) {
    console.error('Erro ao listar compromissos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar compromisso
router.post('/', async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Título, data e horário são obrigatórios' });
    }

    // Validar formato da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
    }

    // Validar formato do horário
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return res.status(400).json({ error: 'Formato de horário inválido. Use HH:MM' });
    }

    const appointmentModel = new Appointment(req.db);
    const appointment = await appointmentModel.create({
      user_id: req.userId,
      title,
      description: description || '',
      date,
      time
    });
    
    res.status(201).json({
      message: 'Compromisso criado com sucesso',
      appointment: appointmentModel.toDict(appointment)
    });
    
  } catch (error) {
    console.error('Erro ao criar compromisso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar compromisso
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar formato da data se fornecida
    if (updateData.date && !/^\d{4}-\d{2}-\d{2}$/.test(updateData.date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
    }

    // Validar formato do horário se fornecido
    if (updateData.time && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(updateData.time)) {
      return res.status(400).json({ error: 'Formato de horário inválido. Use HH:MM' });
    }

    const appointmentModel = new Appointment(req.db);
    const appointment = await appointmentModel.update(id, req.userId, updateData);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Compromisso não encontrado' });
    }
    
    res.json({
      message: 'Compromisso atualizado com sucesso',
      appointment: appointmentModel.toDict(appointment)
    });
    
  } catch (error) {
    console.error('Erro ao atualizar compromisso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir compromisso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const appointmentModel = new Appointment(req.db);
    const deleted = await appointmentModel.delete(id, req.userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Compromisso não encontrado' });
    }
    
    res.json({ message: 'Compromisso excluído com sucesso' });
    
  } catch (error) {
    console.error('Erro ao excluir compromisso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;