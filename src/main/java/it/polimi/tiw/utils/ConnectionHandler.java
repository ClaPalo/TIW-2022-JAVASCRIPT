package it.polimi.tiw.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.UnavailableException;

/**
 * This class handles connection to db. It offers two static methods to provide a new connection and to close a 
 * given connection. 
 */
public class ConnectionHandler {

/**
 * The getConnection method looks for db access parameters inside the Servlet Context given
 * as a parameter. In our implementation, indeed, such parameters are stored as application-level parameters
 * inside the Deployment Descriptor "web.xml".
 * @param context, the ServletContext of the application that is using the connection.
 * @return a newly created Connection object.
 * @throws UnavailableException in case of problems with driver existence or with the connection.
 */
	public static Connection getConnection(ServletContext context) throws UnavailableException {
		
		Connection connection = null;
		
		try {
			
			String driver = context.getInitParameter("dbDriver");
			String url = context.getInitParameter("dbUrl");
			String user = context.getInitParameter("dbUser");
			String password = context.getInitParameter("dbPassword");
			
			Class.forName(driver);	
			
			connection = DriverManager.getConnection(url, user, password);
			
		} catch (ClassNotFoundException e) {
			throw new UnavailableException("Can't load database driver.");
		} catch (SQLException e) {
			throw new UnavailableException("Couldn't get db connection.");
		}
		
		return connection;
		
	}
	
	
	
	/**
	 * The closeConnection method closes the Connection given as a parameter, if it exists.
	 * @param connection to close.
	 * @throws SQLException in case something goes wrong while closing.
	 */
	public static void closeConnection(Connection connection) throws SQLException {
		if (connection != null) {
			connection.close();
		}
	}
	
}