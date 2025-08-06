

Aqui está um prompt detalhado para instruir um agente a desenvolver o aplicativo solicitado:

---

**Prompt para Desenvolvimento de Agenda de Compromissos (Frontend MVP)**

**Objetivo:**  
Criar um MVP de SaaS de agenda de compromissos com frontend moderno usando Flask como servidor estático e Chadcn UI para componentes visuais. O backend deve ser simulado (sem persistência real), com dados armazenados apenas no navegador.

---

### **Requisitos Técnicos:**
1. **Framework:**  
   - Flask (Python) para servir arquivos estáticos (HTML, CSS, JS)  
   - **Sem backend real:** Nenhuma API REST, banco de dados ou lógica server-side  

2. **Frontend:**  
   - Biblioteca: **Chadcn UI** (componentes React + Tailwind CSS)  
   - Estrutura: Sidebar fixa + área de conteúdo principal  
   - Responsividade: Layout adaptável para desktop/mobile  

3. **Funcionalidades Mínimas (MVP):**  
   - **Calendário mensal** com visualização de dias  
   - **Lista de compromissos** diários  
   - **CRUD de compromissos:** Criar, editar, excluir  
   - **Filtros:** Por dia/semana  
   - **Armazenamento:** `localStorage` para persistência temporária  

4. **Design:**  
   - Tema: Moderno, minimalista, com cores neutras  
   - Sidebar: Menu de navegação (ícones + texto)  
   - Componentes Chadcn UI: Botões, cards, modais, formulários  
   - Feedback visual: Toasts para ações (sucesso/erro)  

---

### **Estrutura de Pastas:**
```
agenda-app/
├── backend/          # Flask (servidor estático)
│   ├── app.py        # Servidor Flask
│   └── requirements.txt
├── frontend/         # React + Chadcn UI
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Telas (Calendário, Compromissos)
│   │   ├── hooks/       # Hooks personalizados
│   │   ├── utils/       # Funções auxiliares
│   │   └── styles/      # Estilos globais
│   ├── public/
│   └── package.json
└── README.md
```

---

### **Instruções Detalhadas:**

#### **1. Backend (Flask - Servidor Estático):**
- Crie um servidor Flask que sirva os arquivos estáticos do diretório `frontend/build`.  
- Implemente **rotas mínimas:**  
  ```python
  from flask import Flask, send_from_directory

  app = Flask(__name__, static_folder='../frontend/build')

  @app.route('/')
  def serve():
      return send_from_directory(app.static_folder, 'index.html')

  if __name__ == '__main__':
      app.run(debug=True)
  ```
- **Não implemente:** APIs, autenticação ou lógica de negócios.

#### **2. Frontend (React + Chadcn UI):**
- **Setup Inicial:**  
  ```bash
  npx create-react-app frontend --template typescript
  cd frontend
  npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
  ```
- **Configurar Chadcn UI:**  
  - Siga a [documentação oficial](https://ui.chadcn.com/) para integrar componentes.  
  - Use componentes pré-prontos: `Calendar`, `Card`, `Button`, `Modal`, `Input`.  

- **Estrutura de Componentes:**  
  - `Sidebar.jsx`: Menu fixo com ícones (ex: 📅 Calendário, ⚙️ Configurações).  
  - `CalendarView.jsx`: Calendário mensal interativo (usar biblioteca como `react-calendar`).  
  - `AppointmentList.jsx`: Lista de compromissos do dia selecionado.  
  - `AppointmentForm.jsx`: Formulário para criar/editar compromissos (modal).  
  - `ToastNotification.jsx`: Feedback visual para ações do usuário.  

- **Gerenciamento de Estado:**  
  - Use `useState` e `useEffect` para gerenciar compromissos.  
  - Armazene dados no `localStorage`:  
    ```javascript
    // Exemplo de salvamento
    const saveAppointments = (data) => {
      localStorage.setItem('appointments', JSON.stringify(data));
    };
    ```

- **Funcionalidades-Chave:**  
  - **Calendário:**  
    - Destaque dias com compromissos.  
    - Navegação entre meses.  
  - **Compromissos:**  
    - CRUD completo com validações.  
    - Campos: Título, data/hora, descrição, lembrete.  
    - Ordenação por horário.  
  - **Filtros:**  
    - Botão "Hoje" para resetar visualização.  
    - Seleção de dia/semana no calendário.  

#### **3. Design (Chadcn UI + Tailwind CSS):**
- **Cores:**  
  - Primária: `#3B82F6` (azul moderno)  
  - Fundo: `#F9FAFB` (cinza claro)  
  - Texto: `#1F2937` (cinza escuro)  
- **Sidebar:**  
  - Largura fixa: `240px`  
  - Logo + itens de menu (ícones + texto)  
- **Área Principal:**  
  - Header com título da página + botão "Novo Compromisso".  
  - Grid responsivo: Calendário (esquerda) + Lista de compromissos (direita).  

#### **4. Simulação de SaaS:**
- **Dados Mockados:**  
  - Inicialize o `localStorage` com 3-5 compromissos de exemplo.  
- **Limitações:**  
  - Sem persistência entre sessões (dados perdidos ao limpar cache).  
  - Sem multiusuário (todos os dados são locais).  

---

### **Entregáveis Esperados:**
1. Código completo do projeto (frontend + backend estático).  
2. `README.md` com instruções de:  
   - Instalação de dependências (`npm install`, `pip install -r requirements.txt`).  
   - Como rodar o projeto (`npm start` para React + `python app.py` para Flask).  
3. Demonstração funcional das features:  
   - Criação/edição/exclusão de compromissos.  
   - Navegação no calendário.  
   - Armazenamento no `localStorage`.  

---

### **Restrições Importantes:**
- **NÃO IMPLEMENTE:**  
  - Backend real (APIs, banco de dados, autenticação).  
  - Persistência de dados além do `localStorage`.  
  - Lógica de negócios no servidor Flask.  
- **FOQUE APENAS:**  
  - Interface interativa com Chadcn UI.  
  - Simulação de funcionalidades via frontend.  
  - Experiência do usuário moderna e responsiva.  

--- 

**Resultado Final:** Um MVP visualmente atraente que simula uma agenda de compromissos, pronto para evolução futura com backend real.