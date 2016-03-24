package com.video.data;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import com.video.data.entity.manager.CommentManager;
import com.video.data.entity.manager.VideoManager;

public class ManagerFactory {

	public static final EntityManagerFactory emf = Persistence.createEntityManagerFactory("Video");

	public static VideoManager getVideoManager() {
		return new VideoManager(emf);
	}
	
	public static CommentManager getCommentManager(){
		return new CommentManager(emf);
	}
}