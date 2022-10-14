

//var P = new Array();
var IsAvailable = new Array();
var rows = 4;
var opponent = "AI";
var difficulty = "Easy";
var ConstTurn = 1;
var turn = 1;
var gtype = "Default";
var lay = "Horizontal"
var FirstPlay = true;
var AllowedRow;
var mode = 1;
var inGame = 0;
var lines4 = [1, 3, 5, 7];
var lines5 = [1, 3, 5, 7, 9];
var lines6 = [1, 3, 5, 7, 9, 11];
var lines7 = [1, 3, 5, 7, 9, 11, 13];

function Initialize() {
    if (rows === 4) {
        lines = lines4;
    } else if (rows === 5) {
        lines = lines5;
    } else if (rows === 6) {
        lines = lines6;
    } else if (rows === 7) {
        lines = lines7;
    }

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


function closeDropDown(s) {
    id = "dropdown-content" + s;
    var dropdownContent = document.getElementById(id);
    dropdownContent.style.display = "none";
}

function openDropDown(s) {
    id = "dropdown-content" + s;
    var dropdownContent = document.getElementById(id);
    dropdownContent.style.display = "block";
}

function change_table(n) {
    rows = n;
    if(lay == "Vertical"){
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Lines - " + n;
    }else{
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Columns - " + n;
    }
    var dropdownContent = document.getElementById("dropdown-content1");
    dropdownContent.style.display = "none";
}

function define_opponent(n) {
    opponent = n;
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
    gametype = n;
    document.getElementById("dropdownbtn_text5").innerHTML = "Gametype - " + n;
    var dropdownContent = document.getElementById("dropdown-content5");
    dropdownContent.style.display = "none";
}

function define_layout(n) {
    lay = n;
    document.getElementById("dropdownbtn_text6").innerHTML = "Layout - " + n;
    var dropdownContent = document.getElementById("dropdown-content6");
    dropdownContent.style.display = "none";
    if(lay == "Vertical"){
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Lines - " + rows;
    }else{
        document.getElementById("dropdownbtn_text1").innerHTML = "Number of Columns - " + rows;
    }
}

async function startgame() {
    if(inGame == 0){
        reset();
    if (turn == 2 && opponent=="AI") {
        play('Default', numberRows(), difficulty);
        turn = 1;
    }
    Initialize();
    let btn = document.getElementById("start");
    btn.innerHTML = "End Game";
    $("#start").css({"background-color":"brown"});
    inGame = 1
    }else{
        inGame = 0;
        showWinner();
        let btn = document.getElementById("start");
        btn.innerHTML = "Start Game";
        $("#start").css({"background-color":"black"});

    }
    
}

function reset(){
    lines4 = [1, 3, 5, 7];
    lines5 = [1, 3, 5, 7, 9];
    lines6 = [1, 3, 5, 7, 9, 11];
    lines7 = [1, 3, 5, 7, 9, 11, 13];
    turn = ConstTurn;
    FirstPlay = true;
}

function showform() {
    var form = document.getElementById("login_form");
    var div = document.getElementById("exitbackground");
    div.style.animation="fade-in2 0.4s forwards"
    div.style.display="block";
    form.style.animation = "fade-in 0.4s forwards";
    form.style.display = "block";
}

async function closeform() {
    var form = document.getElementById("login_form");
    var div = document.getElementById("exitbackground");
    div.style.animation="fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    div.style.display="none";
    form.style.display = "none";
}

function showInfo() {
    var form = document.getElementById("infopop");
    var div = document.getElementById("exitbackground");
    var front = document.getElementById("configurations");
    front.style.display = "block";
    front.style.zIndex = 120;
    div.style.animation="fade-in2 0.4s forwards"
    div.style.display="block";
    form.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
}

async function closeInfo() {
    var form = document.getElementById("infopop");
    var div = document.getElementById("exitbackground");
    div.style.animation="fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    div.style.display="none";
    form.style.display = "none";
}




async function remove(element) {
    ElRow = element.attr('data-Rows');
    var el = document.getElementById(element.attr('id'));
    if (rows == 4) {
        if (FirstPlay) {
            el.style.animation = "fade-out 0.2s forwards";
            await new Promise(r => setTimeout(r, 200));
            AllowedRow = ElRow;
            lines4[ElRow] -= 1;
            Initialize();
            FirstPlay = false;
        } else {
            if (AllowedRow == ElRow) {
                el.style.animation = "fade-out 0.2s forwards";
                await new Promise(r => setTimeout(r, 200));
                lines4[ElRow] -= 1;
                Initialize();
            }
        }
    } else if (rows == 5) {
        if (FirstPlay) {
            el.style.animation = "fade-out 0.2s forwards";
            await new Promise(r => setTimeout(r, 200));
            AllowedRow = ElRow;
            lines5[ElRow] -= 1;
            Initialize();
            FirstPlay = false;
        } else {
            if (AllowedRow == ElRow) {
                el.style.animation = "fade-out 0.2s forwards";
                await new Promise(r => setTimeout(r, 200));
                lines5[ElRow] -= 1;
                Initialize();
            }
        }
    } else if (rows == 6) {
        if (FirstPlay) {
            el.style.animation = "fade-out 0.2s forwards";
            await new Promise(r => setTimeout(r, 200));
            AllowedRow = ElRow;
            lines6[ElRow] -= 1;
            Initialize();
            FirstPlay = false;
        } else {
            if (AllowedRow == ElRow) {
                el.style.animation = "fade-out 0.2s forwards";
                await new Promise(r => setTimeout(r, 200));
                lines6[ElRow] -= 1;
                Initialize();
            }
        }
    } else if (rows == 7) {
        if (FirstPlay) {
            el.style.animation = "fade-out 0.2s forwards";
            await new Promise(r => setTimeout(r, 200));
            AllowedRow = ElRow;
            lines7[ElRow] -= 1;
            Initialize();
            FirstPlay = false;
        } else {
            if (AllowedRow == ElRow) {
                el.style.animation = "fade-out 0.2s forwards";
                await new Promise(r => setTimeout(r, 200));
                lines7[ElRow] -= 1;
                Initialize();
            }
        }
    } else {
        console.log("Number of Lines not allowed")
    }
}

async function endturn() {
   /* if(turn == 1){
        console.log("1");
        turn = 2;  
    } else {
        console.log("2");
        turn = 1;
    } 
    if (winner('Default', numberRows())) {
        showWinner();
        return;
    }*/

    if (!FirstPlay) {
        if (turn == 1) turn = 2;
        else turn = 1;
        if (opponent == "AI") {
            //if Player vs AI
            play('Default', numberRows(), difficulty);
            turn = 1;
            if (winner('Default', numberRows())) {
                showWinner();
            }
            Initialize();
        }
        Initialize();
        FirstPlay = true;
    }
}

function numberRows() {
    if (rows == 4) return lines4;
    if (rows == 5) return lines5;
    if (rows == 6) return lines6;
    if (rows == 7) return lines7;
}

function showWinner() {
    var form = document.getElementById("winnerpop");

    var printwinner = '';
    if (turn == 1) {
        printwinner = "You have won!";
    } else {
        if (opponent == 'AI') {
            printwinner = "The AI has won.";
        } else {
            printwinner = "Your Opponent won.";
        }
    }
    document.getElementById("winnerName").innerHTML = printwinner;
    form.style.display = "block";
    form.style.animation = "fade-in 0.4s forwards";
    var div = document.getElementById("exitbackground");
    div.style.animation="fade-in2 0.4s forwards"
    div.style.display="block";
}

async function closewinner() {
    var div = document.getElementById("exitbackground");
    var form = document.getElementById("winnerpop");
    div.style.animation="fade-out2 0.2s forwards"
    form.style.animation = "fade-out 0.2s forwards";
    await new Promise(r => setTimeout(r, 200));
    form.style.display = "none";
    div.style.display="none";
    reset();
    Initialize();
}

