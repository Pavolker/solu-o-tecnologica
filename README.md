# Projeto Foresight: Agente Especialista em Soluções Tecnológicas

Um agente especialista que utiliza IA e busca do Google para encontrar as tecnologias mais avançadas para qualquer setor da economia, categorizadas por tipo de aplicação.

## Funcionalidades

- 🔍 Busca e análise de tecnologias avançadas por setor econômico
- 📊 Categorização em 3 níveis de aplicação (Imediata, Estrutural, Sistêmica)
- 🔗 Análise da cadeia produtiva (Suprimentos, Design e Produção, Mercado)
- 📈 Identificação de megatendências (Big Threes)
- 🔮 Visão de futuro do setor
- 💾 Download de relatórios em formato texto

## Tecnologias

- React 19.2
- TypeScript 5.8
- Vite 6.2
- Google Gemini AI
- Tailwind CSS

## Executar Localmente

**Pré-requisitos:** Node.js 20+

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a variável de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave da API do Gemini:
     ```
     VITE_GEMINI_API_KEY=sua_chave_aqui
     ```
   - Obtenha sua chave em: https://aistudio.google.com/apikey

3. Execute o app:
   ```bash
   npm run dev
   ```

4. Acesse: http://localhost:3000

## Deploy no Netlify

### Opção 1: Deploy via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [Netlify](https://app.netlify.com)
3. Clique em "Add new site" → "Import an existing project"
4. Conecte seu repositório GitHub
5. Configure as variáveis de ambiente:
   - Vá em "Site settings" → "Environment variables"
   - Adicione: `VITE_GEMINI_API_KEY` com sua chave da API
6. Clique em "Deploy site"

### Opção 2: Deploy via CLI

```bash
# Instale o Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Deploy
netlify deploy --prod
```

**Importante:** Não esqueça de adicionar a variável de ambiente `VITE_GEMINI_API_KEY` nas configurações do Netlify!

## Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## Licença

MIT
