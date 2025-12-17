const request = require('supertest');
const { expect } = require('chai');
const external = 'http://localhost:4000'; // GraphQL server deve estar rodando

// Função utilitária para obter token JWT
async function getAuthToken(username = "Lucas", password = "123456") {
  const query = {
    query: `mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    token\n  }\n}`,
    variables: { username, password }
  };
  const res = await request(external) // Aqui colocamos a url da aplicação que está rodando externamente
    .post('/graphql')
    .send(query);
  return res.body.data.login.token;
}

describe('GraphQL Transfer Mutation', () => {
  it('01- Transferência com sucesso', async () => {
    const token = await getAuthToken();
    const mutation = {
      query: `mutation {\n  createTransfer(from: \"Lucas\", to: \"Maria\", value: 1000) {\n    from\n    to\n    value}\n}`
    };
    const res = await request(external)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);
  
    expect(res.body.data.createTransfer).to.include({ from: 'Lucas', to: 'Maria', value: 1000 });
    
  });

  it('02- Sem saldo disponível para transferência', async () => {
    const token = await getAuthToken();
    const mutation = {
      query: `mutation {\n  createTransfer(
      from: \"Lucas\", 
      to: \"Maria\", 
      value: 999999) {\n    from\n    to\n    value}\n}`
    };
    const res = await request(external)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(mutation);
    
    expect(res.body.errors).to.not.be.undefined;
    expect(res.body.errors[0].message).to.match(/Saldo insuficiente para realizar a transferência/i);
  });

  it('03- Token de autenticação não informado', async () => {
    const mutation = {
      query: `mutation {\n  createTransfer(
      from: \"Lucas\",
      to: \"Maria\",
      value: 1000) {\n    from\n    to\n    value\n    date\n  }\n}`
    };
    const res = await request(external)
      .post('/graphql')
      .send(mutation);

    expect(res.body.errors).to.not.be.undefined;
    expect(res.body.errors[0].message).to.match(/Token não fornecido/i);
  });
});
