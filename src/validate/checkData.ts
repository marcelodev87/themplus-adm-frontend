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
