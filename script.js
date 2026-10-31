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

// Função para mostrar apenas a seção escolhida
function mostrarSecao(secao) {

  // Esconde todas as seções
  document.querySelectorAll('.card-section').forEach(div => {
    div.style.display = 'none';
  });

  // Remove destaque de todos os botões
  document.querySelectorAll('.menu-secoes button').forEach(btn => {
    btn.classList.remove('ativo');
  });

  // Mostra a seção selecionada
  document.getElementById(secao).style.display = 'flex';

  // Destaca o botão correspondente
  const botaoAtivo = document.querySelector(
    `.menu-secoes button[onclick="mostrarSecao('${secao}')"]`
  );

  if (botaoAtivo) {
    botaoAtivo.classList.add('ativo');
  }
}

// Exibir "Convite" por padrão ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  mostrarSecao('convite');
});

function filtrarCardsGlobal() {

  const termo = document
    .getElementById("campoBusca")
    .value
    .toLowerCase()
    .trim();

  const secoes = document.querySelectorAll(".card-section");

  if (termo === "") {

    // Restaura todos os cards
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "flex";
    });

    // Oculta todas as seções
    secoes.forEach(secao => {
      secao.style.display = "none";
    });

    // Exibe novamente a seção padrão
    mostrarSecao("convite");

    return;
  }

  secoes.forEach(secao => {

    const cards = secao.querySelectorAll(".card");
    let encontrou = false;

    cards.forEach(card => {

      const texto = card.textContent.toLowerCase();

      if (texto.includes(termo)) {
        card.style.display = "flex";
        encontrou = true;
      } else {
        card.style.display = "none";
      }

    });

    secao.style.display = encontrou ? "flex" : "none";

  });
}
