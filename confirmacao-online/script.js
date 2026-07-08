const form = document.getElementById("cursoForm");
const resultado = document.getElementById("resultado");
const btnImagem = document.getElementById("btnImagem");

const selectPrereq = document.getElementById("temPrerequisito");
const prereqContainer = document.getElementById("prerequisitoContainer");
const boxPrereq = document.getElementById("boxPrerequisito");

selectPrereq.addEventListener("change", () => {
    if (selectPrereq.value === "sim") {
        prereqContainer.classList.remove("hidden");
    } else {
        prereqContainer.classList.add("hidden");
        document.getElementById("prerequisitoCurso").value = "";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const prerequisitoRaw = value("prerequisitoCurso");

    // ✅ Verificação obrigatória de pré-requisitos
    if (selectPrereq.value === "sim") {
        if (!prerequisitoRaw.trim()) {
            alert("Por favor, informe os pré‑requisitos para participação no curso.");
            document.getElementById("prerequisitoCurso").focus();
            return;
        }
    }

    const curso = value("nomeCurso");
    const data = value("dataCurso");
    const horario = value("horarioCurso");
    const local = value("localCurso");
    const prerequisito = selectPrereq.value === "sim" ? prerequisitoRaw : "";

    text("cursoTitulo", curso);
    text("cursoData", data);
    text("cursoHorario", horario);
    text("cursoLocal", local);

    if (selectPrereq.value === "sim" && prerequisito.trim()) {
        const elemento = document.getElementById("cursoPrerequisito");
        elemento.innerHTML = prerequisito.replace(/\n/g, "<br>");
        boxPrereq.classList.remove("hidden");
    } else {
        boxPrereq.classList.add("hidden");
    }

    gerarEmail(curso, data, horario, local, prerequisito);
    gerarDescricao(curso, data, horario, local, prerequisito);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

btnImagem.addEventListener("click", () => {
    const cartaoElemento = document.getElementById("cartao");
    const corDeFundoAtual = window.getComputedStyle(cartaoElemento).backgroundColor;

    html2canvas(cartaoElemento, {
        scale: 2,
        backgroundColor: corDeFundoAtual
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "cartao-confirmacao.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();

        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(() => {
                alert("Imagem copiada para a área de transferência!");
            }).catch(err => {
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente. Você pode salvar manualmente.");
            });
        });
    });
});

function gerarEmail(curso, data, horario, local, prereq) {
    const bloco = prereq ? `\nPré‑requisitos: ${prereq}\n` : "";

    document.getElementById("emailCorpo").value = `
Confirmação de participação no curso ${curso} - ${data} - ${local}
`.trim();
}

function gerarDescricao(curso, data, horario, local, prereq) {
    const blocoPrereq = prereq ? `\n\nPré-requisitos: ${prereq}.` : "";

    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital na cor azul e logotipo da UniBB em amarelo. Possui as informações de curso e instruções.

Olá!

Sua participação no curso "${curso}" está confirmada.

Data: ${data}
Horário: ${horario}
Local: ${local}${blocoPrereq}
Situação FIP/ Ponto Eletrônico: 27X, onde X é o número de horas de treinamento no dia.

ATENÇÃO!
É necessário que você se conecte com antecedência ao horário previsto para o início, evitando atrasos para começar o curso;
A sua câmera deverá permanecer aberta durante o período de capacitação;
Lembre-se: o foco na formação é fundamental para o processo de aprendizagem. Converse com o seu gestor para que este momento seja reservado exclusivamente para o treinamento, evitando interrupções;
Caso não possa participar, gentileza informar com antecedência.

Atenciosamente,

Gepes Especializada Educação e Seleção
`.trim();
}

function value(id) {
    return document.getElementById(id).value;
}

function text(id, value) {
    document.getElementById(id).textContent = value;
}

const btnCopiarEmail = document.getElementById("btnCopiarEmail");

btnCopiarEmail.addEventListener("click", () => {
    const emailTexto = document.getElementById("descricaoImagem").value;
    navigator.clipboard.writeText(emailTexto).then(() => {
        alert("Texto do e-mail copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
    });
});

const btnAlterarCor = document.getElementById("btnAlterarCor");
const cartao = document.getElementById("cartao");

const cores = [
    "linear-gradient(160deg, #2c3e50, #000000)", // Grafite
    "linear-gradient(160deg, #102a43, #243b55)", // Marinho
    "linear-gradient(160deg, #0d324d, #1c1c1c)", // Petróleo
    "linear-gradient(160deg, #3333BD, #212194)"
];

let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

const colorPicker = document.getElementById("colorPicker");

colorPicker.addEventListener("input", () => {
    const corEscolhida = colorPicker.value;
    cartao.style.background = corEscolhida;
});

const btnCompartilharEmail = document.getElementById("btnCompartilharEmail");

btnCompartilharEmail.addEventListener("click", () => {
    const cartaoElemento = document.getElementById("cartao");

    html2canvas(cartaoElemento, { scale: 2 }).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]).then(() => {
                alert("Imagem copiada! Agora cole no corpo do e-mail.");
                const tituloEmail = document.getElementById("emailCorpo").value || "Confirmação de participação no curso";
                const corpoEmail = document.getElementById("descricaoImagem").value;

                const assunto = encodeURIComponent(tituloEmail);
                const corpo = encodeURIComponent(corpoEmail);
                window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
            }).catch(err => {
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente. Ela pode ser salva manualmente.");
            });
        });
    });
});
