if(!localStorage.getItem("params")) {
    window.location.href = "index.html";
}
const email = localStorage.getItem("params");
function updd() {
const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
if(document.getElementById("name").value.length <= 3) {
  if(phone == NaN) {
    alert("Username must be greater than 3 characters.");
    localStorage.setItem("no", "Number yet to be entered.");
 } else {
    localStorage.setItem("no", phone);
    alert("Phone number changed successfully.")
 }
} else {
  var formData = {
    username: name
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5500/usernames", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if(xhr.responseText == 's') {
          update(name);
        } else {
            alert("This username already exists ch.");
        }
      } else {
        alert("An unexpected error occured.");
      }
    }
  };
  xhr.send(JSON.stringify(formData));
}
}

function update(name) {
    var formData = {
        name: name
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5500/update-user", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if(xhr.responseText == 's') {
            localStorage.setItem("par", name)
            alert("Username changed successfully.")
          } else {
              alert("An error occured.");
          }
        } else {
          alert("An unexpected error occured.");
        }
      }
    };
    xhr.send(JSON.stringify(formData));
}


function updp() {
  const currentPassword = encrypt(document.getElementById("password").value, 'password');
      var newPassword = document.getElementById("newpassword").value;
      const confirmPassword = document.getElementById("confirmpassword").value;

      if (newPassword !== confirmPassword) {
        document.getElementById("message").innerText = "New password and confirm password do not match";
        return;
      }

      newPassword = encrypt(newPassword, 'password');

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:5500/change-password");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              alert("Password changed successfully");
            } else {
              alert("Couldn't change password.");
            }
          } else {
            alert("An error occurred. ");
          }
        }
      };
      xhr.send(JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword
      }));
}


function encrypt(data, key) {
  const Key = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');
  const encrypted = CryptoJS.AES.encrypt(data, Key, { iv: iv });
  return encrypted.toString();
}