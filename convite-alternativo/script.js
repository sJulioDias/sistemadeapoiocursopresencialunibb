const form = document.getElementById("conviteForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartao");

// Função auxiliar para pegar valor de input/textarea
function value(id) {
    return document.getElementById(id).value;
}

// Função para formatar data ISO (YYYY-MM-DD) em DD/MM/AAAA
function formatarDataISOparaBR(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// INPUT COLOR PARA PERSONALIZAÇÃO DO SEU CARTÃO
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", () => {
    const corEscolhida = colorPicker.value;
    cartao.style.background = corEscolhida;
});

// --- CONTROLE DE EXIBIÇÃO DE PRÉ-REQUISITOS NO FORMULÁRIO ---
const selectPrereq = document.getElementById("temPrerequisito");
const prereqContainer = document.getElementById("prerequisitoContainer");

selectPrereq.addEventListener("change", () => {
    if (selectPrereq.value === "sim") {
        prereqContainer.classList.remove("hidden");
    } else {
        prereqContainer.classList.add("hidden");
        document.getElementById("prerequisitoCurso").value = "";
    }
});

// SUBMISSÃO DO FORMULÁRIO
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const curso = value("curso");
    const descricaoCurso = value("descricaoCurso");
    const prazoInscricao = value("prazoInscricao");
    const dataInicio = value("dataInicio");
    const dataFim = value("dataFim");
    const horario = value("horario");
    const enderecoSala = value("enderecoSala");
    const cidadeUfValor = value("cidadeUf");
    const prerequisito = value("prerequisitoCurso");
    const publicoAlvo = value("publicoAlvo"); // <-- NOVO CAMPO

    // --- VERIFICAÇÃO DE DATAS ---
    if (new Date(dataFim) < new Date(dataInicio)) {
        alert("A data de término não pode ser anterior à data de início.");
        return;
    }

    // --- VERIFICAÇÃO DE PRÉ-REQUISITOS ---
    if (selectPrereq.value === "sim" && !prerequisito.trim()) {
        alert("Por favor, informe os pré‑requisitos para participação no curso.");
        document.getElementById("prerequisitoCurso").focus();
        return;
    }

    // Concatena endereço e cidade/UF para os textos do e-mail
    const localConcatenado = `${enderecoSala} - ${cidadeUfValor}`;

    // --- Código FIP padrão ---
    const codigoFip = "27X (onde X é a quantidade de horas de treinamento no dia)";

    // Preenche os campos de texto do cartão
    document.getElementById("cursoSpan").textContent = curso;
    document.getElementById("descricaoCursoSpan").innerText = descricaoCurso;
    document.getElementById("prazoSpan").textContent = formatarDataISOparaBR(prazoInscricao);

    // Renderiza bloco de informações
    let infoHTML = `
        <div class="info-box-left">
            <strong>Horário:</strong><br>${horario}<br>
            <strong>Local:</strong><br>${enderecoSala}<br>
            <strong>FIP:</strong> ${codigoFip}
        </div>
        <div class="date-badge">
            <div class="date-main">${formatarDataISOparaBR(dataInicio).substring(0, 5)} a ${formatarDataISOparaBR(dataFim).substring(0, 5)}</div>
            <div class="date-sub">${cidadeUfValor}</div>
        </div>
    `;
    document.getElementById("infoEvento").innerHTML = infoHTML;

    // Pré-requisitos no cartão
    const boxPrereq = document.getElementById("boxPrerequisito");
    const txtPrereq = document.getElementById("cursoPrerequisito");
    if (selectPrereq.value === "sim" && prerequisito.trim()) {
        txtPrereq.textContent = prerequisito;
        boxPrereq.classList.remove("hidden");
    } else {
        boxPrereq.classList.add("hidden");
    }

    // Público-alvo no cartão
    const boxPublico = document.getElementById("boxPublico");
    const txtPublico = document.getElementById("cursoPublico");
    if (publicoAlvo.trim()) {
        txtPublico.textContent = publicoAlvo;
        boxPublico.classList.remove("hidden");
    } else {
        boxPublico.classList.add("hidden");
    }

    // Gera conteúdo de e-mail e descrição acessível
    gerarEmail(curso, formatarDataISOparaBR(prazoInscricao), cidadeUfValor);
    gerarDescricao(curso, descricaoCurso, formatarDataISOparaBR(prazoInscricao), dataInicio, dataFim, horario, localConcatenado, codigoFip, prerequisito, publicoAlvo);

    // Mostra resultado
    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

