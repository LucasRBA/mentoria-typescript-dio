"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var apiKey;
let requestToken;
let username;
let password;
let sessionId;
let listId;
let logged = false;
var localApiKey;
let criarListaNome;
let criarListaDescricao;
let loginButton = document.getElementById('login-button');
let searchButton = document.getElementById('search-button');
let criarListaButton = document.getElementById('criar-lista-button');
let searchContainer = document.getElementById('search-container');
let loginContainer = document.getElementById('login-container');
let listCreateContainer = document.getElementById('list-create-container');
let listContainer = document.getElementById('list-container');
const INVISIBLE = "visually-hidden";
class HttpClient {
    static get({ url, method, body = null }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
loginButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let query = (document.getElementById('search').value);
    let listagemDeFilmes = yield procurarFilme(query);
    let ul = document.createElement('ul');
    ul.id = "lista";
    for (const item of listagemDeFilmes.results) {
        let li = document.createElement('li');
        let link = document.createElement('button');
        link.type = "button";
        link.classList.add("btn", "btn-primary", "btn-sm");
        link.addEventListener('click', () => adicionarFilmeNaLista(item.id, parseInt(listId ? listId : '1')));
        link.appendChild(document.createTextNode("+ Lista"));
        li.appendChild(document.createTextNode(item.original_title));
        li.appendChild(document.createTextNode(" - "));
        li.appendChild(link);
        li.classList.add("my-1");
        ul.appendChild(li);
    }
    searchContainer.appendChild(ul);
}));
criarListaButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarLista(criarListaNome, criarListaDescricao);
}));
function preencherSenha() {
    password = document.getElementById('senha').value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById('login').value;
    validateLoginButton();
}
function preencherApi() {
    globalThis.localApiKey = document.getElementById('api-key').value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && localApiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${localApiKey}`,
            method: "GET"
        });
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${localApiKey}`,
            method: "POST",
            body: {
                username: `${username}`,
                password: `${password}`,
                request_token: `${requestToken}`
            }
        });
        requestToken = result.request_token;
        carregar();
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${localApiKey}&request_token=${requestToken}`,
            method: "GET"
        });
        sessionId = result.session_id;
        localStorage.setItem("TMDBapiKey", apiKey ? apiKey : "");
        localStorage.setItem("TMDBsessionId", sessionId ? sessionId : "");
        if (sessionId) {
            searchButton.disabled = false;
        }
    });
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/search/movie?api_key=${localApiKey}&query=${query}`,
            method: "GET"
        });
        return result;
    });
}
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${localApiKey}&language=en-US`,
            method: "GET"
        });
        console.log(result);
    });
}
function preencherNomeLista() {
    criarListaNome = document.getElementById('criar-lista-nome').value;
    validateListCreateButton();
}
function preencherDescricaoLista() {
    criarListaDescricao = document.getElementById('criar-lista-descricao').value;
    validateListCreateButton();
}
function validateListCreateButton() {
    if (criarListaNome && criarListaDescricao) {
        criarListaButton.disabled = false;
    }
    else {
        criarListaButton.disabled = true;
    }
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list?api_key=${localApiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                name: nomeDaLista,
                description: descricao,
                language: "pt-br"
            }
        });
        listId = result.list_id;
        localStorage.setItem("TMDBlistId", listId ? listId : "");
        carregar();
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${localApiKey}&session_id=${sessionId}`,
            method: "POST",
            body: {
                media_id: filmeId
            }
        });
        carregar();
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get({
            url: `https://api.themoviedb.org/3/list/${listId}?api_key=${localApiKey}`,
            method: "GET"
        });
        return result;
    });
}
function montarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let listBody = document.getElementById('list-body');
        if (listBody) {
            listBody.innerHTML = "";
        }
        let listaDeFilmes = yield pegarLista();
        let title = document.createElement('div');
        title.id = "lista-filmes-title";
        let nomeLista = document.createElement('h5');
        nomeLista.appendChild(document.createTextNode(listaDeFilmes.name));
        title.appendChild(nomeLista);
        let descricaoLista = document.createElement('h6');
        descricaoLista.appendChild(document.createTextNode(listaDeFilmes.description));
        title.appendChild(descricaoLista);
        listBody.appendChild(title);
        let ul = document.createElement('ul');
        ul.id = "lista-filmes";
        for (const filme of listaDeFilmes.items) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(filme.original_title));
            ul.appendChild(li);
        }
        listBody.appendChild(ul);
    });
}
function carregar() {
    sessionId = localStorage.getItem("TMDBsessionId");
    apiKey = apiKey;
    if (sessionId && apiKey) {
        loginContainer.classList.add(INVISIBLE);
    }
    else {
        loginContainer.classList.remove(INVISIBLE);
    }
    listId = localStorage.getItem("TMDBlistId");
    if (listId) {
        montarLista();
        listCreateContainer.classList.add(INVISIBLE);
        searchContainer.classList.remove(INVISIBLE);
        listContainer.classList.remove(INVISIBLE);
    }
    else {
        listCreateContainer.classList.remove(INVISIBLE);
        searchContainer.classList.add(INVISIBLE);
        listContainer.classList.add(INVISIBLE);
    }
}
