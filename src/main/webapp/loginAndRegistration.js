(function() { 

	var loginForm = document.getElementById("loginForm");
	var registrationForm = document.getElementById("registrationForm");
	var loginButton = document.getElementById("loginButton");
	var createAccountLabel = document.getElementById("createAccountLabel");
	var alreadyUserLabel = document.getElementById("alreadyUserLabel");

		//Imposto la view iniziale
		registrationForm.style.display = "none";
		loginForm.style.display = "inline";

		createAccountLabel.style.color = "blue";
		alreadyUserLabel.style.color = "blue";

		//Aggiungo i listener
		createAccountLabel.addEventListener("click", ()=>{
			loginForm.style.display = "none";
			registrationForm.style.display = "inline";
		})

		alreadyUserLabel.addEventListener("click", ()=>{
			registrationForm.style.display = "none";
			loginForm.style.display = "inline";
		})

		createAccountLabel.addEventListener("mouseover", ()=>{
			createAccountLabel.style.backgroundColor = "grey";
		})
		createAccountLabel.addEventListener("mouseleave", ()=>{
			createAccountLabel.style.backgroundColor = "";
		})

		alreadyUserLabel.addEventListener("mouseover", ()=>{
			alreadyUserLabel.style.backgroundColor = "grey";
		})
		alreadyUserLabel.addEventListener("mouseleave", ()=>{
			alreadyUserLabel.style.backgroundColor = "";
		})

		loginButton.addEventListener("click", (e)=>{
			if (loginForm.checkValidity()) {
				makeCall("POST", "CheckLogin", loginForm, function(x) {
					if (x.readyState === XMLHttpRequest.DONE) {
						var message = x.responseText;
						console.log(x.status);
						switch(x.status) {
							case 200:
								sessionStorage.setItem("username", message);
								window.location.href = "Home.html";
								break;
							case 400:
								document.getElementById("loginError").textContent = message;
								break;
							case 401:
								document.getElementById("loginError").textContent = message;
								break;
							case 500:
								document.getElementById("loginError").textContent = message;
								break;
						}
					}
				})
			} else {
				loginForm.reportValidity();
			}
		})

}) ();