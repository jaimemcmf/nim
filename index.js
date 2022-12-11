var IsAvailable = new Array();
var rows = 4;
var opponent = "AI";
var difficulty = "Easy";
var ConstTurn = 1;
var turn = 1;
var loserbyforfeit;
var gtype = "Default";
var lay = "Horizontal"
var FirstPlay = true;
var AllowedRow;
var mode = 1;
var inGame = 0;
var AIwins = 0;
var Playerwins = 0;
var Player1wins = 0;
var Player2wins = 0;
var rmCount = 0;
var boards  = [[1, 3, 5, 7], [1, 3, 5, 7, 9], [1, 3, 5, 7, 9, 11], [1, 3, 5, 7, 9, 11, 13]];
var adjust = [1, 3, 5, 7, 9, 11, 13];
var aux = [0,1,2,3,4,5,6];

function Initialize() {
    lines = numberRows();
    for (var i = 0; i < rows; i++) {
        IsAvailable[i] = new Array(lines[i]);
    }
    var draw_element = ''
    for (var i = 0; i < rows; i++) {
        draw_element = draw_element + '<table><tr>'
        for (var j = 0; j < lines[i]; j++) {
            draw_element = draw_element + '<td><div class=el_fig id=el_figId' + i + 'N' + j + ' data-Rows=' + i + ' data-Cols=' + j + ' ></div></td>'
            IsAvailable[i][j] = true;
        }
        draw_element = draw_element + '</tr></table>'
    }
    $('#draw_area').html(draw_element);
    $('.el_fig').css({ 'height': Math.floor(480 / rows - 15) + 'px' });
    $('.el_fig').click(function () { remove($(this)) });
    if (lay == 'Vertical') {
        $('.game_window table').css({ 'margin': 'auto' });
        $('#draw_area').css({ 'transform': 'rotate(0deg)' });
    } else {
        $('#draw_area').css({ 'transform': 'rotate(270deg)' });
    }
}

function startgame() {
    if (inGame == 0) {
        reset();
        if(opponent != "Player"){
            if (turn == 2) {
                play(gtype, numberRows(), difficulty);
                turn = 1;
            }
            init();
        }else{
            joinGame()
            .then(() => {
                waiting();
                console.log(game);
                var update = new EventSource(url + "update?nick="+usr+"&game="+game);
                update.onmessage = function(event) {
                    console.log(event);
                    let d = JSON.parse(event.data);
                    if('turn' in d && d.turn != usr){
                        op = d.turn;
                    }
                    if('stack' in d && d.turn == usr){
                        t = numberRows()[d.stack] - d.pieces;
                        c = d.stack+1;
                        let msg = op + " has removed " + t + " elements from line " + c + "." + "<br>" + "<br>";
                        document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
                    } 
                    if(d.turn == usr) document.getElementById("nextTurnBtn").style.display = "block";
                    if('rack' in d)
                        for(i=0; i<rows; i++) numberRows()[i] = d.rack[i];
                    if('winner' in JSON.parse(event.data)){
                        console.log(event.data);
                        if(d.winner == usr){
                            turn = 1;
                        }else{
                            turn = 2;
                        }
                        inGame = 0;
                        rmCount = 0;
                        showWinner();
                        let btn = document.getElementById("start");
                        btn.innerHTML = "Start Game";
                        $("#start").css({ "background-color": "black" });
                        update.close();
                    }else{
                        console.log("D  " + JSON.stringify(d));
                        if(d.turn == usr) turn = 1;
                        else turn = 2;
                        init();
                    }
                    
                }
            })
            .catch(e => console.log("error"))
        }
    } else {
        if(opponent == "Player"){
            leaveGame();
        }
        rmCount = 0;
        inGame = 0;
        loserbyforfeit = turn;
        turn = 3;
        showWinner();
        let btn = document.getElementById("start");
        btn.innerHTML = "Start Game";
        $("#start").css({ "background-color": "black" });
    }
}

