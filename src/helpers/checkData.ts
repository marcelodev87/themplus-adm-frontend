export const checkDataLogin = (data: {
  email: string;
  password: string;
}): { status: boolean; message?: string } => {
  if (data.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (data.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  return { status: true };
};

export const checkDataReset = (email: string) => {
  const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  }
  if (!emailRegex.test(email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  return { status: true };
};

export const checkPassword = (data: { password: string; passwordConfirm: string }) => {
  if (data.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  if (data.password.trim().length < 8) {
    return {
      status: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    };
  }
  if (data.password.trim() !== data.passwordConfirm.trim()) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};

export const checkDataCoupon = (data: {name: string, movements: number, dateExpires: string, discount: string}, hasDiscount: boolean, hasDateExpires: boolean): { status: boolean; message?: string } => {
  if (data.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do cupom' };
  }
  if (data.movements < 30) {
    return { status: false, message: 'Deve ter no minímo 30 movimentações' };
  }
  if (hasDateExpires) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data.dateExpires)) {
      return {
        status: false,
        message: 'A data de expiração deve estar no formato dd/mm/yyyy',
      };
    }

    const [day, month, year] = data.dateExpires.split('/');
    const dateExpires = new Date(Number(year), Number(month) - 1, Number(day));

    if (isNaN(dateExpires.getTime())) {
      return {
        status: false,
        message: 'Informe uma data de expiração válida no formato dd/mm/yyyy',
      };
    }

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    if (dateExpires.getTime() < tomorrow.getTime()) {
      return {
        status: false,
        message: 'A data de expiração deve ser no mínimo um dia à frente da data atual',
      };
    }
  }
  if (hasDiscount) {
    if (Number(data.discount) <= 0 || Number(data.discount) > 100) {
      return {
        status: false,
        message: 'O desconto deve ser maior que 0% e no máximo 100%',
      };
    }
  }

  return { status: true };
};
