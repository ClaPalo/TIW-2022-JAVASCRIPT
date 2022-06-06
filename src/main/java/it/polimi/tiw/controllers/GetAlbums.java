package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.beans.Album;
import it.polimi.tiw.dao.AlbumDAO;

import java.io.IOException;

import java.sql.Connection;
import it.polimi.tiw.utils.ConnectionHandler;
import java.sql.SQLException;

import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


@WebServlet("/GetAlbums")
public class GetAlbums extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
	
	public GetAlbums() {
		super();
	}
	
	public void init() throws ServletException {
		this.connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)  throws ServletException, IOException {
		
		HttpSession session = request.getSession();
		
		User user = (User) session.getAttribute("user");
		String albumsAreMine = request.getParameter("myalbums");
		
		System.out.println(albumsAreMine);
		
		if (albumsAreMine == null || (!albumsAreMine.equals("true") && !albumsAreMine.equals("false"))) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		
		AlbumDAO albumDAO = new AlbumDAO(this.connection);
		List<Album> albumsToSend = null;
		
		try {
			if (albumsAreMine.equals("true"))
				albumsToSend = albumDAO.getAlbumsByUser(user.getId(), true);
			else
				albumsToSend = albumDAO.getAlbumsByUser(user.getId(), false);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(albumsToSend);
		
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
	
}