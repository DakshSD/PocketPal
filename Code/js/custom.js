var ee = "";
var ep = "";
var fmail = "";
var uname = "";
var op = Math.floor(Math.random() * 9000) + 1000;
function login() {
    ee = document.getElementById("logemail").value;
    ep = encrypt(document.getElementById("password").value, 'password');
    ccrd(function(response) {
        if (response[0] === 's') {
          localStorage.setItem("params", ee);
          localStorage.setItem("par", response.slice(1));
          window.location.href = "dashboard.html";
        } else {
          if(response[0] == 'f') {
            alert("Invalid  Credentials")
             document.getElementById("check").innerHTML = "Invalid credentials.";
          } else {
            alert("Trouble logging in. Try again later. ")
          }
        }
      });
}

function redirect() {
    document.getElementById("section-1").style.visibility = "hidden";
    document.getElementById("section-2").style.visibility = "visible";
    document.getElementById("section-2").scrollIntoView({
        behavior: 'smooth'
    });
}

function send() {
    fmail = document.getElementById("femail").value;
    if (document.getElementById("femail").value.replace(/\s/g, '') == "") {
        document.getElementById("remind").innerHTML = "Please enter email";
    } else {
        check(function(response) {
            if(response == 's')  {
                document.getElementById("remind").innerHTML = "This email doesn't exist. ";
            } else {
                if(response[0] == 'f') {
                  uname = response.slice(1);
                    document.getElementById("section-2").style.visibility = "hidden";
                    document.getElementById("section-3").style.visibility = "visible";
                    document.getElementById("section-3").scrollIntoView({
                        behavior: 'smooth'
                    });
                } else {
                   alert("Trouble connecting to the server.")
                }
            }
        });
    }
}
function confirm() {
    if (document.getElementById("otp").value == op) {
        localStorage.setItem("params", fmail);
        localStorage.setItem("par", uname);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("wrong").innerHTML = "OTP doesn't match";
    }
}


function encrypt(data, key) {
    const Key = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
    const encrypted = CryptoJS.AES.encrypt(data, Key, { iv: iv });
    return encrypted.toString();
}

function ccrd(callback) {
    var formData = {
        email: ee,
        password: ep
      };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:5500/login", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(xhr.responseText);
          } else {
            callback(xhr.responseText);
          }
        }
      };
      xhr.send(JSON.stringify(formData));
    } 


function check(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5500/checks", true);
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
    xhr.send(JSON.stringify({ email: fmail, otp: op }));
        } 



  (function ($) {
  
  "use strict";

    
    $('#sidebarMenu .nav-link').on('click',function(){
      $("#sidebarMenu").collapse('hide');
    });
    
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });
  
  })(window.jQuery);


  function logout() {
    localStorage.removeItem("params");
    localStorage.removeItem("par");
    window.location.href = "login.html";
  }


function validateEmail() {
    const emailInput = document.getElementById("email");
    const email = emailInput.value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  
    if (!emailRegex.test(email)) {
      emailInput.setCustomValidity("Please enter a valid email address");
    } else {
      emailInput.setCustomValidity("");
    }
  }