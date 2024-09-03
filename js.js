// Clase para manejar operaciones básicas del perceptrón
class Operation {
    constructor(perceptron) {
        this.perceptron = perceptron;
    }

    stepFunction(x) {
        return x > 0 ? 1 : -1;
    }

    operation(index) {
        let sumproduct = (this.perceptron.weight[0] * this.perceptron.trueTable[0][index]) +
                         (this.perceptron.weight[1] * this.perceptron.trueTable[1][index]);
        let x = Math.tanh(sumproduct - this.perceptron.ERROR);
        return this.stepFunction(x);
    }

    operationTest(val1, val2) {
        let sumproduct = (this.perceptron.weight[0] * val1) + (this.perceptron.weight[1] * val2);
        let x = Math.tanh(sumproduct - this.perceptron.ERROR);
        return this.stepFunction(x);
    }
}

// Clase para actualizar los pesos
class WeightUpdater {
    constructor(perceptron) {
        this.perceptron = perceptron;
    }

    weightRecalculate(index) {
        let Y = this.perceptron.desiredOutput[index];
        let X1 = this.perceptron.trueTable[0][index];
        let X2 = this.perceptron.trueTable[1][index];
        this.perceptron.weight[0] += (2 * this.perceptron.E * Y * X1);
        this.perceptron.weight[1] += (2 * this.perceptron.E * Y * X2);
        this.perceptron.ERROR += (2 * this.perceptron.E * Y * this.perceptron.umbral);
    }
}

// Clase para manejar la tabla de resultados
class TableHandler {
    constructor() {
        this.table = document.getElementById("resultTable");
    }

    addRowResponse(weight, trueTable, ERROR, response) {
        for (let i = 0; i < 4; i++) {
            let x = Math.tanh(((weight[0] * trueTable[0][i]) + (weight[1] * trueTable[1][i])) - ERROR);
            let salida = response[i];
            this.table.insertRow(-1).innerHTML =
                `<tr><th scope="row" class="text-center">${i + 1}</th><td class="text-center">${trueTable[0][i]}</td><td class="text-center">${weight[0]}</td><td class="text-center">${trueTable[1][i]}</td><td class="text-center">${weight[1]}</td><td class="text-center">${ERROR}</td><td class="text-center">${salida}</td></tr>`;
        }
    }

    addRowError() {
        this.table.insertRow(-1).innerHTML =
            '<tr><th class="text-center" colspan="7">NO SE ENCONTRÓ VALORES</th></tr>';
    }

    dropRowTable() {
        let rowCount = this.table.rows.length;
        for (let i = rowCount - 1; i > 0; i--) {
            this.table.deleteRow(i);
        }
    }
}

// Clase para manejar las interacciones de la interfaz de usuario
class UIHandler {
    constructor(perceptron) {
        this.perceptron = perceptron;
        this.selectValue1 = document.getElementById("valueV1");
        this.selectValue2 = document.getElementById("valueV2");

        if (this.selectValue1 && this.selectValue2) {
            this.selectValue1.addEventListener('change', () => this.testNewValue());
            this.selectValue2.addEventListener('change', () => this.testNewValue());
        }
    }

    testNewValue() {
        if (this.selectValue1.value !== '' && this.selectValue2.value !== '') {
            let v1 = parseFloat(this.selectValue1.value);
            let v2 = parseFloat(this.selectValue2.value);
            let response = this.perceptron.operationTest(v1, v2);
            document.getElementById("response").value = response;
        }
    }

    clearLabelTestResponse() {
        this.selectValue1.value = '';
        this.selectValue2.value = '';
    }

    addLabels(weight, ERROR, counter) {
        let myCollapse = document.getElementById('labels');
        myCollapse.className = ".collapsing";
        myCollapse.style.display = 'block';
        myCollapse.setAttribute("data-bs-toggle", "collapse");
        document.getElementById("nW1").innerHTML = weight[0];
        document.getElementById("nW2").innerHTML = weight[1];
        document.getElementById("nError").innerHTML = ERROR;
        document.getElementById("nCounter").innerHTML = counter;
    }

    addTestResponse() {
        let myCollapse = document.getElementById('testResponse');
        myCollapse.className = ".collapsing";
        myCollapse.style.display = 'block';
        myCollapse.setAttribute("data-bs-toggle", "collapse");
    }

    hiddenLabels() {
        let myCollapse = document.getElementById('labels');
        myCollapse.style.display = 'none';
    }
}

