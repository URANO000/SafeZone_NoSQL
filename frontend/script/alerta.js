const APIALERTAS = "http://localhost:7000/api/alertas/";
let modoEdicion = false;
let idEdicion = null;

// ==========================
// CARGAR ALERTAS
// ==========================
function cargarAlertas() {
    $.ajax({
        type: "GET",
        url: APIALERTAS,
        success: function(alertas) {
            console.log("Alertas cargadas:", alertas);

            const tbody = $("#tablaAlertas tbody");
            tbody.empty();

            alertas.forEach(a => {
                tbody.append(`
                    <tr>
                        <td>${a._id}</td>
                        <td>${a.usuarioId?._id || a.usuarioId}</td>
                        <td>${a.tipo}</td>
                        <td>${a.mensaje}</td>
                        <td>${a.leido ? "Sí" : "No"}</td>
                        <td>${new Date(a.createdAt).toLocaleString()}</td>

                        <td class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm editarAlerta" data-id="${a._id}">
                                Editar
                            </button>

                            <button class="btn btn-danger btn-sm eliminarAlerta" data-id="${a._id}">
                                Eliminar
                            </button>

                            ${!a.leido ? `
                                <button class="btn btn-success btn-sm marcarLeido" data-id="${a._id}">
                                    Marcar leído
                                </button>
                            `: ""}
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err) {
            console.error("Error al cargar alertas:", err);
        }
    });
}

// ======================
// CANCELAR EDICIÓN
// ======================
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#alertaFormulario")[0].reset();
    $("#alertaFormulario button[type='submit']").text("Agregar Alerta");
    $("#btnCancelar").hide();
}

// ===============================
// CREAR O EDITAR ALERTA
// ===============================
$("#alertaFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        usuarioId: $("#usuarioId").val(),
        tipo: $("#tipo").val(),
        mensaje: $("#mensaje").val(),
    };

    const metodo = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion ? `${APIALERTAS}${idEdicion}` : APIALERTAS;

    $.ajax({
        type: metodo,
        url: url,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function() {
            alert(modoEdicion ? "Alerta actualizada" : "Alerta agregada");
            cancelarEdicion();
            cargarAlertas();
        },
        error: function(err) {
            console.error("Error al guardar alerta:", err);
            alert("Error al guardar alerta");
        }
    });
});

// ===========================
// EDITAR ALERTA
// ===========================
$(document).on("click", ".editarAlerta", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "GET",
        url: `${APIALERTAS}${id}`,
        success: function(a) {
            $("#usuarioId").val(a.usuarioId);
            $("#tipo").val(a.tipo);
            $("#mensaje").val(a.mensaje);

            modoEdicion = true;
            idEdicion = id;

            $("#alertaFormulario button[type='submit']").text("Actualizar Alerta");
            $("#btnCancelar").show();

            $("html, body").animate({
                scrollTop: $("#alertaFormulario").offset().top - 100
            }, 500);
        },
        error: function(err) {
            console.error("Error al cargar alerta:", err);
            alert("No se pudo cargar alerta para editar");
        }
    });
});

// ===========================
// ELIMINAR ALERTA
// ===========================
$(document).on("click", ".eliminarAlerta", function() {
    const id = $(this).data("id");

    if (!confirm("¿Desea eliminar esta alerta?")) return;

    $.ajax({
        type: "DELETE",
        url: `${APIALERTAS}${id}`,
        success: function() {
            alert("Alerta eliminada");
            cargarAlertas();
        },
        error: function(err) {
            console.error("Error al eliminar alerta:", err);
            alert("Error al eliminar");
        }
    });
});

// ==================================
// MARCAR ALERTA COMO LEÍDA (PATCH)
// ==================================
$(document).on("click", ".marcarLeido", function() {
    const id = $(this).data("id");

    $.ajax({
        type: "PATCH",
        url: `${APIALERTAS}${id}/leido`,
        success: function() {
            alert("Alerta marcada como leída");
            cargarAlertas();
        },
        error: function(err) {
            console.error("Error al marcar leída:", err);
            alert("No se pudo marcar como leída");
        }
    });
});

// ===============================
// INICIALIZACIÓN
// ===============================
$(document).ready(function() {
    cargarAlertas();
});
