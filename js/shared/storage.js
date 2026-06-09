// CRUD de arreglos en localStorage (se guarda como texto con JSON).

const obtener = (clave) => JSON.parse(localStorage.getItem(clave)) || [];
const guardar = (clave, lista) => localStorage.setItem(clave, JSON.stringify(lista));

const agregar = (clave, item) => {
  const lista = obtener(clave);
  lista.push(item);
  guardar(clave, lista);
};

// Edita el item cuyo campo coincide con el valor. Ej: actualizar("cuentas", "numero", "1234...", {...})
const actualizar = (clave, campo, valor, cambios) => {
  const lista = obtener(clave);
  const item = lista.find((x) => x[campo] === valor);
  if (item) Object.assign(item, cambios); // copia los cambios sobre el item
  guardar(clave, lista);
};

// Borra el item cuyo campo coincide con el valor.
const eliminar = (clave, campo, valor) => {
  const lista = obtener(clave).filter((x) => x[campo] !== valor);
  guardar(clave, lista);
};

// Sesion: el usuario activo es un solo valor, no una lista.
const guardarSesion = (email) => localStorage.setItem("usuarioActivo", email);
const obtenerSesion = () => localStorage.getItem("usuarioActivo");
const cerrarSesion = () => localStorage.removeItem("usuarioActivo");

export { obtener, guardar, agregar, actualizar, eliminar, guardarSesion, obtenerSesion, cerrarSesion };
