package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import it.polimi.tiw.utils.ConnectionHandler;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import it.polimi.tiw.beans.User;
import it.polimi.tiw.beans.Image;
import it.polimi.tiw.dao.CommentDAO;
import it.polimi.tiw.dao.ImageDAO;

/**
 * Servlet implementation class CheckLogin
 */
@WebServlet("/SubmitComment")
@MultipartConfig
public class SubmitComment extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SubmitComment() {
        super();
    }
    
    public void init() throws ServletException {
		
    	ServletContext servletContext = getServletContext();
    	
    	this.connection = ConnectionHandler.getConnection(servletContext);
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String text = null;
		Integer imageID = null;
		User user = (User) request.getSession().getAttribute("user");
		text = request.getParameter("text");
		
		System.out.println("Trying to post a comment");
		
		if (user == null || text == null || text.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); //Missing user or text
			response.getWriter().println("Missing user or text");
			System.out.println("No text");

			return;
		}
		
		if (text.length() > 180) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); //Text too long
			response.getWriter().println("Text too long");
			System.out.println("Too long");


			return;
		}
		
		try {
			imageID = Integer.parseInt(request.getParameter("imageId"));
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST); //Missing informations
			response.getWriter().println("Missing imageId");
			System.out.println("No image ID");


			return;
		}
		
		ImageDAO imageDAO = new ImageDAO(this.connection);
		Image img = null;
		CommentDAO commentDAO = new CommentDAO(connection);
		
		try {
			
			img = imageDAO.getImageById(imageID);
			
			if (img == null) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND); //Image doesn't exist
				response.getWriter().println("Image doesn't exist");
				System.out.println("No image on DB");

				return;
			}
			
			commentDAO.addComment(user.getId(), text, imageID);
			
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
		
		response.setStatus(HttpServletResponse.SC_OK);
		System.out.println("Comment added");
	}
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(this.connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
