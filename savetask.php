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
	$task_name = $_POST['task_name'];
	$task_link_id = $_POST['task_link_id'];
	$task_year = $_POST['school_year'];

	error_log("task_name= " . $task_name);
	error_log("\nlink id = " . $task_link_id);

	$dbConn = opendatabase();	
	$stmt = $dbConn->stmt_init(); 

	$sql = "INSERT INTO tb_task(task_name, task_link_id, school_year) VALUES (?,?,?)";
	error_log("QRY: " . $sql);
	
	if($stmt->prepare($sql)){
		// Bind parameters:	s - string, b - blob, i - int, etc
		$stmt -> bind_param("sii", $task_name, $task_link_id, $task_year);
		/* Execute it */
		$stmt -> execute();
		//Get the id of the new record
		$task_id = $stmt -> insert_id;
		error_log("New Record has id: " . $task_id);
		/* Close statement */
		$stmt -> close();
		error_log("Insert/update successful.",0);
		echo $task_id;
	} else {
		error_log("Error!Prepare failed: (" . $dbConn->errno . ") " . $dbConn->error ,0);
	}	

  $dbConn -> close();
?>