async function remove(element) {
    ElRow = element.attr('data-Rows');
    var el = document.getElementById(element.attr('id'));
    if (inGame && turn == 1) {
        if (FirstPlay) {
            el.style.animation = "fade-out 0.2s forwards";
            await new Promise(r => setTimeout(r, 200));
            AllowedRow = ElRow;
            numberRows()[ElRow] -= 1;
            rmCount++;
            Initialize();
            FirstPlay = false;
        } else {
            if (AllowedRow == ElRow) {
                el.style.animation = "fade-out 0.2s forwards";
                await new Promise(r => setTimeout(r, 200));
                numberRows()[ElRow] -= 1;
                rmCount++;
                Initialize();
            }
        }
    }
}

async function endturn() {
    if (!FirstPlay) {
        if (winner(gtype, numberRows()) && opponent == "AI") {
            showWinner();
            getRanking();
            inGame = 0;
            let btn = document.getElementById("start");
            btn.innerHTML = "Start Game";
            $("#start").css({ "background-color": "black" });
            return;
        }
        var temp = AllowedRow;
        temp++;
        if (opponent == "Player") {
            document.getElementById("nextTurnBtn").style.display = "none";
            if(turn == 1)
                var msg = usr + " has removed " + rmCount + " elements from line " + temp + "." + "<br>" + "<br>";
            else
                var msg = op + " has removed " + rmCount + " elements from line " + temp + "." + "<br>" + "<br>";
        } else {
            if(usr == undefined) var msg = "You have removed " + rmCount + " elements from line " + temp + "." + "<br>" + "<br>";
            else var msg = usr + " has removed " + rmCount + " elements from line " + temp + "." + "<br>" + "<br>";
        }
        document.getElementById("movesMade").innerHTML = msg + document.getElementById("movesMade").innerHTML;
        console.log("notify play  " + AllowedRow + " " + rmCount + " " + rmCount)
        if(opponent == "Player") notifyPlay(AllowedRow, numberRows()[AllowedRow]);
        adjust = numberRows();
        rmCount = 0;
        if (turn == 1) turn = 2;
        else turn = 1;
        if (opponent == "AI") {
            await new Promise(r => setTimeout(r, 500));
            play(gtype, numberRows(), difficulty);
            Initialize()
            if (winner(gtype, numberRows())) {
                showWinner();
                getRanking();
                inGame = 0;
                let btn = document.getElementById("start");
                btn.innerHTML = "Start Game";
                $("#start").css({ "background-color": "black" });
                return;
            }
            turn = 1;
        }
        Initialize();
        FirstPlay = true;
    }
}

function reset() {
    boards = [[1, 3, 5, 7], [1, 3, 5, 7, 9], [1, 3, 5, 7, 9, 11], [1, 3, 5, 7, 9, 11, 13]];
    turn = ConstTurn;
    FirstPlay = true;
    document.getElementById("movesMade").innerHTML = "";
    rmCount = 0;
}

function showform() {
    var form = document.getElementById("login_form");
    var div = document.getElementById("exitbackground");
    div.style.animation = "fade-in2 0.4s forwards"
    div.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
    form.style.display = "block";
}

async function closeform() {
    var form = document.getElementById("login_form");
    var div = document.getElementById("exitbackground");
    div.style.animation = "fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    div.style.display = "none";
    form.style.display = "none";
}

function showsignupform() {
    var form = document.getElementById("signup_form");
    var div = document.getElementById("exitbackground");
    div.style.animation = "fade-in2 0.4s forwards"
    div.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
    form.style.display = "block";
}

async function closesignupform() {
    var form = document.getElementById("signup_form");
    var div = document.getElementById("exitbackground");
    div.style.animation = "fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    div.style.display = "none";
    form.style.display = "none";
}

function showInfo() {
    var form = document.getElementById("infopop");
    var div = document.getElementById("exitbackground");
    var front = document.getElementById("configurations");
    front.style.display = "block";
    front.style.zIndex = 4;
    div.style.animation = "fade-in2 0.4s forwards"
    div.style.display = "block";
    form.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
}

