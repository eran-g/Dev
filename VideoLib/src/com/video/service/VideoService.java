package com.video.service;

import java.lang.reflect.Type;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.video.data.ManagerFactory;
import com.video.data.entity.Comment;
import com.video.data.entity.Video;
import com.video.data.entity.manager.CommentManager;
import com.video.data.entity.manager.VideoManager;

@Path("/VideoService")
public class VideoService {
	
   private static final String FAILURE_RESULT="{\"msg\":\"failure\"}";
   
   VideoManager vManager = ManagerFactory.getVideoManager();
   CommentManager cManager = ManagerFactory.getCommentManager();
   
   Type video_type = new TypeToken<Video>() {}.getType();
   Type videos_type = new TypeToken<List<Video>>() {}.getType();
   Type comments_type = new TypeToken<List<Comment>>() {}.getType();
   
   @GET
   @Path("/videos")
   @Produces(MediaType.APPLICATION_JSON)
   public String getAllVideos(){

	   List<Video> videos = vManager.getVideo();
	   return videos2json(videos);
   }

   @GET
   @Path("/video")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public String getVideoData(@QueryParam("id") int id){
      
	   try {
		   Video video = vManager.findVideoById(id);
		   if(video == null){
			   return FAILURE_RESULT;
		   }

		   JSONObject videoJson = new JSONObject(video2json(video));
		   videoJson.put("datestr", video.getDatestr());
		   JSONObject videoData = new JSONObject();
		   videoData.put("video", videoJson);
		   
		   List<Comment> comments = ManagerFactory.getCommentManager().getCommentByVideoId(id);
		   if(comments.size() > 0){
			
			   JSONArray commentsJson = new JSONArray(comments2json(comments));
			   videoData.put("comments", commentsJson);
		   }
		   return videoData.toString();
		   
	   } catch (JSONException e) {

		   e.printStackTrace();
		   return FAILURE_RESULT;
	   }
   }
   
   @GET
   @Path("/rating")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public String getVideoRating(@QueryParam("id") int id){
      
	   Video video = vManager.findVideoById(id);
	   if(video == null){
		   return FAILURE_RESULT;
	   }
	   
	   JSONObject json = new JSONObject();
	   try {
		json.put("rating", formatRating(video.getRating()));
	   } catch (JSONException e) {
		e.printStackTrace();
	   }
	   return json.toString();
   }
   
   @POST
   @Path("/comment")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public String addVideoComment(@QueryParam("id") int id, @QueryParam("comment") String vcomment){
	    
	   try {
		   Comment comment = new Comment();
		   comment.setVideoid(id);
		   comment.setDate(new Date());
		   comment.setText(vcomment);
		   cManager.createComment(comment);
		   
		   JSONObject resp = new JSONObject();
		   try {
			   resp.put("msg", "Comment saved.");
		   } catch (JSONException e) {
			   e.printStackTrace();
		   }
		   
		   return resp.toString();
		   
		} catch (Exception e) {
			e.printStackTrace();
			return FAILURE_RESULT;
		}
   }
   
   @POST
   @Path("/rate")
   @Consumes(MediaType.APPLICATION_JSON)
   @Produces(MediaType.APPLICATION_JSON)
   public String addVideoRating(@QueryParam("id") int id, @QueryParam("rating") int newRating){
	    
	   try {
		   Video video = vManager.getVideoById(id);
		   float rating = newRating;
		   if(video.getRating() > 0){
			   
			   rating = (video.getRating() + newRating) / 2;
			   rating = formatRating(rating);   
		   }
		   
		   video.setRating(rating);
		   vManager.updateVideo(video);
		   JSONObject resp = new JSONObject();
		   resp.put("rating", String.valueOf(rating));
		   return resp.toString();
		   
		} catch (Exception e) {
			e.printStackTrace();
			return FAILURE_RESULT;
		}
   }

	private float formatRating(float rating) {
		rating = Float.parseFloat(new DecimalFormat("##.##").format(rating));
		return rating;
	}

   private String video2json(Video video) {
		Gson gson = new Gson();
		String json = gson.toJson(video, video_type);
		return json;
   }
   
   private String videos2json(List<Video> videos) {
		Gson gson = new Gson();
		String json = gson.toJson(videos, videos_type);
		return json;
	}
   
   private String comments2json(List<Comment> comments) {
		Gson gson = new Gson();
		String json = gson.toJson(comments, comments_type);
		return json;
	}
}