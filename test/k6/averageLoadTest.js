import { sleep, check, group } from 'k6';
import { getUserData, postRequest, postRequestToken } from './helpers/apiCalls.js';
import { Trend } from 'k6/metrics';

const waitingTimeLogin = new Trend('waiting_time', true);
const waitingTimeTransfer = new Trend('waiting_time_transfer', true);
const timeToToken = new Trend('time_to_token', true);

const VUS = 25;
export const options = {
  vus: VUS,
  // iterations: 1, 
  thresholds: {
    http_req_duration: ['p(95)<200'], 
  },
  stages: [
    { duration: '20s', target: 8 },
    {duration: '30s', target: VUS },
    { duration: '10s', target: VUS },
    { duration: '30s', target: 0 },
  ],
};

export function setup() {
  return getUserData('/users');
  
}

export default function(data) {
  const user = data[(__VU - 1 + __ITER) % data.length];
  
  let token = '';

  group('Login Usuário', function() {
    let loginData = {
      username: user.username,
      password: '123456', 
    };
   
    let res = postRequest('/login', loginData); 

    waitingTimeLogin.add(res.timings.duration);
    timeToToken.add(res.timings.duration - res.timings.waiting);

    check(res, {
      'status é 200': (r) => r.status === 200,
      'token recebido': (r) => r.json('token') !== undefined || r.json('token') !== "",
    });
    
    token = res.json('token');
  });

  group('Realizar Transferência', function() {
      let transferPayload = {
      from: user.username,
      to: user.favorecidos[0], 
      value: 0, 
    };

    let res = postRequestToken('/transfer', token, transferPayload);
    
    waitingTimeTransfer.add(res.timings.waiting);

    check(res, {
      'status é 201': (r) => r.status === 201,
      'transferência realizada': (r) => r.json('from') === user.username,
    });
  });

  sleep(1);
}