async function closeInfo() {
    var form = document.getElementById("infopop");
    var div = document.getElementById("exitbackground");
    var front = document.getElementById("configurations");
    front.style.zIndex = 2;
    div.style.animation = "fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    div.style.display = "none";
    form.style.display = "none";
}

function showRules() {
    var form = document.getElementById("rulespop");
    var hide = document.getElementById("classificationspop");
    form.style.display = "block";
    hide.style.display = "none";
    form.style.animation = "fade-in 0.4s forwards";
}

async function closeRules() {
    var form = document.getElementById("rulespop");
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    form.style.display = "none";
}

function showClassifications() {
    
    var form = document.getElementById("classificationspop");
    var hide = document.getElementById("rulespop");
    updateClassifications();
    hide.style.display = "none";
    form.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
}

function updateClassifications() {
    getRanking();
    if (typeof(Storage) !== "undefined") {
        document.getElementById("aiscore").innerHTML = localStorage.ai;
        document.getElementById("playerAIscore").innerHTML = localStorage.usr;
        if(usr != undefined){
            document.getElementById("player_name").innerHTML = usr;
        }else{
            document.getElementById("player_name").innerHTML = "Player";
        }
    } else {
        console.log("No support for WebStorage");
        document.getElementById("aiscore").innerHTML = AIwins;
        document.getElementById("playerAIscore").innerHTML = Playerwins;
    }
}

async function closeClassifications() {
    var form = document.getElementById("classificationspop");
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    form.style.display = "none";
}

function init(){
    Initialize();
    let btn = document.getElementById("start");
    btn.innerHTML = "End Game";
    $("#start").css({ "background-color": "brown" });
    inGame = 1;
    if(opponent == "AI"){
        let ntbtn = document.getElementById("nextTurnBtn");
        ntbtn.style.display = "block";
    }
}

function waiting(){
    let btn = document.getElementById("start");
    btn.innerHTML = "Waiting...";
    $("#start").css({ "background-color": "orange" });
}

function numberRows() {
    return boards[rows-4];
}

function showWinner() {
    var form = document.getElementById("winnerpop");
    var printwinner = '';
    if (turn == 3){
        if(opponent == "AI"){
            printwinner = "You have forfeited the game. <br> <i>AI wins the game.<i>"
            if (localStorage.ai) {
                localStorage.ai = Number(localStorage.ai) + 1;
              } else {
                localStorage.ai = 1;
            }
        }else{
            if(loserbyforfeit == 1){
                printwinner = "You have forfeited the game. Player 2 wins the game."
                Player2wins++;
            }else{
                printwinner = "You have forfeited the game. Player 1 wins the game."
                Player1wins++;
            }
        }
    }else if (turn == 1) {
        if (opponent == "AI") {
            printwinner = "You have won!";
            if (localStorage.usr) {
                localStorage.usr = Number(localStorage.usr) + 1;
              } else {
                localStorage.usr = 1;
              }
        } else {
            if(usr == undefined) usr = "Player 1";
            printwinner = usr + " has won!"
            Player1wins++;
        }
    } else {
        if (opponent == 'AI') {
            printwinner = "The AI has won.";
            if (localStorage.ai) {
                localStorage.ai = Number(localStorage.ai) + 1;
              } else {
                localStorage.ai = 1;
              }
        } else {
            if(op == undefined ) op = "Player 2";
            printwinner = op + " has won!";
            Player2wins++;
        }
    }
    document.getElementById("nextTurnBtn").style.display = "none";
    document.getElementById("winnerName").innerHTML = printwinner;
    form.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
    var div = document.getElementById("exitbackground");
    div.style.animation = "fade-in2 0.4s forwards"
    div.style.display = "block";
    var front = document.getElementById("configurations");
    front.style.zIndex = 4;
    updateClassifications();
}

