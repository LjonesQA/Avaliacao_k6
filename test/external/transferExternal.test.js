//No external não mokcamos nada (não usamos o sinon), fazemos requisições reais, fazemos requisições 
// para a aplicação que está rodando externamente via HTTP
//Lembrando que para rodar esse teste a aplicação deve estar rodando (node app.js)
//Lembenado que os usuarios devem existir na base de dados (model/userModel.js)

//Bibliotecas
const request = require('supertest');//Importante saber que ele faz requisições assíncronas
const { expect } = require('chai'); //Aqui fica a biblioteca responsável para fazer validações ( asserts)   
const { response } = require('../../app');

//Função utilitária para obter token de autenticação
async function getAuthToken(app, username = "Lucas", password = "123456") {
    const respostaLogin = await request(app)
        .post('/login')
        .send({ username, password });
    return respostaLogin.body.token;
}

//Aplicação
describe('Transfer External',()=>{
    describe('POST /transfer',()=>{
        //Captura o token
        it('Quando informo senha e password corretamente',async ()=>{
            const respostaLogin = await request('http://localhost:3000') //Aqui colocamos a url da aplicação que está rodando externamente
                .post('/login')
                .send({
                    username: "Lucas",
                    password: "123456"
                }); 
            const token = respostaLogin.body.token;
            expect(respostaLogin.status).to.equal(200);
            expect(respostaLogin.body).to.have.property('token');
        });

         it('Validar o case sensitive pra logar',async ()=>{
            const respostaLogin = await request('http://localhost:3000') //Aqui colocamos a url da aplicação que está rodando externamente
                .post('/login')
                .send({
                    username: "lucas",
                    password: "123456"
                }); 
            const token = respostaLogin.body.token;
            expect(respostaLogin.status).to.equal(401);
             expect(respostaLogin.body).to.have.property('error');
            expect(respostaLogin.body.error).to.have.property('message');
            expect(respostaLogin.body.error.message).to.match(/Login ou senha inválidos/i);
        });

        it('Retorna erro ao tentar transferir sem token- 401 ', async () => {        

            const resposta = await request('http://localhost:3000') //Aqui colocamos a url da aplicação que está rodando externamente
                .post('/transfer')
                .send({
                    from: "naoexiste",
                    to: "outroinexistente",
                    value: 100
                });
            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.have.property('message');
            expect(resposta.body.error.message).to.match(/Token não fornecido/i);
        });


        it('Ao tentar fazer uma transferencia valida entre usuarios existentes- 201', async () => {
            const token = await getAuthToken('http://localhost:3000');
            const resposta= await request('http://localhost:3000') //Aqui colocamos a url da aplicação que está rodando externamente
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "Lucas",
                    to: "Maria",
                    value: 1500
                });
            expect(resposta.status).to.equal(201);
            const expectedResponse = require('../fixture/quandoInformoValoresValidos.json');
            delete expectedResponse[1].date;
            delete resposta.body.date;
            expect(resposta.body).to.deep.equal(expectedResponse[1]);

        })

        

    })
})