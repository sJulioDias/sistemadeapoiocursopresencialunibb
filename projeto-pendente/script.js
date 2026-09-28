const form = document.getElementById("cancelamentoForm");
const resultado = document.getElementById("resultado");

// Cards
const cartao = document.getElementById("cartaoCancelamento");
const cartaoAdicional = document.getElementById("cartaoAdicional");

// Botões
const btnImagem = document.getElementById("btnImagem");
const btnImagemAdicional = document.getElementById("btnImagemAdicional");
const btnCopiarEmail = document.getElementById("btnCopiarEmail");
const btnEmail = document.getElementById("btnEmail");


function value(id) {
    return document.getElementById(id).value;
}


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const curso = value("curso");
    const cidadeUf = value("cidadeUf");
    const periodo = value("periodo");
    const informacoesAdicionais = value("informacoesAdicionais").trim();

    // Preenche o card principal
    document.getElementById("cursoSpan").textContent = curso;
    document.getElementById("cidadeUfSpan").textContent = cidadeUf;
    document.getElementById("periodoSpan").textContent = periodo;

    // Gera conteúdo do e-mail
    gerarEmail(curso, cidadeUf, periodo);
    gerarDescricao(curso, cidadeUf, periodo);

    // ========================================
    // CARD DE INFORMAÇÕES ADICIONAIS
    // ========================================

    const informacoesAdicionaisSpan =
        document.getElementById("informacoesAdicionaisSpan");

    if (informacoesAdicionais) {
        // Insere as informações no card
        informacoesAdicionaisSpan.textContent = informacoesAdicionais;

        // Exibe o card adicional
        cartaoAdicional.classList.remove("hidden");

        // Habilita o botão do card adicional
        btnImagemAdicional.disabled = false;
    } else {
        // Limpa o conteúdo
        informacoesAdicionaisSpan.textContent = "";

        // Esconde o card adicional
        cartaoAdicional.classList.add("hidden");

        // Desabilita o botão
        btnImagemAdicional.disabled = true;
    }

    // Exibe a área de resultado
    resultado.classList.remove("hidden");

    resultado.scrollIntoView({
        behavior: "smooth"
    });
});


// ========================================
// CARD PRINCIPAL
// GERAR, BAIXAR E COPIAR IMAGEM
// ========================================

btnImagem.addEventListener("click", () => {
    html2canvas(cartao, {
        scale: 1.5
    }).then(canvas => {

        // Baixar como JPG
        const link = document.createElement("a");
        link.download = "comunicado-unibb.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();

        // Copiar para a área de transferência
        canvas.toBlob(blob => {
            const item = new ClipboardItem({
                "image/png": blob
            });

            navigator.clipboard.write([item])
                .then(() => {
                    alert(
                        "Comunicado copiado para a área de transferência!"
                    );
                })
                .catch(err => {
                    console.error(
                        "Erro ao copiar imagem:",
                        err
                    );

                    alert(
                        "A imagem foi baixada, mas não foi possível copiá-la automaticamente."
                    );
                });
        }, "image/png");
    });
});


// ========================================
// CARD ADICIONAL
// GERAR, BAIXAR E COPIAR IMAGEM
// ========================================

btnImagemAdicional.addEventListener("click", () => {

    // Segurança adicional
    if (btnImagemAdicional.disabled) {
        return;
    }

    html2canvas(cartaoAdicional, {
        scale: 1.5
    }).then(canvas => {

        // Baixar como JPG
        const link = document.createElement("a");
        link.download = "informacoes-adicionais-unibb.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();

        // Copiar para a área de transferência
        canvas.toBlob(blob => {
            const item = new ClipboardItem({
                "image/png": blob
            });

            navigator.clipboard.write([item])
                .then(() => {
                    alert(
                        "Card adicional copiado para a área de transferência!"
                    );
                })
                .catch(err => {
                    console.error(
                        "Erro ao copiar card adicional:",
                        err
                    );

                    alert(
                        "O card adicional foi baixado, mas não foi possível copiá-lo automaticamente."
                    );
                });

        }, "image/png");
    });
});


// ========================================
// COPIAR TEXTO DO E-MAIL
// ========================================

btnCopiarEmail.addEventListener("click", () => {

    const emailTexto =
        document.getElementById("descricaoImagem").value;

    navigator.clipboard.writeText(emailTexto)
        .then(() => {
            alert("Texto do e-mail copiado!");
        })
        .catch(err => {
            console.error(
                "Erro ao copiar texto:",
                err
            );

            alert(
                "Não foi possível copiar o texto automaticamente."
            );
        });
});


// ========================================
// COMPARTILHAR POR E-MAIL
// ========================================

btnEmail.addEventListener("click", () => {

    const assunto =
        document.getElementById("emailCorpo").value ||
        "Comunicado de inscrição pendente UniBB";

    const corpo =
        document.getElementById("descricaoImagem").value ||
        "Segue comunicado de inscrição pendente.";

    const mailtoLink =
        `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;

    window.location.href = mailtoLink;
});


// ========================================
// GERAR TÍTULO DO E-MAIL
// ========================================

function gerarEmail(curso, cidadeUf, periodo) {

    document.getElementById("emailCorpo").value = `
Comunicado - Inscrição pendente: ${curso} - ${cidadeUf} (${periodo})
`.trim();

}


// ========================================
// GERAR DESCRIÇÃO DA IMAGEM
// ========================================

function gerarDescricao(curso, cidadeUf, periodo) {

    document.getElementById("descricaoImagem").value = `
#Paratodosverem

Olá, Gestor!

Um funcionário de sua dependência manifestou interesse em ampliar seus conhecimentos participando do curso "${curso}", que acontecerá em ${cidadeUf}, no período de ${periodo}.

Que tal apoiar esse desenvolvimento?

Com o seu incentivo, o time se engaja e os resultados aparecem: funcionários mais qualificados eclientes mais satisfeitos.

Ao desenvolver sua equipe, você também fortalece sua liderança e impulsiona o desempenho da dependência.

Para autorizar a matrícula, acesse o Portal Capacita Aqui e realize a validação na aba "Validação Gestor/a".

Seu apoio faz a diferença!

Atenciosamente,

Gepes Especializada
Educação e Seleção
`.trim();

}
