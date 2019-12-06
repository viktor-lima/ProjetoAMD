// terminar as métricas :
// tempo médio de atendimento = 1 / mi
// média de clientes no sistema = lambda / (mi - lambda)
// média de clientes na fila = mi² /  mi * (mi - lambda)

// talvez consertar as outras métricas:
//Tempo médio de permanencia no sistema = 1 / (mi - lambda)
// tempo médio de permanencia na fila = lambda / mi * (mi - lambda)

// lambda = quantidade de pacotes / tempo
// mi = 1 / quantidade atendida

// média aritmética
// tempo médio de atendimento = soma dos tempos de download / tempo
// media de clientes no sistema = contador de clientes / tempo
// media de clientes na fila = contador de clientes na fila (fila.length?) / tempo
// fila.length? pq pode ser que isso continue contando mesmo que saia da fila
// esse tempo é variável também
// pq 1 minuto, 2 minutos, ou 60 seg, ou 120 seg
// a cada minuto o tempo tem que acrescentar
// pode ser feito do jeito que os meninos fizeram
// cria uma variável tempoInicial e uma tempoAtual que vai ser um new date a cada minuto

class Tipo {
    constructor() {
        this.tamanho = 0
    }
}

class Arquivo extends Tipo {
    constructor(tamanho) {
        super(tamanho);
    }
}

class Multimidia extends Tipo {
    constructor(tamanho) {
        super(tamanho);
    }
}

const fila = [];
const atendidos = []
let cont = 0
let contPacotes = 0
let contArquivo = 1
let contMultimidia = 1
var paraFila
var paraAtendidos
var paraExibePacoteAtual
var paraAddPacote
var paraTempoSistema
var paraTempoFila
let mediaTempo = 0;
let mediaFila = 0;
let somaFila = 0;
var somaSistema = 0;
var mediaSistema = 0;
let _horaInicial;

class Pacote {
    constructor(nome, prioridade, tempoFila, tempoDownload, tempoSistema, tipo, tamanho) {
        this.nome = '';
        this.prioridade = false;
        this.tempoFila = null;
        this.tempoInicialFila = null;
        this.tempoFinalFila = null;
        this.tempoDownload = 0;
        this.tempoSistema = 0;
        this.tipo = null;
        this.tamanhoInicial = 0;
        this.tamanho = 0;
        this.t0 = 0;
        this.t1 = 0;

        // saber se vai ser atendido de primeira
        this.senha = 0;

    }

    static addPacote() {

        let quantidadePct = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < quantidadePct; i++) {
            let p = new Pacote()
            let chance = Math.floor(Math.random() * 3)

            //p.senha = chance

            if (chance == 0) {
                p.senha = 0
                p.prioridade = true
                p.tipo = new Multimidia()
                p.nome = 'M' + contMultimidia++
                p.tamanhoInicial = Math.floor((Math.random() * 11) + 1)
                p.tamanho = p.tamanhoInicial

            } else {
                p.senha = 2
                p.tipo = new Arquivo();
                p.nome = 'A' + contArquivo++
                p.tamanhoInicial = Math.floor((Math.random() * 5) + 1);
                p.tamanho = p.tamanhoInicial
            }
            // if (fila.length >= 5) {
            //     setTimeout('this.addPacote()', 1000)
            //     alert('fodeu')
            // }
            p.tempoInicialFila = new Date()
            p.t0 = p.tempoInicialFila.getTime()
            if (p.prioridade) {
                let indice = 0
                for (var j = 0; j < fila.length; j++) {
                    if (!fila[j].prioridade) {
                        indice = fila.indexOf(fila[j])
                    }
                }
                if (indice != 0) {
                    fila.splice(indice, 0, p)
                }
            } else {
                //p.tempoInicialFila = new Date();
                fila.push(p)
            }
            contPacotes++
        }
    }
}

function download() {
    var form = document.getElementById('formulario');
    var intervalo = document.getElementById('intervalo').value
    var velocidade = document.getElementById('velocidade').value

    form.addEventListener('submit', function (e) {
        // impede o envio do form
        e.preventDefault();
    });

    if (fila[0].prioridade === false) {
        if (fila[0].senha === 1) {
            for (var i = 0; i < intervalo; i++) {
                if (fila[0].tamanho > 0) {
                    fila[0].tempoDownload += 1000
                    fila[0].tamanho -= velocidade
                }
            }
            if (fila[0].tamanho > 0) {
                fila.push(fila.shift())
            } else {
                fila[0].tamanho = 0
                fila[0].tempoFinalFila = new Date();
                fila[0].t1 = fila[0].tempoFinalFila.getTime()
                fila[0].tempoSistema = fila[0].t1 - fila[0].t0
                atendidos.push(fila.shift())
                // console.log(atendidos)
            }

        } else {
            fila[0].senha = 1
            fila.push(fila.shift())
        }
    }

    for (var i = 0; i < intervalo; i++) {
        if (fila[0].tamanho > 0) {
            fila[0].tempoDownload += 1000
            fila[0].tamanho -= velocidade
        }
    }
    if (fila[0].tamanho > 0) {
        fila.push(fila.shift())
    } else {
        fila[0].tamanho = 0
        fila[0].tempoFinalFila = new Date();
        fila[0].t1 = fila[0].tempoFinalFila.getTime()
        fila[0].tempoSistema = fila[0].t1 - fila[0].t0
        atendidos.push(fila.shift())
        // console.log(atendidos)
    }
}

