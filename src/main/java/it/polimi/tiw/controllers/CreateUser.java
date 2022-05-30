package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.UserDAO;

/**
 * Servlet implementation class CreateUser
 */
@WebServlet("/CreateUser")
@MultipartConfig
public class CreateUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CreateUser() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    public void init() throws ServletException {
    	//TODO Usa handler
    	try {
			ServletContext context = getServletContext();
			String driver = context.getInitParameter("dbDriver");
			String url = context.getInitParameter("dbUrl");
			String user = context.getInitParameter("dbUser");
			String password = context.getInitParameter("dbPassword");
			Class.forName(driver);
			connection = DriverManager.getConnection(url, user, password);
		} catch (ClassNotFoundException e) {
			throw new UnavailableException("Can't load the driver");
		} catch (SQLException e) {
			throw new UnavailableException("Could't connect");
		}
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String password = request.getParameter("registrationPassword");
		String mail = request.getParameter("mail");
		String repPassword = request.getParameter("confirmPassword");
		
		if (username == null || password == null || mail == null || repPassword == null ||
				username.isEmpty() || password.isEmpty() || mail.isEmpty() || repPassword.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Devi inserire tutti i dati richiesti");
			System.out.println("Mancano dati");
			return;
		}
		
		
		if (!isValidMail(mail)) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Mail non valida");
			System.out.println("Mail");
			return;
		}
		
		UserDAO userDao = new UserDAO(connection);
		
		try {
			if (userDao.isPresentUsername(username)) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Username gia presente");
				System.out.println("Username gia presente");
				return;
			} else if (userDao.isPresentMail(mail)) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("E-mail gia presente");
				System.out.println("E-mail gia presente");
				return;
			} else if (password.length() < 5) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("La password deve essere di almeno 5 caratteri");
				System.out.println("La password deve essere di almeno 5 caratteri");
				return;
			} else if (!password.equals(repPassword)) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Le password devono coincidere");
				System.out.println("Le password devono coincidere");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Si è verificato un errore nel server, riprova più tardi");
			System.out.println("Si è verificato un errore nel server, riprova più tardi");
			return;
		}
		
		try {
			userDao.addUser(username, password, mail);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Si è verificato un errore nel server, riprova più tardi");
			System.out.println("Si è verificato un errore nel server, riprova più tardi");
			return;

		}
		
		response.setStatus(HttpServletResponse.SC_OK);

	}
	
	private boolean isValidMail(String email) {
		String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\."+
                "[a-zA-Z0-9_+&*-]+)*@" +
                "(?:[a-zA-Z0-9-]+\\.)+[a-z" +
                "A-Z]{2,7}$";
                  
		Pattern pat = Pattern.compile(emailRegex);
		if (email == null)
			return false;
		return pat.matcher(email).matches();
	}

}
