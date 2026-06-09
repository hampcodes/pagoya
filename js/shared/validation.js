// Validaciones reutilizables.

const esEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const esNumeroCuentaValido = (numero) => /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(numero);

export { esEmailValido, esNumeroCuentaValido };
