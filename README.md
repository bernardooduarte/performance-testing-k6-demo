# Performance Testing with k6, Node.js & PostgreSQL 🚀

Este repositório é um guia prático e demonstrativo de como implementar **Testes de Performance e Carga** em aplicações modernas. Em um cenário de Cloud (onde performance = custo), saber identificar gargalos antes do deploy é uma habilidade indispensável em 2026.

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js (Express)
- **Banco de Dados:** PostgreSQL 15
- **Ferramenta de Teste:** [k6 by Grafana](https://k6.io/) (JavaScript)
- **Infraestrutura:** Docker & Docker Compose

## 🏗️ Arquitetura do Projeto

A aplicação consiste em uma API simples que gerencia itens em um banco de dados relacional. Para tornar os testes realistas, foi implementado um **delay artificial de 100ms** nas consultas, simulando processamentos de regras de negócio.

```
/
├── api/                # Aplicação Node.js e Dockerfile
├── performance-tests/  # Scripts do k6 (Smoke, Load, Stress)
└── docker-compose.yml  # Orquestração do Banco e API
```

## 🚀 Como Executar

### 1. Subir a Infraestrutura

Certifique-se de ter o Docker instalado e execute:

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3000`.

### 2. Executar os Testes (via Docker)

Você não precisa instalar o k6 localmente. Rode os scripts usando o container oficial:

**Smoke Test** (Validação inicial):

```bash
cat performance-tests/smoke-test.js | docker run --rm -i grafana/k6 run -
```

**Load Test** (Carga sustentada - 50 VUs):

```bash
cat performance-tests/load-test.js | docker run --rm -i grafana/k6 run -
```

**Stress Test** (Ponto de ruptura - 200 VUs):

```bash
cat performance-tests/stress-test.js | docker run --rm -i grafana/k6 run -
```

## 📊 Análise de Resultados Obtidos

Durante a execução dos testes, os seguintes comportamentos foram observados:

### 1. Smoke Test 💨

**Objetivo:** Validar conectividade e scripts.

**Resultado:** 100% de sucesso. Latência estável próxima aos 115ms (100ms do delay + overhead da rede/banco).

### 2. Load Test 📈

**Configuração:** Ramp-up para 50 usuários simultâneos por 1 minuto.

**Resultado:** O sistema manteve a estabilidade. Métrica p(95): ~126ms. Isso indica que mesmo com 50 usuários, 95% das requisições foram processadas quase instantaneamente após o delay obrigatório.

### 3. Stress Test 💥

**Configuração:** Aceleração agressiva até 200 usuários simultâneos.

**Ponto de Ruptura Identificado:**
- **Latência:** O p(99) saltou para 2.06s, falhando no limite (Threshold) definido de 1s.

**Conclusão:** O sistema não sofreu erros (0% de falhas HTTP), mas a fila de conexões do banco/Node causou uma degradação severa na experiência do usuário.

## 🛡️ Thresholds (Limites de Qualidade)

Defini como critérios de sucesso (SLA) para esta aplicação:

- `http_req_failed`: Menos de 1% de erro.
- `http_req_duration`: 95% das requisições abaixo de 250ms (em carga normal).

---

Desenvolvido para fins de estudo sobre SRE e Qualidade de Software.