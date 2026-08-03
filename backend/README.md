# Backend do projeto

## Description

A seguir será listada os comandos para realizar o setup do projeto.

## Project setup

```bash
$ npm install
```

## Banco de Dados

Antes de executar o projeto, verificar se está com o Docker instalado e certifique-se de configurar as variáveis de ambiente. Comandos para configurar o container do banco de dados:

```bash
  # Subir o banco de dados
  $ sudo docker compose up -d

  # Parar o banco de dados apagando os dados
  $ sudo docker compose down -v

  # Parar o banco de dados se m apagar os dados
  $ sudo docker compose down
```

## Compile e rode o projeto

```bash
# Desenvolvimento
$ npm run start

# watch mode
$ npm run start:dev

# Modo em produção
$ npm run start:prod

# Modo de debug
$ npm run start:debug
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
