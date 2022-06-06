(function() { 

	var loginForm = document.getElementById("loginForm");
	var registrationForm = document.getElementById("registrationForm");
	var loginButton = document.getElementById("loginButton");
	var registrationButton = document.getElementById("registrationButton");
	var createAccountLabel = document.getElementById("createAccountLabel");
	var alreadyUserLabel = document.getElementById("alreadyUserLabel");
	var registrationPassword = document.getElementById("registrationPassword");
	var confirmPassword = document.getElementById("confirmPassword");
	var mail = document.getElementById("mail");
	var title = document.getElementById("title");
	
	var readyToSend;
	
	function start() {
		//Imposto la view iniziale
		registrationForm.style.display = "none";
		loginForm.style.display = "inline";
		title.textContent = "Login";
		loginForm.reset();
		registrationForm.reset();
		document.getElementById("nickname").focus();
		document.getElementById("utenteCreato").style.display = "none";
		for (let i = 0; i < document.getElementsByClassName("error").length; i++) {
			let element = document.getElementsByClassName("error").item(i);
			element.style.display = "none";
			element.style.color = "red";
		}
	}
		
		start();

		createAccountLabel.style.color = "blue";
		alreadyUserLabel.style.color = "blue";

		

		//Aggiungo i listener
		
		document.addEventListener("keypress", (e)=>{
			if (e.keyCode === 13) {
				var e = document.createEvent("HTMLEvents");
				e.initEvent("click", false, false);
				if (loginForm.style.display === "inline") {
					loginButton.dispatchEvent(e);
				} else if (registrationForm.style.display === "inline") {
					registrationButton.dispatchEvent(e);
				}
			}
		}, false)	// Better not to prioritize a HTTP Post as a consequence of a generic "enter" press
		
		createAccountLabel.addEventListener("click", ()=>{
			loginForm.style.display = "none";
			registrationForm.style.display = "inline";
			title.textContent = "Registration";
			
		})

		alreadyUserLabel.addEventListener("click", ()=>{
			start();
		})

		createAccountLabel.addEventListener("mouseover", ()=>{
			createAccountLabel.style["text-decoration"] = "underline";
		})
		createAccountLabel.addEventListener("mouseleave", ()=>{
			createAccountLabel.style["text-decoration"] = "none";
		})

		alreadyUserLabel.addEventListener("mouseover", ()=>{
			alreadyUserLabel.style["text-decoration"] = "underline";
		})
		alreadyUserLabel.addEventListener("mouseleave", ()=>{
			alreadyUserLabel.style["text-decoration"] = "none";
		})

		loginButton.addEventListener("click", (e)=>{
			if (isReadyToSend(loginForm, document.getElementById("loginError")) && loginForm.checkValidity()) {
				let oldUsername = document.getElementById("nickname").value;
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
								start();
								document.getElementById("nickname").value = oldUsername;
								document.getElementById("loginError").style.display = "inline";
								document.getElementById("loginError").textContent = message;
								break;
							case 401:
								start();
								document.getElementById("nickname").value = oldUsername;
								document.getElementById("loginError").style.display = "inline";
								document.getElementById("loginError").textContent = message;
								break;
							case 500:
								start();
								document.getElementById("nickname").value = oldUsername;
								document.getElementById("loginError").style.display = "inline";
								document.getElementById("loginError").textContent = message;
								break;
						}
					}
				})
			} else {
				loginForm.reportValidity();
			}
		})
		
		registrationButton.addEventListener("click", (e)=>{
			if (isReadyToSend(registrationForm, document.getElementById("registrationError")) && registrationForm.checkValidity()) {
				makeCall("POST", "CreateUser", registrationForm, function(x) {
					if (x.readyState === XMLHttpRequest.DONE) {
						var message = x.responseText;
						console.log(x.status);
						switch(x.status) {
							case 200:
								start();
								document.getElementById("utenteCreato").style.display="inline";
								break;
							case 400:
								document.getElementById("registrationError").style.display = "inline";
								document.getElementById("registrationError").textContent = message;
								break;
							case 401:
								document.getElementById("registrationError").style.display = "inline";
								document.getElementById("registrationError").textContent = message;
								break;
							case 500:
								document.getElementById("registrationError").style.display = "inline";
								document.getElementById("registrationError").textContent = message;
								break;
						}
					}
				})
			} else {
				registrationForm.reportValidity();
			}
		})
		
		//TODO Aggiungi a checkvalidity un controllo che non permetta di mandare il form se c'è qualche errore

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
		
		registrationPassword.addEventListener("focusout", (e)=>{
			let error = document.getElementById("confirmPasswordError");
			if (confirmPassword.value.length > 0 && !(confirmPassword.value === registrationPassword.value)) {
				error.textContent = "Le password devono coincidere";
				error.style.display = "inline";
			}
		})
		
		registrationPassword.addEventListener("input", (e)=>{
			let error = document.getElementById("confirmPasswordError");
			if (confirmPassword.value === registrationPassword.value) {
				error.style.display = "none";
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
		
		mail.addEventListener("focusout", (e)=>{
			let error = document.getElementById("mailError");
			if (!validateMail(mail.value)) {
				error.textContent = "Mail non valida";
				error.style.display = "inline";
			}
		})
		
		mail.addEventListener("input", (e)=>{
			let error = document.getElementById("mailError");
			if (validateMail(mail.value)) {
				error.style.display = "none";
			}
		})
	
	

}) ();

function isReadyToSend(form, error) {
	var toCheck = form.getElementsByTagName("input");
	//Controllo che tutti i campi siano riempiti
	for (let i = 0; i < toCheck.length; i++) {
		if (toCheck[i].value.length === 0) {
			error.style.display = "inline";
			error.textContent = "Tutti i campi sono obbligatori";
			return false;
		} else {
			error.style.display = "none";
		}
	}
	//Controllo che non ci siano errori di inserimento
	toCheck = form.getElementsByClassName("error");
	for (let i = 0; i < toCheck.length; i++) {
		if (toCheck[i].style.display !== "none"){
			return false;
		}
	}
	return true;
}