const APIRUTAS = "http://localhost:7000/api/rutas/";

let idEdicion = null;
let modoEdicion = false;

// Cargar rutas al iniciar

function cargarRutas() {
    $.ajax({
        type: "GET",
        url: APIRUTAS,
        success: function (rutas) {
            const tbody = $("#tablaRutas tbody");
            tbody.empty();

            rutas.forEach(r => {
                tbody.append(
                    `
                    <tr>
                    <td>${r._id}</td>
                    <td>${r.usuarioId}</td>

                    <td>Lat: ${r.origen?.lat}, Lng: ${r.origen?.lng}</td>
                    <td>Lat: ${r.destino?.lat}, Lng: ${r.destino?.lng}</td>

                    <td>${JSON.stringify(r.camino || "N/A")}</td>
                    <td>${r.estatus}</td>

                    <td>${new Date(r.createdAt).toLocaleString()}</td>

                    <td>
                        <button class="btn btn-primary btn-sm editarRuta" data-id="${r._id}">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm eliminarRuta" data-id="${r._id}">
                            Eliminar
                        </button>
                    </td>
                </tr>
                `
                );

            })
        },
        error: function (err) {
            console.error("Error al cargar rutas");
        }
    })
};

//Guardar o actualizar ruta
$("#rutaFormulario").on("submit", function (e) {
    e.preventDefault();


    //Parsear camino desde textarea
    let caminoData = [];
    try {
        const raw = $("#camino").val().trim();
        caminoData = raw ? JSON.parse(raw) : [];
    } catch (e) {
        alert("El formato del camino no es JSON válido.");
        console.error("JSON inválido en camino:", e);
        return;
    }

    //Construir objeto según el schema
    const datos = {
        usuarioId: $("#usuarioId").val(),
        estatus: $("#estatus").val(),
        origen: {
            lat: parseFloat($("#origenLat").val()),
            lng: parseFloat($("#origenLng").val())
        },
        destino: {
            lat: parseFloat($("#destinoLat").val()),
            lng: parseFloat($("#destinoLng").val())
        },
        camino: caminoData
    };

    //Determinar si es POST o PUT
    const tipoPeticion = modoEdicion ? "PUT" : "POST";
    const urlPeticion = modoEdicion ? `${APIRUTAS}${idEdicion}` : APIRUTAS;

    console.log("Enviando petición:", tipoPeticion, urlPeticion, datos);

    $.ajax({
        type: tipoPeticion,
        url: urlPeticion,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function (response) {
            alert(modoEdicion ? "Ruta actualizada exitosamente" : "Ruta agregada exitosamente");
            cancelarEdicion();
            cargarRutas();
        },
        error: function (err) {
            console.error("Error al guardar ruta:", err);
            console.error("Respuesta del servidor:", err.responseText);
            alert("Error al guardar ruta");
        }
    });
});

//Editar ruta
$(document).on("click", ".editarRuta", function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    console.log("=== INICIO DEBUG EDITAR RUTA ===");
    console.log("ID del botón:", id);
    console.log("Tipo de ID:", typeof id);
    console.log("API URL base:", APIRUTAS);
    console.log("URL completa que se va a llamar:", APIRUTAS + id);
    console.log("=== FIN DEBUG ===");

    $.ajax({
        type: "GET",
        url: APIRUTAS + id,
        success: function (ruta) {

            //Llenar campos del form
            $("#usuarioId").val(ruta.usuarioId);

            $("#estatus").val(ruta.estatus);

            $("#origenLat").val(ruta.origen.lat);
            $("#origenLng").val(ruta.origen.lng);

            $("#destinoLat").val(ruta.destino.lat);
            $("#destinoLng").val(ruta.destino.lng);

            $("#camino").val(JSON.stringify(ruta.camino, null, 2));


            if (ruta.createdAt) {
                const dt = new Date(ruta.createdAt);
                const formatted = dt.toISOString().slice(0, 16); //yyyy-MM-ddTHH:mm
                $("#createdAt").val(formatted);
            }


            modoEdicion = true;
            idEdicion = id;

            //Cambiar texto del botón y mostrar cancelar
            $("#rutaForm button[type='submit']").text("Actualizar Ruta");
            $("#btnCancelar").show();

            // Scroll
            $('html, body').animate({
                scrollTop: $("#rutaForm").offset().top - 100
            }, 500);
        },
        error: function (xhr, status, error) {
            console.error("ERROR AL CARGAR RUTA:");
            console.error("URL intentada:", APIRUTAS + id);
            console.error("Status HTTP:", xhr.status);
            console.error("Status text:", status);
            console.error("Error:", error);
            console.error("Respuesta completa:", xhr.responseText);

            alert(`Error al cargar la ruta para editar. Código: ${xhr.status}\nURL: ${APIRUTAS + id}`);
        }
    });
});


$(document).on("click", ".eliminarRuta", function (e) {
    e.preventDefault();
    const id = $(this).data("id");

    if (confirm("Desea eliminar esta ruta?")) {
        $.ajax({
            type: "DELETE",
            url: `${APIRUTAS}${id}`,
            success: function () {
                alert("Ruta eliminada exitosamente");
                cargarRutas();
            },
            error: function (err) {
                console.error("Error al eliminar ruta");
                alert("Error al eliminar ruta");
            }
        });
    };

});

$("#btnCancelar").on("click", function () {
    cancelarEdicion();
});

//Cancel edit
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#rutaFormulario")[0].reset();
    $("#rutaFormulario button[type='submit']").text("Agregar Ruta");
    $("#btnCancelar").hide();
}


$(document).ready(function () {
    cargarRutas();
});