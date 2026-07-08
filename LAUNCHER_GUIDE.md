# Guia de Uso: Launchers do Projeto

Este documento explica as diferenças entre os dois launchers disponíveis e como usar cada um.

## Resumo Rápido

| Launcher | Arquivo | Uso | Requisito |
|----------|---------|-----|-----------|
| **Normal** | `start-project.cmd` | Usa Node/NPM do sistema | Node.js LTS instalado |
| **Bundled Node** | `start-project-bundled-node.cmd` | Usa Node/NPM pré-compilado local | Nenhum (contém tudo) |

---

## 1. Launcher Normal: `start-project.cmd`

### O que faz

- Usa a versão de Node e NPM instalada no seu sistema
- Melhor para desenvolvimento com versões específicas controladas globalmente
- Recomendado para a maioria dos casos

### Pré-requisitos

1. **Node.js LTS** instalado no sistema
   - Download: https://nodejs.org
   - Verificar instalação: abra um terminal e digite `node --version`

2. **Bun** instalado no sistema
   - Download: https://bun.sh
   - Verificar instalação: abra um terminal e digite `bun --version`

### Passo a Passo

#### Opção 1: Inicialização Completa (Recomendado)

```powershell
cd C:\Users\seu-usuario\Desktop\projeto\cwm-link-api
.\start-project.cmd
```

**O que acontece:**
1. ✅ Verifica se Node, NPM e Bun estão instalados
2. ✅ Cria arquivos `.env` (se não existirem)
3. ✅ Instala dependências do backend, frontend e auth-service
4. ✅ Executa migrations do Prisma e Drizzle
5. ✅ Encontra uma porta disponível para o backend (começa em 3005)
6. ✅ Abre 3 janelas de terminal com os serviços rodando

**Resultado:**
- Auth service: http://localhost:3000
- Backend API: http://localhost:3005 (ou próxima porta livre)
- Frontend: http://localhost:5173

---

#### Opção 2: Apenas Verificar o Ambiente

Se você quer verificar se tudo está configurado corretamente sem iniciar os serviços:

```powershell
.\start-project.cmd -CheckOnly
```

**Output esperado:**
```
==> Checking prerequisites
Environment looks good. No services were started.
```

---

#### Opção 3: Pular Instalação de Dependências

Se as dependências já foram instaladas anteriormente:

```powershell
.\start-project.cmd -SkipInstall
```

**O que acontece:**
1. Pula a instalação de pacotes (mais rápido)
2. Executa migrations do banco de dados
3. Inicia os 3 serviços

**Use quando:** Você já rodou `start-project.cmd` uma vez e quer fazer um restart rápido

---

#### Opção 4: Apenas Setup, Sem Iniciar Serviços

Útil para preparar o ambiente mas deixar os serviços para depois:

```powershell
.\start-project.cmd -NoStart
```

---

## 2. Launcher Bundled Node: `start-project-bundled-node.cmd`

### O que faz

- Usa Node e NPM **pré-compilados** inclusos no projeto
- Ignora completamente a versão instalada no sistema
- Ideal para contornar conflitos de versão ou máquinas sem Node instalado

### Pré-requisitos

1. **Bun** instalado no sistema (necessário apenas para auth-service)
   - Download: https://bun.sh

2. **Arquivo com Node pré-compilado**
   - Caminho esperado: `tools/node/` (dentro do projeto)
   - Deve conter:
     - `node.exe` (o executável do Node)
     - `node_modules/npm/` (NPM bundled com Node)

### Como Preparar o Diretório de Node Bundled

#### Método 1: Download Manual

1. Baixe Node do site oficial: https://nodejs.org
2. Extraia o arquivo `.zip` 
3. Crie a pasta `tools/node` na raiz do projeto
4. Copie o conteúdo do Node extraído para `tools/node/`

**Estrutura esperada:**
```
cwm-link-api/
  tools/
    node/
      node.exe
      node_modules/
        npm/
          bin/
            npm-cli.js
```

#### Método 2: Usar Node Portable

- Baixe Node Portable de: https://nodejs.org/en/download/package-manager/
- Extraia em `tools/node/`

### Passo a Passo

#### Opção 1: Inicialização Completa (Com Node Padrão)

```powershell
cd C:\Users\seu-usuario\Desktop\projeto\cwm-link-api
.\start-project-bundled-node.cmd
```

**Funcionamento:**
- Procura Node em `tools/node/` por padrão
- Mesmos passos do launcher normal

