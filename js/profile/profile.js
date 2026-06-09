import { esEmailValido } from "../shared/validation.js";
import { obtener, actualizar, obtenerSesion, guardarSesion } from "../shared/storage.js";
import { mostrarMensaje } from "../shared/ui.js";

// Usuario con la sesion activa (o undefined si no hay sesion).
const usuario = obtener("usuarios").find((u) => u.email === obtenerSesion());

// Vuelca los datos guardados en los inputs del formulario.
function mostrarDatos() {
  if (!usuario) return;
  document.getElementById("nombre").value = usuario.nombre || "";
  document.getElementById("apellido").value = usuario.apellido || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("telefono").value = usuario.telefono || "";
}

// Guardar datos personales.
function guardarDatos(evento, form) {
  evento.preventDefault();
  if (!usuario) {
    mostrarMensaje("Inicia sesion para editar tu perfil", "error", form);
    return;
  }

  const email = document.getElementById("email").value.trim();
  if (!esEmailValido(email)) {
    mostrarMensaje("Ingresa un correo valido", "error", form);
    return;
  }

  actualizar("usuarios", "email", usuario.email, {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    email: email,
    telefono: document.getElementById("telefono").value.trim(),
  });

  // Si cambio el correo, la sesion debe apuntar al nuevo.
  if (email !== usuario.email) {
    guardarSesion(email);
    usuario.email = email;
  }
  mostrarMensaje("Datos guardados con exito", "exito", form);
}

// Cambiar contrasena.
function cambiarPassword(evento, form) {
  evento.preventDefault();
  if (!usuario) {
    mostrarMensaje("Inicia sesion para cambiar tu contrasena", "error", form);
    return;
  }

  const actual = document.getElementById("actual").value;
  const nueva = document.getElementById("nueva").value;
  const repetir = document.getElementById("repetir").value;

  if (actual !== usuario.password) {
    mostrarMensaje("La contrasena actual no es correcta", "error", form);
    return;
  }
  if (nueva.length < 6) {
    mostrarMensaje("La nueva contrasena debe tener al menos 6 caracteres", "error", form);
    return;
  }
  if (nueva !== repetir) {
    mostrarMensaje("Las contrasenas no coinciden", "error", form);
    return;
  }

  actualizar("usuarios", "email", usuario.email, { password: nueva });
  usuario.password = nueva;
  form.reset();
  mostrarMensaje("Contrasena actualizada", "exito", form);
}

// La pagina tiene dos formularios: datos y contrasena.
const [formDatos, formPassword] = document.querySelectorAll("form");

mostrarDatos();
formDatos.addEventListener("submit", (evento) => guardarDatos(evento, formDatos));
formPassword.addEventListener("submit", (evento) => cambiarPassword(evento, formPassword));
