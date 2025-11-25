const tabla = document.getElementById("usuariosTabla");
const form = document.getElementById("formUsuario");

async function cargarUsuarios() {
    const resp = await fetch("/api/usuarios");
    const data = await resp.json();
    tabla.innerHTML = "";
    data.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.rol}</td>
            <td>${u.verificado}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarUsuario('${u._id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${u._id}')">Eliminar</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const passwordHash = document.getElementById("passwordHash").value;

    await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, passwordHash })
    });

    form.reset();
    cargarUsuarios();
});

async function eliminarUsuario(id) {
    await fetch("/api/usuarios/" + id, { method: "DELETE" });
    cargarUsuarios();
}

function editarUsuario(id) {
    const nombre = prompt("Nuevo nombre:");
    const email = prompt("Nuevo email:");
    fetch("/api/usuarios/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    }).then(cargarUsuarios);
}

cargarUsuarios();
