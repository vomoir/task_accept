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
	$long_link = $_POST['long_link'];
	$short_link = $_POST['short_link'];
	$task_name = $_POST['task_name'];
	$task_year = $_POST['school_year'];

	error_log("long link= " . $long_link);
	error_log("\nshort link = " . $short_link);
	error_log("\ntask name = " . $task_name);
	error_log("\ntask year = " . $task_year);
	
	$dbConn = opendatabase();	
	$stmt = $dbConn->stmt_init(); 
	$sql = "INSERT INTO tb_task_link( long_url, short_url) VALUES (?, ?)";
	
	error_log("QRY: " . $sql);
	
	if($stmt->prepare($sql)){
		// Bind parameters:	s - string, b - blob, i - int, etc
		$stmt -> bind_param("ss", $long_link, $short_link);
		/* Execute it */
		$stmt -> execute();
		//Get the id of the new record
		$link_id = $stmt -> insert_id;
		error_log("New Record has id: " . $link_id);
		/* Close statement */
		$stmt -> close();
		error_log("Insert/update successful.",0);
		//$out['task_name'] = $task_name;
		//$out['link_id'] = $link_id;
		//return array($link_id, $task_name);
		echo $link_id . "," . $task_name . "," . $task_year ;
		//echo $task_name;
	} else {
		error_log("Error!Prepare failed: (" . $dbConn->errno . ") " . $dbConn->error ,0);
	}	

  $dbConn -> close();
?>