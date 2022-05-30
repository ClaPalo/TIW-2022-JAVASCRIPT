(function() { 

	var loginForm = document.getElementById("loginForm");
	var registrationForm = document.getElementById("registrationForm");
	var loginButton = document.getElementById("loginButton");
	var createAccountLabel = document.getElementById("createAccountLabel");
	var alreadyUserLabel = document.getElementById("alreadyUserLabel");
	var registrationPassword = document.getElementById("registrationPassword");
	var confirmPassword = document.getElementById("confirmPassword");

		//Imposto la view iniziale
		registrationForm.style.display = "none";
		loginForm.style.display = "inline";

		createAccountLabel.style.color = "blue";
		alreadyUserLabel.style.color = "blue";

	for (let i = 0; i < document.getElementsByClassName("error").length; i++) {
		let element = document.getElementsByClassName("error").item(i);
		element.style.display = "none";
		element.style.color = "red";
	}

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

		registrationPassword.addEventListener("focusout", (e)=>{
			let passwordError = document.getElementById("passwordError");
			if (registrationPassword.value.length < 5) {
				passwordError.textContent = "La password deve essere di almeno 5 caratteri";
				passwordError.style.display = "inline";
			}
		})
		
		registrationPassword.addEventListener("input", (e)=>{
			let passwordError = document.getElementById("passwordError");
			if (registrationPassword.value.length >= 5) {
				passwordError.style.display = "none";
			}
		})
		
		confirmPassword.addEventListener("focusout", (e)=>{
			let error = document.getElementById("confirmPasswordError");
			if (!(confirmPassword.value === registrationPassword.value)) {
				error.textContent = "Le password devono coincidere";
				error.style.display = "inline";
			}
		})
		
		confirmPassword.addEventListener("input", (e)=>{
			let error = document.getElementById("confirmPasswordError");
			if ((confirmPassword.value === registrationPassword.value)) {
				error.style.display = "none";
			}
		})
	
	

}) ();