(function() { 
	
	// page components
	  let albumList, albumInfo, albumThumbnails, imageWindow, username,
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
			
			albumInfo = new AlbumInfo(document.getElementById("id_album_title"));
			
			albumThumbnails = new AlbumThumbnails(	document.getElementById("id_thumbnails_with_buttons"),
													document.getElementById("id_thumbnails"));
													
			imageWindow = new ImageWindow(	document.getElementById("id_image_window_with_close"),
											document.getElementById("id_image_window"),
											document.getElementById("id_close"));
											
			imageWindow.registerEvents();
			
			document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })
		}
		
		this.refresh = function() {
			albumThumbnails.reset();
			albumList.showMyAlbums();
			albumList.showOtherAlbums();
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
	      container.innerHTML = ""; // empty the tables body
	      var container_visibleinscope = container;
	      // build updated lists
	      arrayAlbums.forEach(function(album) {
	        row = document.createElement("tr");
	        titlecell = document.createElement("td");
	        anchor = document.createElement("a");
	        titlecell.appendChild(anchor);
	   		titleText = document.createTextNode(album.title);
	        anchor.appendChild(titleText);
	        anchor.setAttribute("albumid", album.id);
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter
	          let albumID = e.target.getAttribute("albumid");
	          albumInfo.show(albumID);
	          albumThumbnails.loadImages(albumID);
	        }, false);
	        anchor.href = "#";
	        row.appendChild(titlecell);
	        container_visibleinscope.appendChild(row);
	      });
	      
	      container.style.visibility = "visible";
	    }
		
	}
	
	function AlbumInfo(titleContainer) {
		
		this.titleContainer = titleContainer;
		
		this.show = function(albumID) {
			var self = this;
			makeCall("GET", "GetAlbumInfo?id=" + albumID, null, function(request) {
				
				var message = request.responseText;
				
				if (request.readyState == 4) {
					if (request.status == 200) {
						var album = JSON.parse(message);
						self.update(album);
					} else if (request.readyState == 404) {
						// TODO
					} else {
						//TODO
					}
				}
			})
		}
		
		this.update = function(album) {
			this.titleContainer.textContent = album.title;
		}
		
	}
	
	function AlbumThumbnails(thumbnailsWithButtonsContainer, thumbnailsContainer) {
		
		this.images = [];
		
		this.thumbnailsWithButtonsContainer = thumbnailsWithButtonsContainer;
		this.thumbnailsContainer = thumbnailsContainer;
		
		this.loadImages = function(albumID) {
			var self = this;
			makeCall("GET", "GetAlbumImages?id=" + albumID, null, function(request) {
				
				var message = request.responseText;
				self.images = [];
				
				if (request.readyState == 4) {
					if (request.status == 200) {
						let images = JSON.parse(message);
						images.forEach(function (image) {
							let image_to_add = new Image();
							image_to_add.src = image.imgPath.substr(1);
							image_to_add.id = image.id;
							self.images.push(image_to_add);
						});
						self.show(0);
					} else if (request.readyState == 404) {
						// TODO
					} else {
						//TODO
					}
				}
			})
			
		}
		
		this.show = function(page) {
			
			if (page < 0 || page*5 > this.images.length) return;
			
			this.thumbnailsContainer.innerHTML = "";
			
			if (document.getElementById("id_prev_button") !== null) {
				this.thumbnailsWithButtonsContainer.removeChild(document.getElementById("id_prev_button"));
			}
			
			if (document.getElementById("id_next_button") !== null) {
				this.thumbnailsWithButtonsContainer.removeChild(document.getElementById("id_next_button"));
			}
			
			var self = this;
			
			if (this.images.length > 0) {
				if (page > 0) {
					var left_button, left_button_label;
					
					left_button_label = document.createElement("label");
					left_button = document.createElement("button");
					left_button.textContent = "❮";
					left_button_label.appendChild(left_button);
					left_button_label.setAttribute("class", "prev_button");
					left_button_label.setAttribute("id", "id_prev_button");
					
					left_button.addEventListener("click", function() {
						self.show(page-1);
					}, false)
					
					this.thumbnailsWithButtonsContainer.insertBefore(left_button_label, this.thumbnailsWithButtonsContainer.firstChild);
				}
				
				for (let i=0; i<5 && (i+page*5)<this.images.length; i++) {
					var imagecell, imagetag;
				    imagecell = document.createElement("td");
				    imagetag = document.createElement("img");
				    imagecell.appendChild(imagetag);
				    imagetag.setAttribute("src", this.images[5*page + i].src);
				    imagetag.setAttribute("width", 200);
					
					this.thumbnailsContainer.appendChild(imagecell);
					
					
					imagetag.addEventListener("mouseover", function(e) {
						imageWindow.show(e.target.getAttribute("src"));
					}, false)
				}
				
				if ((page+1)*5 < this.images.length) {
					var right_button, right_button_label;
					
					right_button_label = document.createElement("label");
					right_button = document.createElement("button");
					right_button.textContent = "❯";
					right_button_label.appendChild(right_button);
					right_button_label.setAttribute("class", "next_button");
					right_button_label.setAttribute("id", "id_next_button");
			
					right_button.addEventListener("click", function() {
						self.show(page+1);
					}, false)
					
					this.thumbnailsWithButtonsContainer.appendChild(right_button_label);
				}
			}
		}
		
		this.reset = function() {
			this.images = [];
			if (document.getElementById("id_prev_button") !== null) {
				this.thumbnailsWithButtonsContainer.removeChild(document.getElementById("id_prev_button"));
			}
			if (document.getElementById("id_next_button") !== null) {
				this.thumbnailsWithButtonsContainer.removeChild(document.getElementById("id_next_button"));
			}
			this.thumbnailsContainer.innerHTML = "";
		}
	}
	
	function ImageWindow(imageWindowWithCloseButtonContainer, imageWindowContainer, closeButtonContainer) {
		this.imageWindowWithCloseButtonContainer = imageWindowWithCloseButtonContainer;
		this.imageWindowContainer = imageWindowContainer;
		this.closeButtonContainer = closeButtonContainer;
		
		this.show = function(image_src) {
			
			var imageTag = document.createElement("img");
			imageTag.setAttribute("src", image_src);
			
			this.imageWindowWithCloseButtonContainer.style.visibility = "visible";
			darken(true);
			
			this.imageWindowContainer.insertBefore(imageTag, this.imageWindowContainer.firstChild);
			
		}
		
		this.registerEvents = function() {
			var self = this;
			this.closeButtonContainer.addEventListener("click", function() {
				darken(false);
				self.imageWindowWithCloseButtonContainer.style.visibility = "hidden";
				self.imageWindowContainer.removeChild(self.imageWindowContainer.firstChild);
			}, false);
		}
	}

}) ();