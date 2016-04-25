package com.test;

import java.applet.*;
import java.awt.*;

public class Main extends Applet{
	
   public void paint(Graphics g){
	   System.out.println("Main.paint()");
      g.drawString("Welcome in Java Applet.",40,20);
   }
}