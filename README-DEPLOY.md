# 🚀 Deploy do AgendaFácil na Railway

## 📦 Arquivos de Deploy Preparados

Este projeto já está **100% preparado** para deploy na Railway com:

✅ **Configuração de produção** com variáveis de ambiente  
✅ **Suporte a PostgreSQL** para banco de dados  
✅ **Build automático** do frontend React  
✅ **Servir arquivos estáticos** pelo Flask  
✅ **CORS configurado** para produção  
✅ **Health check** endpoint  
✅ **Gunicorn** para servidor de produção  

## 🔧 Arquivos Criados para Deploy

```
📁 Projeto/
├── railway.json          # Configuração da Railway
├── Procfile              # Comando de inicialização
├── build.sh/build.bat    # Scripts de build
├── deploy.md             # Guia detalhado de deploy
├── backend/
│   ├── requirements.txt  # Dependências Python (atualizadas)
│   ├── wsgi.py          # Ponto de entrada WSGI
│   ├── init_db.py       # Script de inicialização do BD
│   └── .env.example     # Exemplo de variáveis
└── frontend/
    └── .env.example     # Exemplo de variáveis React
```

## ⚡ Deploy Rápido (5 minutos)

### 1. Preparar Repositório
```bash
# Commitar todas as alterações
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Criar Projeto na Railway
```
1. Acesse: https://railway.app
2. Conecte com GitHub
3. Selecione o repositório
4. Railway detecta railway.json automaticamente
```

### 3. Configurar Variáveis (Obrigatórias)
```bash
FLASK_ENV=production
JWT_SECRET_KEY=SuaChaveSuperSecretaAqui123456789
```

### 4. Adicionar PostgreSQL
```
1. No dashboard: "+ New" → "Database" → "PostgreSQL"
2. Conectar ao serviço principal
3. DATABASE_URL é configurada automaticamente
```

### 5. Deploy Automático!
```
✅ Build do React acontece automaticamente
✅ Backend inicia com Gunicorn
✅ Banco de dados é criado automaticamente
✅ URL pública é gerada
```

## 🔍 Verificação Pós-Deploy

### URLs para Testar:
- **App:** `https://seu-projeto.railway.app`
- **Health:** `https://seu-projeto.railway.app/api/health`
- **API:** `https://seu-projeto.railway.app/api/auth/register`

### Status Esperado:
```json
// GET /api/health
{
  "status": "healthy",
  "message": "AgendaFácil API is running",
  "environment": "production"
}
```

## 🛠️ Configurações Avançadas

### Domínio Personalizado:
```bash
# Na Railway, aba "Settings" → "Domains"
CORS_ORIGINS=https://meudominio.com
```

### Múltiplos Ambientes:
```bash
# Produção
FLASK_ENV=production

# Staging  
FLASK_ENV=staging
```

## 🔧 Solução de Problemas

### ❌ Build Falha:
```bash
# Verifique logs na Railway
# Certifique-se que railway.json está correto
```

### ❌ CORS Error:
```bash
# Adicione variável CORS_ORIGINS
CORS_ORIGINS=https://seu-app.railway.app
```

### ❌ Database Error:
```bash
# Verifique se PostgreSQL está conectado
# DATABASE_URL deve existir automaticamente
```

## 📊 Recursos de Produção

### Monitoramento:
- **Logs em tempo real** na Railway
- **Métricas de performance** automáticas  
- **Health checks** configurados

### Escalabilidade:
- **Auto-scaling** baseado em carga
- **Zero-downtime deployments**
- **Rollback** instantâneo se necessário

### Segurança:
- **HTTPS** automático com certificados SSL
- **Variáveis de ambiente** criptografadas
- **CORS** restritivo em produção

## 💰 Estimativa de Custos

### Railway Pricing:
- **Hobby Plan:** $5/mês (suficiente para MVP)
- **Pro Plan:** $20/mês (para produção)
- **PostgreSQL:** Incluído no plano

### Recursos Inclusos:
- **Unlimited deploys**
- **Custom domains**  
- **SSL certificates**
- **Automatic backups**

## 🎯 Checklist Final

- [ ] Código commitado no GitHub
- [ ] railway.json configurado
- [ ] Variáveis de ambiente definidas
- [ ] PostgreSQL adicionado e conectado
- [ ] Build passou sem erros
- [ ] Health check respondendo
- [ ] Interface carregando corretamente
- [ ] Registro/Login funcionando
- [ ] Dashboard acessível
- [ ] CORS configurado para domínio

## 📞 Suporte

### Em caso de problemas:
1. **Logs da Railway:** Dashboard → Deployments → Logs
2. **Health Check:** `https://app.railway.app/api/health`  
3. **GitHub Issues:** Para reportar bugs
4. **Railway Discord:** Suporte da plataforma