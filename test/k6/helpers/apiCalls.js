import http from 'k6/http';
import { BASE_URL } from './baseUrl.js';


export function postRequest(endpoint, payload) {
    let res = http.post(`${BASE_URL}${endpoint}`, JSON.stringify(payload), 
         {
          headers: { 'Content-Type': 'application/json' },
          
        });
    return res;
    }

export function postRequestToken(endpoint, token, checkoutPayload) {
    
    let res = http.post(`${BASE_URL}${endpoint}`, JSON.stringify(checkoutPayload), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    return res;;
}

export function getUserData(endpoint) {
    let res = http.get(`${BASE_URL}${endpoint}`, {
        headers: {
            'Accept': 'application/json', // Informa que você espera JSON
            'Content-Type': 'application/json',
        },
    });

    // Validação de segurança
    if (res.status !== 200) {
        console.error(`ERRO NO SETUP: A API retornou status ${res.status} para o endpoint ${endpoint}`);
        console.error(`CORPO DA RESPOSTA: ${res.body}`);
        return []; // Retorna array vazio para evitar o erro de parsing
    }

    try {
        return res.json();
    } catch (e) {
        console.error(`ERRO DE PARSING: A resposta não é um JSON válido. Conteúdo: ${res.body}`);
        return [];
    }
}