document.getElementById("login").addEventListener("submit", function(event) {
  event.preventDefault();
  
  let passIngresada = document.getElementById("password").value;

  // Recuperamos usuario del localStorage
  let usuarioGuardado = JSON.parse(localStorage.getItem("USUARIO"));

  if (usuarioGuardado &&
      passIngresada == usuarioGuardado.password) {
    alert("Inicio de sesión exitoso. Bienvenida " + usuarioGuardado.nombre);
    // redirige a una página de perfil
    window.location.href = "../index.html";
  } else {
    alert("Correo o contraseña incorrectos ❌");
  }
});
