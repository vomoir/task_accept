<?PHP
	require_once("dbconnector.php");
	/*
	require_once("check_session.php");

	if (!checkSession()){
		error_log("Session Time out.");
		echo "error: Session has timed out. Please login again...";
		return false;
	}
	*/

	date_default_timezone_set('Australia/Sydney');
	if(!empty($_REQUEST['tasklinks'])){
     // query string had param set to nothing ie ?param=&param2=something
	 	$taskLinks = $_GET['tasklinks'];
	} else {
	   $taskLinks = " ";
	}
	if(empty($_REQUEST['studentname'])){
		// No student name passed in on query string. Must not be using the App.
		// Redirect to different page to enter their details.
	 	header('Location: user_update.html?taskname=' . $_GET['taskname'] . '&year=' . $_GET['year']); 
	}
	
	$studentName = $_GET['studentname'];
	$taskName   = $_GET['taskname'];
	$schoolYear = $_GET['year'];
	
	error_log("studentName = " . $studentName);
	error_log("\ntaskName = " . $taskName);
	error_log("\nSchool Year = ". $schoolYear);
	error_log("\nTask Links = ". $taskLinks);
	
	$date = date('Y-m-d H:i:s a');
	$clientIp = $_SERVER['REMOTE_ADDR'];
	$serverIp = $_SERVER['SERVER_ADDR'];
	//$clientProxyIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
	//error_log("\nClient Proxy IP = ". $clientProxyIp);

	error_log("\nDate = " . $date);
	error_log("\nClient IP = ". $clientIp);
	$user_agent     =   $_SERVER['HTTP_USER_AGENT'];
	//error_log ("Browser stuff - " . $browserInfo);
	//$browser = get_browser();
	//error_log $browser;
	
	echo "Student: " . $studentName;
	echo "\nTask: " . $taskName;
	echo "\nCurrent Date/Time: " . $date;
	echo "\nClient IP = ". $clientIp;
	echo "\nServer IP = ". $serverIp;
	/***
	 * another way of obtaining ip adresses:
	 * $host= gethostname();
	 * $ip = gethostbyname($host);
	 */
	$clientOs = getOS();
	error_log("OS: " . getOS());
	//====================================================

	$dbConn = opendatabase();	
	$stmt = $dbConn->stmt_init(); 
	$sql = "INSERT INTO tb_notification(student_name, task_name, school_year, task_links, notify_date, user_ip, user_agent) VALUES (?,?,?,?,?,?,?);";
	
	error_log("QRY: " . $sql);
	
	if($stmt->prepare($sql)){
		// Bind parameters:	s - string, b - blob, i - int, etc
		$stmt -> bind_param("ssissss", $studentName, $taskName, $schoolYear, $taskLinks, $date, $clientIp, $clientOs );
		/* Execute it */
		$stmt -> execute();
		/* Close statement */
		$stmt -> close();
		error_log("Insert/update successful.",0);		
	} else {
		error_log("Error!Prepare failed: (" . $dbConn->errno . ") " . $dbConn->error ,0);
	}	

  $dbConn -> close();


function getOS() { 

    global $user_agent;

    $os_platform    =   "Unknown OS Platform";

    $os_array       =   array(
                            '/windows nt 10/i'     =>  'Windows 10',
                            '/windows nt 6.3/i'     =>  'Windows 8.1',
                            '/windows nt 6.2/i'     =>  'Windows 8',
                            '/windows nt 6.1/i'     =>  'Windows 7',
                            '/windows nt 6.0/i'     =>  'Windows Vista',
                            '/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
                            '/windows nt 5.1/i'     =>  'Windows XP',
                            '/windows xp/i'         =>  'Windows XP',
                            '/windows nt 5.0/i'     =>  'Windows 2000',
                            '/windows me/i'         =>  'Windows ME',
                            '/win98/i'              =>  'Windows 98',
                            '/win95/i'              =>  'Windows 95',
                            '/win16/i'              =>  'Windows 3.11',
                            '/macintosh|mac os x/i' =>  'Mac OS X',
                            '/mac_powerpc/i'        =>  'Mac OS 9',
                            '/linux/i'              =>  'Linux',
                            '/ubuntu/i'             =>  'Ubuntu',
                            '/iphone/i'             =>  'iPhone',
                            '/ipod/i'               =>  'iPod',
                            '/ipad/i'               =>  'iPad',
                            '/android/i'            =>  'Android',
                            '/blackberry/i'         =>  'BlackBerry',
                            '/webos/i'              =>  'Mobile'
                        );

    foreach ($os_array as $regex => $value) { 

        if (preg_match($regex, $user_agent)) {
            $os_platform    =   $value;
        }

    }   

    return $os_platform;

}

function getBrowser() {

    global $user_agent;

    $browser        =   "Unknown Browser";

    $browser_array  =   array(
                            '/msie/i'       =>  'Internet Explorer',
                            '/firefox/i'    =>  'Firefox',
                            '/safari/i'     =>  'Safari',
                            '/chrome/i'     =>  'Chrome',
                            '/edge/i'       =>  'Edge',
                            '/opera/i'      =>  'Opera',
                            '/netscape/i'   =>  'Netscape',
                            '/maxthon/i'    =>  'Maxthon',
                            '/konqueror/i'  =>  'Konqueror',
                            '/mobile/i'     =>  'Handheld Browser'
                        );

    foreach ($browser_array as $regex => $value) { 

        if (preg_match($regex, $user_agent)) {
            $browser    =   $value;
        }

    }

    return $browser;

}
/*
	$user_os        =   getOS();
	$user_browser   =   getBrowser();
	$device_details =   "<strong>Browser: </strong>".$user_browser."<br /><strong>Operating System: </strong>".$user_os."";
	print_r($device_details);
	echo("<br /><br /><br />".$_SERVER['HTTP_USER_AGENT']."");
*/
?>