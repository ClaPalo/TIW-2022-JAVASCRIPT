package it.polimi.tiw.beans;

import java.sql.Date;

public class Image {
	private int id;
	private int userId;
	private String title;
	private String text;
	private Date dateOfCreation;
	private String imgPath;
	
	
	public int getId() {
		return this.id;
	}
	
	public int getUserId() {
		return this.userId;
	}
	
	public String getTitle() {
		return this.title;
	}
	
	public String getText() {
		return this.text;
	}
	
	public Date getDateOfCreation() {
		return this.dateOfCreation;
	}
	
	public String getImgPath() {
		return this.imgPath;
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
	
	public void setText(String text) {
		this.text = text;
	}
	
	public void setDateOfCreation(Date dateOfCreation) {
		this.dateOfCreation = dateOfCreation;
	}
	
	public void setImgPath(String imgPath) {
		this.imgPath = imgPath;
	}
}