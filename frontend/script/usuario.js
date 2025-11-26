const APIUSUARIOS = "http://localhost:7000/api/usuarios/";

// Cargar lista de usuarios en la tabla
async function cargarUsuarios() {
    $.ajax({
        type: "GET",
        url: APIUSUARIOS,
        success: function(usuarios) {
            const tbody = $("#tablaUsuarios");
            tbody.empty();

            usuarios.forEach(usuario => {
                tbody.append(`
                    <tr>
                        <td>${usuario._id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.rol}</td>
                        <td>${usuario.verificado ? "Sí" : "No"}</td>
                        <td>
                            <a class="btn btn-primary btn-sm editarUsuario" data-id="${usuario._id}" href="#">Editar</a>
                            <a class="btn btn-danger btn-sm eliminarUsuario" data-id="${usuario._id}" href="#">Eliminar</a>
                        </td>
                    </tr>
                `);
            });
        },
        error: function(err){
            console.error("Error al cargar usuarios: ", err);
        }
    });
}

// Guardar usuario
$("#usuarioFormulario").on("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombre: $("#nombre").val(),
        email: $("#email").val(),
        passwordHash: $("#password").val(),
        rol: $("#rol").val(),
        verificado: $("#verificado").is(":checked")
    };

    $.ajax({
        type: "POST",
        url: APIUSUARIOS,
        data: JSON.stringify(datos),
        contentType: "application/json",
        success: function(response) {
            $("#usuarioFormulario")[0].reset();
            cargarUsuarios();
        },
        error: function(err){
            console.error("Error al guardar usuario: ", err);
            alert("Error al guardar usuario");
        }
    });
});

// Eliminar usuario
$(document).on("click", ".eliminarUsuario", function() {
    const id = $(this).data("id");

    if(confirm("¿Desea eliminar este usuario?")) {
        $.ajax({
            type: "DELETE",
            url: `${APIUSUARIOS}${id}`,
            success: function(){
                cargarUsuarios();
            },
            error: function(err){
                console.error("Error al eliminar usuario: ", err);
            }
        });
    }
});

cargarUsuarios();
