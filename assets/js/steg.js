$(document).ready(function () {
	$("a").on('click', function(event) {
		// Make sure this.hash has a value before overriding default behavior
		if (this.hash !== "") {
			// Prevent default anchor click behavior
			event.preventDefault();

			// Store hash
			var hash = this.hash;

			// Using jQuery's animate() method to add smooth page scroll
			// The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
			$('html, body').animate({scrollTop: $(hash).offset().top}, 800, function(){
				// Add hash (#) to URL when done scrolling (default click behavior)
				window.location.hash = hash;
			});
		} // End if
	});
	updateTaskList();
	
});
function updateTaskList(){
	var jqXhr = $.ajax({
		url: "tasks_get_list.php",
		cache: false
	});
	jqXhr.done(function(data){
		$("#tasks_list").empty();
		$("#tasks_list").append("<option>--Select task--</option>");
		$("#tasks_list").append(data);			
	})
	.fail(function(xhr){
		console.log("error: ", xhr);
	});
}
var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {

	var qr = qrcode(typeNumber || 10, errorCorrectLevel || 'L');
	qr.addData(text);
	qr.make();

	//	return qr.createTableTag();
	return qr.createImgTag();
};

function saveNewTask(){
	var taskName =  $('#taskName').val();
	var task_year = $('#taskYear').val();
	var task_link = $('#taskLinks').val();
	let qrTask = new QrTask(0, taskName, task_year, task_link);

	console.log("Task name = " + qrTask.getTaskName());
	qrTask.saveNewTask();
	//put the new class in the global scope so we can 
	//generate QR code.
	var global = window || global;
	global.qrTask = qrTask;
	//display the QR code for the newly instanciated class
	update_qrcode();
	updateTaskList();
}

var update_qrcode = function() {

	var taskName = qrTask.getTaskName();
	var taskNameUri = "taskname=" + taskName;

	var taskYear = qrTask.getTaskYear();
	var taskYearUri = "&year=" + taskYear;

	var taskLinks = encodeURI(qrTask.getTaskLink());
	taskLinks = "&tasklinks=" + qrTask.getTaskShortLinkURL();	
	
	$("#qrLabel").val(taskName);

	$.post("iptest.php",
	    function(taskName, data){
			//alert("Data: " + data + "\nStatus: " + status);
			console.log("Server IP address = " + data);
		}
	);
	
	var text = "http://10.145.165.220/task_accepted/index.php?";
	text += taskNameUri + taskLinks + taskYearUri;
	
	if(text.length > 0){
		//Max chars for QR Code is about 2192/10. Trim the text to be less than that.
		text = text.substring(0,219);
		var qrDiv = document.getElementById('qr');
		qrDiv.innerHTML = create_qrcode(text);
		var qrLabel = $("#qrLabel").val();
		//$('#qrLabel').add('p').addClass('qrdesc'); //jquery version
		//$("qrDescPara").addClass("qrdesc"); //jquery version
		
		var qrDescPara = document.createElement("p");
		qrDescPara.classList.add("qrdesc");
		var qrDesc = document.createTextNode(qrLabel);
		qrDescPara.appendChild(qrDesc);
		qrDiv.appendChild(qrDescPara);
		//scroll to top of page so we can see the new QR image
		$("#wrap").animate({ scrollTop: $(document).height() }, "slow");
	}
};

function embed_qrcode(){
	var qrImage;
	var mainImage;
	var result;
	//add an id to the qr Image element so we can access it directly
	$('#qr img').attr("id","qrImg");
	qrImage = document.querySelector("#qrImg");
	//mainImage = $("#picFile").attr("src");
	mainImage = document.querySelector("#picFile");
	result = embedImage(mainImage, qrImage);
}


function newTask(){
	//let qrTask = new QrTask(taskId, taskName, task_year, task_link);
	$('#tasks_list').val(0);
	$('#taskName').val("");
	$('#taskLinks').val("");
	$('#taskYear').val("");
	$('#linkTest').wrap(function() {
		var link = $('<a/>');
		link.attr('href', "#");
		link.attr('target','_blank');
		return link;
	 });
}

function getTaskData(taskId){
	console.log("Task Id = " + taskId);
	if(taskId > 0){
		//alert(projId);
		$.ajax({
			type: "POST",
			url: "task_get_detail.php",
			cache: false,
			data: {'ID': taskId},
			dataType: "xml",
			success: function(xml) {
				console.log(xml);
				$(xml).find('task_detail').each(function(){
					var taskName = $(this).find("task").text();
					var task_link = $(this).find("task_link").text()
					var task_year = $(this).find("task_year").text();

					let qrTask = new QrTask(taskId, taskName, task_year, task_link);
					$('#taskName').val(qrTask.getTaskName());
					$('#taskLinks').val(qrTask.getTaskLink());
					$('#taskYear').val(qrTask.getTaskYear());
					$('#linkTest').wrap(function() {
						var link = $('<a/>');
						link.attr('href', qrTask.getTaskLink());
						link.attr('target','_blank');
						return link;
					 });

					console.log("Task name = " + qrTask.getTaskName());
					//put the new class in the global scope so we can 
					//generate QR code.
					var global = window || global;
					global.qrTask = qrTask;
					//display the QR code for the newly instanciated class
					update_qrcode();
				});
			},
			error: function(xhr, textStatus, error){
				console.log(xhr.statusText);
				console.log(textStatus);
				console.log(error);
			}
		});
	} 
}