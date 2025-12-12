// API base
const API_REPORTES = "http://localhost:7000/api/reportes/";

let modoEdicion = false;
let idEdicion = null;

// Cargar reportes al iniciar

function cargarReportes() {
    $.ajax({
        type: "GET",
        url: API_REPORTES,
        success: function (reportes) {
            const tbody = $("#tablaReportes tbody");
            tbody.empty();

            reportes.forEach(r => {
                tbody.append(`
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
                        <button class="btn btn-primary btn-sm editarReporte" data-id="${r._id}">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm eliminarReporte" data-id="${r._id}">
                            Eliminar
                        </button>
                    </td>
                </tr>

                 `);

            });

        },
        error: function (err) {
            console.error("Error al cargar reportes", err);
        }
    });
}

//cancelar edicion
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#reporteForm")[0].reset();
    $("#reporteForm button[type='submit").text("Agregar Reporte");
    $("#btnCancelar").hide();
}

//Guardar o actualizar reporte
$("#reporteForm").on("submit", function (e) {
    e.preventDefault();

    const mediaIdsString = $("#mediaIds").val();

    const datos = {
        descripcion: $("#descripcion").val(),
        estatus: $("#estatus").val(),
        mediaIds: mediaIdsString ? mediaIdsString.split(",").map(s => s.trim()) : [],
        severidad: $("#severidad").val(),
        tipo: $("#tipo").val(),
        usuarioId: $("#usuarioId").val(),
        zonaId: $("#zonaId").val()
    };

    const tipoPeticion = modoEdicion ? "PUT" : "POST";
    const urlPeticion = modoEdicion ? `${API_REPORTES}${idEdicion}` : API_REPORTES;

    console.log("Enviando petición:", tipoPeticion, urlPeticion, datos);

    $.ajax({
        type: tipoPeticion,
        url: urlPeticion,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function (response) {
            alert(modoEdicion ? "Reporte actualizado exitosamente" : "Reporte guardado exitosamente ");
            cancelarEdicion();
            cargarReportes();
        },
        error: function (err) {
            console.error("Error al guardar reporte", err);
            console.error("Respuesta del servidor:", err.responseText);
            alert("Error al guardar zona");
        }
    });
});

// Editar
$(document).on("click", ".editarReporte", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    console.log("=== INICIO DEBUG EDITAR ===");
    console.log("ID del botón:", id);
    console.log("Tipo de ID:", typeof id);
    console.log("API URL base:", API_REPORTES);
    console.log("URL completa que se va a llamar:", API_REPORTES + id);
    console.log("=== FIN DEBUG ===");

    $.ajax({
        type:"GET",
        url:API_REPORTES + id,
        success: function(reportes){
            //cargar datos
            $("#descripcion").val(reportes.descripcion);
            $("#estatus").val(reportes.estatus);
            $("#mediaIds").val(reportes.mediaIds);
            $("#severidad").val(reportes.severidad);
            $("#timestamp").val(reportes.timestamp);
            $("#tipo").val(reportes.tipo);
            $("#usuarioId").val(reportes.usuarioId);
            $("#zonaId").val(reportes.zonaId);

            modoEdicion = true;
            idEdicion = id;

            //Cambiar txt del btn'
            $("#reporteForm button[type='submit']").text("Actualizar reporte");
            $("#btnCancelar").show();

            //scroll
            $('html, body').animate({
                scrollTop: $("#reporteForm").offset().top - 100
            }, 500);
        },
        error: function(xhr, status, error){
            alert(`Error al cargar el reporte a editar. Code ${xhr.status}\nURL: ${API_REPORTES + id}`)
        }
    })
})



// Eliminar
$(document).on("click", ".eliminarReporte", function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    if (confirm("Desea eliminar este reporte?")) {
        $.ajax({
            type: "DELETE",
            url: `${API_REPORTES}${id}`,
            success: function () {
                alert("Reporte eliminado exitosamente");
                cargarReportes();
            },
            error: function (err) {
                console.error("Error al eliminar reporte: ", err);
                alert("Error al eliminar reporte");
            }
        });
    }
})

//Cancelar
$("#btnCancelar").on("click", function () {
    cancelarEdicion();
});


$(document).ready(function () {
    cargarReportes();
});