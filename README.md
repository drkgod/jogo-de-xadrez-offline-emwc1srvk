# Xadrez Offline

Aplicação de xadrez para partidas locais, com experiência completa de tabuleiro, lobby, autenticação e área administrativa.

## Funcionalidades

- jogo local e offline;
- lobby de partidas;
- cadastro e autenticação;
- painel administrativo;
- interface responsiva construída em React.

## Stack

`React 19` · `TypeScript` · `Vite` · `Tailwind CSS` · `shadcn/ui`

## Executar

```bash
pnpm install
pnpm dev
```

## Comandos

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm preview
```

## Estrutura principal

```text
src/pages/Index.tsx       tabuleiro e entrada
src/pages/Lobby.tsx       lobby de partidas
src/pages/Login.tsx       acesso
src/pages/Register.tsx    cadastro
src/pages/Admin.tsx       administração
src/stores/               estado da aplicação
```

## Escopo

Este é um projeto experimental de produto e interface. Para publicação aberta, revise autenticação, persistência e regras de autorização do ambiente escolhido.
