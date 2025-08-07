const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const createToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET_KEY || 'sua-chave-secreta-muito-segura-para-desenvolvimento';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  
  return jwt.sign(
    { identity: userId },
    jwtSecret,
    { expiresIn }
  );
};

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const userModel = new User(req.db);
    const user = await userModel.create({ name, email, password });
    
    const accessToken = createToken(user.id);
    
    res.status(201).json({
      access_token: accessToken,
      user: userModel.toDict(user)
    });
    
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.message === 'Este e-mail já está cadastrado') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const userModel = new User(req.db);
    const user = await userModel.findByEmail(email);
    
    if (!user || !(await userModel.validatePassword(user, password))) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' });
    }
    
    const accessToken = createToken(user.id);
    
    res.json({
      access_token: accessToken,
      user: userModel.toDict(user)
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter usuário atual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userModel = new User(req.db);
    const user = await userModel.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ user: userModel.toDict(user) });
    
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;