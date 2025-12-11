const APIMEDIA = "http://localhost:7000/api/media";

let editId = null;

document.addEventListener("DOMContentLoaded", cargarMedia);

async function cargarMedia() {
    try {
        const resp = await fetch(APIMEDIA);
        const data = await resp.
        json();

        const tbody = document.querySelector("#tablaMedia tbody");
        tbody.innerHTML = "";

        data.forEach(m => {
            tbody.innerHTML += `
                <tr>
                    <td>${m._id}</td>
                    <td>${m.usuarioId?.nombre || "N/A"}</td>
                    <td>${m.reporteId?.titulo || "N/A"}</td>
                    <td>${m.tipo}</td>
                    <td><a href="${m.url}" target="_blank">Ver</a></td>
                    <td>${m.verificado ? "✔" : "❌"}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editar('${m._id}')">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminar('${m._id}')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al cargar media:", error);
    }
}

document.querySelector("#mediaForm").addEventListener("submit", async e => {
    e.preventDefault();

    const mediaData = {
        usuarioId: document.querySelector("#usuarioId").value,
        reporteId: document.querySelector("#reporteId").value,
        tipo: document.querySelector("#tipo").value,
        url: document.querySelector("#url").value,
        verificado: document.querySelector("#verificado").value === "true"
    };

    const metodo = editId ? "PUT" : "POST";
    const endpoint = editId ? `${APIMEDIA}/${editId}` : APIMEDIA;

    try {
        await fetch(endpoint, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mediaData)
        });

        limpiarFormulario();
        cargarMedia();

    } catch (error) {
        console.error("Error guardando media:", error);
    }
});

async function editar(id) {
    editId = id;

    const resp = await fetch(`${APIMEDIA}/${id}`);
    const m = await resp.json();

    document.querySelector("#usuarioId").value = m.usuarioId;
    document.querySelector("#reporteId").value = m.reporteId;
    document.querySelector("#tipo").value = m.tipo;
    document.querySelector("#url").value = m.url;
    document.querySelector("#verificado").value = m.verificado;

    document.querySelector("#btnCancelar").style.display = "inline-block";
}

document.querySelector("#btnCancelar").addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
    editId = null;
    document.querySelector("#mediaForm").reset();
    document.querySelector("#btnCancelar").style.display = "none";
}

async function eliminar(id) {
    if (!confirm("¿Eliminar media?")) return;

    await fetch(`${APIMEDIA}/${id}`, { method: "DELETE" });
    cargarMedia();
}