// function calculaMediaTempoSistema() {
//     for (var i = 0; i < atendidos.length; i++) {
//         somaSistema += atendidos[i].tempoSistema
//     }

//     mediaSistema = ((somaSistema / atendidos.length) / 1000).toFixed(2)

//     var teste = document.getElementById('tempoSistema');
//     teste.innerHTML = mediaSistema
// }

// function calculaMediaTempoFila() {

//     var tempo = new Date()
//     tempo = tempo.getTime()

//     for (var i = 0; i < fila.length; i++) {
//         fila[i].tempoSistema = (tempo - fila[i].t0) - fila[i].tempoDownload
//         somaFila += fila[i].tempoFila
//     }
//     for (var i = 0; i < atendidos.length; i++) {
//         somaFila += atendidos[i].tempoSistema - atendidos[i].tempoDownload
//     }
//     tamanho = fila.length + atendidos.length

//     mediaFila = ((somaFila / tamanho) / 1000).toFixed(2)

//     var teste = document.getElementById('tempoFila');
//     teste.innerHTML = mediaFila
// }

function exibeFila() {
    var teste;
    var text;
    document.getElementById('showFila').innerHTML = null;
    for (var i = 0; i < fila.length; i++) {
        teste = document.getElementById('showFila');
        text = document.createTextNode(" " + fila[i].nome + " . " + fila[i].tamanho + "MB |");
        teste.appendChild(text);
    }
    paraFila = setTimeout('exibeFila();', 500);
}

function exibeAtendidos() {
    var teste;
    var text;
    document.getElementById('showAtendidos').innerHTML = null;
    for (var i = 0; i < atendidos.length; i++) {
        teste = document.getElementById('showAtendidos');
        text = document.createTextNode(atendidos[i].nome + " . " + atendidos[i].tamanhoInicial + "MB |");
        teste.appendChild(text);
    }
}

function exibePacoteAtual() {
    var teste;
    var text;
    document.getElementById('pacoteAtual').innerHTML = null;
   
    teste = document.getElementById('pacoteAtual');
    text = document.createTextNode(fila[0].nome + " . " + fila[0].tamanho + "MB");
    teste.appendChild(text);
}

function horaInicial() {
    _horaInicial = new Date().getTime()
}

function metricas() {

    // tempo médio de atendimento = 1 / mi
    // média de clientes no sistema = lambda / (mi - lambda)
    // média de clientes na fila = mi² /  mi * (mi - lambda)

    // talvez consertar as outras métricas:
    //Tempo médio de permanencia no sistema = 1 / (mi - lambda)
    // tempo médio de permanencia na fila = lambda / mi * (mi - lambda)

    var _horaAtual = new Date().getTime()

    var minuto = _horaAtual - _horaInicial
    minuto = Math.round((minuto/1000)/60)

    lambda = contPacotes / minuto

    mi = atendidos.length / minuto

    var tempoMedioAtendimento = 1 / mi

    var stats = document.getElementById('tempoAtendimento'); // tempo medio de atendimento
    stats.innerHTML = tempoMedioAtendimento.toFixed(2)

    var tempoMedioSistema = 1 / (mi - lambda)

    var stats2 = document.getElementById('tempoSistema');  //tempo medio de sistema
    stats2.innerHTML = tempoMedioSistema.toFixed(2)

    var tempoMedioFila = lambda / (mi * (mi - lambda))

    var stats3 = document.getElementById('tempoFila'); // tempo medio de fila
    stats3.innerHTML = tempoMedioFila.toFixed(2)

    var mediaPacotesSistema = lambda / (mi - lambda)

    var stats4 = document.getElementById('mediaPacotesSistema'); //media de pacotes no sistema
    stats4.innerHTML = mediaPacotesSistema.toFixed(2)

    var mediaPacotesFila = (mi * mi) / (mi * (mi - lambda))

    var stats5 = document.getElementById('mediaPacotesFila'); //media de pacotes na fila
    stats5.innerHTML = mediaPacotesFila.toFixed(2)

    console.log(_horaInicial)
    console.log(_horaAtual)
    console.log(minuto)
    console.log(contPacotes)
    console.log(lambda)
    console.log(atendidos.length)
    console.log(mi)
    console.log(tempoMedioAtendimento)
    console.log(tempoMedioSistema)
    console.log(tempoMedioFila)
    console.log(mediaPacotesFila)
    console.log(mediaPacotesSistema)
}

function execucao(p) {
    var form = document.getElementById('formulario');
    var intervalo = document.getElementById('intervalo').value * 1000

    form.addEventListener('submit', function (e) {
        // impede o envio do form
        e.preventDefault();
    });
    
    paraAddPacote = setInterval(() => {
        Pacote.addPacote()
    }, intervalo)
    
    exibeFila()
    
    horaInicial()

    paraAtendidos = setInterval(() => {
        exibeAtendidos()
    }, intervalo)

    paraExibePacoteAtual = setInterval(() => {
        exibePacoteAtual()
    }, intervalo)

    setInterval(() => {
        metricas()
    }, 60000)

    // paraTempoSistema = setInterval(() => {
    //     calculaMediaTempoSistema()
    // }, 5000)

    setInterval(() => {
        download()
    }, intervalo)
}

function paraSistema() {

    clearTimeout(paraFila);
    clearInterval(paraAddPacote)
    clearInterval(paraAtendidos);
    clearInterval(paraExibePacoteAtual);
    clearInterval(paraTempoFila)
    clearInterval(paraTempoSistema);

}

// console.log(atendidos.length);


