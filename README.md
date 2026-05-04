# ContextAtlas

> **🇺🇸 English** | [🇧🇷 Português](#-português)

ContextAtlas is an MCP Server that captures not just syntax, but the **agent's reasoning**, building a temporal and structural memory of the entire development session for any AI Agent compatible with the MCP protocol (Cursor, Claude Desktop, Windsurf, Devin, etc).

## 🌊 The AI Usage Flow

Unlike standard environments where the AI fumbles around to understand a project, ContextAtlas provides a structured, automated flow:

1. **Zero-Setup Onboarding**: The moment the agent connects, it can call the `onboarding` tool. ContextAtlas automatically runs a graph-based `discovery` algorithm to find the most critical files and injects a complete architectural overview into the agent's prompt. 
2. **Safe Navigation & Impact**: Before changing code, the agent uses tools like `blast_radius`, `trace_callers`, and `semantic_search` to understand exactly what will break if a function is modified.
3. **Structured Memory**: As the agent thinks and writes code, it uses `create_reasoning_context_graph` and `save_code_change` to persist its reasoning into the project's graph. Weeks later, another agent will know exactly *why* a specific architectural decision was made.

---

## 🚀 Quick Start

### Option A — No install required (recommended)

Just add the following to your MCP client config. The package will be downloaded automatically on first run via `npx`:

```json
"mcpServers": {
  "contextatlas": {
    "command": "npx",
    "args": [
      "-y",
      "@contextatlas/core@latest",
      "mcp-atlas"
    ]
  }
}
```

### Option B — Global install (faster startup)

Install once globally and reference the binary directly:

```bash
npm install -g @contextatlas/core
```

Then use this config instead:

```json
"mcpServers": {
  "contextatlas": {
    "command": "mcp-atlas"
  }
}
```

*After restarting your MCP client, your AI Agent immediately gains ContextAtlas capabilities!*

---

## 🛠️ Complete Toolset

With ContextAtlas active, the AI Agent gains the following tools, categorized by their role in the development flow:

### 🧭 Onboarding & Project Discovery
- **`onboarding`**: Guides a new AI agent through the codebase. It automatically runs the discovery algorithm to find the most important files and components and explains the architecture.
- **`discovery`**: Analyzes the project graph and returns an initial context containing core files, central components, and overall project scale.

### 🔍 Navigation & Search
- **`find_symbol`**: Quickly locates classes, methods, and functions by exact name across the entire project.
- **`search_symbol`**: Searches for code symbols by partial name matching.
- **`expand_node`**: Navigates dependency graph connections via relational search (BFS) around a specific node.
- **`get_file`**: Returns the text content of a specified file.
- **`semantic_search`**: Finds the graph nodes that best match a natural language query using AI embeddings.

### 💥 Impact Analysis
- **`blast_radius`**: Analyzes the impact of a proposed change using a natural language query. It automatically finds the most impacted node and traces its callers.
- **`get_impact`**: Returns exact impact weights from modified nodes to mathematically assess the blast radius of changes.
- **`trace_callers`**: Discovers who depends on function X (avoiding breaking existing code!).
- **`trace_callees`**: Understands what a complex piece of code depends on internally.

### 🧠 Memory & Reasoning
- **`save_code_change`**: The agent automatically "saves" to persistent memory that it modified a file, attaching its rationale and thought process.
- **`create_reasoning_context_graph`**: Saves temporal reasoning (prompt → thought → solution) so that another agent knows *why* a change was made.
- **`get_file_history`**: Returns all recorded changes and agent thoughts for a specific file.
- **`get_all_changes`**: Returns all recorded code changes across the project, sorted by time.
- **`find_bugs_by_file`**: Returns bugs registered during previous model reasoning sessions for a specific file.

---

## Overview

The goal is to create a local tool capable of building a **project and agent interaction context graph** to provide real structural context to AI agents that edit code.

It solves three key problems present in current tools:
- Limited understanding of the actual code structure
- Lack of structured memory of the agent's reasoning
- Difficulty integrating context via standardized protocols

The system builds a **Context Graph**, where **Code**, **User prompts**, **Agent reasoning**, **Tool calls**, and **Code changes** are represented as **nodes and edges**.

This allows the agent to understand:
- Real project dependencies
- Impact of changes
- Decision history
- Development session flow

---

## Core Concept

The tool maintains a **living graph of the project**. It is not just AST, Embeddings, or Text indexing. It combines three main layers:

| Layer | Purpose |
|---|---|
| **Code Graph** | Structural relationships between files, functions, classes, imports |
| **Reasoning Graph** | Agent thoughts, decisions, plans, and observations |
| **Change Graph** | Temporal log of every code modification and its rationale |

---

## Graph Structure

### Node Types
Every relevant entity becomes a node.
- **Code Structure:** `File` · `Module` · `Function` · `Class` · `Interface` · `Import` · `Export`
- **AI Interactions:** `UserPrompt` · `AgentThought` · `ToolCall` · `CodeChange`

### Relationship Types
Edges capture dependency and flow.
- **Code Relations:** `IMPORTS` · `EXPORTS` · `CALLS` · `IMPLEMENTS` · `DEFINES`
- **Interaction Relations:** `GENERATED_BY` · `THINKS` · `CALLS_TOOL` · `MODIFIES` · `RELATED_TO_PROMPT`

---

## License
MIT

---

---

# 🇧🇷 Português

O ContextAtlas é um Servidor MCP que captura não apenas a sintaxe, mas o **raciocínio do agente**, construindo uma memória temporal e estrutural de toda a sessão de desenvolvimento para qualquer Agente de IA compatível com o protocolo MCP (Cursor, Claude Desktop, Windsurf, Devin, etc).

## 🌊 O Fluxo de Uso da IA

Diferente de ambientes padrão onde a IA fica "tateando" no escuro para entender um projeto, o ContextAtlas fornece um fluxo estruturado e automatizado:

1. **Onboarding Imediato**: No momento em que o agente se conecta, ele pode chamar a ferramenta de `onboarding`. O ContextAtlas roda automaticamente um algoritmo de `discovery` baseado em grafos para encontrar os arquivos mais críticos e injeta uma visão arquitetural completa no prompt do agente.
2. **Navegação Segura e Impacto**: Antes de alterar o código, o agente usa ferramentas como `blast_radius`, `trace_callers` e `semantic_search` para entender exatamente o que vai quebrar se uma função for modificada.
3. **Memória Estruturada**: Conforme o agente pensa e escreve código, ele usa `create_reasoning_context_graph` e `save_code_change` para persistir seu raciocínio no grafo do projeto. Semanas depois, outro agente saberá exatamente *o porquê* de uma decisão arquitetural específica ter sido tomada.

---

## 🚀 Instalação

### Opção A — Sem instalação (recomendado)

Adicione o seguinte ao arquivo de configuração do seu cliente MCP. O pacote será baixado automaticamente no primeiro uso via `npx`:

```json
"mcpServers": {
  "contextatlas": {
    "command": "npx",
    "args": [
      "-y",
      "@contextatlas/core@latest",
      "mcp-atlas"
    ]
  }
}
```

### Opção B — Instalação global (inicialização mais rápida)

Instale uma vez globalmente e referencie o binário diretamente:

```bash
npm install -g @contextatlas/core
```

Depois use esta configuração:

```json
"mcpServers": {
  "contextatlas": {
    "command": "mcp-atlas"
  }
}
```

*Após reiniciar o seu cliente MCP, o seu Agente de IA imediatamente ganha as capacidades do ContextAtlas!*

---

## 🛠️ Todas as Ferramentas Disponíveis

Com o ContextAtlas ativo, o Agente de IA ganha as seguintes tools, categorizadas pelo seu papel no fluxo de desenvolvimento:

### 🧭 Onboarding & Descoberta do Projeto
- **`onboarding`**: Guia um novo agente de IA pela base de código. Ele executa automaticamente o algoritmo de descoberta para encontrar os arquivos e componentes mais importantes e explica a arquitetura.
- **`discovery`**: Analisa o grafo do projeto e retorna um contexto inicial contendo arquivos centrais, componentes principais e a escala geral do projeto.

### 🔍 Navegação & Busca
- **`find_symbol`**: Localiza rapidamente classes, métodos e funções pelo nome exato no projeto todo.
- **`search_symbol`**: Busca por símbolos de código combinando nomes parciais.
- **`expand_node`**: Navega pelas conexões do grafo de dependências via busca relacional (BFS) ao redor de um nó específico.
- **`get_file`**: Retorna o conteúdo em texto de um arquivo especificado.
- **`semantic_search`**: Encontra os nós do grafo que melhor correspondem a uma consulta em linguagem natural usando embeddings de IA.

### 💥 Análise de Impacto
- **`blast_radius`**: Analisa o impacto de uma mudança proposta usando uma consulta em linguagem natural. Ele encontra automaticamente o nó mais impactado e rastreia quem o chama.
- **`get_impact`**: Retorna os pesos de impacto exatos dos nós modificados para avaliar matematicamente o raio de explosão (blast radius) das mudanças.
- **`trace_callers`**: Descobre quem depende da função X (evitando quebrar código existente!).
- **`trace_callees`**: Entende de quem um código complexo depende internamente.

### 🧠 Memória & Raciocínio
- **`save_code_change`**: O agente "salva" automaticamente para a memória persistente que modificou um arquivo, anexando sua justificativa e processo de pensamento.
- **`create_reasoning_context_graph`**: Salva o raciocínio temporal (prompt → pensamento → solução) para que outro agente saiba o *por que* uma mudança foi feita.
- **`get_file_history`**: Retorna todas as mudanças registradas e pensamentos do agente para um arquivo específico.
- **`get_all_changes`**: Retorna todas as modificações de código registradas no projeto todo, ordenadas por tempo.
- **`find_bugs_by_file`**: Retorna bugs registrados durante sessões anteriores de raciocínio do modelo para um arquivo específico.

---

## Visão Geral

A proposta é criar uma ferramenta local capaz de construir um **grafo de contexto do projeto e das interações do agente** para fornecer contexto estrutural real a agentes de IA que editam código.

O objetivo é resolver três problemas principais presentes nas ferramentas atuais:
- Entendimento limitado da estrutura real do código
- Ausência de memória estruturada do raciocínio do agente
- Dificuldade de integrar contexto via protocolos padronizados

O sistema constrói um **Context Graph**, no qual **Código**, **Prompts do usuário**, **Raciocínio do agente**, **Chamadas de ferramentas** e **Mudanças no código** são representados como **nós e arestas**.

Isso permite que o agente compreenda:
- Dependências reais do projeto
- Impacto de mudanças
- Histórico de decisões
- Fluxo de desenvolvimento da sessão

---

## Conceito Central

A ferramenta mantém um **grafo vivo do projeto**. Ele não é apenas AST, Embeddings, ou Indexação textual. Ele combina três camadas principais:

| Camada | Propósito |
|---|---|
| **Code Graph** | Relacionamentos estruturais entre arquivos, funções, classes, imports |
| **Reasoning Graph** | Pensamentos, decisões, planos e observações do agente |
| **Change Graph** | Log temporal de cada modificação de código e sua justificativa |

---

## Estrutura do Grafo

### Tipos de Nós
Cada entidade relevante vira um nó.
- **Estrutura do Código:** `File` · `Module` · `Function` · `Class` · `Interface` · `Import` · `Export`
- **Interações com IA:** `UserPrompt` · `AgentThought` · `ToolCall` · `CodeChange`

### Tipos de Relações
As arestas capturam dependência e fluxo.
- **Relações de Código:** `IMPORTS` · `EXPORTS` · `CALLS` · `IMPLEMENTS` · `DEFINES`
- **Relações de Interação:** `GENERATED_BY` · `THINKS` · `CALLS_TOOL` · `MODIFIES` · `RELATED_TO_PROMPT`
