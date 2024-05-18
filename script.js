const ITEMS_PER_PAGE = 9;
const allAtivos = {};
let currentPage = 1;

function mostrarAtivos() {
    fetch("https://controle-de-ativos-spv-default-rtdb.firebaseio.com/Ativos_Cadastrados.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha na solicitação');
            }
            return response.json();
        })
        .then(data => {
            Object.assign(allAtivos, data);
            const totalCount = Object.keys(allAtivos).length;
            document.getElementById('total-count').innerText = `Total de itens cadastrados: ${totalCount}`;
            exibirAtivosPorPagina(currentPage);
        })
        .catch(error => {
            console.error('Erro ao buscar ativos:', error);
        });
}

function exibirAtivosPorPagina(page, ativos = allAtivos) {
    const column1 = document.getElementById("column1");
    const column2 = document.getElementById("column2");
    const column3 = document.getElementById("column3");
    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";

    const keys = Object.keys(ativos);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(page * ITEMS_PER_PAGE, keys.length);
    let i = startIndex;

    for (i; i < endIndex; i++) {
        const key = keys[i];
        const ativo = ativos[key];
        const listItem = document.createElement("div");
        listItem.classList.add("list-item", "card");
        listItem.innerHTML = `
            <div class="card-content">
                <p class="title is-5"><strong>Nome:</strong> ${ativo.nome}</p>
                <p class="subtitle is-6"><strong>Descrição:</strong> ${ativo.descricao}</p>
                <p class="subtitle is-6"><strong>Plaqueta:</strong> ${ativo.etiqueta}</p>
                <p class="subtitle is-6"><strong>Local:</strong> ${ativo.local}</p>
                <p class="subtitle is-6"><strong>Sublocalização:</strong> ${ativo.sublocalizacao}</p>
            </div>
            <div class="card-image">
                <figure class="image is-4by3">
                    <img src="${ativo.imageURL}" alt="${ativo.descricao}">
                </figure>
                <br/>
                <a href="${ativo.imageURL}" target="_blank" class="button is-link is-fullwidth">ver imagem</a>
            </div>
        `;
        if (i % 3 === 0) {
            column1.appendChild(listItem);
        } else if (i % 3 === 1) {
            column2.appendChild(listItem);
        } else {
            column3.appendChild(listItem);
        }
    }
    document.getElementById("page-num").innerText = `Página ${page}`;
}

function buscarAtivos(event) {
    event.preventDefault();
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const ativosFiltrados = Object.keys(allAtivos).reduce((filtered, key) => {
        const ativo = allAtivos[key];
        const nome = ativo.nome?.toLowerCase() || "";
        const descricao = ativo.descricao?.toLowerCase() || "";
        const etiqueta = ativo.etiqueta?.toLowerCase() || "";
        // Verifica se o termo de busca está presente no nome, na etiqueta ou na descrição
        if (nome.includes(searchInput) || etiqueta.includes(searchInput) || descricao.includes(searchInput)) {
            filtered[key] = ativo;
        }
        return filtered;
    }, {});

    exibirAtivosPorPagina(1, ativosFiltrados);
}

function limparBusca() {
    document.getElementById("search-input").value = "";
    exibirAtivosPorPagina(1);
}

function nextPage() {
    const totalPages = Math.ceil(Object.keys(allAtivos).length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        exibirAtivosPorPagina(currentPage);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        exibirAtivosPorPagina(currentPage);
    }
}

window.onload = mostrarAtivos;

document.getElementById("search-form").addEventListener("submit", buscarAtivos);
document.getElementById("clear-button").addEventListener("click", limparBusca);
document.getElementById("next-page").addEventListener("click", nextPage);
document.getElementById("prev-page").addEventListener("click", prevPage);
