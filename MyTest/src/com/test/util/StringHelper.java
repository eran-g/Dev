package com.test.util;

public class StringHelper {

	public static String gracefullTrim(String src, int maxLength){
		String str = src;
		if(src.length() > maxLength){
			str = src.substring(0,maxLength);
			
			if(str.lastIndexOf(" ") > -1){
				str = str.substring(0,str.lastIndexOf(" "));
			}else if (str.lastIndexOf(".") > -1){
				str = str.substring(0,str.lastIndexOf("."));
			}else if (str.lastIndexOf(",") > -1){
				str = str.substring(0,str.lastIndexOf(","));
			}
		}
		if(str.length() < src.length()){
			str+=" ...";
		}
		return str;
	}
	 
	public static boolean isEmptyString(String str){
		return str == null || (str != null && str.trim().length() == 0);
	}
	/* remove leading whitespace */
	public static String ltrim(String source) {
	  return source.replaceAll("^\\s+", "");
	 }

	 /* remove trailing whitespace */
	public static String rtrim(String source) {
	  return source.replaceAll("\\s+$", "");
	 }
	
}