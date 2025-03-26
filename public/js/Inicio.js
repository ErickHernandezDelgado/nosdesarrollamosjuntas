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
        alert(data.mensaje);
        if (data.mensaje.includes("✅")) {
            localStorage.setItem("userId", data.usuario.id);
            window.location.href = "/home";
        }
    })
    .catch(error => console.error("❌ Error en el inicio de sesión:", error));
});
