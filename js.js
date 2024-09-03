class Perceptron {
    constructor() {
        this.weight = [];
        this.E = 0.6;
        this.ERROR = 0.6; // Valor inicial, se puede ajustar
        this.desiredOutput = [1, -1, -1, -1];
        this.trueTable = [[1, 1, -1, -1], [1, -1, 1, -1]];
        this.response = [];
        this.counter = 0;
        this.umbral = -1;
        this.perceptron = true;
        this.table = document.getElementById("resultTable");

        this.selectValue1 = document.getElementById("valueV1");
        this.selectValue2 = document.getElementById("valueV2");

        if (this.selectValue1 && this.selectValue2) {
            this.selectValue1.addEventListener('change', () => this.testNewValue());
            this.selectValue2.addEventListener('change', () => this.testNewValue());
        }
    }

    stepFunction(x) {
        return x >= 0 ? 1 : -1;
    }

    operation(index) {
        let sumproduct = (this.weight[0] * this.trueTable[0][index]) + (this.weight[1] * this.trueTable[1][index]);
        let x = Math.tanh(sumproduct - this.ERROR);
        return this.stepFunction(x);
    }

    operationTest(val1, val2) {
        let sumproduct = (this.weight[0] * val1) + (this.weight[1] * val2);
        let x = Math.tanh(sumproduct - this.ERROR);
        return this.stepFunction(x);
    }

    validateValue(index, value) {
        let error = (this.desiredOutput[index] - value);
        return error === 0;
    }

    weightRecalculate(index) {
        let Y = this.desiredOutput[index];
        let X1 = this.trueTable[0][index];
        let X2 = this.trueTable[1][index];
        this.weight[0] += (2 * this.E * Y * X1);
        this.weight[1] += (2 * this.E * Y * X2);
        this.ERROR += (2 * this.E * Y * this.umbral);
    }

    viewResponse() {
        console.log("Response: ", this.response);
    }

    viewWeight() {
        console.log("Weight: ", this.weight);
    }

    useNeuralCase() {
        if (this.counter >= 1000) {
            this.perceptron = false;
            return;
        }
        this.counter++;
        let estado = true;
        for (let i = 0; i < 4; i++) {
            let y = this.operation(i);
            if (!this.validateValue(i, y)) {
                this.weightRecalculate(i);
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

    addRowResponse() {
        for (let i = 0; i < 4; i++) {
            let x = Math.tanh(((this.weight[0] * this.trueTable[0][i]) + (this.weight[1] * this.trueTable[1][i])) - this.ERROR);
            let salida = this.stepFunction(x);
            this.table.insertRow(-1).innerHTML =
                `<tr><th scope="row" class="text-center">${i + 1}</th><td class="text-center">${this.trueTable[0][i]}</td><td class="text-center">${this.weight[0]}</td><td class="text-center">${this.trueTable[1][i]}</td><td class="text-center">${this.weight[1]}</td><td class="text-center">${this.ERROR}</td><td class="text-center">${salida}</td></tr>`;
        }
    }

    addRowError() {
        this.table.insertRow(-1).innerHTML =
            '<tr><th class="text-center" colspan="7">NO SE ENCONTRÓ VALORES</th></tr>';
    }

    initializeValues() {
        this.weight[0] = parseFloat((Math.random() * 2));
        this.weight[1] = parseFloat((Math.random() * 2));
        this.E = 0.6;
        this.ERROR = parseFloat((Math.random() * 2));

        document.getElementById("W1").value = this.weight[0];
        document.getElementById("W2").value = this.weight[1];
        document.getElementById("E").value = this.E;
        document.getElementById("ERROR").value = this.ERROR;

        this.counter = 0;
        this.perceptron = true;
        this.clearLabelTestResponse();
    }

    start() {
        this.initializeValues();
        this.useNeuralCase();
        if (this.table.rows.length > 0) {
            this.dropRowTable();
        }
        if (!this.perceptron) {
            this.addRowError();
            this.hiddenLabels();
            return;
        }
        this.addLabels();
        this.addRowResponse();
        this.addTestResponse();
        this.neurona();
    }

    dropRowTable() {
        let rowCount = this.table.rows.length;
        for (let i = rowCount - 1; i > 0; i--) {
            this.table.deleteRow(i);
        }
    }

    addLabels() {
        let myCollapse = document.getElementById('labels');
        myCollapse.className = ".collapsing";
        myCollapse.style.display = 'block';
        myCollapse.setAttribute("data-bs-toggle", "collapse");
        document.getElementById("nW1").innerHTML = this.weight[0];
        document.getElementById("nW2").innerHTML = this.weight[1];
        document.getElementById("nError").innerHTML = this.ERROR;
        document.getElementById("nCounter").innerHTML = this.counter;
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

    testNewValue() {
        if (this.selectValue1.value !== '' && this.selectValue2.value !== '') {
            let v1 = parseFloat(this.selectValue1.value);
            let v2 = parseFloat(this.selectValue2.value);
            let response = this.operationTest(v1, v2);
            document.getElementById("response").value = response;
        }
    }

    clearLabelTestResponse() {
        this.selectValue1.value = '';
        this.selectValue2.value = '';
    }
    
    /* PRUEBAS EN CONSOLA */
    neurona() {
        this.weight[0] = parseFloat((Math.random() * 2));
        this.weight[1] = parseFloat((Math.random() * 2));
        this.E = 0.6;
        this.ERROR = parseFloat((Math.random() * 2));
        this.response = [];
        let verifier = false;
        let mal = 0;
        let bien = 0;

        do {
            for (let x = 0; x < this.desiredOutput.length; x++) {
                console.log("entrada: ", x, " ===============================================");
                do {
                    this.response[x] = Math.tanh(((this.trueTable[0][x] * this.weight[0]) + (this.trueTable[1][x] * this.weight[1])) - this.ERROR);
                    this.response[x] = this.stepFunction(this.response[x]);

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
                        this.weight[0] += (2 * this.E * this.desiredOutput[x] * this.trueTable[0][x]);
                        this.weight[1] += (2 * this.E * this.desiredOutput[x] * this.trueTable[1][x]);
                        this.ERROR += (2 * this.E * this.desiredOutput[x] * -1);
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
            let prueba1 = parseFloat((Math.random() * 100) - 50);
            let prueba2 = parseFloat((Math.random() * 100) - 50);

            let prueba = Math.tanh(((prueba1 * this.weight[0]) + (prueba2 * this.weight[1])) - this.ERROR);
            prueba = this.stepFunction(prueba);
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
