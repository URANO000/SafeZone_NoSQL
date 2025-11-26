const APIZONAS = "http://localhost:7000/api/zona/";

// Cargar lista de zonas en la tabla
async function cargarZonas() {
    $.ajax({
        type: "GET",
        url: APIZONAS,
        success: function(zonas) {
            const tbody = $("#tablaZonas");
            tbody.empty();

            zonas.forEach(zona => {
                tbody.append(`
                    <tr>
                        <td>${zona._id}</td>
                        <td>${zona.nombre}</td>
                        <td>Lat: ${zona.coordenadas.lat}, Lng: ${zona.coordenadas.lng}</td>
                        <td>${zona.radio || "-"}</td>
                        <td>${zona.estatus}</td>
                        <td>${zona.descripcion || "-"}</td>
                        <td>
                            <a class="btn btn-primary btn-sm editarZona" data-id="${zona._id}" href="#">Editar</a>
                            <a class="btn btn-danger btn-sm eliminarZona" data-id="${zona._id}" href="#">Eliminar</a>
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

// Guardar zona
$("#zonaFormulario").on("submit", function(e){
    e.preventDefault();

    const datos = {
        nombre: $("#nombre").val(),
        coordenadas: {
            lat: parseFloat($("#lat").val()),
            lng: parseFloat($("#lng").val())
        },
        radio: parseFloat($("#radio").val()) || undefined,
        estatus: $("#estatus").val(),
        descripcion: $("#descripcion").val()
    };

    $.ajax({
        type: "POST",
        url: APIZONAS,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function(response){
            $("#zonaFormulario")[0].reset();
            cargarZonas();
        },
        error: function(err){
            console.error("Error al guardar zona: ", err);
            alert("Error al guardar zona");
        }
    });
});

// Eliminar zona
$(document).on("click", ".eliminarZona", function(){
    const id = $(this).data("id");

    if(confirm("¿Desea eliminar esta zona?")) {
        $.ajax({
            type: "DELETE",
            url: `${APIZONAS}${id}`,
            success: function(){
                cargarZonas();
            },
            error: function(err){
                console.error("Error al eliminar zona: ", err);
            }
        });
    }
});

cargarZonas();