// Clase principal
class Perceptron {
    constructor() {
        this.weight = [Math.random() * 2, Math.random() * 2];
        this.E = 0.6;
        this.ERROR = Math.random() * 2; // Valor inicial, se puede ajustar
        this.desiredOutput = [1, -1, -1, -1];
        this.trueTable = [[1, 1, -1, -1], [1, -1, 1, -1]];
        this.response = [];
        this.counter = 0;
        this.umbral = -1;
        this.perceptron = true;
        this.tableHandler = new TableHandler();
        this.operation = new Operation(this);
        this.weightUpdater = new WeightUpdater(this);
        this.uiHandler = new UIHandler(this);
    }

    operationTest(val1, val2) {
        let sumproduct = (this.weight[0] * val1) + (this.weight[1] * val2);
        let x = Math.tanh(sumproduct - this.ERROR);
        return this.stepFunction(x);
    }

    stepFunction(x) {
        return x >= 0 ? 1 : -1;
    }

    validateValue(index, value) {
        let error = (this.desiredOutput[index] - value);
        return error === 0;
    }

    useNeuralCase() {
        if (this.counter >= 1000) {
            this.perceptron = false;
            return;
        }
        this.counter++;
        let estado = true;
        for (let i = 0; i < 4; i++) {
            let y = this.operation.operation(i);
            if (!this.validateValue(i, y)) {
                this.weightUpdater.weightRecalculate(i);
                estado = false;
                this.response = [];
                break;
            }
            this.response.push(y);
        }
        if (!estado) {
            this.useNeuralCase();
        }
    }

    initializeValues() {
        this.weight[0] = Math.random() * 2;
        this.weight[1] = Math.random() * 2;
        this.E = 0.6;
        this.ERROR = Math.random() * 2;

        document.getElementById("W1").value = this.weight[0];
        document.getElementById("W2").value = this.weight[1];
        document.getElementById("E").value = this.E;
        document.getElementById("ERROR").value = this.ERROR;

        this.counter = 0;
        this.perceptron = true;
        this.uiHandler.clearLabelTestResponse();
    }

    start() {
        this.initializeValues();
        this.useNeuralCase();
        if (this.tableHandler.table.rows.length > 0) {
            this.tableHandler.dropRowTable();
        }
        if (!this.perceptron) {
            this.tableHandler.addRowError();
            this.uiHandler.hiddenLabels();
            return;
        }
        this.uiHandler.addLabels(this.weight, this.ERROR, this.counter);
        this.tableHandler.addRowResponse(this.weight, this.trueTable, this.ERROR, this.response);
        this.uiHandler.addTestResponse();
        this.neurona();
    }

    neurona() {
        let verifier = false;
        let mal = 0;
        let bien = 0;

        do {
            for (let x = 0; x < this.desiredOutput.length; x++) {
                console.log("entrada: ", x, " ===============================================");
                do {
                    this.response[x] = this.operation.operation(x);
                    console.log("response: ", this.response[x]);
                    console.log("output: ", this.desiredOutput[x]);

                    if (this.response[x] == this.desiredOutput[x]) {
                        if (this.response[0] == this.desiredOutput[0] &&
                            this.response[1] == this.desiredOutput[1] &&
                            this.response[2] == this.desiredOutput[2] &&
                            this.response[3] == this.desiredOutput[3]) {
                            verifier = true;
                        }
                    } else {
                        this.weightUpdater.weightRecalculate(x);
                        console.log(false);
                    }
                } while (this.response[x] != this.desiredOutput[x]);
            }
            console.log("==================================");
        } while (!verifier);

        for (let i = 0; i < this.response.length; i++) {
            console.log("response[", i, "]= ", this.response[i]);
        }

        for (let j = 0; j <= 1000; j++) {
            let prueba1 = Math.random() * 100 - 50;
            let prueba2 = Math.random() * 100 - 50;

            let prueba = this.operation.operationTest(prueba1, prueba2);
            if (prueba >= 0) {
                if (prueba1 >= 0 && prueba2 >= 0) {
                    console.log("bien= ", prueba);
                    bien++;
                } else {
                    console.log("mal= ", prueba);
                    mal++;
                }
            } else {
                if (prueba1 <= 0 && prueba2 <= 0) {
                    console.log("bien= ", prueba);
                    bien++;
                } else if (prueba1 >= 0 && prueba2 <= 0) {
                    console.log("bien= ", prueba);
                    bien++;
                } else if (prueba1 <= 0 && prueba2 >= 0) {
                    console.log("bien= ", prueba);
                    bien++;
                } else {
                    console.log("mal= ", prueba);
                    mal++;
                }
            }
        }

        console.log("=============== FIN ===================");
        console.log("errores: ", mal);
        console.log("logros: ", bien);
        let porcentajeDeError = (mal / 1000) * 100;
        console.log("Porcentaje de error: ", porcentajeDeError.toFixed(2), "%");
    }
}

const perceptron = new Perceptron();

document.getElementById("startButton").addEventListener('click', () => {
    perceptron.start();
});
