const APISESIONES = "http://localhost:7000/api/sesiones/";
let modoEdicion = false;
let idEdicion = null;

// =======================
// CARGAR SESIONES
// =======================
function cargarSesiones() {
    $.ajax({
        type: "GET",
        url: APISESIONES,
        success: function(sesiones) {
            console.log("Sesiones cargadas:", sesiones);

            const tbody = $("#tablaSesiones tbody");
            tbody.empty();

            sesiones.forEach(s => {
                tbody.append(`
                    <tr>
                        <td>${s._id}</td>
                        <td>${s.usuarioId?._id || s.usuarioId}</td>
                        <td>${new Date(s.createdAt).toLocaleString()}</td>
                        <td>${new Date(s.expiresAt).toLocaleString()}</td>

                        <td class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm editarSesion" data-id="${s._id}">
                                Editar
                            </button>

                            <button class="btn btn-danger btn-sm eliminarSesion" data-id="${s._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err) {
            console.error("Error al cargar sesiones:", err);
        }
    });
}

// =======================
// CANCELAR EDICIÓN
// =======================
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#sesionFormulario")[0].reset();
    $("#sesionFormulario button[type='submit']").text("Guardar Sesión");
    $("#btnCancelar").hide();
}

// =======================
// CREAR O EDITAR SESIÓN
// =======================
$("#sesionFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        usuarioId: $("#usuarioId").val(),
        createdAt: $("#fechaInicio").val(),
        expiresAt: $("#fechaFin").val()
    };

    const metodo = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion ? `${APISESIONES}${idEdicion}` : APISESIONES;

    $.ajax({
        type: metodo,
        url: url,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function() {
            alert(modoEdicion ? "Sesión actualizada" : "Sesión registrada");
            cancelarEdicion();
            cargarSesiones();
        },
        error: function(err) {
            console.error("Error al guardar sesión:", err);
            alert("Error al guardar sesión");
        }
    });
});

// =======================
// EDITAR SESIÓN
// =======================
$(document).on("click", ".editarSesion", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: `${APISESIONES}${id}`,
        success: function(s) {
            $("#usuarioId").val(s.usuarioId);

            $("#fechaInicio").val(
                new Date(s.createdAt).toISOString().slice(0,16)
            );

            $("#fechaFin").val(
                new Date(s.expiresAt).toISOString().slice(0,16)
            );

            modoEdicion = true;
            idEdicion = id;

            $("#sesionFormulario button[type='submit']").text("Actualizar Sesión");
            $("#btnCancelar").show();

            $("html, body").animate({
                scrollTop: $("#sesionFormulario").offset().top - 100
            }, 500);
        },
        error: function(err) {
            console.error("Error al cargar sesión:", err);
            alert("No se pudo cargar sesión para editar");
        }
    });
});

// =======================
// ELIMINAR SESIÓN
// =======================
$(document).on("click", ".eliminarSesion", function() {
    const id = $(this).data("id");

    if (!confirm("¿Desea eliminar esta sesión?")) return;

    $.ajax({
        type: "DELETE",
        url: `${APISESIONES}${id}`,
        success: function() {
            alert("Sesión eliminada");
            cargarSesiones();
        },
        error: function(err) {
            console.error("Error al eliminar sesión:", err);
            alert("Error al eliminar sesión");
        }
    });
});

// =======================
// INICIALIZACIÓN
// =======================
$(document).ready(function() {
    cargarSesiones();
});
