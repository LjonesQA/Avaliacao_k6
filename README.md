Meu Relatório Técnico: Implementação do Script de Performance

Este documento detalha as decisões técnicas e os conceitos de engenharia que apliquei no desenvolvimento do meu script desafioFinal.js. Meu objetivo foi criar um teste robusto, escalável e que simulasse o comportamento real da aplicação.

Mapeamento Técnico dos Conceitos Aplicados
1. Helpers e Abstração de Chamadas
Para manter meu código limpo e facilitar a manutenção, decidi não escrever URLs e headers diretamente no script principal. Utilizei Helpers (apiCalls.js) para encapsular toda a lógica do protocolo HTTP.

Aplicação: Ao chamar postRequestToken, estou abstraindo a complexidade da montagem dos headers de autenticação, o que me permite focar apenas no fluxo de negócio do teste.

2. Ciclo de Vida: Setup e Data-Driven Testing (DDT)
Não quis que meu teste trabalhasse com dados estáticos ou "chutados". Por isso, utilizei a função setup() para garantir uma massa de dados real.

O que fiz: Meu setup() realiza uma requisição GET /users antes do início da carga. Esse array de 100 usuários é passado para as instâncias de VUs, garantindo que o teste seja guiado por dados reais (Data-Driven).

3. Modelagem de Carga com Stages e VUs
Em vez de disparar toda a carga de uma vez, modelei o comportamento através de Stages para observar a elasticidade da API.

Estratégia: Defini estágios de Ramp-up (subida gradual para 8 e depois 25 VUs), um Plateau (manutenção da carga máxima) e um Ramp-down (descida). Isso me permite identificar em qual nível de concorrência a performance começa a degradar.

4. Grupos e Transações de Negócio
Para organizar as métricas e facilitar o debug, separei as ações em Groups.

Aplicação: Criei o group('Login Usuário') e o group('Realizar Transferência'). Isso isola as métricas: se o login for rápido, mas a transferência falhar, consigo identificar o gargalo imediatamente no relatório final.

5. Checks e Validação de Resposta sob Carga
Utilizei Checks para garantir que a API não está apenas respondendo, mas respondendo o conteúdo esperado.

Minha lógica: Além de verificar o status 200/201, implementei uma validação dinâmica no corpo da resposta: 'transferência realizada': (r) => r.json('from') === user.username. Isso garante a integridade dos dados mesmo com múltiplos usuários simultâneos.

6. Thresholds (SLA de Performance)
Defini critérios rígidos de sucesso através de Thresholds.

Critério: Estabeleci que 95% das requisições (p(95)) devem ser respondidas em menos de 200ms. Diferente da média, o P95 me mostra a experiência real dos usuários mais afetados pela latência.

7. Encadeamento de Requisições e Auth Token
Implementei o Reaproveitamento de Resposta para lidar com a segurança da API.

Fluxo: Extraio o token JWT da resposta do login (res.json('token')) e o injeto automaticamente na próxima requisição de transferência. Isso simula o fluxo de autenticação exato de um usuário real.

8. Métricas Customizadas com Trends
Para ter uma visão mais granular, criei Trends customizadas.

Motivo: O k6 mede o tempo total, mas eu queria medir tempos específicos, como o waitingTimeLogin. Isso me ajuda a entender quanto tempo o servidor leva processando (ex: custo do Bcrypt) antes de enviar o primeiro byte.

9. Geração Sintética com Faker e Randomização
Para evitar que o banco de dados entregue dados "viciados" ou de cache, usei o Faker e funções de randomização.

Uso: Funções como randomEmail() e randomName() garantem que cada tentativa de cadastro ou interação utilize dados novos e únicos, forçando a API a processar cada requisição de forma independente.

10. Pacing com Sleep
Por fim, utilizei o sleep(1) para controlar o Pacing (ritmo) das iterações.

Objetivo: Isso evita que os VUs executem requisições em um loop infinito e irrealista, simulando melhor o tempo de pensamento do usuário e protegendo a pilha de rede do meu sistema operacional de exaustão de portas.

Com este script, consigo garantir que a aplicação não só aguenta a carga solicitada, mas mantém a integridade dos dados e respeita os tempos de resposta acordados.