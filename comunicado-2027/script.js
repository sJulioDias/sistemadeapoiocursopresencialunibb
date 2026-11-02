function formatarTexto(texto) {
    return texto.replace(/\n/g, "<br>");
}

function atualizarCard() {

    document.getElementById("previewTitulo").textContent =
        document.getElementById("titulo").value;

    document.getElementById("previewParagrafo1").innerHTML =
        formatarTexto(
            document.getElementById("paragrafo1").value
        );

    document.getElementById("previewParagrafo2").innerHTML =
        formatarTexto(
            document.getElementById("paragrafo2").value
        );

    document.getElementById("previewParagrafo3").innerHTML =
        formatarTexto(
            document.getElementById("paragrafo3").value
        );
}

function aplicarTag(textareaId, tag) {

    const textarea = document.getElementById(textareaId);

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;

    if (inicio === fim) {
        alert("Selecione um texto primeiro.");
        return;
    }

    const textoSelecionado =
        textarea.value.substring(inicio, fim);

    const novoTexto =
        `<${tag}>${textoSelecionado}</${tag}>`;

    textarea.setRangeText(
        novoTexto,
        inicio,
        fim,
        "end"
    );

    atualizarCard();

    textarea.focus();
}

function aplicarDestaque(textareaId) {

    const textarea = document.getElementById(textareaId);

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;

    if (inicio === fim) {
        alert("Selecione um texto primeiro.");
        return;
    }

    const textoSelecionado =
        textarea.value.substring(inicio, fim);

    const novoTexto =
        `<span class="destaque-amarelo">${textoSelecionado}</span>`;

    textarea.setRangeText(
        novoTexto,
        inicio,
        fim,
        "end"
    );

    atualizarCard();

    textarea.focus();
}

async function exportarPNG() {

    const card = document.getElementById("cardExport");

    const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
    });

    const imagem = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = imagem;
    link.download = "comunicado-unibb.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function removerTags(html) {

    const temp = document.createElement("div");

    temp.innerHTML = html;

    return temp.textContent || temp.innerText || "";
}

function gerarPraTodosVerem() {

    const titulo =
        document.getElementById("titulo").value;

    const texto1 =
        removerTags(
            document.getElementById("paragrafo1").value
        );

    const texto2 =
        removerTags(
            document.getElementById("paragrafo2").value
        );

    const texto3 =
        removerTags(
            document.getElementById("paragrafo3").value
        );

    const descricao =
`#PraTodosVerem

Card institucional da UniBB com fundo colorido e área central branca.

No topo aparece o título:

${titulo}

Texto do comunicado:

${texto1}

${texto2}

${texto3}

Assinatura:

Gepes Especializada
Educação e Seleção.`;

    document.getElementById("praTodosVerem").value =
        descricao;
}

/* ==========================
   TEMAS DE CORES
========================== */

const temas = [
    {
        nome: "Azul BB",
        card: "linear-gradient(135deg,#0048c9,#002f87)",
        header: "#002563",
        destaque: "#f6f632",
        portal: "#eef5ff"
    },
    {
        nome: "Marinho",
        card: "linear-gradient(160deg,#062f4f,#04324f)",
        header: "#022033",
        destaque: "#5fe3ff",
        portal: "#d9f5ff"
    },
    {
        nome: "Roxo",
        card: "linear-gradient(160deg,#735CC6,#5741a5)",
        header: "#402f7e",
        destaque: "#f3d9ff",
        portal: "#f4eaff"
    },
    {
        nome: "Rosa",
        card: "linear-gradient(160deg,#FF6E91,#de4b6d)",
        header: "#b83755",
        destaque: "#ffe0e8",
        portal: "#fff0f4"
    },
    {
        nome: "Índigo",
        card: "linear-gradient(160deg,#3333BD,#212194)",
        header: "#171770",
        destaque: "#cfd3ff",
        portal: "#e8eaff"
    }
];

let indiceTema = 0;

/* ==========================
   INICIALIZAÇÃO
========================== */

document.addEventListener("DOMContentLoaded", () => {

    atualizarCard();

    const campos = [
        "titulo",
        "paragrafo1",
        "paragrafo2",
        "paragrafo3"
    ];

    campos.forEach(id => {

        document
            .getElementById(id)
            .addEventListener("input", atualizarCard);

    });

    const btnAlterarCor =
        document.getElementById("btnAlterarCor");

    if (btnAlterarCor) {

        btnAlterarCor.addEventListener("click", () => {

            indiceTema++;

            if (indiceTema >= temas.length) {
                indiceTema = 0;
            }

            const tema = temas[indiceTema];

            document.getElementById("cardExport")
                .style.background = tema.card;

            document.querySelector(".header")
                .style.background = tema.header;

            document.documentElement.style.setProperty(
                "--cor-destaque",
                tema.destaque
            );
            document.documentElement.style.setProperty(
                "--cor-portal",
                tema.portal
            );


        });

    }

});

function removerFormatacao(textareaId) {

    const textarea =
        document.getElementById(textareaId);

    const inicio = textarea.selectionStart;
    const fim = textarea.selectionEnd;

    if (inicio === fim) {
        alert("Selecione um texto formatado primeiro.");
        return;
    }

    let textoSelecionado =
        textarea.value.substring(inicio, fim);

    textoSelecionado = textoSelecionado
        .replace(/<strong>/gi, "")
        .replace(/<\/strong>/gi, "")
        .replace(
            /<span class="destaque-amarelo">/gi,
            ""
        )
        .replace(/<\/span>/gi, "");

    textarea.setRangeText(
        textoSelecionado,
        inicio,
        fim,
        "end"
    );

    atualizarCard();

    textarea.focus();
}
