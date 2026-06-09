import { esEmailValido } from "../shared/validation.js";
import { obtener, agregar, guardarSesion } from "../shared/storage.js";
import { mostrarMensaje } from "../shared/ui.js";

function registrar(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  if (!esEmailValido(email)) {
    mostrarMensaje("Ingresa un correo valido");
    return;
  }
  if (password.length < 6) {
    mostrarMensaje("La contrasena debe tener al menos 6 caracteres");
    return;
  }
  if (password !== password2) {
    mostrarMensaje("Las contrasenas no coinciden");
    return;
  }

  if (obtener("usuarios").some((u) => u.email === email)) {
    mostrarMensaje("Ya existe una cuenta con ese correo");
    return;
  }

  agregar("usuarios", { nombre, email, password });
  guardarSesion(email);
  window.location.href = "../dashboard/dashboard.html";
}

document.querySelector("form").addEventListener("submit", registrar);
