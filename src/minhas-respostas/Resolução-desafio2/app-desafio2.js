"use strict";
var Profissao;
(function (Profissao) {
    Profissao[Profissao["Atriz"] = 0] = "Atriz";
    Profissao[Profissao["Padeiro"] = 1] = "Padeiro";
})(Profissao || (Profissao = {}));
let pessoa1 = {};
pessoa1.nome = "Maria";
pessoa1.idade = 29;
pessoa1.profissao = Profissao.Atriz;
let pessoa2 = {};
pessoa2.nome = "Roberto";
pessoa2.idade = 19;
pessoa2.profissao = Profissao.Padeiro;
let pessoa3 = {
    nome: "Laura",
    idade: 32,
    profissao: Profissao.Atriz
};
let pessoa4 = {
    nome: "Carlos",
    idade: 19,
    profissao: Profissao.Padeiro
};
console.log(`${pessoa1.nome} tem ${pessoa1.idade} anos e sua profissão é ${Profissao[pessoa1.profissao]}.`);
console.log(`${pessoa2.nome} tem ${pessoa2.idade} anos e sua profissão é ${Profissao[pessoa2.profissao]}.`);
console.log(`${pessoa3.nome} tem ${pessoa3.idade} anos e sua profissão é ${Profissao[0]}.`);
console.log(`${pessoa4.nome} tem ${pessoa4.idade} anos e sua profissão é ${Profissao[1]}.`);
