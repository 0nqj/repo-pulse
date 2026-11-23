# Repo Pulse

Painel público de telemetria para um repositório GitHub. O projeto registra oito leituras diárias de métricas reais, das 14h às 21h no horário de São Paulo, e publica o histórico no GitHub Pages.

## Transparência por padrão

- Cada commit automático de coleta adiciona uma leitura datada em `public/data/snapshots.json`.
- Os novos commits de coleta têm o dono do repositório como autor. O GitHub Actions executa a coleta e registra o commit como `github-actions[bot]` (committer).
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

### Arquivo mensal

Todos os dias às **22h17 de São Paulo**, o workflow [Atualizar branch mensal](.github/workflows/archive-month.yml) incorpora o estado da `main` à branch `mensal/AAAA-MM`. A primeira execução do mês cria a branch. A cada dia, um commit registra a data local e o SHA arquivado em `.repo-pulse/arquivo-diario`. Repetir a execução no mesmo dia preserva o primeiro registro.

O dono do repositório aparece como autor e `github-actions[bot]` como committer. Na virada do mês, o workflow abre outra branch a partir da `main`. As branches dos meses anteriores ficam disponíveis para consulta.

## Licença

MIT
