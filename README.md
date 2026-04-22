# ForgeFIT - High Performance Fitness Platform

ForgeFIT é uma plataforma de treinamento de alta performance construída com Next.js, Firebase e GenAI.

## Funcionalidades
- **Agenda Semanal**: Planejamento de treinos e registro de execução em tempo real.
- **Banco de Exercícios**: Base de dados com instruções e guias de execução.
- **Evolução de Performance**: Análise de biometria (IMC OMS), metas nutricionais e recordes (PR) automáticos.
- **Rotina Alimentar**: Registro de refeições e balanço calórico/proteico diário.
- **Integração Firebase**: Sincronização em tempo real via Cloud Firestore e autenticação Google.

## Tecnologias
- **Next.js 15 (App Router)**
- **Firebase** (Auth & Firestore)
- **Genkit** (AI Flows)
- **Tailwind CSS** & **ShadCN UI**
- **Lucide React** (Icons)
- **Recharts** (Gráficos)

## Como rodar
1. Instale as dependências: `npm install`
2. Configure as variáveis do Firebase em `src/firebase/config.ts`
3. Inicie o servidor de desenvolvimento: `npm run dev`
