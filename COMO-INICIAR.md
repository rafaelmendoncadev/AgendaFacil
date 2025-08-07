# 🚀 Como Iniciar o AgendaFácil

## ⚡ Método Rápido (Recomendado)

### Windows PowerShell:
```powershell
.\start.ps1
```

### Windows Command Prompt:
```cmd
start-dev.bat
```

## 📋 Método Manual (Se necessário)

### 1. Iniciar Backend:
```cmd
cd backend
npm start
```

### 2. Iniciar Frontend (Em outro terminal):
```cmd
cd frontend  
npm start
```

## 🔧 URLs dos Serviços

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

## ❗ Solução de Problemas

### Erro "Failed to fetch":
1. **Verifique se o backend está rodando** na porta 5000
2. **Execute primeiro o backend**, depois o frontend
3. **Use os scripts automáticos** (start.ps1 ou start-dev.bat)

### Erro de porta ocupada:
```cmd
# Parar todos os serviços
stop.bat
# ou
.\stop.ps1

# Reiniciar
start-dev.bat
```

## ✅ Verificação Rápida

Se tudo estiver funcionando, você deve conseguir acessar:
- http://localhost:5000/api ← deve retornar algo
- http://localhost:3000 ← interface do usuário

## 📝 Primeira Execução

1. Execute `start-dev.bat` 
2. Aguarde ambos os serviços iniciarem
3. Acesse http://localhost:3000
4. Clique em "Cadastre-se" para criar sua conta
5. Use o sistema normalmente