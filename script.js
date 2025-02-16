// Função para carregar os códigos do CSV e converter em um array
/*async function carregarCodigosCSV() {
    try {
        const response = await fetch("testecsv1.csv");
        const data = await response.text();
        return data.split("\n").map(codigo => codigo.trim());
    } catch (error) {
        console.error("Erro ao carregar os códigos:", error);
        return [];
    }
}

// Função para buscar um código específico no CSV
async function buscarCodigo() {
    const codigosValidos = await carregarCodigosCSV();
    let codigoUsuario = document.getElementById("codigo").value.trim().toUpperCase();
    let resultado = document.getElementById("resultado");

    if (codigoUsuario === "") {
        resultado.innerHTML = "⚠️ Por favor, insira um código.";
        resultado.style.color = "orange";
        return;
    }

    if (codigosValidos.includes(codigoUsuario)) {
        resultado.innerHTML = "✅ Certificado válido!";
        resultado.style.color = "green";
    } else {
        resultado.innerHTML = "❌ Certificado inválido!";
        resultado.style.color = "red";
    }
}

// Adicionar evento ao botão de busca
document.getElementById("buscar").addEventListener("click", buscarCodigo);

//Evento para botão enter funcionar
document.getElementById("codigo").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita que a página seja recarregada (caso esteja dentro de um form)
        buscarCodigo(); // Chama a função de validação
    }
})*/


document.addEventListener("DOMContentLoaded", function () {
    const inputCodigo = document.getElementById("codigo");
    const botaoBuscar = document.getElementById("buscar");
    const resultadoDiv = document.getElementById("resultado");

    // Verifica se os elementos existem antes de adicionar eventos
    if (inputCodigo && botaoBuscar && resultadoDiv) {
        
        // Permitir validação ao pressionar Enter
        inputCodigo.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                buscarCodigo();
            }
        })

        // Evento de clique no botão
        botaoBuscar.addEventListener("click", buscarCodigo);

        async function buscarCodigo() {
            const codigoDigitado = inputCodigo.value.trim().toUpperCase();

            // Se o usuário não inserir um código, mostrar aviso
            if (codigoDigitado === "") {
                resultadoDiv.innerHTML = "<p style='color: red;'>⚠️ Por favor, insira um código de validação.</p>";
                return;
            }

            try {
                const response = await fetch("dadoscsv1.csv"); // Carregar CSV
                const data = await response.text();
                const linhas = data.split("\n").map(linha => linha.trim()).filter(linha => linha); // Remover espaços extras

                let certificadoValido = false;
                let nome = "";
                let cpf = "";

                for (let i = 1; i < linhas.length; i++) { // Ignorar cabeçalho
                    let colunas = linhas[i].includes(";") ? linhas[i].split(";") : linhas[i].split(","); // Aceitar diferentes separadores CSV

                    if (colunas.length >= 3) {
                        let codigo = colunas[0].trim();
                        let cpfEncontrado = colunas[1].trim();
                        let nomeEncontrado = colunas[2].trim();

                        if (codigo === codigoDigitado) {
                            certificadoValido = true;
                            nome = nomeEncontrado;
                            cpf = cpfEncontrado;
                            break;
                        }
                    }
                }

                if (certificadoValido) {
                    resultadoDiv.innerHTML = `
                        <p style='color: green;'>✅ Certificado Válido</p>
                        <p><strong>Nome:</strong> ${nome}</p>
                        <p><strong>CPF:</strong> ${cpf}</p>
                    `;
                } else {
                    resultadoDiv.innerHTML = "<p style='color: red;'>❌ Código inválido</p>";
                }
            } catch (error) {
                resultadoDiv.innerHTML = "<p style='color: red;'>Erro ao carregar os dados.</p>";
                console.error("Erro ao buscar CSV:", error);
            }
        }
    } else {
        console.error("Erro: Elementos HTML não encontrados.");
    }
})
