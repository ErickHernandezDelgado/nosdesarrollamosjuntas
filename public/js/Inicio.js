document.getElementById("inicioForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const contraseña = document.getElementById("contraseña").value;

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, apellido, contraseña })
    })
    .then(response => response.json())
    .then(data => {
        if (data.estatus) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 1500
            });

            setTimeout(()=>{ window.location.href = "/" }, 1500)
        }
    })
    .catch(error => console.error("❌ Error en el inicio de sesión:", error));
});
