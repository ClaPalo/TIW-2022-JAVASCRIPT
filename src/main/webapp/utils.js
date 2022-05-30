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
