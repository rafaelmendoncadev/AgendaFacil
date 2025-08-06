# 🚀 Deploy na Railway - AgendaFácil

## 📋 Pré-requisitos

1. **Conta na Railway** - https://railway.app
2. **GitHub/GitLab** - Repositório do projeto
3. **Código preparado** com as configurações de produção

## 🔧 Configuração na Railway

### 1. Criar Novo Projeto
```
1. Acesse railway.app
2. Clique em "New Project" 
3. Conecte com GitHub/GitLab
4. Selecione o repositório do AgendaFácil
```

### 2. Configurar Variáveis de Ambiente
Adicione as seguintes variáveis no painel da Railway:

```bash
# Obrigatórias
FLASK_ENV=production
JWT_SECRET_KEY=sua-chave-super-secreta-de-producao-aqui
DATABASE_URL=postgresql://...  # Railway fornece automaticamente
PORT=8080                      # Railway define automaticamente

# Opcionais
CORS_ORIGINS=https://seu-app-name.railway.app
```

### 3. Configurar Banco PostgreSQL
```
1. No projeto Railway, clique em "+ New"
2. Selecione "Database" > "PostgreSQL" 
3. A variável DATABASE_URL será criada automaticamente
4. Conecte o banco ao seu serviço principal
```

### 4. Deploy Automático
```
1. Railway detecta o railway.json automaticamente
2. Build do frontend acontece primeiro
3. Backend é iniciado com os arquivos estáticos
4. URL de produção é gerada automaticamente
```

## 🔍 Verificação Pós-Deploy

### Endpoints para Testar:
- **Health Check:** `https://seu-app.railway.app/api/health`
- **Interface:** `https://seu-app.railway.app/`
- **Registro:** `https://seu-app.railway.app/api/auth/register`

### Logs e Debug:
```bash
# Ver logs na Railway
- Acesse o dashboard do projeto
- Clique na aba "Deployments"
- Veja logs em tempo real na aba "Logs"
```

## 🔧 Solução de Problemas

### Build Falha:
```bash
# Verifique se todos os arquivos estão commitados:
- package.json (frontend)
- requirements.txt (backend)
- railway.json
- build.sh/build.bat
```

### Erro de CORS:
```bash
# Adicione a variável CORS_ORIGINS:
CORS_ORIGINS=https://seu-app-name.railway.app
```

### Erro de Banco:
```bash
# Verifique se o PostgreSQL está conectado
# A variável DATABASE_URL deve estar configurada automaticamente
```

## 📝 Comandos Úteis

### Build Local para Testar:
```bash
# Windows
build.bat

# Linux/Mac
chmod +x build.sh
./build.sh
```

### Testar Produção Localmente:
```bash
# Definir variáveis
export FLASK_ENV=production
export DATABASE_URL=sqlite:///test.db
export JWT_SECRET_KEY=test-key

# Executar
cd backend && python app.py
```

## 🎯 Checklist de Deploy

- [ ] Código commitado e pushed
- [ ] railway.json configurado  
- [ ] Variáveis de ambiente definidas
- [ ] PostgreSQL conectado
- [ ] Build executado com sucesso
- [ ] Health check respondendo
- [ ] Interface carregando
- [ ] Registro/Login funcionando
- [ ] Dashboard acessível

## 🌐 URLs de Exemplo

Sua aplicação estará disponível em:
- **Produção:** `https://agendafacil-production.railway.app`
- **Staging:** `https://agendafacil-staging.railway.app`