const API_URL = "https://api-to-do-bq6q.onrender.com/tareas";

document.addEventListener("DOMContentLoaded", cargarTareas);

document.getElementById("tarea-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion })
  });

  if (res.ok) {
    document.getElementById("tarea-form").reset();
    cargarTareas();
  }
});

async function cargarTareas() {
  const res = await fetch(API_URL);
  const tareas = await res.json();
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";

  tareas.forEach(t => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerHTML = `
      <div>
        <strong>${t.titulo}</strong><br>
        <small>${t.descripcion || ""}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-success me-2" onclick="marcarCompletada(${t.id}, ${t.completado})">
          ${t.completado ? "✅" : "☐"}
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${t.id})">🗑️</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

async function eliminarTarea(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  cargarTareas();
}

async function marcarCompletada(id, estadoActual) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completado: !estadoActual })
  });
  cargarTareas();
}
