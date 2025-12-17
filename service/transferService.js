const { transfers } = require('../model/transferModel');
const { getUser } = require('./userService');

function transferValue({ from, to, value }) {
  const sender = getUser(from);
  const recipient = getUser(to);
  if (!sender || !recipient) {
    throw new Error('Remetente ou destinatário inválido');
  }
  if (typeof sender.saldo !== 'number' || sender.saldo < value) {
    throw new Error('Saldo insuficiente para realizar a transferência');
  }
  const isFavorecido = sender.favorecidos && sender.favorecidos.includes(to);
  if (!isFavorecido && value >= 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
  }
  sender.saldo -= value;
  if (typeof recipient.saldo === 'number') {
    recipient.saldo += value;
  }
  const transfer = { from, to, value, date: new Date() };
  transfers.push(transfer);
  return transfer;
}

function getTransfers() {
  return transfers;
}

module.exports = {
  transferValue,
  getTransfers,
};
