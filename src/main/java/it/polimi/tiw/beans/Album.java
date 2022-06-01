package it.polimi.tiw.beans;

import java.sql.Date;

public class Album {
	private int id;
	private int userId;
	private String title;
	private Date dateOfCreation;
	
	
	
	public int getId() {
		return this.id;
	}
	
	public int getUserId() {
		return this.userId;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public Date getDateOfCreation() {
		return this.dateOfCreation;
	}
	
	
	
	public void setId(int id) {
		this.id = id;
	}
	
	public void setUserId(int userId) {
		this.userId = userId;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public void setDateOfCreation(Date dateOfCreation) {
		this.dateOfCreation = dateOfCreation;
	}
}