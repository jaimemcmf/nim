function nimSum(arr) {
    let NimSum = arr[0]; 
    for(i=1; i<rows; i++){
        NimSum = NimSum ^ arr[i];
    }
    return NimSum;
}

function winner (gt, arr) {
    var cont=0;
    for(i=0; i<rows; i++){
        cont += arr[i];
    }
    if(gt == 'Default'){
        if(cont <= 1){
            console.log(turn + " has won!");
        }
    }else{
        if(cont <= 1){
            if(turn == 1) console.log("2 has won!");
            else console.log("1 has won");       
        }
    }
}

function getNextMove (gt, arr) {
    var move = [-1, -1];
    var i,j;
    for(i=0; i<rows; i++){
        arr2 = [...arr];
        for(j=0; j<arr[i]; j++){
            arr2[i] -= 1;
            console.log("nimSUm== " + nimSum(arr2) +" "+ i + " " + j + " " + rows);
            if(nimSum(arr2) == 0){
                move[0] = i;
                move[1] = j+1;
                return move;
            }
        }
    }
    return move;
}

function play(gt,arr) {
    move = getNextMove(gt, arr);
    arr[move[0]] -= move[1];
}

// Programçao dinamica

// Exercicio das pedras, guardar num array em que estados e possivel ganhar
// Apos isso, ver se é possivel chegar a alguma posiçao de vitoria atraves do estado atual
// Ver se estado é de vitoria caso a soma Nim seja 0
// Caso não haja nenhuma posição de vitoria possivel
// Escolher uma posição perdedora aleatoriamente

// ----------------------------------------------

// Kinda Pesquisa Exaustiva

// Para calcular um estado, começar na ultima/primeira linha, começar a remover elementos e verificar se
// conseguimos chegar a soma nim 0, na primeira situação que aconteça fazer essa jogada
// Caso não exista, escolher uma linha aleatoria(que nao esteja vazia) e tirar um numero aleatorio de elementos
// Sendo X o numero de elementos da linha e R o numero de elementos aleatorio R <= X