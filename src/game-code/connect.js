var usr, pass, opp;
var game;
var url2 = 'http://localhost:8005/';
var url = 'http://twserver.alunos.dcc.fc.up.pt:8008/';

async function register(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        //'Content-Type': 'application/json',
        
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    console.log(response);
    return response.json(); 
  }

  async function join(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        //'Content-Type': 'application/json'
       
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    console.log(response)
    return response.json(); 
  }

  async function leave(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        //'Content-Type': 'application/json'
        
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function notify(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin', 
      headers: {
        //'Content-Type': 'application/json'
        
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }

  async function ranking(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        //'Content-Type': 'application/json'
       
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }


  function registerClick(){
    let usr = document.getElementById("uname2").value;
    let pass1 = document.getElementById("psw2").value;
    let pass2 = document.getElementById("psw3").value;
    if(pass1 != pass2 || usr == "" || pass1 == "" || pass2 == ""){
        console.log("register error");
    }else{
        register(url + 'register', { nick:usr, password:pass1 })
        .then((data) => {
            if(!('error' in data)) {
                closesignupform();
                document.getElementById("login_text").style.display = "none";
                document.getElementById("signup_text").style.display = "none";
                let user_text = document.getElementById("user_text");
                user_text.innerHTML = usr;
                user_text.onclick = function(){
                    document.getElementById("login_text").style.display = "inline";
                    document.getElementById("signup_text").style.display = "inline";
                    user_text.innerHTML = "|";
                    user_text.onclick = null;
                }
            }
        })
        .catch(e => {console.log(e)});
    }
  }

  function loginClick(){
    usr = document.getElementById("uname1").value;
    pass = document.getElementById("psw1").value;
        register(url + 'register', { nick:usr, password:pass })
        .then((data) => {
        if(!('error' in data)) {
            closeform();
            document.getElementById("login_text").style.display = "none";
            document.getElementById("signup_text").style.display = "none";
            let user_text = document.getElementById("user_text");
            user_text.innerHTML = usr;
            user_text.onclick = function(){
                document.getElementById("login_text").style.display = "inline";
                document.getElementById("signup_text").style.display = "inline";
                user_text.innerHTML = "|";
                user_text.onclick = null;
                usr = undefined;
                pass = undefined;
                updateClassifications();
            }
        }
        })
        .catch(e => {console.log(e)});
    }

  
function joinGame(){
        let size = rows;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            join(url + 'join', { nick:usr, password:pass, group:5, size:size})
            .then((data)  => {
              if('error' in data)reject();
              else {
                console.log("DATA " + data);
                game = data.game;
                resolve();
              }
            })
            .catch((e) => {
              console.log(e);
              reject();
            })
           }, 750);
        });
}

function notifyPlay(stack, pieces){
  //console.log("notify play  connect" + stack + " " + pieces);
  notify(url + 'notify', { nick:usr, password:pass, game:game, stack:stack, pieces: pieces})
  .then((data) => {
    if('error' in data){
      console.log(data.error);
    }else{
      console.log("DATA: " + data);
    }
  })
  .catch(e => console.log("ERRO"+e));
}

function leaveGame(){
  console.log("PASS " + pass);
  leave(url + 'leave', { nick:usr, password:pass, game:game})
  .then((data) => {
    if('error' in data){
      console.log(data.error);
    }
  })
  .catch(e => console.log(e));
}

function getRanking(){
  let classi = "";
  let size = rows;
  ranking(url + 'ranking', { group:5, size:size})
  .then((data) => {
    if('ranking' in data){
      for(let i=0; i<data.ranking.length; i++){
        classi += data.ranking[i].nick + ":   " + data.ranking[i].victories + "/" + data.ranking[i].games + "<br>" + "<br>";
      }
      document.getElementById("pvpClassifications").innerHTML = classi;
    } 
    if('error' in data){
      console.log(data.error);
    }
  })
  .catch(e => console.log(e));
}