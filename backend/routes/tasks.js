const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar tarefas
router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filters = {};
    
    if (status) {
      if (!['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }
      filters.status = status;
    }

    if (priority) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Prioridade inválida' });
      }
      filters.priority = priority;
    }

    const taskModel = new Task(req.db);
    const tasks = await taskModel.findByUserId(req.userId, filters);
    
    res.json({
      tasks: tasks.map(task => taskModel.toDict(task))
    });
    
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar tarefa
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', status = 'pending', due_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    // Validar prioridade
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Prioridade inválida' });
    }

    // Validar status
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Validar formato da data de vencimento se fornecida
    if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
    }

    const taskModel = new Task(req.db);
    const task = await taskModel.create({
      user_id: req.userId,
      title,
      description: description || '',
      priority,
      status,
      due_date: due_date || null
    });
    
    res.status(201).json({
      message: 'Tarefa criada com sucesso',
      task: taskModel.toDict(task)
    });
    
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar prioridade se fornecida
    if (updateData.priority && !['low', 'medium', 'high'].includes(updateData.priority)) {
      return res.status(400).json({ error: 'Prioridade inválida' });
    }

    // Validar status se fornecido
    if (updateData.status && !['pending', 'in_progress', 'completed'].includes(updateData.status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    // Validar formato da data de vencimento se fornecida
    if (updateData.due_date && updateData.due_date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(updateData.due_date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
    }

    const taskModel = new Task(req.db);
    const task = await taskModel.update(id, req.userId, updateData);
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json({
      message: 'Tarefa atualizada com sucesso',
      task: taskModel.toDict(task)
    });
    
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    if (error.message.includes('inválida')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir tarefa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const taskModel = new Task(req.db);
    const deleted = await taskModel.delete(id, req.userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json({ message: 'Tarefa excluída com sucesso' });
    
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;