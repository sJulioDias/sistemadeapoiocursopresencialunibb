const form = document.getElementById("conviteForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartao");

// Função auxiliar para pegar valor
function value(id) {
    return document.getElementById(id).value;
}

// INPUT COLOR PARA PERSONALIZAÇÃO
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", () => {
    cartao.style.background = colorPicker.value;
});

// Função para aplicar <strong> em trechos entre ~...~
function aplicarRealce(texto) {
    return texto.replace(/~(.*?)~/g, '<strong>$1</strong>');
}

// Função para preservar quebras de linha e aplicar realce
function formatarTexto(texto) {
    let formatado = aplicarRealce(texto);
    formatado = formatado.replace(/\n/g, "<br>");
    return formatado;
}

// SUBMISSÃO DO FORMULÁRIO
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const campo1 = value("campo1");
    const campo2 = value("campo2");
    const campo3 = value("campo3");
    const campo4 = value("campo4");

    document.getElementById("campo1Span").innerHTML = aplicarRealce(campo1);
    document.getElementById("campo2Span").innerHTML = formatarTexto(campo2);
    document.getElementById("campo3Span").innerHTML = formatarTexto(campo3);
    document.getElementById("campo4Span").innerHTML = formatarTexto(campo4);

    gerarEmail(campo1, campo2);
    gerarDescricao(campo1, campo2, campo3, campo4);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

// BOTÃO PARA GERAR IMAGEM
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    const estiloAtual = window.getComputedStyle(cartao);
    const corDeFundo = estiloAtual.backgroundColor || estiloAtual.backgroundImage;

    html2canvas(cartao, {
        scale: 2,
        backgroundColor: corDeFundo 
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "convite-unibb.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.80);
        link.click();

        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(() => {
                alert("Imagem copiada para a área de transferência!");
            }).catch(err => {
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente.");
            });
        });
    });
});

// BOTÃO PARA COPIAR TEXTO DO EMAIL
const btnCopiarEmail = document.getElementById("btnCopiarEmail");
btnCopiarEmail.addEventListener("click", () => {
    const emailTexto = document.getElementById("descricaoImagem").value;
    navigator.clipboard.writeText(emailTexto).then(() => {
        alert("Texto do e-mail copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
    });
});

// BOTÃO PARA ALTERAR COR DO CARTÃO
const btnAlterarCor = document.getElementById("btnAlterarCor");
const cores = [
    "linear-gradient(160deg, #062f4f, #04324f)", 
    "linear-gradient(160deg, #735CC6, #5741a5)",
    "linear-gradient(160deg, #FF6E91, #de4b6d)",
    "linear-gradient(160deg, #3333BD, #212194)"
];
let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

// FUNÇÃO PARA GERAR TÍTULO DO EMAIL
function gerarEmail(campo1, campo2) {
    document.getElementById("emailCorpo").value = `
Convite - ${campo1} - ${campo2.substring(0,50)}...
`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(campo1, campo2, campo3, campo4) {
    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital com convite para curso presencial na cor azul, com o logo da UniBB na cor amarela.

${campo1}

${campo2}

${campo3}

${campo4}

Atenciosamente,
Gepes Especializada - Educação e Seleção
`.trim();
}

// BOTÃO PARA COMPARTILHAR POR EMAIL
const btnEmail = document.getElementById("btnEmail");
btnEmail.addEventListener("click", () => {
    html2canvas(cartao, { scale: 2 }).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });

            navigator.clipboard.write([item]).then(() => {
                alert("Imagem copiada! Agora cole no corpo do e-mail.");

                const assunto = document.getElementById("emailCorpo").value || "Convite UniBB";
                const corpo = document.getElementById("descricaoImagem").value || "Segue convite em anexo.";

                const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
                window.location.href = mailtoLink;

            }).catch(err => {
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente.");
            });
        });
    });
});

// BOTÃO PARA LIMPAR TODOS OS CAMPOS E BLOCOS
const btnLimpar = document.getElementById("btnLimpar");
btnLimpar.addEventListener("click", () => {
    // Limpa os campos do formulário
    document.getElementById("campo1").value = "";
    document.getElementById("campo2").value = "";
    document.getElementById("campo3").value = "";
    document.getElementById("campo4").value = "";

    // Limpa os blocos do cartão
    document.getElementById("campo1Span").textContent = "";
    document.getElementById("campo2Span").textContent = "";
    document.getElementById("campo3Span").innerHTML = "";
    document.getElementById("campo4Span").textContent = "";

    // Limpa os campos de e-mail e descrição
    document.getElementById("emailCorpo").value = "";
    document.getElementById("descricaoImagem").value = "";

    // Oculta novamente a seção de resultado
    resultado.classList.add("hidden");
});

// BOTÃO PARA REALÇAR SELEÇÃO
const btnRealcar = document.getElementById("btnRealcar");
btnRealcar.addEventListener("click", () => {
    const campos = ["campo1", "campo2", "campo3", "campo4"];
    let campoAtivo = null;

    // Procura o campo que tem uma seleção válida
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el.selectionStart !== el.selectionEnd) {
            campoAtivo = el;
        }
    });

    if (!campoAtivo) {
        alert("Selecione um trecho de texto em algum campo para realçar.");
        return;
    }

    const inicio = campoAtivo.selectionStart;
    const fim = campoAtivo.selectionEnd;
    const texto = campoAtivo.value;
    const selecionado = texto.substring(inicio, fim);

    // Envolve o trecho selecionado com ~...~
    const novoTexto = texto.substring(0, inicio) + "~" + selecionado + "~" + texto.substring(fim);
    campoAtivo.value = novoTexto;
});
