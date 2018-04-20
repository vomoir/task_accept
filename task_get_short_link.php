<?PHP
/********************
Author:
Function:
*********************/

$taskId = $_POST['task_id'];

/*
session_start();
if (!(isset($_SESSION['name_of_username']) && $_SESSION['login'] != '')) {
	//ajax redirect here
}

//$user_id = $_SESSION['id_of_user'];
*/
date_default_timezone_set('Australia/Sydney');
error_log("In task_get_short_link.php...");

require_once("dbconnector.php");
//require_once("check_session.php");
/*
if (!checkSession()){
	error_log("Session Time out.");
	echo "error: Session has timed out. Please login again...";
	return false;
}
*/

GetTaskShortLink($taskId);

function GetTaskShortLink($taskId){
	//Return metadata about the columns in each table for a given database (table_schema)
	$qry = "SELECT tb_task_link.id, tb_task_link.long_url, tb_task_link.short_url FROM tb_task_link 
	INNER JOIN tb_task on tb_task_link.id = tb_task.task_link_id
	WHERE tb_task.id = " . $taskId;

	date_default_timezone_set('Australia/Sydney');
	error_log("In task_get_short_link.php...\n" . $qry);
	
	$dbConn = opendatabase();

	$result = mysqli_query($dbConn, $qry);
	
	date_default_timezone_set('Australia/Sydney');	
	error_log("Records in Projects: " . mysqli_num_rows($result));
	
	if(!$result || mysqli_num_rows($result) <= 0){
		echo("Could not obtain metadata information.");
		return false;
	} else {
		$row = mysqli_fetch_assoc($result);
		error_log("Short url = " . $row['short_url'],0);
		echo $row['short_url'];
	}
	$dbConn -> close();
}
?>