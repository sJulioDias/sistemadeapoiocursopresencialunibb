document.getElementById('form-card').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturar inputs
    const curso = document.getElementById('in-curso').value;
    const ed1 = document.getElementById('in-ed1').value;
    const ed2 = document.getElementById('in-ed2').value;
    const data = document.getElementById('in-data').value;
    const horario = document.getElementById('in-horario').value;
    const genero = document.getElementById('in-genero').value;

    // Injetar no card
    document.getElementById('out-curso').innerText = curso;

    const containerEd2 = document.getElementById('container-ed2');
    const outEd1 = document.getElementById('out-ed1');
    const labelEducadores = document.getElementById('label-educadores');

    // Ajuste de gênero
    let labelSingular = "Educador/a";
    let labelPlural = "Educadores/as";

    if (genero === "feminino") {
        labelSingular = "Educadora";
        labelPlural = "Educadoras";
        document.querySelector("label[for='in-ed1']").innerText = "Primeira Educadora *";
        document.querySelector("label[for='in-ed2']").innerText = "Segunda Educadora (Opcional)";
    } else if (genero === "masculino") {
        labelSingular = "Educador";
        labelPlural = "Educadores";
        document.querySelector("label[for='in-ed1']").innerText = "Primeiro Educador *";
        document.querySelector("label[for='in-ed2']").innerText = "Segundo Educador (Opcional)";
    } else {
        document.querySelector("label[for='in-ed1']").innerText = "Primeiro Educador/a *";
        document.querySelector("label[for='in-ed2']").innerText = "Segundo Educador/a (Opcional)";
    }

    if(ed2.trim() !== "") {
        labelEducadores.innerText = labelPlural + ":";
        outEd1.innerText = `${ed1.toUpperCase()} e ${ed2.toUpperCase()}`;
        containerEd2.innerHTML = "";
    } else {
        labelEducadores.innerText = labelSingular + ":";
        outEd1.innerText = ed1.toUpperCase();
        containerEd2.innerHTML = "";
    }

    document.getElementById('out-data').innerText = data;
    document.getElementById('out-horario').innerText = horario;

    // Trocar telas
    document.getElementById('setup-form').style.display = 'none';
    document.getElementById('card-resultado').style.display = 'flex';
});

// Função voltar
function voltar() {
    document.getElementById('card-resultado').style.display = 'none';
    document.getElementById('setup-form').style.display = 'block';
}

// Função baixar imagem
function baixarImagem() {
    const card = document.getElementById('capture-area');
    
    html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const image = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement('a');
        link.download = `convite-unibb-${Date.now()}.jpg`;
        link.href = image;
        link.click();
    });
}

// Função baixar PDF
function baixarPDF() {
    const card = document.getElementById('capture-area');

    html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", 0.9);

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("landscape", "pt", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
        pdf.save(`convite-unibb-${Date.now()}.pdf`);
    });
}
