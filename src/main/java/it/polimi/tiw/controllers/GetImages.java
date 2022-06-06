package it.polimi.tiw.controllers;

import it.polimi.tiw.beans.Image;
import it.polimi.tiw.dao.ImageDAO;

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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


@WebServlet("/GetAlbumImages")
public class GetImages extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection;
	
	public GetImages() {
		super();
	}
	
	public void init() throws ServletException {
		this.connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)  throws ServletException, IOException {
		
		Integer albumId = null;
		
		try {
			albumId = Integer.parseInt(request.getParameter("id"));
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		
		ImageDAO imageDAO = new ImageDAO(this.connection);
		List<Image> imagesToSend = null;
		
		try {
			imagesToSend = imageDAO.getImagesByAlbum(albumId);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(imagesToSend);
		
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