<?PHP
/********************
Author:
Function:
*********************/

$taskId = $_POST['ID'];

/*
session_start();
if (!(isset($_SESSION['name_of_username']) && $_SESSION['login'] != '')) {
	//ajax redirect here
}

//$user_id = $_SESSION['id_of_user'];
*/
date_default_timezone_set('Australia/Sydney');
error_log("In task_get_detail.php...");

require_once("dbconnector.php");
//require_once("check_session.php");
/*
if (!checkSession()){
	error_log("Session Time out.");
	echo "error: Session has timed out. Please login again...";
	return false;
}
*/

GetProjectDetail($taskId);

function GetProjectDetail($projId){
	//Return metadata about the columns in each table for a given database (table_schema)
	$qry = "SELECT tb_task.task_name, tb_task_link.long_url, tb_task.school_year, tb_task.task_link_id FROM tb_task
    INNER JOIN tb_task_link on tb_task.task_link_id = tb_task_link.id
    WHERE tb_task.id = " . $projId;
	date_default_timezone_set('Australia/Sydney');
	error_log("In task_get_detail.php...\n" . $qry);
	
	$dbConn = opendatabase();

	$result = mysqli_query($dbConn, $qry);
	
	date_default_timezone_set('Australia/Sydney');	
	error_log("Records in Projects: " . mysqli_num_rows($result));
	
	if(!$result || mysqli_num_rows($result) <= 0){
		echo("Could not obtain metadata information.");
		return false;
	}

	/*****************************************************************/
	$xml = new XMLWriter();
	//$projXml  = new DOMDocument();
	//$xml->openURI("php://output");
	$xml->openMemory();
	
	$xml->startDocument();
		$xml->setIndent(true);
		$xml->startElement("task_detail");
			while ($row = mysqli_fetch_assoc($result)) {
				$_SESSION['task_name']  = $row['task_name'];

				$xml->startElement("task");
					$xml->writeAttribute('id', $projId);
					$xml->writeRaw($row['task_name']);
				$xml->endElement();
				
				$xml->startElement("task_year");
					$xml->writeRaw($row['school_year']);
				$xml->endElement();			

				$xml->startElement("task_link");
					$xml->startCdata("task_link");
						$xml->writeRaw($row['long_url']);
					$xml->endCdata();	
				$xml->endElement();								
			}
		$xml->endElement();
	$xml->endDocument();
	$dbConn -> close();
	header('Content-type: text/xml');

	$strXML = $xml->outputMemory(TRUE);
	$xml->flush();
	date_default_timezone_set('Australia/Sydney');
	error_log("String XML:\n " . $strXML);
	//$projXml->loadXML($strXML);
	echo $strXML;
	/*****************************************************************
	$options = array();
	while ($row = mysqli_fetch_assoc($result)){
		$options['object_row'][] = $row;
	}
	echo json_encode($options);
	*****************************************************************/
}
?>