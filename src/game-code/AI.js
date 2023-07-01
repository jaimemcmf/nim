var l;
function nimSum(arr) {
    let NimSum = arr[0];
    for (i = 1; i < rows; i++) {
        NimSum = NimSum ^ arr[i];
    }
    return NimSum;
}

function winner(gt, arr) {
    let cont = 0;
    for (i = 0; i < rows; i++) {
        cont += arr[i];
    }
    if (gt == "Default") {
        if (cont == 0) {
            console.log(turn + " has won!");
            return true;
        }
    } else {
        if (cont == 0) {
            if(turn == 1) turn = 2;
            else turn = 1;
            console.log(turn + " has won!");
            return true;
        }
    }
    return false;
}

function getNextMove(gt, arr) {
    if(gt == "Default"){
        var move = [-1, -1];
        var i, j;
        for (i = 0; i < rows; i++) {
            arr2 = [...arr];
            for (j = 0; j < arr[i]; j++) {
                arr2[i] -= 1;
                if (nimSum(arr2) == 0) {
                    move[0] = i;
                    move[1] = j + 1;
                    return move;
                }
            }
        }
        return move;
    }else{
        var move = [-1,-1];
        var i, gtoc=0, eqo=0, gtocol;
        for(i=0; i<rows; i++){
            if(arr[i] > 1){
                gtoc++;
                gtocol = i;
            }else if(arr[i] == 1){
                eqo++;
            }
        }
        if(gtoc == 1){
            if(eqo % 2 == 0){
                move[0] = gtocol;
                move[1] = arr[gtocol]-1;
            }else{
                move[0] = gtocol;
                move[1] = arr[gtocol];
            }
            console.log("a la misere " + move);
            return move;
        }else{
            return getNextMove("Default", arr);
        }
    }
}

function play(gt, arr, dif) {
    if (dif == "Impossible") {
        move = getNextMove(gt, arr);
        console.log(move);
        if (move[0] != -1){
            arr[move[0]] -= move[1];
            l = move[0]+1;
            var msg = "AI has removed " + move[1] + " elements from line " + l + "." + "<br>" + "<br>";
            document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
        } 
        else {
            console.log("Randomizing");
            randRow = Math.floor(Math.random() * rows);
            while (arr[randRow] == 0) {
                randRow = Math.floor(Math.random() * rows);
            }
            let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
            arr[randRow] -= randVal;
            var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
            document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
        }
    } else if (dif == "Easy") {
        console.log("Randomizing");
        randRow = Math.floor(Math.random() * rows);
        while (arr[randRow] == 0) {
            randRow = Math.floor(Math.random() * rows);
        }
        let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
        arr[randRow] -= randVal;
        var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
        document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
    } else if (dif == "Average") {
        var chance = Math.random();
        if (chance < 0.3) {
            move = getNextMove(gt, arr);
            console.log(move);
            if (move[0] != -1){
                arr[move[0]] -= move[1];
                l = move[0]+1;
                var msg = "AI has removed " + move[1] + " elements from line " + l + "." + "<br>" + "<br>";
                document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
            } 
            else {
                console.log("Randomizing");
                randRow = Math.floor(Math.random() * rows);
                while (arr[randRow] == 0) {
                    randRow = Math.floor(Math.random() * rows);
                }
                let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
                arr[randRow] -= randVal;
                var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
                document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
            }
        } else {
            console.log("Randomizing");
            randRow = Math.floor(Math.random() * rows);
            while (arr[randRow] == 0) {
                randRow = Math.floor(Math.random() * rows);
            }
            let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
            arr[randRow] -= randVal;
            var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
            document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
        }
    } else if (dif == "Hard") {
        var chance = Math.random();
        if (chance < 0.60) {
            move = getNextMove(gt, arr);
            console.log(move);
            if (move[0] != -1){
                arr[move[0]] -= move[1];
                l = move[0]+1;
                var msg = "AI has removed " + move[1] + " elements from line " + l + "." + "<br>" + "<br>";
                document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
            } 
            else {
                console.log("Randomizing");
                randRow = Math.floor(Math.random() * rows);
                while (arr[randRow] == 0) {
                    randRow = Math.floor(Math.random() * rows);
                }
                let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
                arr[randRow] -= randVal;
                var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
                document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
            }
        } else {
            console.log("Randomizing");
            randRow = Math.floor(Math.random() * rows);
            while (arr[randRow] == 0) {
                randRow = Math.floor(Math.random() * rows);
            }
            let randVal = Math.floor(Math.random() * (arr[randRow] - 1)) + 1;
            arr[randRow] -= randVal;
            var msg = "AI has removed " + randVal + " elements from line " + (randRow+1) + "." + "<br>" + "<br>";
            document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
        }
    }
}