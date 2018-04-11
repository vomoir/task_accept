<?PHP
require_once("dbconnector.php");
//require_once("check_session.php");
error_log("In tasks_get_list.php\nChecking Session...");

if(!isset($_POST['submit'])){
/*
	if (!checkSession()){
		error_log("Session Time out.");
		echo "error: Session has timed out. Please login again...";
		return false;
		exit;
	} else {
		GetProjectsList();
	}
*/
		GetTasksList();	
}

function GetTasksList(){
/*
	if($_SESSION['admin'] == "false"){
		error_log("In project_get_list.php: NOT and admin!");
		echo "error: not authorised.";
		return false;
	
	}
*/
	error_log("GetTasksList...");
	//Return metadata about the columns in each table for a given database (table_schema)
	$qry = "SELECT id, task_name, school_year, task_link_id FROM tb_task order by id";
	
	error_log($qry);

	$dbConn = opendatabase();

	$result = mysqli_query($dbConn, $qry);
	if(!$result || mysqli_num_rows($result) <= 0){
		echo("Could not obtain metadata information.");
		return false;
	} else {
		error_log("Records found: " . mysqli_num_rows($result));
	}

	$data = array();
	/*
	while($obj = mysqli_fetch_object($result)) {
		$data[] = $obj;
	}
	//echo '{"users":'.json_encode($data).'}';
	echo json_encode($data);
	*/
	$options = "";
	while($row = mysqli_fetch_array($result)) {
		$options .= "<option value='" . $row['id'] . "'>";
		$options .= $row['task_name'] . "  (Year " . $row['school_year'] . ")" . "</option>";
	} 
	error_log($options);
	echo $options;
}
?>