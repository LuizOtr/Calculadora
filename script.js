function inserDisplay(data) {
    document.querySelector('#display').value += data; // incremento de valor o sinal de += adiciona mais caracteres na tela
};

function cleanData() {
    document.querySelector('#display').value = ''; // apaga os dados da variavel data
};

function backSpace() {
    const display = document.querySelector('#display');
    display.value = display.value.slice(0, -1); // apaga o ultimo número - 'slice'= busque mais informações sobre ele
};

function clean_Memory() {
    localStorage.clear();
    cleanData();
    load_History()
};

function convert_str_to_numb() {
    const display = document.querySelector('#display');
    const expressao = display.value;
    let numeros = [];
    let operadores = [];
    let numeroAtual = "";
    for (let n = 0; n < expressao.length; n++) {
        const caracteres = expressao[n];
        const operadorValidos = ['+', '-', '*', '/'];
        if (operadorValidos.includes(caracteres)) {
            numeros.push(parseFloat(numeroAtual));
            operadores.push(caracteres);
            numeroAtual = "";
        } else {
            numeroAtual += caracteres
        }
    }
    numeros.push(parseFloat(numeroAtual));
    return { numeros, operadores };
}

function square_root() {
    const { numeros, operadores } = convert_str_to_numb();

    if (numeros.length === 0) {
        return;
    }

    const lastNumber = numeros.pop();
    const root = Math.sqrt(lastNumber);
    let newExpression = "";

    if (operadores.length > 0) {
        for (let n = 0; n < operadores.length; n++) {
            newExpression += numeros[n] + operadores[n];
        }
        newExpression += root;
        document.querySelector('#display').value = newExpression;

    } else {
        newExpression = root; 
        document.querySelector('#display').value = newExpression;
        const expressionString = `√(${lastNumber})`;
        save_results(expressionString, root);
    }
}

function calculate_Percentage(){
    const { numeros, operadores } = convert_str_to_numb();

    if (numeros.length === 0) {
        return; 
    }

    const lastNumber = numeros.pop();
    const percent = lastNumber / 100;
    
    let newExpression = "";

    if (operadores.length > 0) {        
        for (let n = 0; n < operadores.length; n++) {
            newExpression += numeros[n] + operadores[n];
        }
        newExpression += percent;
        document.querySelector('#display').value = newExpression;

    } else {        
        newExpression = percent; 
        document.querySelector('#display').value = newExpression;
        const expressionString = `${lastNumber}%`;
        save_results(expressionString, percent);
    }
}

function result() {
    const { numeros, operadores } = convert_str_to_numb();
    const operationsMap = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };

    let result = numeros[0];
    for (let n = 0; n < operadores.length; n++) {
        const operador = operadores[n];
        const nextNumber = numeros[n + 1];
        const calculationFunction = operationsMap[operador];
        result = calculationFunction(result, nextNumber);
    }
    result = parseFloat(result.toFixed(10));

    const expression = document.querySelector('#display').value;
    document.querySelector('#display').value = result;
    save_results(expression, result);
    console.log("Resultado final:", result);
    return result;
}

function save_results(expression, result) {
    try {
        const historyItem = `${expression}=${result}`;
        const historyArrayString = localStorage.getItem('calc_history');
        let historyArray = historyArrayString ? JSON.parse(historyArrayString) : [];
        historyArray.push(historyItem);
        const MAX_HISTORY_ITEMS = 13; 
        if (historyArray.length > MAX_HISTORY_ITEMS) {
            historyArray = historyArray.slice(historyArray.length - MAX_HISTORY_ITEMS);
        }
        localStorage.setItem('calc_history', JSON.stringify(historyArray));
        load_History();
    } catch (e) {
        console.error("Erro ao salvar histórico:", e);
    }
}

function load_History() {
    const listaDeHistorico = document.querySelector('#historico-lista');
    listaDeHistorico.innerHTML = '';
    const historyArrayString = localStorage.getItem('calc_history');
    const historyArray = historyArrayString ? JSON.parse(historyArrayString) : [];
    historyArray.forEach((item, index) => {
        const numeroSequencial = index + 1; 
        const novoItem = document.createElement('li');
        novoItem.textContent = `${numeroSequencial}: ${item}`;
        listaDeHistorico.appendChild(novoItem);
    });
    
    console.log(`Total de itens de histórico carregados: ${historyArray.length}`);
}

window.onload = load_History;





// observação sobre "eval" ao mesmo tempo que ele pode ser bom ele pode ser um desatre pois ele é extremamente inseguro
// cuide quando for usar ele se possivel evite até usar e use outras alternativas como:
//JSON.parse(): Para converter uma string de texto no formato JSON em um objeto JavaScript. É a forma segura de fazer o que eval() faria com um texto JSON.
//Notação de Colchetes (objeto[chave]): Para acessar dinamicamente a propriedade de um objeto. Em vez de eval('usuario.nome'), você usa usuario[nomeDaVariavel], onde nomeDaVariavel é uma string que contém "nome".