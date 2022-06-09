package it.polimi.tiw.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import it.polimi.tiw.beans.User;

public class UserDAO {
	private Connection connection;
	
	public UserDAO(Connection connection) {
		this.connection = connection;
	}
	
	/**
	 * Checks if the user exists and if the password is correct
	 * @param mail e-mail of the user
	 * @param password password of the user
	 * @return the user's bean if the credentials are correct. Null if not
	 */
	public User checkCredentials(String username, String password) throws SQLException {
		String query = "SELECT idUser, username, password, mail FROM User WHERE username = ? AND password = ?";
		try (PreparedStatement statement = connection.prepareStatement(query);) {
		
			statement.setString(1, username);
			statement.setString(2, password);
			try (ResultSet result = statement.executeQuery();) {
				if (!result.isBeforeFirst()) {
					return null;
				} else {
					result.next();
					User user = new User();
					user.setId(result.getInt("idUser"));
					user.setMail(result.getString("mail"));
					user.setUsername(result.getString("username"));
					user.setPassword(result.getString("password"));
					return user;
				}
			}
			
		}
	}
	
	public boolean isPresentUsername(String username) throws SQLException {
		String query = "SELECT * FROM User WHERE username = ?";
		try (PreparedStatement statement = connection.prepareStatement(query);) {
			statement.setString(1, username);
			try (ResultSet result = statement.executeQuery();) {
				if (!result.isBeforeFirst()) {
					return false;
				} else {
					return true;
					
				}
			}
		}
	}
	
	public boolean isPresentMail(String mail) throws SQLException {
		String query = "SELECT * FROM User WHERE mail = ?";
		try (PreparedStatement statement = connection.prepareStatement(query);) {
			statement.setString(1, mail);
			try (ResultSet result = statement.executeQuery();) {
				if (!result.isBeforeFirst()) {
					return false;
				} else {
					return true;
					
				}
			}
		}
	}
	
	public void addUser(String username, String password, String mail) throws SQLException {
		String query = "INSERT INTO User (username, password, mail) VALUES (?,?,?)";
		try (PreparedStatement statement = connection.prepareStatement(query);) {
			statement.setString(1, username);
			statement.setString(2, password);
			statement.setString(3, mail);
			statement.executeUpdate();
		}
	}
	
	public String getUsernameFromId(int userId) throws SQLException {
		String query = "SELECT username FROM User WHERE idUser = ?";
		
		PreparedStatement statement = connection.prepareStatement(query);
		statement.setInt(1,  userId);
		
		ResultSet result = statement.executeQuery();
		if (result.next()) {
			return result.getString("username");
		}
		return null;
	}
}
