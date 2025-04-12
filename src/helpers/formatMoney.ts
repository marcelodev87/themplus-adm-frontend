export const formatToBr = (value: string): string => {
  const number = parseFloat(value);

  if (isNaN(number)) {
    return 'Valor inválido';
  }

  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};