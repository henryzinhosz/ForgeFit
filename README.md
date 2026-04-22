# ForgeFIT - High Performance Fitness Platform

ForgeFIT é uma plataforma de treinamento de alta performance construída com Next.js, Firebase e GenAI.

## Funcionalidades
- **Agenda Semanal**: Planejamento de treinos e registro de execução em tempo real com travas de segurança por data.
- **Banco de Exercícios**: Base de dados com instruções e guias de execução profissional.
- **Evolução de Performance**: Análise de biometria (IMC OMS), metas nutricionais unificadas e recordes (PR) 100% automáticos via memória de treino.
- **Rotina Alimentar**: Registro de refeições e balanço calórico/proteico diário baseado em banco de dados brasileiro.
- **Dashboard de Consistência**: Visualização de frequência mensal e volume de exercícios realizados.
- **Integração Firebase**: Sincronização em tempo real via Cloud Firestore e autenticação Google.

## Tecnologias
- **Next.js 15 (App Router)**
- **Firebase** (Auth & Firestore)
- **Genkit** (AI Flows)
- **Tailwind CSS** & **ShadCN UI**
- **Lucide React** (Icons)
- **Recharts** (Gráficos)

## Como rodar localmente
1. Instale as dependências: `npm install`
2. Configure as variáveis do Firebase em `src/firebase/config.ts`
3. Inicie o servidor de desenvolvimento: `npm run dev`

## Como subir para o GitHub
Execute os seguintes comandos no terminal:

```bash
# 1. Inicialize o repositório git
git init

# 2. Adicione todos os arquivos (o .gitignore já está configurado para proteger chaves)
git add .

# 3. Crie o commit inicial
git commit -m "feat: ForgeFIT MVP - High Performance Fitness System"

# 4. Defina a branch principal como main
git branch -M main

# 5. Conecte ao seu repositório (Substitua pela URL do seu repo no GitHub)
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

# 6. Envie os arquivos
git push -u origin main
```

---
*ForgeFIT - Forjando sua melhor versão com precisão e tecnologia.*