**Resultado:**
- Auth service: http://localhost:3000
- Backend API: http://localhost:3005 (ou próxima porta livre)
- Frontend: http://localhost:5173

---

#### Opção 2: Apontar para Node Customizado

Se você quer usar Node de outro local:

```powershell
.\start-project-bundled-node.cmd -NodeDir "C:\caminho\para\node"
```

Ou com caminho relativo:

```powershell
.\start-project-bundled-node.cmd -NodeDir ".\ferramentas\nodejs"
```

---

#### Opção 3: Verificar Ambiente (Com Node Bundled)

```powershell
.\start-project-bundled-node.cmd -CheckOnly -NodeDir "tools/node"
```

**Output esperado:**
```
==> Checking prerequisites
Environment looks good. No services were started.
```

---

#### Opção 4: Pular Instalação (Com Node Bundled)

```powershell
.\start-project-bundled-node.cmd -SkipInstall
```

---

#### Opção 5: Setup + Node Customizado, Sem Iniciar

```powershell
.\start-project-bundled-node.cmd -NoStart -NodeDir "D:\nodejs-portable"
```

---

## Comparação Detalhada

### Quando usar `start-project.cmd` (Normal)

✅ Use se:
- Node.js LTS está instalado no seu sistema
- Você quer usar a versão global de Node
- Você trabalha com múltiplos projetos com versões diferentes
- Você quer manter Node atualizado facilmente

❌ Evite se:
- Há conflito entre versões de Node
- A máquina não tem Node instalado
- Você quer garantir que todos usem exatamente a mesma versão

### Quando usar `start-project-bundled-node.cmd` (Bundled)

✅ Use se:
- Node não está instalado no sistema
- Há conflito com outra versão de Node
- Você quer garantir consistência entre máquinas
- Você trabalha em ambientes corporativos com restrições
- Precisa de uma versão específica de Node

❌ Evite se:
- Node.js já está bem configurado no sistema
- Espaço em disco é crítico (Node bundled ocupa ~200MB extra)

---

## Solução de Problemas

### Erro: "Node not found" (com `start-project.cmd`)

**Solução:**
1. Instale Node.js: https://nodejs.org
2. Feche e reabra o PowerShell para recarregar as variáveis de ambiente
3. Teste: `node --version`

### Erro: "Node binary not found at..." (com `start-project-bundled-node.cmd`)

**Solução:**
1. Verifique se `tools/node/` existe na raiz do projeto
2. Confirme que contém `node.exe` e `node_modules/npm/`
3. Especifique o caminho correto: `.\start-project-bundled-node.cmd -NodeDir "caminho/correto"`

### Erro: "Port 3005 is already in use"

**Solução:**
- Ambos os launchers escolhem a próxima porta livre automaticamente
- Você verá a mensagem: `"Port 3005 is in use. Using next available port 3006 instead."`
- Se quiser usar uma porta específica, edite `.env` e mude a variável `PORT`

### Erro: "Bun not found"

**Solução (para ambos os launchers):**
1. Instale Bun: https://bun.sh
2. Reabra o PowerShell
3. Teste: `bun --version`

---

## Combinações Úteis

### Startup Rápido (Já instalado tudo)

```powershell
# Versão normal
.\start-project.cmd -SkipInstall

# Versão bundled
.\start-project-bundled-node.cmd -SkipInstall
```

### Restart Completo (Limpar tudo)

```powershell
# Remova node_modules se quiser reinstalar tudo
rmdir node_modules -Recurse -Force
rmdir client\node_modules -Recurse -Force
rmdir auth-service\node_modules -Recurse -Force

# Depois execute normalmente
.\start-project.cmd
```

### Desenvolvimento com Node Customizado

```powershell
.\start-project-bundled-node.cmd -NodeDir "D:\nodejs-v20.10.0" -SkipInstall
```

---

## Dicas Finais

1. **Primeira vez?** Use `start-project.cmd -CheckOnly` para validar o setup
2. **Porta conflita?** O launcher corrige automaticamente, não precisa fazer nada
3. **Restartando?** Use `-SkipInstall` para ser mais rápido
4. **Máquina sem Node?** Use `start-project-bundled-node.cmd` com Node pré-compilado
5. **Múltiplos projetos?** Cada um pode ter seu próprio Node bundled em `tools/node/`

---

## Suporte

Se encontrar problemas:
1. Verifique as pré-requisitos acima
2. Tente com `-CheckOnly` primeiro
3. Consulte a seção "Solução de Problemas"
4. Verifique se há mensagens de erro específicas nas janelas de terminal que abrem
