# ClassQuest Backend API

## Contexto

O ClassQuest é uma plataforma educacional que permite a criação e gerenciamento de turmas, questionários e avaliações. Esta API backend fornece todos os endpoints necessários para:

- Gerenciamento de usuários (professores e alunos)
- Criação e administração de turmas
- Desenvolvimento de questionários e questões
- Coleta de respostas dos alunos
- Geração de resultados e relatórios

## Tecnologias

- Node.js
- TypeScript
- Express.js
- TSyringe (Dependency Injection)

## Rotas Disponíveis

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Realiza login do usuário |
| POST | `/logout` | Realiza logout do usuário |

### 👥 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/user` | Cria um novo usuário |
| GET | `/user` | Lista todos os usuários |
| PUT | `/user/:id` | Atualiza um usuário específico |

### 🏫 Turmas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/class` | Cria uma nova turma |
| GET | `/class` | Lista todas as turmas |
| GET | `/class/:id` | Busca uma turma específica |
| PUT | `/class/:id` | Atualiza uma turma específica |
| DELETE | `/class/:id` | Remove uma turma |
| POST | `/class/student` | Adiciona um aluno à turma |
| POST | `/class/code` | Permite entrada na turma via código |

### 📝 Questionários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/questionnaire` | Lista todos os questionários |
| POST | `/questionnaire` | Cria um novo questionário |
| GET | `/questionnaire/:id` | Busca um questionário específico |
| PUT | `/questionnaire/:id` | Atualiza um questionário |
| DELETE | `/questionnaire/:id` | Remove um questionário |

### ❓ Questões

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/question` | Lista todas as questões |
| POST | `/question` | Cria uma nova questão |
| GET | `/question/:id` | Busca uma questão específica |
| PUT | `/question/:id` | Atualiza uma questão |
| DELETE | `/question/:id` | Remove uma questão |

### 🔤 Alternativas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/alternative` | Lista todas as alternativas |
| POST | `/alternative` | Cria uma nova alternativa |
| PUT | `/alternative/:id` | Atualiza uma alternativa |
| DELETE | `/alternative/:id` | Remove uma alternativa |

### 📋 Respostas dos Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/user-answer` | Lista todas as respostas |
| POST | `/user-answer` | Cria uma nova resposta |
| GET | `/user-answer/:id` | Busca uma resposta específica |
| GET | `/user-answer/student/:studentId` | Busca respostas de um aluno específico |
| PUT | `/user-answer/:id` | Atualiza uma resposta |
| DELETE | `/user-answer/:id` | Remove uma resposta |

### 📊 Resultados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/results` | Lista todos os resultados |
| POST | `/results` | Cria um novo resultado |
| GET | `/results/:id` | Busca um resultado específico |
| GET | `/results/student/:studentId` | Busca resultados de um aluno específico |
| PUT | `/results/:id` | Atualiza um resultado |
| DELETE | `/results/:id` | Remove um resultado |

## Estrutura da API

A API segue os padrões RESTful e utiliza injeção de dependência através do TSyringe para melhor organização e testabilidade do código.

### Arquitetura

- **Controllers**: Responsáveis por receber as requisições HTTP e delegar para os services
- **Services**: Contém a lógica de negócio da aplicação
- **Routes**: Define os endpoints e conecta com os controllers apropriados

## Como usar

1. Instale as dependências
2. Configure as variáveis de ambiente
3. Execute o servidor
4. Acesse os endpoints através do cliente HTTP de sua preferência