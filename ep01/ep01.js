/*

    EP01 - Pescaria

    Primeiro exercício programa de MAC0420/MAC5744.

    Nome: Lucas Moretto da Silva
    NUSP: 9778602

*/

window.onload = main;

// ==================================================================
// Constantes globais

// dimensões do fundo Mar x Areia
const AREIA_ALT = 0.30;
// a altura do mar é 2.0 - AREIA_ALT

// dos peixes
const PEIXE_MIN_SIZE = 0.03; // raio mínimo
const PEIXE_MAX_SIZE = 0.08;
const PEIXE_NUM_TIPOS = 3; // 4, 8 e 16 vértices.
const PEIXES_NUM = 16; // qtd inicial de peixes

// a bolha que pega os peixes
const BOLHA_SIZE = 0.02; // lado do quadrado Bolha
const BOLHA_VELY = 0.03;

// o arpão que lança as bolhas
const ARPAO_BASE = 0.05;
const ARPAO_ALT = 0.15;
const ARPAO_VEL = 0.02;

// CORES
const AGUA = "rgba(145,185,255,1.0)";
const PRAIA = "rgba(200,250, 20,1.0)";

// ==================================================================
// Variáveis globais para o canvas
var ctx;

//==================================================================
// função principal

function main() {

    const canvas = document.getElementById('meucanvas');
    ctx = canvas.getContext('2d');
    if (!ctx) alert("Não consegui abrir o contexto 2d :-( ");
}
