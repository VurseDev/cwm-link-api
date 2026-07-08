# Como rodar o projeto CWM Link

Este projeto tem tres aplicacoes:

- Backend NestJS na raiz do repositorio.
- Frontend React/Vite em `client`.
- Micro auth service com Bun/Elysia/Better Auth em `auth-service`.

## 1. Requisitos

Instale ou confirme estes runtimes:

```powershell
node --version
bun --version
```

O backend e o frontend usam Node/npm. O auth service usa Bun.

Se o comando `npm` falhar procurando `C:\Users\ocaua\AppData\Roaming\npm\node_modules\npm\bin\npm-cli.js`, use este fallback nos comandos npm:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
```

## 2. Instalar dependencias

Na raiz:

```powershell
npm install
```

No frontend:

```powershell
cd client
npm install
cd ..
```

No auth service:

```powershell
cd auth-service
bun install
cd ..
```

## 3. Configurar variaveis de ambiente

Backend NestJS, na raiz:

```powershell
Copy-Item .env.example .env
```

Conteudo esperado:

```env
DATABASE_URL=file:./dev.db
PORT=3005
```

Auth service:

```powershell
cd auth-service
Copy-Item .env.example .env
cd ..
```

Conteudo esperado:

```env
DATABASE_URL=file:./auth.db
PORT=3000
```

Frontend:

```powershell
cd client
Copy-Item .env.example .env
cd ..
```

Conteudo esperado:

```env
VITE_AUTH_URL=http://localhost:3000
VITE_API_URL=http://localhost:3005
```

## 4. Preparar bancos locais

Backend NestJS usa Prisma com SQLite em `dev.db`.

```powershell
npm run prisma:generate
npm run prisma:deploy
```

O auth service usa Drizzle com SQLite em `auth-service/auth.db`.

```powershell
cd auth-service
bun run db:generate
bun run db:migrate
cd ..
```

## 5. Rodar os servicos

Opcao recomendada (um clique):

```powershell
.\start-project.cmd
```

Ele faz tudo automaticamente:
- verifica Node/npm/Bun
- cria os arquivos `.env` se estiverem ausentes
- instala dependencias no backend, frontend e auth-service
- executa Prisma e Drizzle setup
- abre tres janelas com os servicos

Para apenas validar o ambiente sem iniciar os servidores:

```powershell
.\start-project.cmd -CheckOnly
```

Se voce ja tem tudo instalado e quer pular as instalacoes:

```powershell
.\start-project.cmd -SkipInstall
```

Para executar com um Node pré-compilado e ignorar a versão instalada no sistema:

```powershell
.\start-project-bundled-node.cmd -NodeDir .\tools\node
```

O diretório `NodeDir` deve conter `node.exe` e `node_modules\npm\bin\npm-cli.js`.

O antigo wrapper continua funcionando, mas o novo script e o recomendado:

```powershell
.\run-project.bat
```

Opcionalmente, rode manualmente como descrito abaixo.

Abra tres terminais.

Terminal 1, auth service:

```powershell
cd auth-service
bun run dev
```

URL: `http://localhost:3000`

Terminal 2, backend NestJS:

```powershell
npm run start:dev
```

URL: `http://localhost:3005`

Terminal 3, frontend:

```powershell
cd client
npm run dev
```

URL padrao do Vite: `http://localhost:5173`

## 6. Validar se esta funcionando

Auth service:

```powershell
Invoke-WebRequest http://localhost:3000/health
```

Backend:

```powershell
Invoke-WebRequest http://localhost:3005/parts
```

Frontend:

Abra `http://localhost:5173` no navegador.

## 7. Comandos uteis

Backend:

```powershell
npm run build
npm test -- --runInBand
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
```

Frontend:

```powershell
cd client
npm run build
npm run dev
```

Auth service:

```powershell
cd auth-service
bun run --bun tsc --noEmit
bun run dev
```

## 8. Observacoes sobre portas

Para desenvolvimento local, mantenha:

- Auth service em `3000`.
- Backend NestJS em `3005`.
- Frontend Vite em `5173`.

Essa combinacao bate com `client/.env.example` e evita conflito entre o Nest e o auth service.
