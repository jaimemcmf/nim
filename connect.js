/////////////////////////////////////////////////////////// FETCH REQUESTS ///////////////////////////////////////////////////////////////////
var usr, pass, opp;
var game;


async function register(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function join(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function leave(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function notify(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async function ranking(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

////////////////////////////////////////////////// CALLING FUCNTIONS //////////////////////////////////////////////////////////////////////

  function registerClick(){
    let usr = document.getElementById("uname2").value;
    let pass1 = document.getElementById("psw2").value;
    let pass2 = document.getElementById("psw3").value;
    if(pass1 != pass2 || usr == "" || pass1 == "" || pass2 == ""){
        console.log("register error");
    }else{
        register('http://twserver.alunos.dcc.fc.up.pt:8008/register', { nick:usr, password:pass1 })
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
        register('http://twserver.alunos.dcc.fc.up.pt:8008/register', { nick:usr, password:pass })
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
            join('http://twserver.alunos.dcc.fc.up.pt:8008/join', { nick:usr, password:pass, group:5, size:size})
            .then((data)  => {
              if('error' in data)reject();
              else {
                game = data.game;
                resolve();
              }
            })
            .catch((e) => {
              reject();
            })
           }, 750);
        });
}

function notifyPlay(stack, pieces){
  //console.log("notify play  connect" + stack + " " + pieces);
  notify('http://twserver.alunos.dcc.fc.up.pt:8008/notify', { nick:usr, password:pass, game:game, stack:stack, pieces: pieces})
  .then((data) => {
    if('error' in data){
      console.log(data.error);
    }else{
      console.log(data);
    }
  })
  .catch(e => console.log(e));
}

function leaveGame(){
  leave('http://twserver.alunos.dcc.fc.up.pt:8008/leave', { nick:usr, password:pass, game:game})
  .then((data) => {
    if('error' in data){
      console.log(data.error);
    }
  })
  .catch(e => console.log(e));
}