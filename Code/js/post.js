const currentDateAndTime = new Date();


const hours = currentDateAndTime.getHours();
const minutes = currentDateAndTime.getMinutes();
const seconds = currentDateAndTime.getSeconds();

const formattedDate = currentDateAndTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
function postbudget() {
const desc = document.getElementById('desc').value;
const amt = document.getElementById('from').value;

const xhr = new XMLHttpRequest();
const url = 'http://localhost:5500/postbudget';
const params = JSON.stringify({ email: email, date: formattedDate, time: formattedTime, desc: desc, amt: amt });

xhr.open('POST', url, true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const data = xhr.responseText;
      if (data === 's') {
        alert('Budget entry successful');
      } else {
        alert('Budget entry failed');
      }
    } else {
      console.error('Error:', xhr.statusText);
      alert('Something went wrong');
    }
  }
};

xhr.send(params);

}

function updb() {
  const amt = document.getElementById("amt").value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/updb", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = xhr.responseText;
        if (data === 's') {
          alert('Updated Balance');
        } else {
          alert(data);
        }
      } else {
        console.error('Error:', xhr.statusText);
      }
    }
  };
  
  var requestData = JSON.stringify({ email: email, change: amt });
  
  xhr.send(requestData);
  
}

function invest() {
  const amt = document.getElementById("amt").value;
  const type = document.getElementById("desc").value;
  const quant = document.getElementById("quant").value; 
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/invest", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = xhr.responseText;
        if (data === 's') {
          alert('Added Investment!');
        } else {
          alert("Failed to add investment!");
        }
      } else {
        alert("Try again later!")
        console.error('Error:', xhr.statusText);
      }
    }
  }
  var requestData = JSON.stringify({ date: formattedDate, time: formattedTime, email: email, name: type, amt: amt, quant: quant  });
  
  xhr.send(requestData);
}
