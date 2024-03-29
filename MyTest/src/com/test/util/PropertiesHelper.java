package com.test.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertiesHelper
{
    // private static final AppLogger log = AppLog.getLogger(PropertiesHelper.class.getName());
	private static Properties properties = null;
	
	private PropertiesHelper() {
    	throw new UnsupportedOperationException();
    }

	public static void setBoolean(String name, boolean b){
		if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	properties.setProperty(name, b?"true":"false");
	}
	
	public static String get(String name){
    	if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	try{
    		return properties.getProperty(name).trim();
    	}catch (Exception e) {
			return null;
		}
    }
	
	public static String getString(Properties props, String propName, String defaultValue){

		String prop = props.getProperty(propName);
		return !StringHelper.isEmptyString(prop)? prop : defaultValue;
	}
	
    public static String getString(String name, String deflt){
    	
    	if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	
    	if(deflt != null && properties.getProperty(name)==null){
    		return deflt;
    	}else{
    		return properties.getProperty(name).trim();
    	}
    }
	
	public static int getInt(Properties props, String propName, int defaultValue){

		try {
			String prop = props.getProperty(propName);
			if(!StringHelper.isEmptyString(prop)){
				if(Integer.parseInt(prop) > -1){
					return Integer.parseInt(prop);
				}
			}
		} catch (NumberFormatException e) {
			return defaultValue;
		}
		return defaultValue;
	}

    public static int getInt(String name, Integer deflt){

    	if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	
    	String prop = properties.getProperty(name);
		if(!StringHelper.isEmptyString(prop)){
			return new Integer(prop.trim()).intValue();
		}
		return deflt;
		/*
    	if(deflt != null && properties.getProperty(name)==null){
    		return deflt;
    	}else{
    		return new Integer(properties.getProperty(name).trim()).intValue();
    	}
    	*/
    }

    public static long getLong(String name, Long deflt){
    	
    	if(properties == null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}

		String prop = properties.getProperty(name);
		if(!StringHelper.isEmptyString(prop)){
			return new Long(prop);
		}
		return deflt;
    }
    
    public static int getInt(String name){
    	if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	
    	return getInt(name,null);
    }
    
	public static Properties loadDefaultProperties(){
    	try {
    		loadProperties(properties, "default.properties");
    		return properties;
		} catch (IOException e) {
			
			return null;
		}
    }
    
    public static Properties loadProperties(final String path) throws IOException {
        final Properties props = new Properties();
        PropertiesHelper.loadProperties(props, path);
        return props;
    }

	public static boolean getBoolean(String name) {
		if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	try{
    		return properties.getProperty(name).equalsIgnoreCase("true");
    	}catch (Exception e) { 
			return false;
		}
	}
	
	public static boolean getBoolean(String name, boolean defaultValue) {
		
		if(properties == null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
		String prop = properties.getProperty(name);
		if(!StringHelper.isEmptyString(prop)){
			return prop.equalsIgnoreCase("true");
		}
		return defaultValue;
	}
	
	public static boolean getBoolean(Properties props, String name, boolean defaultValue){

		String prop = props.getProperty(name);
		if(!StringHelper.isEmptyString(prop)){
			return prop.equalsIgnoreCase("true");
		}
		return defaultValue;
	}
	
	public static void set(String name, String val) {
		if(properties==null){
    		properties = new Properties();
    		loadDefaultProperties();
    	}
    	properties.setProperty(name, val);		
	}
	
	private static void loadProperties(final Properties props, final String path) throws IOException {
        
    	final InputStream in = new FileInputStream(path);

        try {
            props.load(in);
        }
        
        finally {
            in.close();
        }
    }
}
