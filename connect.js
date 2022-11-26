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

  function registerClick(){
    let usr = document.getElementById("uname2").value;
    let pass1 = document.getElementById("psw2").value;
    let pass2 = document.getElementById("psw3").value;
    if(pass1 != pass2 || usr == "" || pass1 == "" || pass2 == ""){
        console.log("register error");
    }else{
        register('http://twserver.alunos.dcc.fc.up.pt:8008/register', { nick:usr, password:pass1 })
        .then((data) => {
        console.log(data); })
        .catch(e => {console.log(e)});
    }
  }

  function loginClick(){
    let usr = document.getElementById("uname1").value;
    let pass1 = document.getElementById("psw1").value;
        register('http://twserver.alunos.dcc.fc.up.pt:8008/register', { nick:usr, password:pass1 })
        .then((data) => {
        console.log(data); })
        .catch(e => {console.log(e)});
    }
