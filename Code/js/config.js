const apiKey = '0a086092a54f2c785dce977f'; 
const news_api = 'e80fa83eb7d94d7d873796a910a40637'

const email = localStorage.getItem("params");
const name = localStorage.getItem("par");
var phone_num = localStorage.getItem("no");
if(phone_num) {

} else {
phone_num = "Phone Number missing";
}

var balance = 0;

var age = 0;

function bal() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5500/balance", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = xhr.responseText;
          if (data[0] === 's') {
            balance = data.replace(/s/g, '');
            let parts = balance.split('+');
            balance = parts[0];
            age = parts[1];
            document.getElementById("balance").innerHTML = balance; 
            document.getElementById("age").innerHTML = age; 
          } else {
            balance = "Couldn't fetch balance";
          }
        } else {
          console.error('Error:', xhr.statusText);
        }
      }
    };
    
    var requestData = JSON.stringify({ email: email});
    
    xhr.send(requestData);
}

bal();