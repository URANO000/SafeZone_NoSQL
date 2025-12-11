// ========================
// CONFIG
// ========================
const APIVOTOS = "http://localhost:7000/api/votos/";
let modoEdicionVoto = false;
let idVotoEdicion = null;

// ========================
// CARGAR LISTA DE VOTOS
// ========================
function cargarVotos() {
    $.ajax({
        type: "GET",
        url: APIVOTOS,
        success: function(votos) {
            console.log("Votos cargados:", votos);

            const tbody = $("#tablaVotos");
            tbody.empty();

            votos.forEach(voto => {
                tbody.append(`
                    <tr>
                        <td>${voto._id}</td>
                        <td>${voto.reporteId}</td>
                        <td>${voto.usuarioId}</td>
                        <td>${voto.voto}</td>
                        <td>
                            <button class="btn btn-primary btn-sm editarVoto" data-id="${voto._id}">Editar</button>
                            <button class="btn btn-danger btn-sm eliminarVoto" data-id="${voto._id}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err) {
            console.error("Error al cargar votos:", err);
        }
    });
}

// ========================
// CANCELAR EDICIÓN
// ========================
function cancelarEdicionVotos() {
    modoEdicionVoto = false;
    idVotoEdicion = null;

    $("#votosForm")[0].reset();
    $("#votosForm button[type='submit']").text("Guardar Voto");
    $("#btnCancelar").hide();
}

// ========================
// GUARDAR O ACTUALIZAR VOTO
// ========================
$("#votosForm").on("submit", function(e) {
    e.preventDefault();

    const datosVoto = {
        reporteId: $("#reporteId").val(),
        usuarioId: $("#usuarioId").val(),
        voto: parseInt($("#voto").val())
    };

    const tipo = modoEdicionVoto ? "PUT" : "POST";
    const url = modoEdicionVoto ? `${APIVOTOS}${idVotoEdicion}` : APIVOTOS;

    console.log("Enviando:", tipo, url, datosVoto);

    $.ajax({
        type: tipo,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(datosVoto),
        success: function() {
            alert(modoEdicionVoto ? "Voto actualizado exitosamente" : "Voto agregado exitosamente");
            cancelarEdicionVotos();
            cargarVotos();
        },
        error: function(err) {
            console.error("Error al guardar voto:", err);
            alert("Error al guardar voto");
        }
    });
});

// ========================
// EDITAR VOTO
// ========================
$(document).on("click", ".editarVoto", function() {
    const id = $(this).data("id");

    console.log("Editando voto:", id);

    $.ajax({
        type: "GET",
        url: APIVOTOS + id,
        success: function(voto) {
            console.log("Voto recibido:", voto);

            $("#reporteId").val(voto.reporteId);
            $("#usuarioId").val(voto.usuarioId);
            $("#voto").val(voto.voto);

            modoEdicionVoto = true;
            idVotoEdicion = id;

            $("#votosForm button[type='submit']").text("Actualizar Voto");
            $("#btnCancelar").show();

            $("html, body").animate({
                scrollTop: $("#votosForm").offset().top - 100
            }, 500);
        },
        error: function(xhr) {
            console.error("Error al cargar voto:", xhr.responseText);
            alert("Error al cargar el voto para editar");
        }
    });
});

// ========================
// ELIMINAR VOTO
// ========================
$(document).on("click", ".eliminarVoto", function() {
    const id = $(this).data("id");

    if (!confirm("¿Desea eliminar este voto?")) return;

    $.ajax({
        type: "DELETE",
        url: `${APIVOTOS}${id}`,
        success: function() {
            alert("Voto eliminado exitosamente");
            cargarVotos();
        },
        error: function(err) {
            console.error("Error al eliminar voto:", err);
            alert("Error al eliminar voto");
        }
    });
});

// ========================
// BOTÓN CANCELAR
// ========================
$("#btnCancelar").on("click", function() {
    cancelarEdicionVotos();
});

// ========================
// INICIALIZAR
// ========================
$(document).ready(function() {
    cargarVotos();
});
