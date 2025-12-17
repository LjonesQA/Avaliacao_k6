import http from 'k6/http';
import { BASE_URL } from './baseUrl.js';
import { randomName, randomPassword ,favorecidosData } from './randomData.js';
import { postRequest } from './apiCalls.js';

export function createUsers(vus) {
  const users = [];

  for (let i = 1; i <= vus; i++) {
    const user = {
      username: randomName(),
      password: randomPassword(),
    //   saldo: 1000,
      favorecidos: [favorecidosData()],
    };

    console.log('Cadastrando usuário:', user)

    const res = postRequest('/register', user);
    console.log('Response cadastro: '+res.body);
    console.log('Status cadastro: '+res.status);

    if (res.status !== 201) {
      throw new Error(`Erro ao cadastrar ${user.username}`);
    }

    users.push({
      username: user.username,
      password: user.password,
      favorecidos: user.favorecidos,
    });
  }

  return users;
}
