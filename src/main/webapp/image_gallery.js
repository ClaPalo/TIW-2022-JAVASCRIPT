(function() { 
	
	// page components
	  let albumList, username,
	    pageOrchestrator = new PageOrchestrator(); // main controller
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
			username = new Username(sessionStorage.getItem("username"), document.getElementById("username"));
			username.show();
			
			albumList = new AlbumList(	document.getElementById("id_alert_my_albums"),
										document.getElementById("id_alert_other_albums"),
										document.getElementById("id_my_albums"),
										document.getElementById("id_other_albums"))
			
			albumList.showMyAlbums();
			albumList.showOtherAlbums();
			
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
	      usernameContainer.textContent = this.username;
	    }
	}
	
	function AlbumList(myalbumsalertContainer, otheralbumsalertContainer, myAlbumsContainer, otherAlbumsContainer) {
		
		this.myAlbumsAlert = myalbumsalertContainer;
		this.otherAlbumsAlert = otheralbumsalertContainer;
		this.myAlbumsContainer = myAlbumsContainer;
		this.otherAlbumsContainer = otherAlbumsContainer;
		
		this.showMyAlbums = function() {
			var self = this;
			makeCall("GET", "GetAlbums?myalbums=true", null, function(request) {
				if (request.readyState == 4) {
		            var unparsed_json = request.responseText;
		            if (request.status == 200) {
		              var albums = JSON.parse(unparsed_json);
		              if (albums.length == 0) {
		                self.myAlbumsAlert.textContent = "No albums yet! Click on \"Create a new album\" to start.";
		                return;
		              }
		              self.updateView(albums, self.myAlbumsContainer); // self visible by closure
		            
		          	} else {
		            	self.myAlbumsAlert.textContent = message;
		          	}
	          	}
			})
		}
		
		this.showOtherAlbums = function() {
			var self = this;
			makeCall("GET", "GetAlbums?myalbums=false", null, function(request) {
				if (request.readyState == 4) {
		            var unparsed_json = request.responseText;
		            if (request.status == 200) {
		              var albums = JSON.parse(unparsed_json);
		              if (albums.length == 0) {
		                self.otherAlbumsAlert.textContent = "Other users have never created any albums :(";
		                return;
		              }
		              self.updateView(albums, self.otherAlbumsContainer); // self visible by closure
		            
		          	} else {
		            	self.otherAlbumsAlert.textContent = message;
		          	}
	          	}
			})
		}
		
		this.updateView = function(arrayAlbums, container) {
	      var elem, i, row, titlecell, anchor, titleText;
	      this.myAlbumsContainer.innerHTML = ""; // empty the tables body
	      this.otherAlbumsContainer.innerHTML = "";
	      var container_visibleinscope = container;
	      // build updated lists
	      arrayAlbums.forEach(function(album) {
	        row = document.createElement("tr");
	        titlecell = document.createElement("td");
	        anchor = document.createElement("a");
	        titlecell.appendChild(anchor);
	   		titleText = document.createTextNode(album.title);
	        anchor.appendChild(titleText);
	        anchor.setAttribute('albumid', album.id);
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter
	          // TODO
	        }, false);
	        anchor.href = "#";
	        row.appendChild(titlecell);
	        container_visibleinscope.appendChild(row);
	      });
	      
	      container.style.visibility = "visible";
	    }
		
	}
	

}) ();