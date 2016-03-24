package com.video.data.entity.manager;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;

import com.ibm.jpa.web.Action;
import com.ibm.jpa.web.JPAManager;
import com.ibm.jpa.web.NamedQueryTarget;
import com.video.data.entity.Video;

@JPAManager(targetEntity=com.video.data.entity.Video.class)
@SuppressWarnings("unchecked")
public class VideoManager {

	private EntityManagerFactory emf;

	protected static final class NamedQueries {

		protected static final String getVideo = "SELECT v FROM Video v ORDER BY v.rating DESC";
		protected static final String getVideoById = "SELECT v FROM Video v WHERE v.id = :id";
		protected static final String getVideoRatingById = "SELECT v.rating FROM Video v WHERE v.id = :id";
	}

	public VideoManager() {
	
	}

	public VideoManager(EntityManagerFactory emf) {
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
	
	@Action(Action.ACTION_TYPE.UPDATE)
	public String updateVideo(Video video) throws Exception {
		EntityManager em = getEntityManager();
		try {
			em.getTransaction().begin();
			video = em.merge(video);
			em.getTransaction().commit();
		} catch (Exception ex) {
			throw ex;
		} finally {
			em.close();
		}
		return "";
	}
	
	@Action(Action.ACTION_TYPE.FIND)
	public Video findVideoById(int id) {
		Video video = null;
		EntityManager em = getEntityManager();
		try {
			video = (Video) em.find(Video.class, id);
		} finally {
			em.close();
		}
		return video;
	}

	@NamedQueryTarget("getVideo")
	public List<Video> getVideo() {
		EntityManager em = getEntityManager();
		List<Video> results = null;
		try {
			Query query = em.createQuery(NamedQueries.getVideo);
			results = (List<Video>) query.getResultList();
		} finally {
			em.close();
		}
		return results;
	}

	
	@NamedQueryTarget("getVideoRatingById")
	public int getVideoRatingById(int id) {
		EntityManager em = getEntityManager();
		int result = -1;
		try {
			Query query = em.createQuery(NamedQueries.getVideoRatingById);
			query.setParameter("id", id);
			Object singleRes = query.getSingleResult();
			if(singleRes != null)
				result = (int)singleRes;
		} finally {
			em.close();
		}
		return result;
	}
	
	@NamedQueryTarget("getVideoById")
	public Video getVideoById(int id) {
		EntityManager em = getEntityManager();
		List<Video> results = null;
		try {
			Query query = em.createQuery(NamedQueries.getVideoById);
			query.setParameter("id", id);
			results = (List<Video>) query.getResultList();
		} finally {
			em.close();
		}
		if(results != null && results.size() == 1){
			return results.get(0);
		}
		return null;
	}
	
	@NamedQueryTarget("getVideo")
	public Video getTopRatingVideo() {
		EntityManager em = getEntityManager();
		List<Video> results = null;
		try {
			Query query = em.createQuery(NamedQueries.getVideo);
			query.setMaxResults(1);
			results = (List<Video>) query.getResultList();
		} finally {
			em.close();
		}
		if(results != null && results.size() == 1){
			return results.get(0);
		}
		return null;
	}
 }