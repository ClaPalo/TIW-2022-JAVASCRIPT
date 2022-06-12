package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.polimi.tiw.beans.Album;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.AlbumDAO;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class OrderAlbums
 */
@WebServlet("/OrderAlbums")
@MultipartConfig
public class OrderAlbums extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public OrderAlbums() {
        super();
    }
    
    public void init() throws ServletException {
		this.connection = ConnectionHandler.getConnection(getServletContext());
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
		
		HttpSession session = request.getSession();
		
		AlbumDAO albumDAO = new AlbumDAO(this.connection);
		Album album = null;
		
		String[] albumIDs = null;
		List<Integer> albumOrder = new ArrayList<>();
		
		
		
		User user = (User) session.getAttribute("user");
		
		albumIDs = request.getParameterValues("albumId");
		int albumId;
		for (String albumIdString : albumIDs) {
			try {
				albumId = Integer.parseInt(albumIdString);
				//Check if the user is the owner of the album
				album = albumDAO.getAlbumById(albumId);
				if (user.getId() != album.getUserId()) {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
					response.getWriter().println("Sorry, something went wrong. Try again.");
					return;
				}
				albumOrder.add(albumId);
			} catch (NumberFormatException | NullPointerException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Sorry, something went wrong. Try again.");
				return;
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error. Try again.");
				return;
			}
		}
		
		
		for (int i = 0; i < albumOrder.size(); i++) {
			try {
				albumDAO.setAlbumPosition(albumOrder.get(i), i+1);
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error. Try again.");
				return; //TODO Rollback?
			}
		}
		
		response.setStatus(HttpServletResponse.SC_OK);
	}

}
