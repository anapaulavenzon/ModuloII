"use strict";
const formulario = document.querySelector("#formulario-cadastro");
let inputData = document.querySelector("#input-data");
let inputDescricao = document.querySelector("#input-descricao");
let inputDetalhamento = document.querySelector("#input-detalhamento");
let tabelaLembretes = document.querySelector("#container-registros");
const myModal = new bootstrap.Modal("#transaction-modal");
const btnSair = document.querySelector("#button-logout");
let usuarioLogado = sessionStorage.getItem("usuarioLogado");
btnSair.addEventListener("click", sair);
document.addEventListener("DOMContentLoaded", () => {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar essa página!");
        window.location.href = "../index.html";
        return;
    }
    carregarLembretesUsuario();
});
formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    adicionarNovoLembrete();
});
function adicionarNovoLembrete() {
    let data = inputData.value;
    let descricao = inputDescricao.value;
    let detalhamento = inputDetalhamento.value;
    let lembrete = {
        data: data,
        descricao: descricao,
        detalhamento: detalhamento,
    };
    let listaLembretes = buscarLembretesNoStorage();
    let existe = listaLembretes.some((lembrete) => lembrete.data === data);
    if (existe) {
        alert("Já foi cadastrado um lembrete nesta data!");
        inputData.value = "";
        inputData.focus();
        return;
    }
    console.log(listaLembretes);
    listaLembretes.push(lembrete);
    console.log(listaLembretes);
    preencherTabela(lembrete);
    formulario.reset();
    salvarNoStorage(listaLembretes);
    myModal.hide();
}
function preencherTabela(lembrete) {
    let novaLinha = document.createElement("tr");
    let colunaData = document.createElement("td");
    let colunaDescricao = document.createElement("td");
    let colunaDetalhamento = document.createElement("td");
    let colunaAcoes = document.createElement("td");
    let botaoEditar = document.createElement("button");
    let botaoApagar = document.createElement("button");
    let lembreteData = lembrete.data;
    console.log(lembreteData);
    novaLinha.setAttribute("id", `${lembrete.data}`);
    novaLinha.setAttribute("class", "row registros");
    colunaData.setAttribute("class", "col-2 d-flex align-items-center justify-content-center");
    colunaDescricao.setAttribute("class", "col-3 d-flex align-items-center");
    colunaDetalhamento.setAttribute("class", "col-4");
    colunaAcoes.setAttribute("class", "col-2 offset-1 d-flex align-items-center");
    botaoEditar.setAttribute("class", "btn btn-success me-2");
    botaoEditar.setAttribute("type", "button");
    botaoEditar.addEventListener("click", () => editarLembrete(lembreteData));
    botaoApagar.setAttribute("class", "btn btn-danger");
    botaoApagar.setAttribute("type", "button");
    botaoApagar.addEventListener("click", () => apagarLembrete(lembreteData));
    colunaData.innerHTML = `<h3 class="fs-2 text-center">${lembrete.data}</h3>`;
    colunaDescricao.innerHTML = `<p class="fs-3">${lembrete.descricao}</p>`;
    colunaDetalhamento.innerHTML = `<p class="fs-5">${lembrete.detalhamento}`;
    botaoEditar.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30"
                                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            `;
    botaoApagar.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30"
                                    fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                </svg>
                            `;
    colunaAcoes.appendChild(botaoEditar);
    colunaAcoes.appendChild(botaoApagar);
    novaLinha.appendChild(colunaData);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaDetalhamento);
    novaLinha.appendChild(colunaAcoes);
    tabelaLembretes.appendChild(novaLinha);
}
function salvarNoStorage(listaLembretes) {
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return usuario.login === usuarioLogado;
    });
    listaUsuarios[indiceUsuarioLogado].lembretes = listaLembretes;
    //setItem no localStorage
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
}
function carregarLembretesUsuario() {
    //getItem
    let listaStorage = buscarLembretesNoStorage();
    if (listaStorage) {
        for (const lembrete of listaStorage) {
            preencherTabela(lembrete);
        }
    }
    return;
}
function apagarLembrete(data) {
    let listaLembretes = buscarLembretesNoStorage();
    let indiceEncontrado = listaLembretes.findIndex((lembrete) => lembrete.data === data);
    let confirma = confirm(`Você tem certeza que deseja excluir o lembrete de data ${data}?`);
    if (confirma) {
        let linhasTabela = document.querySelectorAll(".registros");
        for (let linha of linhasTabela) {
            if (linha.id == data) {
                console.log(linha);
                tabelaLembretes.removeChild(linha);
                listaLembretes.splice(indiceEncontrado, 1);
                alert("Registro removido!");
            }
        }
    }
    salvarNoStorage(listaLembretes);
    return;
}
function buscarLembretesNoStorage() {
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios"));
    let dadosUsuarioLogado = listaUsuarios.find((usuario) => {
        return usuario.login === usuarioLogado;
    });
    return dadosUsuarioLogado.lembretes;
}
function editarLembrete(data) {
    alert(`Editar recado ${data}?`);
}
function sair() {
    sessionStorage.removeItem("usuarioLogado");
    window.location.href = "../index.html";
}
