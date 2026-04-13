document.getElementById('form-card').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturar inputs
    const curso = document.getElementById('in-curso').value;
    const ed1 = document.getElementById('in-ed1').value;
    const ed2 = document.getElementById('in-ed2').value;
    const data = document.getElementById('in-data').value;
    const horario = document.getElementById('in-horario').value;

    // Injetar no card
    document.getElementById('out-curso').innerText = curso;

    const containerEd2 = document.getElementById('container-ed2');
    const outEd1 = document.getElementById('out-ed1');
    const labelEducadores = document.querySelector("#out-ed1").previousElementSibling; 
    // pega o <strong> que está antes do span out-ed1

    if(ed2.trim() !== "") {
        // Dois educadores → concatenados com "e"
        labelEducadores.innerText = "Educadores/as:";
        outEd1.innerText = `${ed1.toUpperCase()} e ${ed2.toUpperCase()}`;
        containerEd2.innerHTML = ""; // não precisamos mais de container separado
    } else {
        // Apenas um educador
        labelEducadores.innerText = "Educador/a:";
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

// Função baixar PDF (paisagem)
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
        const imgWidth = pageWidth;
        const imgHeight = canvas.height * pageWidth / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(`convite-unibb-${Date.now()}.pdf`);
    });
}
