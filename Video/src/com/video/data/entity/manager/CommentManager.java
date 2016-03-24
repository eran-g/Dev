package com.video.data.entity.manager;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;

import com.ibm.jpa.web.Action;
import com.ibm.jpa.web.JPAManager;
import com.ibm.jpa.web.NamedQueryTarget;
import com.video.data.entity.Comment;

@JPAManager(targetEntity=com.video.data.entity.Comment.class)
@SuppressWarnings("unchecked")
public class CommentManager {

	private EntityManagerFactory emf;

	protected static final class NamedQueries {

		protected static final String getCommentByVideoId = "SELECT c FROM Comment c WHERE c.videoid = :video_id";
	}

	public CommentManager() {
	
	}

	public CommentManager(EntityManagerFactory emf) {
		this.emf = emf;
	}

	public void setEntityManagerFactory(EntityManagerFactory emf) {
		this.emf = emf;
	}

	private EntityManager getEntityManager() {
		if (emf == null) {
			throw new RuntimeException(
					"The EntityManagerFactory is null.  This must be passed in to the constructor or set using the setEntityManagerFactory() method.");
		}
		return emf.createEntityManager();
	}
	
	@Action(Action.ACTION_TYPE.CREATE)
	public boolean createComment(Comment comment) throws Exception {
		
		boolean ret = true;
		EntityManager em = getEntityManager();
		try {
			em.getTransaction().begin();
			em.persist(comment);
			em.getTransaction().commit();
		} catch (Exception ex) {
			
			ret = false;
			throw ex;
		} finally {
			em.close();
		}
		return ret;
	}
	
	@NamedQueryTarget("getCommentByVideoId")
	public List<Comment> getCommentByVideoId(int video_id) {
		
		EntityManager em = getEntityManager();
		List<Comment> results = null;
		try {
			Query query = em.createQuery(NamedQueries.getCommentByVideoId);
			query.setParameter("video_id", video_id);
			results = (List<Comment>) query.getResultList();
		} finally {
			em.close();
		}
		return results;
	}
 }