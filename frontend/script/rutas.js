
const APIRUTAS = "http://localhost:7000/api/rutas/";

let editId = null;

// Cargar rutas al iniciar
document.addEventListener("DOMContentLoaded", cargarRutas);

async function cargarRutas() {
    try {
        const resp = await fetch(APIRUTAS);
        const rutas = await resp.json();

        const tbody = document.querySelector("#tablaRutas tbody");
        tbody.innerHTML = "";

        rutas.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r._id}</td>
                    <td>${r.usuarioId}</td>

                    <td>Lat: ${r.origen?.lat}, Lng: ${r.origen?.lng}</td>
                    <td>Lat: ${r.destino?.lat}, Lng: ${r.destino?.lng}</td>

                    <td>${JSON.stringify(r.camino || "N/A")}</td>
                    <td>${r.estatus}</td>

                    <td>${new Date(r.createdAt).toLocaleString()}</td>

                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editar('${r._id}')">
                            <i class="fa fa-edit"></i>
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="eliminarRuta('${r._id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al cargar rutas:", error);
    }
}

// Guardar / actualizar ruta
document.querySelector("#rutaForm").addEventListener("submit", async e => {
    e.preventDefault();

    const rutaData = {
        usuarioId: document.querySelector("#usuarioId").value,

        origen: {
            lat: Number(document.querySelector("#origenLat").value),
            lng: Number(document.querySelector("#origenLng").value)
        },

        destino: {
            lat: Number(document.querySelector("#destinoLat").value),
            lng: Number(document.querySelector("#destinoLng").value)
        },

        camino: document.querySelector("#camino").value ? JSON.parse(document.querySelector("#camino").value) : null,

        estatus: document.querySelector("#estatus").value,

        createdAt: document.querySelector("#createdAt").value
    };

    const metodo = editId ? "PUT" : "POST";
    const endpoint = editId ? `${APIRUTAS}${editId}` : APIRUTAS;

    try {
        await fetch(endpoint, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rutaData)
        });

        limpiarFormulario();
        cargarRutas();

    } catch (error) {
        console.error("Error guardando ruta:", error);
    }
});

// Editar ruta
async function editar(id) {
    editId = id;

    const resp = await fetch(`${APIRUTAS}${id}`);
    const r = await resp.json();

    document.querySelector("#usuarioId").value = r.usuarioId;

    document.querySelector("#origenLat").value = r.origen.lat;
    document.querySelector("#origenLng").value = r.origen.lng;

    document.querySelector("#destinoLat").value = r.destino.lat;
    document.querySelector("#destinoLng").value = r.destino.lng;

    document.querySelector("#camino").value = r.camino ? JSON.stringify(r.camino) : "";

    document.querySelector("#estatus").value = r.estatus;
    document.querySelector("#createdAt").value = r.createdAt.substring(0, 16);

    document.querySelector("#btnCancelar").style.display = "inline-block";
}

// Cancelar edición
document.querySelector("#btnCancelar").addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
    editId = null;
    document.querySelector("#rutaForm").reset();
    document.querySelector("#btnCancelar").style.display = "none";
}

// Eliminar ruta
async function eliminarRuta(id) {
    if (!confirm("¿Eliminar ruta?")) return;

    await fetch(`${APIRUTAS}${id}`, { method: "DELETE" });
    cargarRutas();
}
