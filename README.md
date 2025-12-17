*Como Rodar o Projeto*
Eu configurei o projeto para que qualquer pessoa consiga subir o ambiente e rodar os testes de performance com comandos simples via NPM. Abaixo, detalho o que cada comando faz:

    1. Subindo o Servidor (Backend)
Antes de qualquer teste, eu preciso garantir que a API está ativa para responder às requisições.

Comando: npm run start

O que acontece: Este comando executa o node server.js, subindo a API REST que processa os logins e as transferências.

(Opcional) Para a versão GraphQL, utilizei: npm run start:graphql.

    2. Executando o Teste de Carga Local
Para uma execução rápida no terminal, sem interface gráfica, configurei o modo local.

Comando: npm run k6:local

O que acontece: Ele dispara o k6 diretamente contra o script averageLoadTest.js. É ideal para validações rápidas de Thresholds e Checks diretamente no console.

    3. Executando com Dashboard (Interface Visual)
Este é o comando que utilizo para apresentações ou análises em tempo real, pois ele habilita um painel web.

Comando: npm run k6:dash

O que acontece:Utilizei o cross-env para garantir que as variáveis de ambiente funcionem tanto no Windows quanto no Linux/Mac.

K6_WEB_DASHBOARD=true: Ativa a interface gráfica do k6.

K6_WEB_PERIOD=2s: Define que o gráfico deve ser atualizado a cada 2 segundos.

*Meu Relatório Técnico: Implementação do Script de Performance*

Este documento detalha as decisões técnicas e os conceitos de engenharia que apliquei no desenvolvimento do meu script desafioFinal.js. Meu objetivo foi criar um teste robusto, escalável e que simulasse o comportamento real da aplicação.

*Mapeamento Técnico dos Conceitos Aplicados*
    . Data-Driven Testing (DDT)
O teste não usa dados fixos no script; ele consome a base de dados da API para se alimentar.

No Código: No bloco export function setup() { return getUserData('/users'); }.

Aplicação: busca 100 usuários reais da API e os injeta no teste, garantindo que a carga seja distribuída entre contas reais.

2. Stages (Estágios de Carga)

No Código: No objeto stages: [ { duration: '10s', target: 8 }, ... ].

Aplicação: Isso permite observar o comportamento da API durante o aquecimento (Ramp-up) e no pico de tráfego (Plateau).

3. Thresholds (Limiares de Qualidade)
É a "régua" que define se a performance é aceitável ou não.

No Código: thresholds: { http_req_duration: ['p(95)<200'] }.

Aplicação: Verificar se pelo menos 95% das requisiçoes demoraram menos de 200ms

4. Checks (Verificações)
Validações de sucesso que não interrompem o teste.

No Código: check(res, { 'status é 200': (r) => r.status === 200 }).

Aplicação: Garante a integridade funcional. 

5. Groups (Organização Logística)
Segmentação das métricas por funcionalidade.

No Código: group('Login Usuário', function() { ... }).

Aplicação: Permite analisar separadamente o tempo de resposta do Login e da Transferência, identificando onde está o gargalo real.

6. Reaproveitamento de Resposta & Token de Autenticação
É o encadeamento lógico entre duas requisições protegidas.

No Código: token = res.json('token'); seguido pelo uso na função postRequestToken('/transfer', token, ...).

Aplicação: Captura o token gerado no login e o utiliza para autorizar a transferência, simulando o fluxo real de uma sessão.

7. Trends (Métricas de Tendência Customizadas)
Cronômetros manuais para partes específicas do código.

No Código: const waitingTimeLogin = new Trend('waiting_time'); e depois waitingTimeLogin.add(res.timings.duration);.

Aplicação: Isso gera estatísticas extras no relatório final, focadas apenas no tempo que o servidor levou para "pensar" antes de responder.

8. Faker (Geração de Dados Dinâmicos)
Evita o uso de dados repetidos que poderiam ser mascarados pelo cache da API.

No Código: import faker from "k6/x/faker"; e o uso em randomName().

Aplicação: Cria nomes e dados aleatórios para novos registros, garantindo que cada requisição seja única para o servidor.

9. Variável de Ambiente
Configuração externa que altera o comportamento do k6 sem mudar o código.

No Código: O uso de  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

Aplicação: Permite usar uma base Url em varias partes do código 

10. Helpers
Centralização de lógica repetitiva.

No Código: import { ... } from './helpers/apiCalls.js';.

Aplicação: Abstrai a montagem de cabeçalhos e URLs, permitindo que seu script principal foque apenas na lógica do teste.


Com este script, consigo garantir que a aplicação não só aguenta a carga solicitada, mas mantém a integridade dos dados e respeita os tempos de resposta acordados.