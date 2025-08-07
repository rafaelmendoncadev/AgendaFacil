# 📅 AgendaFácil

Sistema completo de gerenciamento de compromissos com autenticação, banco de dados SQLite e interface React moderna.

## 🚀 Início Rápido

### Para iniciar o sistema completo:
```bash
start-dev.bat
```

### Para parar todos os serviços:
```bash
stop.bat
```

## 🔧 Requisitos

- **Python 3.8+** (com pip)
- **Node.js 16+** (com npm)
- **Windows** (scripts em .bat)

## 📖 Como usar

1. **Clone/baixe o projeto**
2. **Execute** `start-dev.bat` (ou `.\start.ps1` no PowerShell)
3. **Aguarde** ambos os serviços iniciarem (backend + frontend)
4. **Acesse** http://localhost:3000
5. **Crie sua conta** clicando em "Cadastre-se"

> **⚠️ IMPORTANTE:** Se aparecer erro "Failed to fetch", certifique-se de que o backend esteja rodando na porta 5000. Execute sempre os scripts de inicialização completos.

## 🏗️ Arquitetura

### Backend (Flask + SQLite)
- **Porta:** 5000
- **Banco:** SQLite (`agenda_facil.db`)
- **Autenticação:** JWT tokens
- **Criptografia:** bcrypt para senhas

### Frontend (React + TypeScript)
- **Porta:** 3000
- **Framework:** React 19 + TypeScript
- **Estilo:** Tailwind CSS + shadcn/ui
- **Estado:** Hooks customizados

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário

### Compromissos
- `GET /api/appointments` - Listar compromissos
- `POST /api/appointments` - Criar compromisso
- `PUT /api/appointments/:id` - Editar compromisso
- `DELETE /api/appointments/:id` - Excluir compromisso

## 📁 Estrutura do Projeto

```
AgendaFacil/
├── backend/
│   ├── server.js           # Aplicação Express principal
│   ├── models/             # Modelos Node.js
│   ├── package.json        # Dependências Node.js
│   └── agenda_facil.db     # Banco SQLite (criado automaticamente)
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/         # Hooks customizados
│   │   ├── services/      # Serviços de API
│   │   └── types/         # Tipos TypeScript
│   ├── package.json       # Dependências Node.js
│   └── tailwind.config.js # Configuração Tailwind
├── start-dev.bat          # Inicia ambos os serviços
├── start.bat              # Versão simples
├── stop.bat               # Para todos os serviços
└── LEIA-ME.md             # Este arquivo
```

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT com tokens
- ✅ Isolamento de dados por usuário  
- ✅ CORS configurado
- ✅ Validação de entrada

## 🌟 Funcionalidades

- ✅ **Autenticação completa** - Login/Registro/Logout
- ✅ **Gerenciar compromissos** - Criar/Editar/Excluir
- ✅ **Calendário visual** - Navegação por datas
- ✅ **Filtros por data** - Ver compromissos específicos
- ✅ **Interface responsiva** - Mobile-friendly
- ✅ **Dados persistentes** - Banco SQLite
- ✅ **Usuário de teste** - Para demonstrações

## 🛠️ Desenvolvimento

### Executar manualmente:

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Troubleshooting

**Erro de porta ocupada:**
```bash
stop.bat
start-dev.bat
```

**Problemas com dependências:**
```bash
cd backend && npm install
cd frontend && npm install
```

## 📝 Notas

- O banco SQLite é criado automaticamente no primeiro uso
- Os dados ficam salvos em `backend/agenda_facil.db`
- Para resetar dados: delete o arquivo `.db` e reinicie
- Usuário de teste é recriado automaticamente se não existir