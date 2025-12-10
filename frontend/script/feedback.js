const APIFEEDBACK = "http://localhost:7000/api/feedback/";
let modoEdicion = false;
let idEdicion = null;

// =======================
// CARGAR FEEDBACK
// =======================
function cargarFeedback() {
    $.ajax({
        type: "GET",
        url: APIFEEDBACK,
        success: function(feedbacks) {
            const tbody = $("#tablaFeedback tbody");
            tbody.empty();

            feedbacks.forEach(f => {
                tbody.append(`
                    <tr>
                        <td>${f._id}</td>
                        <td>${f.usuarioId?._id || f.usuarioId}</td>
                        <td>${f.rating} ⭐</td>
                        <td>${f.mensaje}</td>
                        <td>${new Date(f.createdAt).toLocaleString()}</td>

                        <td class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm editarFeedback" data-id="${f._id}">
                                Editar
                            </button>

                            <button class="btn btn-danger btn-sm eliminarFeedback" data-id="${f._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `);
            });
        },
        error: (err) => console.log("Error:", err)
    });
}

// =======================
// CANCELAR EDICIÓN
// =======================
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#feedbackFormulario")[0].reset();
    $("#feedbackFormulario button[type='submit']").text("Guardar Feedback");
    $("#btnCancelar").hide();
}

// =======================
// CREAR O EDITAR FEEDBACK
// =======================
$("#feedbackFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        usuarioId: $("#usuarioId").val(),
        rating: $("#rating").val(),
        mensaje: $("#mensaje").val(),
    };

    const metodo = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion ? `${APIFEEDBACK}${idEdicion}` : APIFEEDBACK;

    $.ajax({
        type: metodo,
        url: url,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function() {
            alert(modoEdicion ? "Feedback actualizado" : "Feedback guardado");
            cancelarEdicion();
            cargarFeedback();
        },
        error: (err) => alert("Error al guardar feedback")
    });
});

// =======================
// EDITAR FEEDBACK
// =======================
$(document).on("click", ".editarFeedback", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: `${APIFEEDBACK}${id}`,
        success: function(f) {
            $("#usuarioId").val(f.usuarioId);
            $("#rating").val(f.rating);
            $("#mensaje").val(f.mensaje);

            modoEdicion = true;
            idEdicion = id;

            $("#feedbackFormulario button[type='submit']").text("Actualizar Feedback");
            $("#btnCancelar").show();
        },
        error: () => alert("Error al cargar feedback")
    });
});

// =======================
// ELIMINAR FEEDBACK
// =======================
$(document).on("click", ".eliminarFeedback", function() {
    const id = $(this).data("id");

    if (!confirm("¿Eliminar feedback?")) return;

    $.ajax({
        type: "DELETE",
        url: `${APIFEEDBACK}${id}`,
        success: function() {
            alert("Feedback eliminado");
            cargarFeedback();
        },
        error: () => alert("Error al eliminar")
    });
});

// =======================
// INICIO
// =======================
$(document).ready(() => cargarFeedback());
