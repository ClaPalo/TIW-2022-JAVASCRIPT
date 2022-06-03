package it.polimi.tiw.beans;

public class Comment {
	private int id;
	private String text;
	private int idUser;
	private String username;
	private int idImage;
	
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public String getText() {
		return this.text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public int getIdUser() {
		return this.idUser;
	}
	
	public void setIdUser(int idUser) {
		this.idUser = idUser;
	}
	
	public String getUsername() {
		return this.username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public int getIdImage() {
		return this.idImage;
	}
	
	public void setIdImage(int idImage) {
		this.idImage = idImage;
	}
}