// BOTÃO PARA BAIXAR E COPIAR IMAGEM
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    const estiloAtual = window.getComputedStyle(cartao);
    const corDeFundo = estiloAtual.backgroundColor || estiloAtual.backgroundImage;

    const htmlElement = document.documentElement;
    htmlElement.style.scrollBehavior = "auto";

    html2canvas(cartao, {
        scale: 1.8,
        backgroundColor: corDeFundo,
        useCORS: true,
        logging: false
    }).then(canvas => {
        htmlElement.style.scrollBehavior = "smooth";

        // --- DOWNLOAD ---
        const link = document.createElement("a");
        link.download = "convite-unibb.png";
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // --- COPIAR PARA ÁREA DE TRANSFERÊNCIA ---
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item])
                .then(() => {
                    alert("Imagem baixada e copiada para a área de transferência!");
                })
                .catch(err => {
                    console.error("Erro ao copiar imagem: ", err);
                    alert("Imagem baixada, mas não foi possível copiar.");
                });
        });
    }).catch(err => {
        console.error("Erro ao gerar imagem: ", err);
        alert("Ocorreu um erro ao gerar e baixar a imagem.");
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

// BOTÃO PARA ALTERAR AS CORES DO CARTÃO
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
function gerarEmail(curso, prazo, cidadeUf) {
    document.getElementById("emailCorpo").value = `Divulgação de vagas - Curso ${curso} - ${cidadeUf} - Inscreva-se até ${prazo}`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(curso, descricaoCurso, prazo, dataInicio, dataFim, horario, localConcatenado, codigoFip, prerequisito, publicoAlvo) {
    const blocoPrereq = prerequisito ? `\nPré‑requisitos: ${prerequisito}` : "";
    const blocoPublico = publicoAlvo ? `\nPúblico-alvo: ${publicoAlvo}` : "";

    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital com convite para curso presencial estruturado com degradê azul escuro e um cartão claro interno. Exibe insígnias nas cores amarelo e azul com a marca UniBB.

"${curso}" – modalidade presencial.

Olá! Temos uma nova turma na região. Aproveite esta oportunidade para seu desenvolvimento profissional! Mas atenção, as vagas são limitadas.

Sobre o curso:
${descricaoCurso}

Seguem as informações:

Data de início: ${formatarDataISOparaBR(dataInicio)}
Data de término: ${formatarDataISOparaBR(dataFim)}
Horário: ${horario}
Local: ${localConcatenado}
Código FIP/Ponto Eletrônico: ${codigoFip}${blocoPrereq}${blocoPublico}

Processo de inscrição:

1. Negocie sua liberação com sua liderança.
2. Acesse o Portal Capacita Aqui, https://gepesbhz.intranet.bb.com.br/capacitaaqui/.
3. Clique na aba “Participante” e realize sua inscrição, até o dia ${prazo}.
4. Após isso, solicite que um/a gestor/a da sua unidade acesse o mesmo link, na aba “Gestor”, para validar sua participação. Este passo é imprescindível! (Vide Tutorial em anexo).

Sua presença fará toda a diferença!

Atenciosamente,
Gepes Especializada - Educação e Seleção
`.trim();
}

// BOTÃO PARA COMPARTILHAR POR EMAIL
const btnEmail = document.getElementById("btnEmail");
btnEmail.addEventListener("click", () => {
    const assunto = document.getElementById("emailCorpo").value || "Convite UniBB";
    const corpo = document.getElementById("descricaoImagem").value || "Segue convite em anexo.";

    const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoLink;
});
