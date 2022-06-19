package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.beans.Album;
import it.polimi.tiw.beans.Image;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.AlbumDAO;
import it.polimi.tiw.dao.ImageDAO;
import it.polimi.tiw.utils.ConnectionHandler;

/**
 * Servlet implementation class EditAlbum
 */
@WebServlet("/EditAlbum")
@MultipartConfig
public class EditAlbum extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EditAlbum() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    public void init() throws ServletException {
		this.connection = ConnectionHandler.getConnection(getServletContext());

    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		User user = (User) request.getSession().getAttribute("user");
		String albumIdNotParsed;
		int albumId;
		List<Image> images = null;
		ImageDAO imageDAO = new ImageDAO(this.connection);

		AlbumDAO albumDAO = new AlbumDAO(this.connection);
				
		albumIdNotParsed = request.getParameter("albumId");
		
		if (albumIdNotParsed == null || albumIdNotParsed.isEmpty()) {
			//The user wants to create a new album
			try {
				images = imageDAO.getImagesOfUser(user.getId());
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later.");
				return;
			}
		} else {
			//The user wants to modify an existing album
			try {
				albumId = Integer.parseInt(request.getParameter("albumId"));
				//Controllo che l'utente sia il proprietario dell'album
				if (albumDAO.getIdOwnerOfAlbum(albumId) != user.getId()) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // "You can't edit someone else's album.");
					response.getWriter().println("You are not allowed to edit someone else's album");
					return;
				}
			} catch (NumberFormatException | NullPointerException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);// "Missing album parameters.");
				response.getWriter().println("Missing album parameters.");
				return;
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later.");
				return;
			}
			
			try {
				images = imageDAO.getImagesByUserNotInAlbum(user.getId(), albumId);

			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later.");
				return;
			}
		}
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(images);
		
		
		
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String[] imageIDs = null;
		String albumIdNotParsed;
		int albumId;
		AlbumDAO albumDAO = new AlbumDAO(this.connection);
		User user = (User) request.getSession().getAttribute("user");
		List<Integer> imagesAllowed = new ArrayList<>();
		
		String albumName = request.getParameter("albumName");
		if (albumName == null || albumName.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Missing album name");
			return;
		}
		
		if (!isValidName(albumName)) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Invalid album name");
			return;
		}
		
		
		albumIdNotParsed = request.getParameter("albumId");
		if (albumIdNotParsed == null || albumIdNotParsed.isEmpty()) {
			//The user wants to create a new album
			try {
				System.out.println("Provo a creare un nuovo album");
				albumId = albumDAO.createEmptyAlbum(albumName, user.getId());
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later");
				return;
			}
		} else {
			//The user wants to edit an existing album
			try {
				albumId = Integer.parseInt(albumIdNotParsed);
				//Controllo che l'album appartenga all'utente
				if (albumDAO.getIdOwnerOfAlbum(albumId) != user.getId()) {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);// "You can't edit someone else's album.");
					response.getWriter().println("You are not allowed to edit someone else's album.");
					return;
				}
				albumDAO.changeAlbumName(albumId, albumName);
			} catch (NumberFormatException | NullPointerException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);// "Missing album ID");
				response.getWriter().println("Missing album ID.");
				return;
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later.");
				return;
			}
		}
		
		
		imageIDs = request.getParameterValues("imageId");
		int imageId;
		ImageDAO imageDAO = new ImageDAO(this.connection);
		
		if (imageIDs == null) {
			response.setStatus(HttpServletResponse.SC_OK);// "No images were selected.");
			return;
		}
		
		//Ottengo la lista di tutte le immagini che questo utente può aggiungere al suo album
		try {
			imagesAllowed = imageDAO.getImagesIDByUserNotInAlbum(user.getId(), albumId);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Internal server error, try later.");
			return;
		}
		
		for (Integer image : imagesAllowed) {
			System.out.println(image);
		}
		
		for (String imageIdString : imageIDs) {
			try {
				imageId = Integer.parseInt(imageIdString);
				
				//Controllo che l'immagine sia tra quelle autorizzate e nel caso la aggiungo all'album
				if (imagesAllowed.remove((Object) imageId))
					imageDAO.addImageToAlbumById(albumId, imageId);
			} catch (NumberFormatException | NullPointerException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);// "Sorry, something went wrong");
				response.getWriter().println("Sorry, something went wrong.");
				return;
			} catch (SQLException s) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Internal server error, try later.");
				return;
			}
			
		}
		
		response.setStatus(HttpServletResponse.SC_OK);
		
	}
	
	private boolean isValidName(String name) {
		if (name.startsWith(" "))
			return false;
		return true;
	}

}

//TODO EscapeString
