const APICOMENTARIOS = "http://localhost:7000/api/comentarios/";

let modoEdicion = false;
let idEdicion = null;

// =======================
// CARGAR COMENTARIOS
// =======================
function cargarComentarios() {
    $.ajax({
        type: "GET",
        url: APICOMENTARIOS,
        success: function (comentarios) {
            const tbody = $("#tablaComentarios tbody");
            tbody.empty();

            comentarios.forEach(c => {
                tbody.append(`
                    <tr>
                        <td>${c._id}</td>

                        <td>${c.usuarioId?.nombre || "Usuario Eliminado"}</td>

                        <td>${c.reporteId?._id || "Reporte Eliminado"}</td>

                        <td>${c.mensaje}</td>

                        <td>${new Date(c.createdAt).toLocaleString()}</td>

                        <td>
                            <button class="btn btn-primary btn-sm editarComentario" data-id="${c._id}">Editar</button>
                            <button class="btn btn-danger btn-sm eliminarComentario" data-id="${c._id}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function (err) {
            console.error("❌ Error al cargar comentarios:", err);
            alert("No se pudieron cargar los comentarios");
        }
    });
}

// =======================
// CANCELAR EDICIÓN
// =======================
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#comentarioFormulario")[0].reset();
    $("#comentarioFormulario button[type='submit']").text("Agregar Comentario");
    $("#btnCancelar").hide();
}

// =======================
// GUARDAR (POST / PUT)
// =======================
$("#comentarioFormulario").on("submit", function (e) {
    e.preventDefault();

    const datos = {
        mensaje: $("#mensaje").val().trim(),
        usuarioId: $("#usuarioId").val(),
        reporteId: $("#reporteId").val()
    };

    const metodo = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion ? `${APICOMENTARIOS}${idEdicion}` : APICOMENTARIOS;

    $.ajax({
        type: metodo,
        url: url,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function () {
            alert(modoEdicion ? "Comentario actualizado" : "Comentario agregado");
            cancelarEdicion();
            cargarComentarios();
        },
        error: function (err) {
            console.error("❌ Error al guardar comentario:", err);
            alert("Hubo un error al guardar el comentario");
        }
    });
});

// =======================
// EDITAR COMENTARIO
// =======================
$(document).on("click", ".editarComentario", function () {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: `${APICOMENTARIOS}${id}`,
        success: function (c) {
            $("#mensaje").val(c.mensaje);
            $("#usuarioId").val(c.usuarioId?._id);
            $("#reporteId").val(c.reporteId?._id);

            modoEdicion = true;
            idEdicion = id;

            $("#comentarioFormulario button[type='submit']").text("Actualizar Comentario");
            $("#btnCancelar").show();
        },
        error: function (err) {
            console.error("❌ Error al cargar comentario:", err);
            alert("No se pudo cargar el comentario");
        }
    });
});

// =======================
// ELIMINAR COMENTARIO
// =======================
$(document).on("click", ".eliminarComentario", function () {
    const id = $(this).data("id");

    if (!confirm("¿Desea eliminar este comentario?")) return;

    $.ajax({
        type: "DELETE",
        url: `${APICOMENTARIOS}${id}`,
        success: function () {
            alert("Comentario eliminado");
            cargarComentarios();
        },
        error: function (err) {
            console.error("❌ Error al eliminar comentario:", err);
            alert("Hubo un error al eliminar");
        }
    });
});

// =======================
// INICIALIZAR
// =======================
$(document).ready(function () {
    cargarComentarios();
});
