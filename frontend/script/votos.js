const API_BASE = "http://localhost:7000/api/votos"; // AJUSTA SI ES NECESARIO

// -----------------------------
// CARGAR TODOS LOS VOTOS
// -----------------------------
async function cargarVotos() {
    try {
        const resp = await fetch(API_BASE);
        const data = await resp.json();
        console.log(data);

        let html = "";

        data.forEach(v => {
            html += `
                <tr>
                    <td>${v._id}</td>
                    <td>${v.reporteId}</td>
                    <td>${v.usuarioId}</td>
                    <td>${v.voto}</td>

                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarVoto('${v._id}')"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        document.getElementById("tablaVotos").innerHTML = html;

    } catch (error) {
        console.error("Error cargando votos:", error);
    }
}

cargarVotos();


// -----------------------------
// CREAR NUEVO VOTO
// -----------------------------
async function crearVoto() {
    const payload = {
        reporteId: document.getElementById("reporteId").value,
        usuarioId: document.getElementById("usuarioId").value,
        voto: Number(document.getElementById("voto").value)
    };

    try {
        const resp = await fetch(API_BASE, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const err = await resp.json();
            alert("Error: " + err.message);
            return;
        }

        alert("Voto guardado correctamente");
        cargarVotos();

    } catch (error) {
        console.error("Error guardando voto:", error);
    }
}


// -----------------------------
// ELIMINAR VOTO
// -----------------------------
async function eliminarVoto(id) {
    if (!confirm("¿Eliminar voto?")) return;

    try {
        const resp = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });

        if (!resp.ok) {
            alert("No se pudo eliminar");
            return;
        }

        alert("Voto eliminado");
        cargarVotos();

    } catch (error) {
        console.error("Error eliminando:", error);
    }
}

