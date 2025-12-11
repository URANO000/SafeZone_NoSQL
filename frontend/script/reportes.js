// API base
const API_REPORTES = "http://localhost:7000/api/reportes";

let editId = null;

// Cargar reportes al iniciar
document.addEventListener("DOMContentLoaded", cargarReportes);

async function cargarReportes() {
    try {
        const resp = await fetch(API_REPORTES);
        const data = await resp.json();

        const tbody = document.querySelector("#tablaReportes tbody");
        tbody.innerHTML = "";

        data.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r._id}</td>
                    <td>${r.descripcion}</td>
                    <td>${r.estatus}</td>
                    <td>${r.severidad}</td>
                    <td>${r.tipo}</td>
                    <td>${r.usuarioId}</td>
                    <td>${r.zonaId}</td>
                    <td>${new Date(r.timestamp).toLocaleString()}</td>
                    <td>${Array.isArray(r.mediaIds) ? r.mediaIds.join(", ") : "-"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editar('${r._id}')">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminar('${r._id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando reportes:", error);
    }
}

// Guardar o actualizar reporte
document.querySelector("#reporteForm").addEventListener("submit", async e => {
    e.preventDefault();

    const mediaIdsString = document.querySelector("#mediaIds").value;

    const reporteData = {
        descripcion: document.querySelector("#descripcion").value,
        estatus: document.querySelector("#estatus").value,
        mediaIds: mediaIdsString ? mediaIdsString.split(",").map(s => s.trim()) : [],
        severidad: document.querySelector("#severidad").value,
        timestamp: document.querySelector("#timestamp").value,
        tipo: document.querySelector("#tipo").value,
        usuarioId: document.querySelector("#usuarioId").value,
        zonaId: document.querySelector("#zonaId").value
    };

    const metodo = editId ? "PUT" : "POST";
    const endpoint = editId ? `${API_REPORTES}/${editId}` : API_REPORTES;

    try {
        await fetch(endpoint, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reporteData)
        });

        limpiarFormulario();
        cargarReportes();

    } catch (error) {
        console.error("Error guardando reporte:", error);
    }
});

// Editar
async function editar(id) {
    editId = id;

    const resp = await fetch(`${API_REPORTES}/${id}`);
    const r = await resp.json();

    document.querySelector("#descripcion").value = r.descripcion;
    document.querySelector("#estatus").value = r.estatus;
    document.querySelector("#mediaIds").value = r.mediaIds?.join(", ") || "";
    document.querySelector("#severidad").value = r.severidad;
    document.querySelector("#timestamp").value = r.timestamp ? r.timestamp.split(".")[0] : "";
    document.querySelector("#tipo").value = r.tipo;
    document.querySelector("#usuarioId").value = r.usuarioId;
    document.querySelector("#zonaId").value = r.zonaId;

    document.querySelector("#btnCancelar").style.display = "inline-block";
}

// Cancelar edición
document.querySelector("#btnCancelar").addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
    editId = null;
    document.querySelector("#reporteForm").reset();
    document.querySelector("#btnCancelar").style.display = "none";
}

// Eliminar
async function eliminar(id) {
    if (!confirm("¿Eliminar reporte?")) return;

    await fetch(`${API_REPORTES}/${id}`, { method: "DELETE" });
    cargarReportes();
}
