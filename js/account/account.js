import { esNumeroCuentaValido } from "../shared/validation.js";
import { obtener, guardar, agregar, actualizar, eliminar } from "../shared/storage.js";
import { mostrarMensaje } from "../shared/ui.js";

const CUENTAS_EJEMPLO = [
  { titular: "Juan Perez", numero: "1234-5678-9012-3456", tipo: "Ahorro", saldo: 1500 },
  { titular: "Juan Perez", numero: "9876-5432-1098-7654", tipo: "Corriente", saldo: 320.5 },
  { titular: "Maria Lopez", numero: "1111-2222-3333-4444", tipo: "Ahorro", saldo: 4820.75 },
];

// Carga datos de ejemplo solo la primera vez.
function cargarEjemplos() {
  if (obtener("cuentas").length === 0) {
    guardar("cuentas", CUENTAS_EJEMPLO);
  }
}

// Devuelve el HTML de una fila de la tabla.
function filaCuenta(cuenta) {
  return `
    <tr>
      <td>${cuenta.titular}</td>
      <td>${cuenta.numero}</td>
      <td>${cuenta.tipo}</td>
      <td>S/ ${cuenta.saldo.toFixed(2)}</td>
      <td class="acciones">
        <a href="form.html?numero=${cuenta.numero}">Editar</a>
        <a href="#" data-eliminar="${cuenta.numero}">Eliminar</a>
      </td>
    </tr>`;
}

// Pinta todas las cuentas en la tabla.
function pintarCuentas(tabla) {
  tabla.innerHTML = obtener("cuentas").map(filaCuenta).join("");
}

// Oculta las filas que no coinciden con el texto buscado.
function filtrarFilas(tabla, texto) {
  texto = texto.toLowerCase();
  tabla.querySelectorAll("tr").forEach((fila) => {
    fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
  });
}

// Lista + buscar + eliminar (list.html).
function iniciarLista() {
  const tabla = document.querySelector("tbody");
  const filtro = document.querySelector(".filtro");
  if (!tabla || !filtro) return;

  pintarCuentas(tabla);

  filtro.addEventListener("input", () => filtrarFilas(tabla, filtro.value));

  tabla.addEventListener("click", (evento) => {
    const numero = evento.target.dataset.eliminar;
    if (numero && confirm("¿Seguro que quieres eliminar esta cuenta?")) {
      evento.preventDefault();
      eliminar("cuentas", "numero", numero);
      pintarCuentas(tabla);
    }
  });
}

// Crear o editar (form.html).
function iniciarFormulario() {
  const formulario = document.querySelector("form");
  if (!formulario) return;

  const inputTitular = document.getElementById("titular");
  const inputTipo = document.getElementById("tipo");
  const inputNumero = document.getElementById("numero");
  const inputSaldo = document.getElementById("saldo");

  // Si la URL trae ?numero=... editamos una cuenta existente.
  const numeroEditar = new URLSearchParams(location.search).get("numero");
  const cuentaEditar = obtener("cuentas").find((c) => c.numero === numeroEditar);

  if (cuentaEditar) {
    document.querySelector(".page-title").textContent = "Editar cuenta";
    inputTitular.value = cuentaEditar.titular;
    inputTipo.value = cuentaEditar.tipo;
    inputNumero.value = cuentaEditar.numero;
    inputSaldo.value = cuentaEditar.saldo;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!esNumeroCuentaValido(inputNumero.value)) {
      mostrarMensaje("El numero debe tener el formato 0000-0000-0000-0000");
      return;
    }

    const cuenta = {
      titular: inputTitular.value.trim(),
      numero: inputNumero.value,
      tipo: inputTipo.value,
      saldo: Number(inputSaldo.value),
    };

    if (cuentaEditar) {
      actualizar("cuentas", "numero", cuentaEditar.numero, cuenta);
    } else {
      agregar("cuentas", cuenta);
    }
    window.location.href = "list.html";
  });
}

cargarEjemplos();
iniciarLista();
iniciarFormulario();
