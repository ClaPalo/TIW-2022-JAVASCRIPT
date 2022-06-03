package it.polimi.tiw.dao;

import it.polimi.tiw.beans.Comment;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.List;
import java.util.ArrayList;

public class CommentDAO {
	
	private Connection connection;
	
	public CommentDAO(Connection connection) {
		this.connection = connection;
	}
	
	public List<Comment> getCommentsByImage(int imageId) throws SQLException {
		List<Comment> comments = new ArrayList<>();
		
		String prepared_query = 
					"SELECT * "
				+ 	"FROM Comment C JOIN User U on (C.idUser = U.idUser) "
				+ 	"WHERE C.idImage = ? "
				+ 	"ORDER BY C.idComment ASC";
		
		PreparedStatement preparedStatement = this.connection.prepareStatement(prepared_query);
		preparedStatement.setInt(1, imageId);
		
		ResultSet result = preparedStatement.executeQuery();
		//TODO try
		while (result.next()) {
			Comment comment_to_add = new Comment();
			comment_to_add.setId(result.getInt("idComment"));
			comment_to_add.setIdUser(result.getInt("idUser"));
			comment_to_add.setUsername(result.getString("username"));
			comment_to_add.setText(result.getString("text"));
			comment_to_add.setIdImage(result.getInt("idImage"));
			
			comments.add(comment_to_add);
		}
		
		return comments;
	}
	
	public Comment getCommentById(int commentId) throws SQLException {
		Comment comment = null;
		
		String prepared_query = "SELECT * FROM Comment WHERE idComment = ?";
		
		PreparedStatement preparedStatement = this.connection.prepareStatement(prepared_query);
		preparedStatement.setInt(1, commentId);
		
		ResultSet result = preparedStatement.executeQuery();
		
		if (result.next()) {
			comment = new Comment();
			comment.setId(result.getInt("idComment"));
			comment.setIdUser(result.getInt("idUser"));
			comment.setText(result.getString("text"));
			comment.setIdImage(result.getInt("idImage"));
		}
		
		return comment;
	}
	
	public void addComment(int userId, String text, int imageId) throws SQLException {
		String prepared_query = "INSERT INTO Comment (text, idUser, idImage) VALUES (?, ?, ?)";
		
		PreparedStatement statement = connection.prepareStatement(prepared_query);
		statement.setString(1, text);
		statement.setInt(2, userId);
		statement.setInt(3, imageId);
		
		statement.executeUpdate();
		
	}
}