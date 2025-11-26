class UsuarioManager {
    constructor(apiUrl = "http://localhost:7000/api/usuarios/") {
        this.APIURL = apiUrl;
        this.modoEdicion = false;
        this.idEdicion = null;
        this.inicializar();
    }

    inicializar() {
        this.cargarDatos();
        this.configurarEventos();
        $("#btnCancelar").hide();
    }

    // GET ALL
    cargarDatos() {
        $.ajax({
            type: "GET",
            url: this.APIURL,
            success: (responseUsuarios) => {
                const tbody = $("#tablaDatos");
                tbody.empty();

                if (responseUsuarios && responseUsuarios.length > 0) {
                    responseUsuarios.forEach(elementUsuario => {
                        tbody.append(`
                            <tr>
                                <td>${elementUsuario._id}</td>
                                <td>${elementUsuario.nombre}</td>
                                <td>${elementUsuario.email}</td>
                                <td>${elementUsuario.rol}</td>
                                <td>${elementUsuario.verificado ? 'Sí' : 'No'}</td>
                                <td>${elementUsuario.preferencias.notificaciones ? 'Sí' : 'No'}</td>
                                <td>${elementUsuario.preferencias.idioma}</td>
                                <td>${new Date(elementUsuario.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-editar" data-id="${elementUsuario._id}">
                                        Editar
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${elementUsuario._id}">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    tbody.append('<tr><td colspan="9" class="text-center">No hay usuarios registrados.</td></tr>');
                }
            },
            error: (xhr, status, error) => {
                console.error("Error al cargar datos: ", error);
                alert("Error al cargar los datos");
            }
        });
    }

    // POST / PUT
    guardarUsuario(datos) {
        const tipoPeticion = this.modoEdicion ? "PUT" : "POST";
        const urlPeticion = this.modoEdicion ? this.APIURL + this.idEdicion : this.APIURL;
        const mensajeExito = this.modoEdicion ? "actualizado" : "guardado";
        const mensajeFallo = this.modoEdicion ? "actualización" : "inserción";

        $.ajax({
            type: tipoPeticion,
            url: urlPeticion,
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: (response) => {
                console.log(`Usuario ${mensajeExito}:`, response);
                this.cargarDatos();
                this.cancelarEdicion();
                alert(`Usuario ${mensajeExito} exitosamente`);
                $('#modalId').modal('hide');
            },
            error: (xhr, status, error) => {
                console.error("Error: ", error);
                console.error("Error xhr: ", xhr.responseText);
                alert(`Fallo la ${mensajeFallo}`);
            }
        });
    }

    // GET BY ID
    cargarUsuario(id) {
        $.ajax({
            type: "GET",
            url: this.APIURL + id,
            success: (usuario) => {
                $("#nombre").val(usuario.nombre);
                $("#email").val(usuario.email);
                $("#rol").val(usuario.rol);
                $("#verificado").prop('checked', usuario.verificado);
                $("#notificaciones").prop('checked', usuario.preferencias.notificaciones);
                $("#idioma").val(usuario.preferencias.idioma);

                this.modoEdicion = true;
                this.idEdicion = id;

                $("#btnSubmit").text("Actualizar");
                $("#btnCancelar").show();

                $('#modalId').modal('show');

                $('html, body').animate({
                    scrollTop: $("#usuarioFormulario").offset().top
                }, 500);
            },
            error: (xhr, status, error) => {
                console.error("Error al cargar usuario: ", error);
                alert("Error al cargar el usuario para editar");
            }
        });
    }

    // DELETE
    eliminarUsuario(id) {
        if (confirm("¿Está seguro que desea eliminar este usuario?")) {
            $.ajax({
                type: "DELETE",
                url: this.APIURL + id,
                success: (response) => {
                    console.log("Usuario eliminado:", response);
                    this.cargarDatos();
                    alert("Usuario eliminado exitosamente");
                },
                error: (xhr, status, error) => {
                    console.error("Error: ", error);
                    console.error("Error xhr: ", xhr.responseText);
                    alert("Error al eliminar el usuario");
                }
            });
        }
    }

    cancelarEdicion() {
        this.modoEdicion = false;
        this.idEdicion = null;
        $("#usuarioFormulario")[0].reset();
        $("#btnSubmit").text("Guardar");
        $("#btnCancelar").hide();
    }

    configurarEventos() {
        $("#usuarioFormulario").on("submit", (e) => {
            e.preventDefault();

            const datos = {
                nombre: $("#nombre").val(),
                email: $("#email").val(),
                passwordHash: $("#password").val(),
                rol: $("#rol").val(),
                verificado: $("#verificado").is(':checked'),
                preferencias: {
                    notificaciones: $("#notificaciones").is(':checked'),
                    idioma: $("#idioma").val()
                }
            };

            this.guardarUsuario(datos);
        });

        $(document).on("click", ".btn-editar", (e) => {
            const id = $(e.currentTarget).data("id");
            this.cargarUsuario(id);
        });

        $(document).on("click", ".btn-eliminar", (e) => {
            const id = $(e.currentTarget).data("id");
            this.eliminarUsuario(id);
        });

        $("#btnCancelar").on("click", () => {
            this.cancelarEdicion();
            $('#modalId').modal('hide');
        });
    }
}

$(document).ready(function() {
    const usuarioManager = new UsuarioManager();
});