async function closewinner() {
    var div = document.getElementById("exitbackground");
    var form = document.getElementById("winnerpop");
    var front = document.getElementById("configurations");
    div.style.animation = "fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    front.style.zIndex = 2;
    form.style.display = "none";
    div.style.display = "none";
    reset();
    Initialize();
}

function startHoverIn() {
    if (inGame == 0) {
        $("#start").css({ "background-color": "brown" });
    }else{
        $("#start").css({ "background-color": "rgb(57, 4, 4)" });
    }
}

function startHoverOut() {
    if (inGame == 0) {
        $("#start").css({ "background-color": "black" });
    }else{
        $("#start").css({ "background-color": "brown" });
    }
}

async function switchform(x){
    if(x==0){
       await closeform();
        showsignupform();
    }else if(x==1){
        await closesignupform();
        showform();
    }else{
        console.log("Error.");
    }
}
function closeDropDown(s) {
    if (((s == 4 || s == 5) && opponent == "AI") || s != 4 && s != 5) {
        id = "dropdown-content" + s;
        var dropdownContent = document.getElementById(id);
        dropdownContent.style.display = "none";
        var dropdownbtn = document.getElementById(("dropdownbtn_text" + s));
        dropdownbtn.style.backgroundColor = "black";
    }
}

function openDropDown(s) {
    if (((s == 4 || s == 5) && opponent == "AI") || (s != 4 && s != 5)) {
        id = "dropdown-content" + s;
        let dropdownContent = document.getElementById(id);
        dropdownContent.style.display = "block";
        let dropdownbtn = document.getElementById(("dropdownbtn_text" + s));
        dropdownbtn.style.backgroundColor = "brown";
    } else {
        id = "dropdown-content" + s;
        var dropdownContent = document.getElementById(id);
        dropdownContent.style.display = "none";
    }
}

function change_table(n) {
    rows = n;
    if (lay == "Vertical") {
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Lines - " + n;
    } else {
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Columns - " + n;
    }
    var dropdownContent = document.getElementById("dropdown-content1");
    dropdownContent.style.display = "none";
}

function define_opponent(n) {
    opponent = n;
    if (opponent == "Player") {
        let dropdownbtn = document.getElementById("dropdownbtn_text4");
        dropdownbtn.style.backgroundColor = "gray";
        let dropdownbtn2 = document.getElementById("dropdownbtn_text5");
        dropdownbtn2.style.backgroundColor = "gray";
    } else {
        let dropdownbtn = document.getElementById("dropdownbtn_text4");
        dropdownbtn.style.backgroundColor = "black";
        let dropdownbtn2 = document.getElementById("dropdownbtn_text5");
        dropdownbtn2.style.backgroundColor = "black";
    }
    document.getElementById("dropdownbtn_text2").innerHTML = "Opponent - " + n;
    var dropdownContent = document.getElementById("dropdown-content2");
    dropdownContent.style.display = "none";
}

function define_order(n) {
    if (n == "First") ConstTurn = 1;
    else ConstTurn = 2;
    turn = ConstTurn;
    document.getElementById("dropdownbtn_text3").innerHTML = "Order - " + n;
    var dropdownContent = document.getElementById("dropdown-content3");
    dropdownContent.style.display = "none";
}

function define_difficulty(n) {
    difficulty = n;
    document.getElementById("dropdownbtn_text4").innerHTML = "Difficulty - " + n;
    var dropdownContent = document.getElementById("dropdown-content4");
    dropdownContent.style.display = "none";
}

function define_gametype(n) {
    gtype = n;
    document.getElementById("dropdownbtn_text5").innerHTML = "Gametype - " + n;
    var dropdownContent = document.getElementById("dropdown-content5");
    dropdownContent.style.display = "none";
}

function define_layout(n) {
    lay = n;
    document.getElementById("dropdownbtn_text6").innerHTML = "Layout - " + n;
    var dropdownContent = document.getElementById("dropdown-content6");
    dropdownContent.style.display = "none";
    if (lay == "Vertical") {
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Lines - " + rows;
    } else {
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Columns - " + rows;
    }
}
