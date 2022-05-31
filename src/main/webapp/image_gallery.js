(function() { 
	
	// page components
	  let missionDetails, missionsList, wizard,
	    pageOrchestrator = new PageOrchestrator(); // main controller
	  console.log("Inizio");
	  window.addEventListener("load", () => {
	    if (sessionStorage.getItem("username") == null) {
	      window.location.href = "index.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  }, false);
	
	function PageOrchestrator() {
		
		this.start = function() {
			console.log("CIAAAAdsfsfas");
			username = new Username(sessionStorage.getItem("username"), document.getElementById("username"));
			username.show();
			
			
			document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })
		}
		
		this.refresh = function() {
			
		}
	}
	
	function Username(_username, usernameContainer) {
		this.username = _username;
	    this.show = function() {
			console.log("CIAAAAO");
	      usernameContainer.textContent = this.username;
	    }
	}
	
	

}) ();