package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.beans.Album;
import it.polimi.tiw.dao.AlbumDAO;

import java.io.IOException;

import java.sql.Connection;
import it.polimi.tiw.utils.ConnectionHandler;
import java.sql.SQLException;

import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


@WebServlet("/GetAlbumInfo")
public class GetAlbumInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
	
	public GetAlbumInfo() {
		super();
	}
	
	public void init() throws ServletException {
		this.connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)  throws ServletException, IOException {
		
		ServletContext context = getServletContext();
		HttpSession session = request.getSession();
		
		User user = (User) session.getAttribute("user");
		
		Integer albumId = null;
		
		try {
			albumId = Integer.parseInt(request.getParameter("id"));
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		
		AlbumDAO albumDAO = new AlbumDAO(this.connection);
		Album albumToSend = null;
		
		try {
			albumToSend = albumDAO.getAlbumById(albumId);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
		
		if (albumToSend == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(albumToSend);
		
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