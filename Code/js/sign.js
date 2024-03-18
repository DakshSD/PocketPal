let email = "";
var op = Math.floor(Math.random() * 9000) + 1000;
let uname = "";
let pass = "";
let age = 0;
function register() {
  const emailInput = document.getElementById("signupemail");
  email = emailInput.value;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  uname = document.getElementById("fullname").value;
  pass = encrypt(document.getElementById("signuppassword").value, 'password');
  age = document.getElementById("age").value;

  if (document.getElementById("fullname").value.length > 3) {
    if (document.getElementById("signuppassword").value.length >= 6) {
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email id")
      } else {
        if (document.getElementById("age") <= 12) {
          alert("You must be older than 12 years of age.")
        } else {
          check(function(response) {
            if (response === 's') {
              username(function(usernameResponse) {
                if (usernameResponse === 's') {
                  document.getElementById("section").style.visibility = "hidden";
                  document.getElementById("section-3").style.visibility = "visible";
                  document.getElementById("section-3").scrollIntoView({
                    behavior: 'smooth'
                  });
                } else {
                  alert("The username already exists")
                }
              });
            } else {
              alert("The email already exists.");
            }
          });
        }
      }
    } else {
      alert("Password must be greater than 6 characters.")
    }
  } else {
    alert("Username must be greater than 3 characters")
  }
}

function confirm() {
  if (document.getElementById("otp").value == op) {
    signup(function(response) {
      if (response == 's') {
        localStorage.setItem("params", email);
        localStorage.setItem("par", uname);
        window.location.href = "dashboard.html";
      } else {
        alert(response);
      }
    });
  } else {
      document.getElementById("wrong").innerHTML = "OTP doesn't match";
  }
}


function check(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/check", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        callback(xhr.responseText);
      } else {
        callback(xhr.responseText);
      }
    }
  };
  xhr.send(JSON.stringify({ email: email }));
}

function username(callback) {
  var formData = {
    username: uname,
    email: email,
    otp: op
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/username", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        alert("Error:", xhr.statusText);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}

function signup(callback) {
  var formData = {
    username: uname,
    email: email,
    password: pass,
    age: age
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/sign", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText);
      } else {
        alert("Error:", xhr.statusText);
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}

function encrypt(data, key) {
  const Key = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  const encrypted = CryptoJS.AES.encrypt(data, Key, { iv: iv });
  return encrypted.toString();
}
