// Función para mostrar/ocultar el campo "Edad menarquía"
function toggleEdadMenarquia() {
    const checkbox = document.getElementById("primerPeriodo");
    const edadInput = document.getElementById("edadMenarquia");
    
    if (checkbox.checked) {
        edadInput.style.display = "block";
        edadInput.required = true;
    } else {
        edadInput.style.display = "none";
        edadInput.required = false;
        edadInput.value = "";
    }
}

// Función para validar los datos y enviarlos al backend
function validarRegistro() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const contraseña = document.getElementById("contraseña").value;
    const edad = parseInt(document.getElementById("edad").value);
    const primerPeriodo = document.getElementById("primerPeriodo").checked;
    const edadMenarquia = primerPeriodo ? parseInt(document.getElementById("edadMenarquia").value) : null;

    if (!nombre || !apellido) {
        Swal.fire({
            position: "top-end",
            icon: "info",
            title: "Por favor, ingresa tu nombre y apellido.",
            showConfirmButton: false,
            timer: 1500
          });
        return;
    }

    if (!contraseña || contraseña.length < 6) {
        Swal.fire({
            position: "top-end",
            icon: "info",
            title: "La contraseña debe tener al menos 6 caracteres.",
            showConfirmButton: false,
            timer: 1500
          });
        return;
    }

    if (isNaN(edad) || edad < 9 || edad > 16) {
        Swal.fire({
            position: "top-end",
            icon: "info",
            title: "Por favor, ingresa una edad válida entre 9 y 16 años.",
            showConfirmButton: false,
            timer: 1500
          });
        return;
    }

    let tipoMenarquia = null;
    if (primerPeriodo) {
        if (!edadMenarquia || edadMenarquia < 9 || edadMenarquia > 16) {
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Por favor, ingresa una edad válida para tu primer período.",
                showConfirmButton: false,
                timer: 1500
              });
            return;
        }
        tipoMenarquia = edadMenarquia <= 11 ? "temprana" : edadMenarquia >= 15 ? "tardia" : "regular";
    }

    fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre,
            apellido,
            contraseña,
            edad,
            primerPeriodo,
            edadMenarquia,
            tipoMenarquia
        }),
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });

        setTimeout(() => {
            window.location.href = "/inicio_sesion";
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un error al registrar.");
    });
}
