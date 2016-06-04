import com.test.util.AppLog;
import com.test.util.AppLogger;

public class Log4jTest {

	private static AppLogger log = AppLog.getLogger();
	
	public static void main(String[] args) {
		
		log.info("test inf");
		log.error(" test err");
		log.debug("test debug");
		
		test();
        System.out.println("Log4jTest.main() Done.");
	}
	
	private static void test(){
		log.info("test method");
	}
}