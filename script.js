// Script para aplicar a classe shrink ao rolar
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});

// Script para abrir/fechar o menu lateral
const toggleBtn = document.getElementById("toggleMenu");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", (event) => {
  event.stopPropagation(); // evita fechar ao clicar no botão
  sidebar.classList.toggle("open");
});

// Fecha o menu ao clicar fora dele
document.addEventListener("click", (event) => {
  if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && event.target !== toggleBtn) {
    sidebar.classList.remove("open");
  }
});
