import { SharedArray } from 'k6/data';

export const transferencias = new SharedArray('transferencias', function () {
  return JSON.parse(
    open('../../fixture/quandoInformoValoresValidos.json')
  );
});
