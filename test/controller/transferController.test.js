//No controleler podemos usar sinon para mockar o serviço, pois não queremos depender do serviço e ele bate direto na API

//Bibliotecas
const request = require('supertest')//Importante saber que ele faz requisições assicronas
const sinon = require ('sinon')
const { expect } = require('chai') //Aqui fica a bilioteca responsavel para fazer validações ( asserts)

//Apçicação
// Função utilitária para obter token de autenticação
async function getAuthToken(app, username = "Lucas", password = "123456") {
    const respostaLogin = await request(app)
        .post('/login')
        .send({ username, password });
    return respostaLogin.body.token;
}
const app = require('../../app')

//Mock
const transferService = require('../../service/transferService')

describe('Transfer controller',()=>{
    describe('POST /transfer',()=>{
        afterEach(() => {
            sinon.restore();
            
        });

        it('01- Quando informo senha e password corretamente',async ()=>{
            const respostaLogin = await request(app)
                .post('/login')
                .send({ username: "Lucas", password: "123456" });
            expect(respostaLogin.status).to.equal(200);
            expect(respostaLogin.body).to.have.property('token');
        });

        it('02- Quando uso dados validos o retorno é 201- MOCADO',async ()=>{
            //Captura o token
            const token = await getAuthToken(app);
            
            //Mock do serviço de transferência
            const transferServiceMock = sinon.stub(transferService,'transferValue');
            transferServiceMock.returns({ 
                from:"Lucas", 
                to:"test",
                value:2000,
                date: new Date() });

            const resposta = await request(app)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "Lucas",
                    to: "test",
                    value: 2000
                });

            //Validação com uma fixture
            const expectedResponse = require('../fixture/quandoInformoValoresValidos.json');
            delete expectedResponse[0].date;
            delete resposta.body.date;
            expect(resposta.body).to.deep.equal(expectedResponse[0]);
        });

        it('03- Retorna erro ao tentar transferir sem Token-Controller', async () => {
            // Não faz mock, usa implementação real
            const resposta = await request(app)
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

        it('04- Retorna erro ao tentar transferir de usuário inexistente - MOCADO', async () => {
            const token = await getAuthToken(app);
           
            //Mock do serviço de transferência
            const transferServiceMock = sinon.stub(transferService,'transferValue');
            transferServiceMock.throws(new Error('Remetente ou destinatário inválido'));
            // Chamada real ao endpoint com token válido
            const resposta = await request(app)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    from: "naoexiste",
                    to: "outroinexistente",
                    value: 100
                });

                
            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error');
            expect(resposta.body.error).to.have.property('message');
            expect(resposta.body.error.message).to.match(/Remetente ou destinatário inválido/i);
        });
    });
    describe('GET /transfers',()=>{

    })
})