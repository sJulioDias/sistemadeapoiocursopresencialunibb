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

// INPUT COLOR PARA PERSONALIZAÇÃO
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", () => {
    const corEscolhida = colorPicker.value;
    cartao.style.background = corEscolhida;
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
    const cidadeUf = value("cidadeUf");

    // --- VERIFICAÇÃO DE DATAS ---
    if (new Date(dataFim) < new Date(dataInicio)) {
        alert("A data de término não pode ser anterior à data de início.");
        return; // interrompe o envio do formulário
    }

    // Concatena endereço e cidade/UF
    const localConcatenado = `${enderecoSala} - ${cidadeUf}`;

    // --- Código FIP padrão ---
    const codigoFip = "27X (onde X é a quantidade de horas de treinamento no dia)";

    // Preenche os campos do cartão
    document.getElementById("cursoSpan").textContent = curso;
    document.getElementById("cidadeUfSpan").textContent = cidadeUf;
    document.getElementById("descricaoCursoSpan").innerText = descricaoCurso;
    document.getElementById("prazoSpan").textContent = formatarDataISOparaBR(prazoInscricao);

    // Informações do evento em linhas separadas, com labels em amarelo
    document.getElementById("infoEvento").innerHTML = 
`<span class="label">Curso:</span> ${curso}
<span class="label">Datas:</span> ${formatarDataISOparaBR(dataInicio)} a ${formatarDataISOparaBR(dataFim)}
<span class="label">Horário:</span> ${horario}
<span class="label">Local:</span> ${localConcatenado}
<span class="label">Código FIP:</span> ${codigoFip}`;

    // Gera conteúdo de e-mail e descrição acessível
    gerarEmail(curso, formatarDataISOparaBR(prazoInscricao), dataInicio, dataFim, horario, localConcatenado, codigoFip, cidadeUf);
    gerarDescricao(curso, descricaoCurso, formatarDataISOparaBR(prazoInscricao), dataInicio, dataFim, horario, localConcatenado, codigoFip);

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
        link.href = canvas.toDataURL("image/jpeg", 0.95);
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
    "linear-gradient(160deg, #2c3e50, #000000)", 
    "linear-gradient(160deg, #102a43, #243b55)", 
    "linear-gradient(160deg, #0d324d, #1c1c1c)", 
    "linear-gradient(160deg, #bdc3c7, #2c3e50)"  
];
let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

// FUNÇÃO PARA GERAR TÍTULO DO EMAIL
function gerarEmail(curso, prazo, dataInicio, dataFim, horario, localConcatenado, codigoFip, cidadeUf) {
    document.getElementById("emailCorpo").value = `
Convite - Curso ${curso} - ${cidadeUf} - Inscreva-se até ${prazo}
`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(curso, descricaoCurso, prazo, dataInicio, dataFim, horario, localConcatenado, codigoFip) {
    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital UniBB com convite para curso presencial, com o logo do Banco do Brasil na cor amarela.

Olá, Colega!

Divulgamos a oferta de vagas para o curso "${curso}" – modalidade presencial.

${descricaoCurso}

Que tal aproveitar esta oportunidade para seu desenvolvimento profissional? Vagas Limitadas.

Seguem as informações:

📅 Data de início: ${formatarDataISOparaBR(dataInicio)}
📅 Data de término: ${formatarDataISOparaBR(dataFim)}
🕒 Horário: ${horario}
📍 Local: ${localConcatenado}
📌 Código FIP/Ponto Eletrônico: ${codigoFip}

Processo de inscrição:

1. Negocie sua liberação com sua liderança.

2. Acesse o Portal do Aluno, https://gepesbhz.intranet.bb.com.br/portaldoaluno/.

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
