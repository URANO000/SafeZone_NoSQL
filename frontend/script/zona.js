const APIZONAS = "http://localhost:7000/api/zona/";
let modoEdicion = false;
let idEdicion = null;

// Cargar lista de zonas en la tabla
function cargarZonas() {
    $.ajax({
        type: "GET",
        url: APIZONAS,
        success: function(zonas) {
            console.log("Zonas cargadas:", zonas);
            const tbody = $("#tablaZonas tbody");
            tbody.empty();

            zonas.forEach(zona => {
                console.log("ID de zona:", zona._id, "Tipo:", typeof zona._id);
                tbody.append(`
                    <tr>
                        <td>${zona._id}</td>
                        <td>${zona.nombre}</td>
                        <td>Lat: ${zona.coordenadas.lat}, Lng: ${zona.coordenadas.lng}</td>
                        <td>${zona.radio || "-"}</td>
                        <td>${zona.estatus}</td>
                        <td>${zona.descripcion || "-"}</td>
                        <td>
                            <button class="btn btn-primary btn-sm editarZona" data-id="${zona._id}">Editar</button>
                            <button class="btn btn-danger btn-sm eliminarZona" data-id="${zona._id}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err){
            console.error("Error al cargar zonas: ", err);
        }
    });
}

// Cancelar edición
function cancelarEdicion() {
    modoEdicion = false;
    idEdicion = null;
    $("#zonaFormulario")[0].reset();
    $("#zonaFormulario button[type='submit']").text("Agregar Zona");
    $("#btnCancelar").hide();
}

// Guardar o actualizar zona
$("#zonaFormulario").on("submit", function(e){
    e.preventDefault();

    const datos = {
        nombre: $("#nombre").val(),
        coordenadas: {
            lat: parseFloat($("#lat").val()),
            lng: parseFloat($("#lng").val())
        },
        radio: $("#radio").val() ? parseFloat($("#radio").val()) : undefined,
        estatus: $("#estatus").val(),
        descripcion: $("#descripcion").val()
    };

    const tipoPeticion = modoEdicion ? "PUT" : "POST";
    const urlPeticion = modoEdicion ? `${APIZONAS}${idEdicion}` : APIZONAS;

    console.log("Enviando petición:", tipoPeticion, urlPeticion, datos);

    $.ajax({
        type: tipoPeticion,
        url: urlPeticion,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function(response){
            alert(modoEdicion ? "Zona actualizada exitosamente" : "Zona agregada exitosamente");
            cancelarEdicion();
            cargarZonas();
        },
        error: function(err){
            console.error("Error al guardar zona: ", err);
            console.error("Respuesta del servidor:", err.responseText);
            alert("Error al guardar zona");
        }
    });
});

// Editar zona
$(document).on("click", ".editarZona", function(e){
    e.preventDefault();
    const id = $(this).data("id");
    
    console.log("=== INICIO DEBUG EDITAR ===");
    console.log("ID del botón:", id);
    console.log("Tipo de ID:", typeof id);
    console.log("API URL base:", APIZONAS);
    console.log("URL completa que se va a llamar:", APIZONAS + id);
    console.log("=== FIN DEBUG ===");

    $.ajax({
        type: "GET",
        url: APIZONAS + id,
        success: function(zona){
            console.log("✅ Zona recibida exitosamente:", zona);
            
            // Cargar datos en el formulario
            $("#nombre").val(zona.nombre);
            $("#lat").val(zona.coordenadas.lat);
            $("#lng").val(zona.coordenadas.lng);
            $("#radio").val(zona.radio || '');
            $("#estatus").val(zona.estatus);
            $("#descripcion").val(zona.descripcion || '');

            // Activar modo edición
            modoEdicion = true;
            idEdicion = id;

            // Cambiar texto del botón y mostrar cancelar
            $("#zonaFormulario button[type='submit']").text("Actualizar Zona");
            $("#btnCancelar").show();

            // Scroll al formulario
            $('html, body').animate({
                scrollTop: $("#zonaFormulario").offset().top - 100
            }, 500);
        },
        error: function(xhr, status, error){
            console.error("❌ ERROR AL EDITAR:");
            console.error("URL intentada:", APIZONAS + id);
            console.error("Status HTTP:", xhr.status);
            console.error("Status text:", status);
            console.error("Error:", error);
            console.error("Respuesta completa:", xhr.responseText);
            alert(`Error al cargar la zona para editar. Código: ${xhr.status}\nURL: ${APIZONAS + id}`);
        }
    });
});

// Eliminar zona
$(document).on("click", ".eliminarZona", function(e){
    e.preventDefault();
    const id = $(this).data("id");

    if(confirm("¿Desea eliminar esta zona?")) {
        $.ajax({
            type: "DELETE",
            url: `${APIZONAS}${id}`,
            success: function(){
                alert("Zona eliminada exitosamente");
                cargarZonas();
            },
            error: function(err){
                console.error("Error al eliminar zona: ", err);
                alert("Error al eliminar zona");
            }
        });
    }
});

// Botón cancelar
$("#btnCancelar").on("click", function(){
    cancelarEdicion();
});

// Inicializar
$(document).ready(function(){
    cargarZonas();
});