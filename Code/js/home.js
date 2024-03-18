

document.addEventListener('DOMContentLoaded', function () {
    if(!localStorage.getItem("params")) {
        window.location.href = "sign.html";
    }
    const userEmail = localStorage.getItem("params");
    const formData = {
      email: userEmail
    };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5500/crd", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            let userData = JSON.parse(xhr.responseText);
            displayUserInfo(userData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert(xhr.responseText);
          }
        } else {
          alert("Error finding user");
        }
      }
    };
    xhr.send(JSON.stringify(formData));
  });
  
      function displayUserInfo(userData) {
    const userInfoContainer = document.getElementById('userInfoContainer');
  
    const userHTML = `
      <div>
        <p><strong>Username:</strong> ${userData[0].name}</p>
        <p><strong>Age:</strong> ${userData[0].age}</p>
        <p><strong>Balance:</strong> ${userData[0].balance}</p>
        <hr>
      </div>
    `;
    userInfoContainer.innerHTML = userHTML;
  }