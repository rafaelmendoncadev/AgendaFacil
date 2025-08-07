const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Database = require('./config/database');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const taskRoutes = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 5000;

// Configurar CORS
const isProduction = process.env.NODE_ENV === 'production';
const corsOrigins = isProduction 
  ? (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://agendafacil-production-49bf.up.railway.app'])
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para injetar conexão do banco
app.use((req, res, next) => {
  req.db = new Database();
  next();
});

// Servir arquivos estáticos do React (se existirem)
const frontendBuildPath = path.join(__dirname, 'public');
app.use(express.static(frontendBuildPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'AgendaFácil API Node.js is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/tasks', taskRoutes);

// Servir React app para qualquer rota não capturada pela API
app.get('*', (req, res) => {
  // Se o arquivo existe no build, serve ele
  const filePath = path.join(frontendBuildPath, req.path);
  if (require('fs').existsSync(filePath) && !require('fs').statSync(filePath).isDirectory()) {
    return res.sendFile(filePath);
  }
  
  // Senão, serve o index.html (para SPA routing)
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // Se não há build do frontend, retorna mensagem de API
  res.json({
    message: 'AgendaFácil API está funcionando!',
    note: 'Frontend não encontrado. Execute o build do React primeiro.'
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: isProduction ? 'Algo deu errado' : error.message
  });
});

// Inicializar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  
  // Inicializar banco de dados
  const initDb = require('./initDb');
  initDb().catch(err => {
    console.error('Erro ao inicializar banco de dados:', err);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor graciosamente...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor graciosamente...');
  process.exit(0);
});

module.exports = app;