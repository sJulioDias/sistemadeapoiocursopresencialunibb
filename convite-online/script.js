const form = document.getElementById("conviteForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartao");

// Função auxiliar para coletar valores dos inputs
function value(id) {
    return document.getElementById(id).value;
}

// Controle manual da cor de fundo do convite
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", () => {
    cartao.style.backgroundColor = colorPicker.value;
});

// Envio do formulário e montagem dinâmica do template
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const curso = value("curso");
    const dataCurso = value("dataCurso");
    const horario = value("horario");
    const local = value("local");
    const prazoInscricao = value("prazoInscricao");
    const sobreCurso = value("sobreCurso");

    // Alimenta os elementos do cartão visual
    document.getElementById("cursoNomeCard").textContent = curso.toUpperCase();
    document.getElementById("dataHoraCard").textContent = `${dataCurso} - ${horario}`;
    document.getElementById("localCard").textContent = local;
    document.getElementById("sobreCard").textContent = sobreCurso; // ✅ agora usa textContent
    document.getElementById("prazoCard").textContent = prazoInscricao;

    // Gera os textos de apoio e e-mail automatizados
    gerarAssuntoEmail(curso, prazoInscricao);
    gerarTextoAlternativo(curso, dataCurso, horario, local, prazoInscricao, sobreCurso);

    // Revela a seção de resultados e move a tela de forma suave
    resultado.classList.remove("hidden");
    window.scrollTo({ top: resultado.offsetTop, behavior: "smooth" }); // ✅ mais confiável
});

// Captura, download e cópia automatizada da imagem via html2canvas
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    const fundoAtual = window.getComputedStyle(cartao).backgroundColor;

    html2canvas(cartao, {
        scale: 2, // Alta definição
        backgroundColor: fundoAtual,
        useCORS: true
    }).then(canvas => {
        // Ação 1: Download direto do arquivo JPG
        const link = document.createElement("a");
        link.download = `convite-${value("curso").toLowerCase().replace(/\s+/g, "-")}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();

        // Ação 2: Tentativa de cópia para a área de transferência
        if (navigator.clipboard && window.ClipboardItem) {
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                    alert("Imagem baixada e também copiada para a sua área de transferência!");
                }).catch(err => {
                    console.error("Erro na cópia automática do canvas: ", err);
                    alert("O arquivo foi baixado, mas seu navegador não suporta a cópia automática.");
                });
            });
        } else {
            alert("O arquivo foi baixado, mas a cópia automática não é suportada neste navegador.");
        }
    });
});

// Copia o corpo de texto gerado para a área de transferência rápida
const btnCopiarEmail = document.getElementById("btnCopiarEmail");
btnCopiarEmail.addEventListener("click", () => {
    const textoAcessibilidade = document.getElementById("descricaoImagem").value;
    navigator.clipboard.writeText(textoAcessibilidade).then(() => {
        alert("Texto copiado com sucesso!");
    }).catch(err => {
        console.error("Falha ao copiar: ", err);
    });
});

// Dispara o cliente local de e-mail preenchendo os dados coletados
const btnEmail = document.getElementById("btnEmail");
btnEmail.addEventListener("click", () => {
    const assunto = document.getElementById("emailAssunto").value || "Convite Curso Online";
    const corpo = document.getElementById("descricaoImagem").value || "";
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoLink;
});

// Auxiliar: Gera o título padrão do e-mail corporativo
function gerarAssuntoEmail(curso, prazo) {
    document.getElementById("emailAssunto").value = `Convite - Curso ${curso} - Inscreva-se até ${prazo}`;
}

// Auxiliar: Gera a descrição completa legível por leitores de tela (#ParaTodosVerem)
function gerarTextoAlternativo(curso, data, horario, local, prazo, sobre) {
    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital em estilo moderno e ilustrado com bordas grossas pretas. Contém os dados do curso online em blocos destacados.

Olá, Colega!

Convidamos você para participar do curso online: ${curso}.

Data: ${data}
Horário: ${horario}
Local: ${local}

Sobre o curso:
${sobre}

Processo de inscrição obrigatório:
1. Negocie sua liberação prévia com sua chefia imediata.
2. Acesse a intranet através do Portal Capacita Aqui, https://gepesbhz.intranet.bb.com.br/capacitaaqui/
3. Realize a inscrição oficial na ferramenta até o dia ${prazo}.
4. Imprescindível: Peça para um gestor validar sua vaga acessando a aba "Gestor/a".

Sua presença fará toda a diferença!

`.trim();
}
