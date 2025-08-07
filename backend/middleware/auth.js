const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token não fornecido ou mal formatado');
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    console.log('Token recebido:', token);
    const jwtSecret = process.env.JWT_SECRET_KEY || 'sua-chave-secreta-muito-segura-para-desenvolvimento';
    
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decodificado:', decoded);
    req.userId = decoded.identity || decoded.userId || decoded.id;
    
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
};

module.exports = authMiddleware;