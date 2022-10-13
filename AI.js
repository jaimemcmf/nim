function nimSum(arr) {
    let NimSum = arr[0];
    for (i = 1; i < rows; i++) {
        NimSum = NimSum ^ arr[i];
    }
    return NimSum;
}

function winner(gt, arr) {
    var cont = 0;
    for (i = 0; i < rows; i++) {
        cont += arr[i];
    }
    if (gt == 'Default') {
        if (cont <= 1) {
            console.log(turn + " has won!");
            return true;
        }
    } else {
        if (cont <= 1) {
            if (turn == 1) console.log("1 has won!");
            else console.log("2 has won");
            return true;
        }
    }
    return false;
}

function getNextMove(gt, arr) {
    var move = [-1, -1];
    var i, j;
    for (i = 0; i < rows; i++) {
        arr2 = [...arr];
        for (j = 0; j < arr[i]; j++) {
            arr2[i] -= 1;
            //console.log("nimSUm== " + nimSum(arr2) + " " + i + " " + j + " " + rows);
            if (nimSum(arr2) == 0) {
                move[0] = i;
                move[1] = j + 1;
                return move;
            }
        }
    }
    return move;
}

function play(gt, arr, dif) {
    if(dif == "Impossible"){
    move = getNextMove(gt, arr);
    console.log(move);
    if (move[0] != -1) arr[move[0]] -= move[1];
    else {
        console.log("Randomizing");
        randRow = Math.floor(Math.random() * rows);
        while (arr[randRow] == 0) {
            randRow = Math.floor(Math.random() * rows);
        }
        arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
    }
    }else if(dif == "Easy"){
        console.log("Randomizing");
        randRow = Math.floor(Math.random() * rows);
        while (arr[randRow] == 0) {
            randRow = Math.floor(Math.random() * rows);
        }
        arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
    }else if(dif == "Average"){
        var chance = Math.random();
        if(chance < 0.3){
            move = getNextMove(gt, arr);
            console.log(move);
            if (move[0] != -1) arr[move[0]] -= move[1];
            else {
                console.log("Randomizing");
                randRow = Math.floor(Math.random() * rows);
                while (arr[randRow] == 0) {
                    randRow = Math.floor(Math.random() * rows);
                }
                arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
            }
        }else{
        console.log("Randomizing");
        randRow = Math.floor(Math.random() * rows);
        while (arr[randRow] == 0) {
            randRow = Math.floor(Math.random() * rows);
        }
        arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
        }
    }else if(dif == "Hard"){
        var chance = Math.random();
        if(chance < 0.60){
            move = getNextMove(gt, arr);
            console.log(move);
            if (move[0] != -1) arr[move[0]] -= move[1];
            else {
                console.log("Randomizing");
                randRow = Math.floor(Math.random() * rows);
                while (arr[randRow] == 0) {
                    randRow = Math.floor(Math.random() * rows);
                }
                arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
            }
        }else{
        console.log("Randomizing");
        randRow = Math.floor(Math.random() * rows);
        while (arr[randRow] == 0) {
            randRow = Math.floor(Math.random() * rows);
        }
        arr[randRow] -= Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
        }
    }
}