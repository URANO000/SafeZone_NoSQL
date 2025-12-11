const APIACTIVITY = "http://localhost:7000/api/activity/";

// Cargar lista de logs en la tabla
function cargarActivityLogs() {
    $.ajax({
        type: "GET",
        url: APIACTIVITY,
        success: function (logs) {
            console.log("Activity logs cargados:", logs);
            const tbody = $("#tablaLogs");
            tbody.empty();

            if (!logs || logs.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="4" class="text-center text-muted">No hay registros disponibles</td>
                    </tr>
                `);
                return;
            }

            logs.forEach(log => {
                tbody.append(`
                    <tr>
                        <td>${log._id}</td>
                        <td><span class="badge bg-info">${log.accion}</span></td>
                        <td>${log.usuarioId}</td>
                        <td>${formatearFecha(log.timestamp)}</td>
                                                <td>${log.ip || "-"}</td>
                    </tr>
                `);
            });
        },
        error: function (err) {
            console.error("Error al cargar activity logs: ", err);
            const tbody = $("#tablaLogs");
            tbody.empty();
            tbody.append(`
                <tr>
                    <td colspan="4" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle"></i> 
                        Error al cargar los registros. Por favor, intente nuevamente.
                    </td>
                </tr>
            `);
        }
    });
}

//Función para formatear la fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);

    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

    return fecha.toLocaleDateString('es-ES', opciones);
}

// Cargar logs cuando el documento esté listo
$(document).ready(function () {
    cargarActivityLogs();
});