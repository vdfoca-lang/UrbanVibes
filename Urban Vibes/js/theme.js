// theme-toggle.js

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".theme-toggle"); // botón con clase .theme-toggle
  const root = document.documentElement; // <html>

  // Leer tema guardado en localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
}

toggleBtn.addEventListener("click", () => {
    // Detectar tema actual
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Aplicar tema
    root.setAttribute("data-theme", newTheme);
    
    // Guardar preferencia
    localStorage.setItem("theme", newTheme);
});
});

