# Repo Pulse

Painel público de telemetria para um repositório GitHub. O projeto registra oito leituras diárias de métricas reais, das 14h às 21h no horário de São Paulo, e publica o histórico no GitHub Pages.

## Transparência por padrão

- Cada commit automático adiciona uma leitura datada em `public/data/snapshots.json`.
- A autoria aparece como `github-actions[bot]`.
- Toda mensagem automática termina com `[bot]`.
- Não há commits vazios, alterações cosméticas aleatórias ou simulação de trabalho humano.
- Os dados vêm diretamente da API do GitHub.

## O que é registrado

Cada leitura preserva estrelas, forks, itens abertos, observadores, linguagem principal, tamanho do repositório, branch padrão e o SHA observado na coleta. O arquivo mantém até 1.440 leituras, aproximadamente 180 dias na cadência normal.

## Publicação

1. Crie um repositório público chamado `repo-pulse` e envie este projeto para a branch `main`.
2. Em **Settings → Pages**, selecione **GitHub Actions** como origem.
3. Em **Settings → Actions → General**, mantenha os workflows habilitados.
4. Execute manualmente **Coletar métricas do repositório** uma vez ou aguarde a próxima janela diária.

O token padrão do próprio workflow é suficiente; não é necessário cadastrar uma chave pessoal.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Validação completa:

```bash
npm test
```

## Automação

O workflow usa um agendamento com o fuso IANA `America/Sao_Paulo`, executando às 14:07, 15:07, 16:07, 17:07, 18:07, 19:07, 20:07 e 21:07. O minuto 07 reduz a chance de atrasos comuns no início exato da hora.

## Licença

MIT
