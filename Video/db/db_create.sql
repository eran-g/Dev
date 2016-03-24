DROP DATABASE IF EXISTS anyclip;

CREATE DATABASE IF NOT EXISTS video;
USE video;

DROP TABLE IF EXISTS `video`.`video`;
CREATE TABLE  `video`.`video` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(250) DEFAULT NULL,
  `thumb` varchar(45) DEFAULT NULL,
  `rating` float DEFAULT '0',
  `title` varchar(145) DEFAULT NULL,
  `description` varchar(245) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `video`.`video` (`filename`,`thumb`,`title`,`description`,`date`) VALUES
 ('IMG_1040.mp4','1.png','Video 1','Video 1 desc','2016-03-09 14:49:22'),
 ('IMG_1041.mp4','2.png','Video 2','Video 2 desc','2016-03-09 14:49:22'),
 ('IMG_1042.mp4','3.png','Video 3','Video 3 desc','2016-03-09 14:49:22');

DROP TABLE IF EXISTS `video`.`comment`;
CREATE TABLE  `video`.`comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `videoid` int(10) unsigned NOT NULL,
  `text` varchar(250) CHARACTER SET latin1 DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `datestr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_comment_videoid` (`videoid`),
  CONSTRAINT `FK_comment_videoid` FOREIGN KEY (`videoid`) REFERENCES `video` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;