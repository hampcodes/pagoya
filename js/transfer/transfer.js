import { esNumeroCuentaValido } from "../shared/validation.js";
import { obtener, guardar, agregar } from "../shared/storage.js";
import { mostrarMensaje } from "../shared/ui.js";

const TRANSFERENCIAS_EJEMPLO = [
  { fecha: "2026-05-28", origen: "1234-5678-9012-3456", destino: "9876-5432-1098-7654", concepto: "Pago alquiler", monto: 250 },
  { fecha: "2026-05-30", origen: "1234-5678-9012-3456", destino: "1111-2222-3333-4444", concepto: "Devolucion", monto: 80 },
  { fecha: "2026-06-01", origen: "9876-5432-1098-7654", destino: "5555-6666-7777-8888", concepto: "Servicios", monto: 145.3 },
];

// Carga datos de ejemplo solo la primera vez.
function cargarEjemplos() {
  if (obtener("transferencias").length === 0) {
    guardar("transferencias", TRANSFERENCIAS_EJEMPLO);
  }
}

// Devuelve el HTML de una fila de la tabla.
function filaTransferencia(t) {
  return `
    <tr>
      <td>${t.fecha}</td>
      <td>${t.origen}</td>
      <td>${t.destino}</td>
      <td>${t.concepto}</td>
      <td>S/ ${t.monto.toFixed(2)}</td>
      <td class="acciones"><a href="#">Ver</a></td>
    </tr>`;
}

// Oculta las filas que no coinciden con el texto buscado.
function filtrarFilas(tabla, texto) {
  texto = texto.toLowerCase();
  tabla.querySelectorAll("tr").forEach((fila) => {
    fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
  });
}

// Listar + buscar (list.html).
function iniciarLista() {
  const tabla = document.querySelector("tbody");
  const filtro = document.querySelector(".filtro");
  if (!tabla || !filtro) return;

  tabla.innerHTML = obtener("transferencias").map(filaTransferencia).join("");

  filtro.addEventListener("input", () => filtrarFilas(tabla, filtro.value));
}

// Registrar nueva transferencia (form.html).
function iniciarFormulario() {
  const cuentaOrigen = document.getElementById("origen");
  const cuentaDestino = document.getElementById("destino");
  const formulario = document.querySelector("form");
  if (!cuentaOrigen || !cuentaDestino || !formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!esNumeroCuentaValido(cuentaDestino.value)) {
      mostrarMensaje("La cuenta destino debe tener el formato 0000-0000-0000-0000");
      return;
    }

    agregar("transferencias", {
      fecha: new Date().toISOString().slice(0, 10),
      origen: cuentaOrigen.value,
      destino: cuentaDestino.value,
      concepto: document.getElementById("concepto").value,
      monto: Number(document.getElementById("monto").value),
    });
    window.location.href = "list.html";
  });
}

cargarEjemplos();
iniciarLista();
iniciarFormulario();
