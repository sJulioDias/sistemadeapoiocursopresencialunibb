const form = document.getElementById("cancelamentoForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartaoCancelamento");

function value(id) {
    return document.getElementById(id).value;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const curso = value("curso");
    const cidadeUf = value("cidadeUf");
    const periodo = value("periodo");
    const motivo = value("motivo");

    document.getElementById("cursoSpan").textContent = curso;
    document.getElementById("cidadeUfSpan").textContent = cidadeUf;
    document.getElementById("periodoSpan").textContent = periodo;
    document.getElementById("motivoSpan").textContent = motivo;

    gerarEmail(curso, cidadeUf, periodo);
    gerarDescricao(curso, cidadeUf, periodo, motivo);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

// BOTÃO PARA GERAR IMAGEM E COPIAR
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    html2canvas(cartao, { scale: 2 }).then(canvas => {
        // Baixar como arquivo JPG
        const link = document.createElement("a");
        link.download = "cancelamento-unibb.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();

        // Copiar para área de transferência
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
        alert("Texto do e-mail copiado!");
    });
});

// BOTÃO PARA COMPARTILHAR POR EMAIL
const btnEmail = document.getElementById("btnEmail");
btnEmail.addEventListener("click", () => {
    const assunto = document.getElementById("emailCorpo").value || "Comunicado de Cancelamento UniBB";
    const corpo = document.getElementById("descricaoImagem").value || "Segue comunicado de cancelamento.";

    const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoLink;
});

// FUNÇÃO PARA GERAR TÍTULO DO EMAIL
function gerarEmail(curso, cidadeUf, periodo) {
    document.getElementById("emailCorpo").value = `
Comunicado - Cancelamento do curso ${curso} - ${cidadeUf} (${periodo})
`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(curso, cidadeUf, periodo, motivo) {
    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital de comunicado de cor azul claro, com faixa superior azul contendo a palavra "COMUNICADO" em amarelo.

Olá, Colega!

Informamos que o curso "${curso}", previsto para ocorrer em ${cidadeUf}, no período de ${periodo} foi cancelado.

Motivo do cancelamento: ${motivo}

Pedimos que continue acompanhando novas comunicações e o planejamento de turmas no Portal do Aluno para se inscrever em nova oportunidade.

Atenciosamente,
Gepes Especializada - Educação e Seleção

`.trim();
}
