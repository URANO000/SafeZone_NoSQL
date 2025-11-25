const tablaZonas = document.getElementById("zonasTabla");
const formZona = document.getElementById("formZona");

async function cargarZonas() {
    const resp = await fetch("/api/zonas");
    const data = await resp.json();
    tablaZonas.innerHTML = "";
    data.forEach(z => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${z.nombre}</td>
            <td>Lat: ${z.coordenadas.lat}, Lng: ${z.coordenadas.lng}</td>
            <td>${z.radio || ""}</td>
            <td>${z.estatus}</td>
            <td>${z.descripcion || ""}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarZona('${z._id}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarZona('${z._id}')">Eliminar</button>
            </td>
        `;
        tablaZonas.appendChild(tr);
    });
}

formZona.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const radio = parseFloat(document.getElementById("radio").value) || 0;
    const estatus = document.getElementById("estatus").value;
    const descripcion = document.getElementById("descripcion").value;

    await fetch("/api/zonas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, coordenadas: { lat, lng }, radio, estatus, descripcion })
    });

    formZona.reset();
    cargarZonas();
});

async function eliminarZona(id) {
    await fetch("/api/zonas/" + id, { method: "DELETE" });
    cargarZonas();
}

function editarZona(id) {
    const nombre = prompt("Nuevo nombre:");
    const estatus = prompt("Nuevo estatus (seguro, cuidado, peligro):");
    fetch("/api/zonas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, estatus })
    }).then(cargarZonas);
}

cargarZonas();
