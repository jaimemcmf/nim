

//var P = new Array();
var IsAvailable = new Array();
var rows = 4;
var opponent = "AI";
var difficulty = "Easy";
var order= "First";
const lines4 = [1,3,5,7];
const lines5 = [1,3,5,7,9];
const lines6 = [1,3,5,7,9,11];
const lines7 = [1,3,5,7,9,11,13];

function Initialize() {
	//P[1]=P1;P[2]=P2;P[3]=P3;P[4]=P4;P[5]=P5;P[6]=P6;P[7]=P7;P[8]=P8;P[9]=P9;P[10]=P10;
    if(rows === 4){
        lines = lines4;
    }else if(rows === 5){
        lines = lines5;
    }else if(rows === 6){
        lines = lines6;
    }else if(rows === 7){
        lines = lines7;
    }
    
	for (var i = 0; i < rows; i++) {
    	IsAvailable[i] = new Array(lines[i]);
	}

	var draw_element = ''
	for (var i=0; i<rows; i++ ){
		draw_element = draw_element + '<table><tr>'
			for (var j=0; j<lines[i]; j++ ){
				draw_element = draw_element + '<td><div class=el_fig id=el_figId'+i+'N'+j+' data-P='+i+' data-N='+j+' ></div></td>'
				IsAvailable[i][j] = true;
			}
		draw_element = draw_element + '</tr></table>'
	}
	$('#draw_area').html(draw_element);
	$('.el_fig').css({'height': Math.floor(480/rows-15) + 'px'});
}

function change_table(n){
    rows = n;
    document.getElementById("dropdownbtn_text1").innerHTML = "Number of Lines - " + n;
}

function define_opponent(n){
    opponent = n;
    document.getElementById("dropdownbtn_text2").innerHTML = "Opponent - " + n;
}

function define_order(n){
    order = n;
    document.getElementById("dropdownbtn_text3").innerHTML = "Order - " + n;
}

function define_difficulty(n){
    difficulty = n;
    document.getElementById("dropdownbtn_text4").innerHTML = "Difficulty - " + n;
}

function startgame() {
    Initialize();
}

function showform() {
    document.getElementById("login_form").style.display = "block";
}

function closeform(){
    document.getElementById("login_form").style.display = "none";
}

