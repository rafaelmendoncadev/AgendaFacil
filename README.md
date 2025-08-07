# AgendaFácil - MVP de Agenda de Compromissos

Um MVP (Minimum Viable Product) de SaaS de agenda de compromissos desenvolvido com React, TypeScript, Tailwind CSS e Flask. Este projeto simula uma aplicação de agenda moderna com interface responsiva e armazenamento local.

## 🚀 Funcionalidades

- ✅ **Calendário Interativo**: Navegação mensal com destaque para dias com compromissos
- ✅ **Gerenciamento de Compromissos**: CRUD completo (Criar, Ler, Editar, Excluir)
- ✅ **Filtros e Navegação**: Visualização por dia/semana com botão "Hoje"
- ✅ **Interface Moderna**: Design responsivo com componentes Chadcn UI
- ✅ **Persistência Local**: Dados salvos no localStorage do navegador
- ✅ **Lembretes**: Sistema de notificações para compromissos
- ✅ **Layout Responsivo**: Otimizado para desktop e mobile

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** com TypeScript
- **Tailwind CSS** para estilização
- **Chadcn UI** para componentes
- **Lucide React** para ícones
- **date-fns** para manipulação de datas
- **Radix UI** para componentes acessíveis

### Backend
- **Flask** (Python) como servidor estático
- **Nenhuma API REST** - apenas serving de arquivos

## 📁 Estrutura do Projeto

```
AgendaFacil/
├── backend/
│   ├── server.js           # Servidor Express
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── ui/         # Componentes base do Chadcn UI
│   │   │   ├── Sidebar.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── AppointmentList.tsx
│   │   │   └── AppointmentForm.tsx
│   │   ├── hooks/          # Hooks personalizados
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useAppointments.ts
│   │   ├── types/          # Definições de tipos
│   │   │   └── index.ts
│   │   ├── lib/            # Utilitários
│   │   │   └── utils.ts
│   │   └── App.tsx         # Componente principal
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js (v16 ou superior)
- Python 3.7+
- npm ou yarn

### 1. Configuração do Backend (Flask)

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências Python
npm install
```

### 2. Configuração do Frontend (React)

```bash
# Navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install
```

### 3. Executando a Aplicação

#### Modo Desenvolvimento (Frontend apenas)
```bash
# No diretório frontend
npm start
```
A aplicação estará disponível em: `http://localhost:3000`

#### Modo Produção (Frontend + Backend)

1. **Build do Frontend:**
```bash
# No diretório frontend
npm run build
```

2. **Inicie o servidor Flask:**
```bash
# No diretório backend
npm start
```

A aplicação estará disponível em: `http://localhost:5000`

## 🎯 Como Usar

1. **Navegação**: Use a sidebar para alternar entre Dashboard, Calendário e Configurações
2. **Criar Compromisso**: Clique em "Novo Compromisso" e preencha o formulário
3. **Visualizar Compromissos**: Clique em um dia no calendário para ver os compromissos
4. **Editar/Excluir**: Use os botões de ação na lista de compromissos
5. **Navegação do Calendário**: Use as setas ou o botão "Hoje" para navegar

## 📊 Dados de Exemplo

A aplicação vem com 3 compromissos de exemplo pré-configurados:
- Reunião de Equipe (hoje)
- Consulta Médica (amanhã)
- Apresentação do Projeto (depois de amanhã)

## 🔒 Limitações (Por Design)

Este é um MVP com as seguintes limitações intencionais:
- **Sem persistência real**: Dados salvos apenas no localStorage
- **Sem backend dinâmico**: Flask serve apenas arquivos estáticos
- **Sem autenticação**: Aplicação single-user
- **Sem sincronização**: Dados perdidos ao limpar cache do navegador

## 🚀 Possíveis Evoluções Futuras

- Integração com banco de dados
- Sistema de autenticação
- API REST completa
- Sincronização multi-dispositivo
- Notificações push
- Integração com calendários externos (Google Calendar, Outlook)
- Modo offline com sync

## 🤝 Contribuição

Este é um projeto educacional demonstrando conceitos de desenvolvimento frontend moderno. Contribuições são bem-vindas!

## 📝 Licença

Este projeto é apenas para fins educacionais e demonstração de conceitos.

---

**Desenvolvido como MVP de demonstração usando React + Flask**