function makeCall(method, url, formElement, cback, reset = true) {
	    var req = new XMLHttpRequest(); // visible by closure
	    req.onreadystatechange = function() {
	      cback(req);
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
	      req.send(new FormData(formElement));
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
}

function validateMail(mail) {
			if (mail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
				return true;
			} else {
				return false;
			}
}

function darken(should_be_dark) {
	darkRectangle = document.getElementById("id_dark");
	
	if (should_be_dark === true) {
		darkRectangle.style.visibility = "visible";
	} else {
		darkRectangle.style.visibility = "hidden";
	}
}

function clearErrors(container) {
	let errors = container.getElementsByClassName("error");
	for (let i = 0; i < errors.length; i++) {
		errors[0].remove();
	}
}