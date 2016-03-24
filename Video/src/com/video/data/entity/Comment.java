package com.video.data.entity;

import java.io.Serializable;

import javax.persistence.*;

import java.text.SimpleDateFormat;
import java.util.Date;

@SuppressWarnings("serial")
@Entity
public class Comment implements Serializable {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private Date date;
	
	private String text;

	private int videoid;

	public Comment() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getDate() {
		return this.date;
	}
	
	public String getDatestr() {
		
		SimpleDateFormat sDateFormat = new SimpleDateFormat("MMM.dd.yyyy");
		return sDateFormat.format(this.date);
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getVideoid() {
		return this.videoid;
	}

	public void setVideoid(int videoid) {
		this.videoid = videoid;
	}

}