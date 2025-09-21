document.getElementById("registroForm").addEventListener("submit", function(event) {
event.preventDefault();

let usuario = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    password: document.getElementById("password").value
};

  // Guardamos en localStorage (simulando una "base de datos")
localStorage.setItem("USUARIO", JSON.stringify(usuario));

alert("Registro exitoso");
  window.location.href = "../pages/formularioiniciodesesion.html"; // redirige al login
});
