// Muestra un mensaje dentro del form (reemplaza a alert).
// contenedor: donde buscar la caja, util si la pagina tiene varios forms.

const mostrarMensaje = (texto, tipo = "error", contenedor = document) => {
  const caja = contenedor.querySelector(".form-mensaje");
  if (!caja) return;
  caja.textContent = texto;
  caja.className = `form-mensaje form-mensaje--${tipo}`;
  caja.hidden = false;
};

export { mostrarMensaje };
