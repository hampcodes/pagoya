import { esEmailValido } from "../shared/validation.js";
import { obtener, guardarSesion } from "../shared/storage.js";
import { mostrarMensaje } from "../shared/ui.js";

function iniciarSesion(evento) {
  evento.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!esEmailValido(email)) {
    mostrarMensaje("Ingresa un correo valido");
    return;
  }

  const usuario = obtener("usuarios").find(
    (u) => u.email === email && u.password === password
  );

  if (!usuario) {
    mostrarMensaje("Correo o contrasena incorrectos");
    return;
  }

  guardarSesion(usuario.email);
  window.location.href = "../dashboard/dashboard.html";
}

document.querySelector("form").addEventListener("submit", iniciarSesion);
