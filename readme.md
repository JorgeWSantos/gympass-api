## App

Gympass style App

## RFs (Regras funcionais)

- [ ] Should be able Sign-in;
- [ ] Should be able Authenticate;
- [ ] Should be able get profile of logged user;
- [ ] Should be able get number of check-ins realizeds for logged user;
- [ ] Should be able user get check-ins history;
- [ ] Should be able user get nearby gyms;
- [ ] Should be able user get gyms by name;
- [ ] Should be able user realize check-in on one gym;
- [ ] Should be able validate check-in of an user;
- [ ] Should be able register a gym

## RNs (Regras de negócios)

- [ ] User Should'nt register an email duplicated;
- [ ] User Should'nt do check-in on 2 gyms in the same day;
- [ ] User Should'nt do check-in if he was more than (100m) away from academy;
- [ ] Check-in can only be validated whitin 20 minutes after being created;
- [ ] Check-in can only be validated by admins;
- [ ] Gym can only be registered by admins;

## RNFs (Requisitos não-funcionais)

- [ ] User password needs to be encrypted;
- [ ] The database needs to be persisted on PostgreSQL;
- [ ] All lists of data needs to be paginated with 20 itens by page;
- [ ] User must be identified by JWT;

## Libs

tsx - used to node understands .ts files
tsup - used to build .ts files

## Create Project

- npm i typescript @types/node tsx tsup -D
- npx tsc --init;
  - create tsconfig.json, change version of JS to es2020
- npm i fastify

### - Prisma
- npm i prisma -D: cli, development dependency
- npx prisma init
- Extension needed: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma
- npx prisma generate: Create types automatically for tables with methods delivered by prisma
- npm i @prisma/client: production dependency
- npx prisma migrate dev: prisma watch the folders and create migrations based on changes at files on folder /prisma
- npx prisma studio: open a SQL Management

## Docker
docker run --name api-gympass-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apigympass -p 5432:5432 bitnami/postgresql

- docker ps: Show containers running
- docker ps -a : Show all containers
- docker start *CONTAINER ID || NAMES*: start a specific container
- docker stop *CONTAINER ID || NAMES*: stop a specific container
- docker logs *CONTAINER ID || NAMES*: logs a specific container
- docker logs *CONTAINER ID || NAMES* -f: logs continually a specific container

- docker compose up -d: run docker in detached mode, the logs are not showed on terminal
- docker compose down: delete all containers
- docker compose stop: stops containers running

