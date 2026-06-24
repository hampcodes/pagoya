
// TO-DO(HAMP): Elementos de la pagina

const chat = document.getElementById("chat");
const form = document.getElementById("formChat");
const inputPreg = document.getElementById("pregunta");
const inputKey = document.getElementById("apiKey");
const btnImagen = document.getElementById("btnImagen");


// TO-DO(HAMP):System prompt: reglas + datos del usuario

const cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];
const transferencias = JSON.parse(localStorage.getItem("transferencias")) || [];

const SYSTEM = `Eres PagoBot, el asistente de PagoYa, una app de pagos (fintech).
Si te preguntan como te llamas, responde que eres "PagoYaBot".
Responde SIEMPRE de forma amable, en espanol, clara y breve.
Responde UNICAMENTE sobre PagoYa y las finanzas del usuario (cuentas, transferencias, ahorro, pagos).
Si te preguntan otra cosa, responde con amabilidad: "Lo siento, solo puedo ayudarte con temas de PagoYa y tus finanzas."

Cuentas del usuario: ${JSON.stringify(cuentas)}
Transferencias del usuario: ${JSON.stringify(transferencias)}`;

//TO-DO(HAMP): Historial de la conversacion (la memoria). Empieza con el system.
const mensajes = [{ role: "system", content: SYSTEM }];


// TO-DO(HAMP): Conexion con OpenAI 

const openai = async (ruta, body) => {
  const r = await fetch(`https://api.openai.com/v1/${ruta}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${inputKey.value.trim()}`,
    },
    body: JSON.stringify(body),
  });
  return r.json();
};


// TO-DO(HAMP): Generar texto (con memoria) 

const enviarTexto = async (e) => {
  e.preventDefault();
  const texto = inputPreg.value.trim();
  if (!texto) return;

  // TO-DO(HAMP): Muestra tu mensaje, limpia el input y pinta el "Procesando...".
  chat.innerHTML += `<p><b>Tu:</b> ${texto}</p>`;
  inputPreg.value = "";
  chat.innerHTML += `<p><i>Procesando...</i></p>`;
  const esperando = chat.lastElementChild;

  // TO-DO(HAMP): Guarda tu pregunta en el historial y manda TODO a OpenAI.
  mensajes.push({ role: "user", content: texto });
  const data = await openai("chat/completions", { model: "gpt-4o-mini", messages: mensajes });
  const respuesta = data.choices[0].message.content;

  // TO-DO(HAMP): Guarda la respuesta (asi recuerda) y la muestra.
  mensajes.push({ role: "assistant", content: respuesta });
  esperando.innerHTML = `<b>IA:</b> ${respuesta}`;
};


// TO-DO(HAMP): Generar imagen 

const crearImagen = async () => {
  const texto = inputPreg.value.trim();
  if (!texto) return;

  chat.innerHTML += `<p><b>Tu:</b> ${texto}</p>`;
  inputPreg.value = "";
  chat.innerHTML += `<p><i>Procesando...</i></p>`;
  const esperando = chat.lastElementChild;

  const data = await openai("images/generations", { model: "gpt-image-1", prompt: texto });
  esperando.innerHTML = `<b>IA:</b><br><img src="data:image/png;base64,${data.data[0].b64_json}" width="300">`;
};


// TO-DO(HAMP): Eventos

form.addEventListener("submit", enviarTexto);
btnImagen.addEventListener("click", crearImagen);
