# 📋 Comandos Prontos para Deploy - Railway

## 🚀 1. Preparar Repositório

```bash
# Adicionar todos os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "🚀 Ready for Railway deployment - All configurations updated"

# Push para o repositório
git push origin main
```

## 🔧 2. Variáveis de Ambiente (Railway Dashboard)

**Copie e cole no painel Variables da Railway:**

```bash
FLASK_ENV=production
JWT_SECRET_KEY=SUA_CHAVE_SECRETA_SUPER_FORTE_AQUI_123456789
CORS_ORIGINS=https://seu-app-name.railway.app
```

> ⚠️ **IMPORTANTE**: Substitua `SUA_CHAVE_SECRETA_SUPER_FORTE_AQUI_123456789` por uma chave realmente segura!

## 🧪 3. Comandos de Teste Pós-Deploy

### Testar Health Check:
```bash
curl https://seu-app-name.railway.app/api/health
```
**Resposta esperada:**
```json
{"status": "healthy", "timestamp": "2024-01-XX..."}
```

### Testar Registro de Usuário:
```bash
curl -X POST https://seu-app-name.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Teste",
    "email": "teste@email.com",
    "password": "123456"
  }'
```

### Testar Login:
```bash
curl -X POST https://seu-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "123456"
  }'
```

## 🔍 4. Verificação Local (Antes do Deploy)

```bash
# Executar verificação completa
# Verificação removida - não mais necessária

# Testar build do frontend localmente
cd frontend
npm ci
CI=false npm run build
cd ..

# Testar backend localmente
cd backend
npm install
npm start
```

## 🛠️ 5. Comandos de Debug (Se necessário)

### Ver logs da Railway:
```bash
# Instalar Railway CLI (opcional)
npm install -g @railway/cli

# Login e ver logs
railway login
railway logs
```

### Testar conexão com banco:
```bash
# No terminal da Railway ou localmente com DATABASE_URL
python -c "
from backend.app import app, db
with app.app_context():
    try:
        db.create_all()
        print('✅ Banco conectado com sucesso!')
    except Exception as e:
        print(f'❌ Erro no banco: {e}')
"
```

## 📱 6. URLs Importantes

**Substitua `seu-app-name` pelo nome real do seu app na Railway:**

- **Frontend**: https://seu-app-name.railway.app
- **API Base**: https://seu-app-name.railway.app/api/
- **Health Check**: https://seu-app-name.railway.app/api/health
- **Login**: https://seu-app-name.railway.app/api/auth/login
- **Register**: https://seu-app-name.railway.app/api/auth/register

## 🎯 7. Checklist Final

- [ ] ✅ Código commitado e pushed
- [ ] ✅ Projeto criado na Railway
- [ ] ✅ PostgreSQL adicionado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Deploy executado com sucesso
- [ ] ✅ Health check funcionando
- [ ] ✅ Frontend carregando
- [ ] ✅ API respondendo
- [ ] ✅ Registro/login funcionando

## 🆘 8. Comandos de Emergência

### Se precisar reverter:
```bash
# Voltar para commit anterior
git log --oneline -5
git reset --hard COMMIT_HASH
git push --force-with-lease origin main
```

### Se precisar limpar cache:
```bash
# Limpar cache do npm
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Se precisar recriar banco:
```bash
# No console da Railway ou localmente
cd backend && npm run init-db
```

---

## 🎉 PRONTO PARA DEPLOY!

**Todos os comandos estão prontos. Apenas execute na ordem e substitua as URLs pelos valores reais do seu projeto na Railway.**

**Boa sorte! 🚀**