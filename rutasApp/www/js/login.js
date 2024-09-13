document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  
   
        
        var apiUrl = 'http://4.228.229.204/rutas/getDatos.php';
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;  
    
        var userData = {
            user: username,
            pass: password
        };
            
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };
    
        function autenticarUsuario() {
            document.getElementById("cargando").innerHTML =`<div class="spinner-border text-primary" role="status">                                                            
                                                            </div>
                                                            <span class="visually-hidden">Loading...</span>`;     
            fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message === "Usuario autenticado correctamente") {
                    document.getElementById("succes").innerHTML = `
                        <div id="succes" class="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>Exito!!!</strong> Usuario Registrado !!. redireccionando..
                            <!--<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>-->
                        </div>
                    `;
                    document.getElementById("cargando").hidden = true;
    
                    // Recuperar datos de rutas
                    var apiUrlDatos = 'http://4.228.229.204/rutas/getDatosRutas.php';
                    var userDataRutas = {
                        userId: data.usuario.id // Suponiendo que `data.usuario.id` es el ID del usuario autenticado
                    };
                    
                    var requestOptionsRutas = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userDataRutas)
                    };
                    
                    fetch(apiUrlDatos, requestOptionsRutas)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la solicitud de rutas');
                            }
                            return response.json();
                        })
                        .then(dataRutas => {
                            if (dataRutas.error) {
                                alert('Error al obtener datos de rutas: ' + dataRutas.error);
                            } else {
                                // Verificar si datosRutas está indefinido o vacío
                                let rutas = dataRutas.datosRutas ? JSON.stringify(dataRutas.datosRutas) : JSON.stringify({ message: "sin datos" });
                                
                                // Construir los parámetros de la URL
                                const queryParams = new URLSearchParams({
                                    userId: data.usuario.id,
                                    userName: data.usuario.user,
                                    userEmail: data.usuario.email,
                                    userNombres: data.usuario.nombres,
                                    userPaterno: data.usuario.ap_paterno,
                                    userMaterno: data.usuario.ap_materno,
                                    userTelefono: data.usuario.telefono,
                                    userDireccion: data.usuario.direccion,
                                    datosRutas: rutas // Convertir datosRutas a cadena JSON
                                }).toString();
                                
                                console.log(queryParams);
                    
                                // Redirigir a la página de inicio con los parámetros
                                window.location.href = `inicio.html?${queryParams}`;
                            }
                        })
                        .catch(error => {
                            console.error('Error al obtener los datos de rutas:', error);
                            
                            // En caso de error, redirigir con datos de usuario pero sin datos de rutas
                            const queryParams = new URLSearchParams({
                                userId: data.usuario.id,
                                userName: data.usuario.user,
                                userEmail: data.usuario.email,
                                userNombres: data.usuario.nombres,
                                userPaterno: data.usuario.ap_paterno,
                                userMaterno: data.usuario.ap_materno,
                                userTelefono: data.usuario.telefono,
                                userDireccion: data.usuario.direccion,
                                datosRutas: JSON.stringify({ message: "sin datos" }) // Enviar mensaje de sin datos en caso de error
                            }).toString();
                    
                            // Redirigir inmediatamente
                            window.location.href = `inicio.html?${queryParams}`;
                        });
    
                } else {
                    console.error('Error en la autenticación:', data.error || 'Error desconocido');
                    document.getElementById("danger").innerHTML = `
                        <div class="alert alert-danger" role="alert">
                           <p>Usuario no registrado</p>
                        </div>
                    `;
                    document.getElementById("cargando").hidden = true;
                    // Recargar la página forzando una nueva solicitud al servidor
                    setTimeout(function() {
                        //window.location.reload(true);
                    }, 3000);
                   // alert('Error en la autenticación: ' + (data.error || 'Error desconocido'));
                }
            })
            .catch(error => {
                console.error('Error al autenticar usuario:', error);
                document.getElementById("danger").innerHTML = `
                        <div class="alert alert-danger" role="alert">
                           <p>Usuario no registrado</p>
                        </div>
                    `;
                    // Recargar la página forzando una nueva solicitud al servidor
                    setTimeout(function() {
                       //window.location.reload(true);
                    }, 3000);
                //alert('Error al autenticar usuario: ' + error);
            });
        }   
        autenticarUsuario();
    });
    