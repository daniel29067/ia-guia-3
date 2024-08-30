let weight = new Array; 
let E;
let ERROR;
let desiredOutput = [1, 1, 1, -1];
const trueTable = [[1, 1, -1, -1], [1, -1, 1, -1]];
let response = [];
let counter;
let umbral = -1;
let perceptron;
let table = document.getElementById("resultTable");
const selectValue1=document.getElementById("valueV1");
const selectValue2=document.getElementById("valueV2");

function operation(index) {
    let sumproduct = (weight[0] * trueTable[0][index]) + (weight[1] * trueTable[1][index])
    let y = Math.tanh(sumproduct) - ERROR;
    if (y >= 0) {
        y = 1;
    } else {
        y = -1;
    }
    return y;
}

function operationTest(val1, val2) {
    let sumproduct = (weight[0] * val1) + (weight[1] * val2)
    let y = Math.tanh(sumproduct) - ERROR;
    
    if (y >= 0) {
        y = 1;
    } else {
        y = -1;
    }
    
    return y;
}

function validateValue(index, value) {

    let error = (desiredOutput[index] - value);
    if (error == 0) {
        return true;
    } else {
        return false;
    }
}

function weightRecalculate(index) {

    let Y = desiredOutput[index];
    let X1 = trueTable[0][index];
    let X2 = trueTable[1][index];
    weight[0] = weight[0] + (2 * E * Y * X1);
    weight[1] = weight[1] + (2 * E * Y * X2);
    ERROR = (ERROR + (2 * E * Y * umbral));

}

function viewResponse() {
    console.log("Response: ", response)
}

function viewWeight() {
    console.log("Weight: ", weight);
}

function useNeuralCase() {
    if (counter >= 1000) {
        perceptron = false;
        return;
    }
    counter++;
    estado = true;
    for (let i = 0; i < 4; i++) {
        let y = operation(i);
        if (validateValue(i, y) == false) {
            weightRecalculate(i);
            estado = false;
            response = [];
            break;
        }
        response.push(y);

    }
    if (estado == false) {
        useNeuralCase();
    }

    return;
}

function addRowResponse() {
    for (let i = 0; i < 4; i++) {
        let salida = (((Math.tanh(((weight[0] * trueTable[0][i]) + (weight[1] * trueTable[1][i]))) - ERROR)>=0))?1:0;
        table.insertRow(-1).innerHTML =
            '<tr><th scope="row" class="text-center">' + (i + 1) + '</th><td class="text-center">' + trueTable[0][i] + '</td><td class="text-center">' + weight[0] + '</td><td class="text-center">' + trueTable[1][i] + '</td><td class="text-center"> ' + weight[1] + '</td><td class="text-center">' + ERROR + '</td><td class="text-center">' + salida + '</td></tr>';
    }
}

function addRowError() {
    table.insertRow(-1).innerHTML =
        '<tr><th class="text-center" colspan="7">NO SE ENCONTRÓ VALORES</th></tr>';
}

function initializeValues() {
    counter = 0;
    weight = [];
    perceptron = true;
    weight.push(parseFloat(document.getElementById("W1").value));
    weight.push(parseFloat(document.getElementById("W2").value));
    E = parseFloat(document.getElementById("E").value)
    ERROR = parseFloat(document.getElementById("ERROR").value)
    clearLabelTestResponse();
}

function start() {
    initializeValues()
    useNeuralCase();
    if (table.rows.length > 0) {
        dropRowTable();
    }
    if (!perceptron) {
        addRowError();
        hiddenLabels();
        return;
    }
    addLabels();
    addRowResponse();
    addTestResponse();
    return;
}

function dropRowTable() {
    var rowCount = table.rows.length;
    for (let i = (rowCount - 1); i > 0; i--) {
        table.deleteRow(i);
    }
}

function addLabels() {
    var myCollapse = document.getElementById('labels');
    myCollapse.className=" .collapsing";
    myCollapse.style.display = 'block';
    myCollapse.setAttribute("data-bs-toggle","collapse");
    document.getElementById("nW1").innerHTML = weight[0];
    document.getElementById("nW2").innerHTML = weight[1];
    document.getElementById("nError").innerHTML = ERROR;
    document.getElementById("nCounter").innerHTML = counter;
}

function addTestResponse(){
    var myCollapse = document.getElementById('testResponse');
    myCollapse.className=" .collapsing";
    myCollapse.style.display = 'block';
    myCollapse.setAttribute("data-bs-toggle","collapse");
}

function hiddenLabels() {
    var myCollapse = document.getElementById('labels');
    myCollapse.style.display = 'none';
}



function testNewValue(){
    let v1=parseFloat(selectValue1.value);
    let v2=parseFloat(selectValue2.value);
    let response=operationTest(v1,v2);
    
    document.getElementById("response").value=response;
}

selectValue1.addEventListener('change', (event)=>{
    if(selectValue1.value!='' && selectValue2.value!=''){
        testNewValue(); 
    }
})

selectValue2.addEventListener("change", (event)=>{
    if(selectValue1.value!='' && selectValue2.value!=''){
        testNewValue();    
    }
})

function clearLabelTestResponse(){
    selectValue1.value='';
    selectValue2.value='';
}