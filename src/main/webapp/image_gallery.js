(function() { 
	
	// page components
	  let albumList, albumInfo, albumThumbnails, imageWindow, username, commentsSection
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
													document.getElementById("id_thumbnails"),
													document.getElementById("id_noalbum_alert"));
													
			imageWindow = new ImageWindow(	document.getElementById("id_image_window_with_close"),
											document.getElementById("id_image_window"),
											document.getElementById("id_close"));
											
			imageWindow.registerEvents();
			
			commentsSection = new CommentsSection(	document.getElementById("id_comments"), 
													document.getElementById("id_comments_alert"),
													document.getElementById("id_submit_comment"),
													document.getElementById("id_submit_comment_alert"));

			document.getElementById("id_submit_comment").addEventListener("submit", (e)=>{
				e.preventDefault();
			})
			
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

		let startElement;
		
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
		              self.updateView(albums, self.myAlbumsContainer, true); // self visible by closure
		            
		          	} else {
		            	self.myAlbumsAlert.textContent = unparsed_json;
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
		              self.updateView(albums, self.otherAlbumsContainer, false); // self visible by closure
		            
		          	} else {
		            	self.otherAlbumsAlert.textContent = unparsed_json;
		          	}
	          	}
			})
		}
		
		this.updateView = function(arrayAlbums, container, areMyAlbums) {
	      var elem, i, row, titlecell, anchor, titleText;
	      container.innerHTML = ""; // empty the tables body
	      var container_visibleinscope = container;
		  var self = this;
	      // build updated lists
	      arrayAlbums.forEach(function(album) {
	        row = document.createElement("tr");
			if (areMyAlbums) {
				row.draggable = true;
				row.addEventListener("dragstart", self.dragStart);
				row.addEventListener("dragover", self.dragOver);
				row.addEventListener("dragleave", self.dragLeave);
				row.addEventListener("drop", self.drop);
			}
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

		this.dragStart = function(event) {
			startElement = event.target.closest("tr");
			//Create the button that confirms the order, if not exists
			if (document.getElementById("orderButton") === null) {
				let orderButton = document.createElement("button");
				orderButton.setAttribute("id", "orderButton");
				orderButton.textContent = "Confirm";
				orderButton.addEventListener("click", () => {
					let orderForm = document.createElement("form");
					let inputTag;
					let divChildren = myAlbumsContainer.children;
					for (let i = 0; i < divChildren.length; i++) {
						inputTag = document.createElement("input");
						inputTag.setAttribute("name", "albumId");
						inputTag.value = divChildren[i].getElementsByTagName("a")[0].getAttribute("albumid");
						orderForm.appendChild(inputTag);
					}

					makeCall("POST", "OrderAlbums", orderForm, (request) => {
						if  (request.readyState === 1) {
							let orderButtonToRemove = document.getElementById("orderButton");
							orderButtonToRemove.parentNode.removeChild(orderButtonToRemove);
						}
					});
				});
				myAlbumsContainer.closest("table").parentNode.insertBefore(orderButton, myAlbumsContainer.closest("table").nextSibling);
			}
		}

		this.dragOver = function(event) {
			event.preventDefault();
			var dest = event.target.closest("tr");
			dest.className = "selected";
		}

		this.dragLeave = function(event) {
			var dest = event.target.closest("tr");
			dest.className = "notselected";
		}

		this.drop = function(event) {
			var dest = event.target.closest("tr");

			// Obtain the index of the row in the table to use it as reference
			// for changing the dragged element position
			var table = dest.closest('table');
			var rowsArray = Array.from(table.querySelectorAll('tbody > tr'));
			var indexDest = rowsArray.indexOf(dest);

			// Move the dragged element to the new position
			if (rowsArray.indexOf(startElement) < indexDest)
				// If we're moving down, then we insert the element after our reference (indexDest)
				startElement.parentElement.insertBefore(startElement, rowsArray[indexDest + 1]);
			else
				// If we're moving up, then we insert the element before our reference (indexDest)
				startElement.parentElement.insertBefore(startElement, rowsArray[indexDest]);

			// Mark all rows in "not selected" class to reset previous dragOver
			for (var i = 0; i < rowsArray.length; i++) {
				rowsArray[i].className = "notselected";
			}
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
	
	function AlbumThumbnails(thumbnailsWithButtonsContainer, thumbnailsContainer, alertContainer) {
		
		this.images = [];
		
		this.thumbnailsWithButtonsContainer = thumbnailsWithButtonsContainer;
		this.thumbnailsContainer = thumbnailsContainer;
		this.alertContainer = alertContainer;
		
		this.loadImages = function(albumID) {
			var self = this;
			makeCall("GET", "GetAlbumImages?id=" + albumID, null, function(request) {
				
				var message = request.responseText;
				self.images = [];
				self.alertContainer.innerHTML = "";
				
				if (request.readyState == 4) {
					if (request.status == 200) {
						let images = JSON.parse(message);
						if (images == null || images.length == 0) {
							self.alertContainer.appendChild(document.createTextNode("This album has no images yet :("));
						} else {
							images.forEach(function (image) {
								let image_to_add = new Image();
								image_to_add.src = image.imgPath.substr(1);
								image_to_add.id = image.id;
								image_to_add.title = image.title;
								image_to_add.desc = image.text;
								self.images.push(image_to_add);
							});
						}
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
					
					var self = this;
					
					imagetag.addEventListener("mouseover", function(e) {
						imageWindow.show(e.target.getAttribute("src"), self.images[5*page + i].id, self.images[5*page + i].title, self.images[5*page + i].desc);
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
			this.alertContainer.innerHTML = "";
		}
	}
	
	function ImageWindow(imageWindowWithCloseButtonContainer, imageWindowContainer, closeButtonContainer) {
		this.imageWindowWithCloseButtonContainer = imageWindowWithCloseButtonContainer;
		this.imageWindowContainer = imageWindowContainer;
		this.closeButtonContainer = closeButtonContainer;
		
		this.show = function(image_src, imageID, imageTitle, imageDesc) {
			
			var imageTag = document.createElement("img");
			imageTag.setAttribute("src", image_src);
			
			this.imageWindowWithCloseButtonContainer.style.visibility = "visible";
			darken(true);
			
			this.imageWindowContainer.insertBefore(imageTag, this.imageWindowContainer.firstChild);

			var imageTitleTag = document.createElement("h1");
			imageTitleTag.textContent = imageTitle;
			this.imageWindowContainer.insertBefore(imageTitleTag, this.imageWindowContainer.firstChild);

			var descriptionTag = document.createElement("p");
			descriptionTag.textContent = imageDesc;
			imageTag.insertAdjacentElement("afterend", descriptionTag);
			
			commentsSection.loadComments(imageID);
		}
		
		this.registerEvents = function() {
			var self = this;
			this.closeButtonContainer.addEventListener("click", function() {
				darken(false);
				self.imageWindowWithCloseButtonContainer.style.visibility = "hidden";
				self.imageWindowContainer.removeChild(self.imageWindowContainer.firstChild);
				self.imageWindowContainer.removeChild(self.imageWindowContainer.firstChild);
				self.imageWindowContainer.removeChild(self.imageWindowContainer.firstChild);

				commentsSection.reset();
			}, false);
		}
	}
	
	function CommentsSection(commentsTable, commentsAlert, commentsForm, commentsFormAlert) {
		this.commentsTable = commentsTable;
		this.commentsAlert = commentsAlert;
		this.commentsForm = commentsForm;
		this.commentsFormAlert = commentsFormAlert;
		
		this.loadComments = function(imageID) {
			var self = this;
			makeCall("GET", "GetComments?imageId=" + imageID, null, function(request) {
				if (request.readyState == 4) {
		            var unparsed_json = request.responseText;
		            if (request.status == 200) {
		              var comments = JSON.parse(unparsed_json);
		              self.updateView(comments, imageID); // self visible by closure
		            
		          	} else {
		            	self.commentsAlert.textContent = message;
		          	}
	          	}
			});
		}
		
		this.updateView = function(comments, imageId) {
			var row, usercell, username, textcell, text;
			var self = this;
			this.reset();
	      	//this.commentsTable.innerHTML = ""; // empty the tables body
	      	if (comments.length > 0) {
		      	comments.forEach(function(comment) {
			        row = document.createElement("tr");
			        usercell = document.createElement("td");
			        row.appendChild(usercell);
			        username = document.createTextNode(comment.username);
			        usercell.appendChild(username);
			        textcell = document.createElement("td");
			        row.appendChild(textcell)
			        text = document.createTextNode(comment.text);
			        textcell.appendChild(text);
			        
			        self.commentsTable.appendChild(row);
			    });
		    } else {
				self.commentsAlert.textContent = "No comments for this image yet. Be the first!";

			}

			  let commentInput = document.createElement("input");
			  commentInput.setAttribute("name", "text");
			  commentInput.setAttribute("type", "text");
			  commentInput.setAttribute("placeholder", "Comment...");
			  commentInput.setAttribute("id", "id_comment_text");
			  commentInput.setAttribute("maxlength", "180");
			  let submitButton = document.createElement("button");
			  submitButton.setAttribute("type", "button");
			  submitButton.setAttribute("id", "buttonId");
			  submitButton.textContent = "Send";
			  commentsForm.appendChild(commentInput);
			  commentsForm.appendChild(submitButton);

			  this.registerEvents(imageId);
		}

		this.registerEvents = function(imageId) {
			var self = this;
			document.getElementById("buttonId").addEventListener("click", ()=>{
				let commentText = document.getElementById("id_comment_text").value;
				if (commentText.length > 0 && commentText.length <= 180 && commentsForm.checkValidity()) {
					let idValue = document.createElement("input");
					idValue.style.display = "none";
					idValue.setAttribute("type", "text");
					idValue.setAttribute("name", "imageId");
					idValue.value = imageId;
					commentsForm.insertBefore(idValue, document.getElementById("id_comment_text"));
					makeCall("POST", "SubmitComment", this.commentsForm, function(x) {
						if (x.readyState === XMLHttpRequest.DONE) {
							var message = x.responseText;
							switch(x.status) {
								case 200:
									self.loadComments(imageId);
									break;
								default:
									console.log(message);
									self.commentsFormAlert.textContent = "Error while sending the comment, try again";
									break;
							}
						}
					}, true);
				}
			});
		}
		
		this.reset = function() {
			this.commentsTable.innerHTML = "";
			this.commentsAlert.innerHTML = "";
			this.commentsForm.innerHTML = "";
		}
		
	}

}) ();