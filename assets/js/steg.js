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

	$.ajax({
		url: "tasks_get_list.php",
		cache: false,
		success: function(html){
			console.log(html);
			$("#tasks_list").append(html);
		}
	});
	
});

var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {

	var qr = qrcode(typeNumber || 10, errorCorrectLevel || 'L');
	qr.addData(text);
	qr.make();

	//	return qr.createTableTag();
	return qr.createImgTag();
};

var update_qrcode = function() {
	//alert("Creating QR...");
	var taskName = $('#taskName').val();
	var taskNameUri = "taskname=" + taskName;

	var taskYear = $('#taskYear').val();
	var taskYearUri = "&year=" + taskYear;

	var taskLinks = encodeURI($('#taskLinks').val());
	//Task links (web resources for the task) is optional
	//var taskLinks = "";
	//https://mncatholic-my.sharepoint.com/personal/tony_edwards_mn_catholic_edu_au/_layouts/OneNote.aspx?id=%2Fpersonal%2Ftony_edwards_mn_catholic_edu_au%2FDocuments%2FClass%20Notebooks%2F11_SDD_2017&wd=target%28_Content%20Library%2FAssessments.one%7C199D0074-5298-460B-8499-0B324E98092D%2FHSC%20Task%201%7C859E2C44-87C3-43DB-A1F6-9654EDF0543A%2F%29 onenote:https://mncatholic-my.sharepoint.com/personal/tony_edwards_mn_catholic_edu_au/Documents/Class%20Notebooks/11_SDD_2017/_Content%20Library/Assessments.one#HSC%20Task%201&section-id={199D0074-5298-460B-8499-0B324E98092D}&page-id={859E2C44-87C3-43DB-A1F6-9654EDF0543A}&end
	if(taskLinks.length > 0){
		var shortLink = makeshort(taskLinks, 6);
		var tasklinkId = saveTaskLink(taskName, taskYear, taskLinks, shortLink);
		//tasklinkId returning as 'undefined' because of asynchronous nature of ajax call
		//console.log("new tasklink id = " + tasklinkId);
		taskLinks = "&tasklinks=" + shortLink;	
		//$.get("http://tinyurl.com/api-create.php?url=" + taskLinks , function(shorturl){
		//	alert(shorturl)
		//});		
	}
	
	$("#qrLabel").val(taskName);

	$.post("iptest.php",
	    function(taskName, data){
			alert("Data: " + data + "\nStatus: " + status);
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

function makeshort(longString, idLen){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < idLen - 1; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
    return text;
}

function saveTaskLink(taskName, school_year,  longLink, shortLink){
	var msg = "";
	console.log("school year = " + school_year);
	$.ajax({
		url: "savetasklinks.php",
		cache: false,
		type: 'POST',
		data: {'long_link': longLink, 'short_link': shortLink, 'task_name': taskName, 'school_year': school_year},
		success: function(resp) {
			console.log("\n\nsaveTaskLinks: resp = " + resp);
			console.log("school year after ajax = " + school_year);
			//taskName = resp.split(",")[1];
			linkId = resp.split(",")[0];
			//school_year = resp.split(",")[2];
			saveTask(taskName, linkId, school_year);										
		},
		error: function(xhr, textStatus, error){
			displayMessage( "Error deleting data: " + error ); 
		}
	});
/*
	$.post("savetasklinks.php",{
        long_link: longLink,
		short_link: shortLink,
		task_name: taskName
    },
    function(taskName, data){
		//alert("Data: " + data + "\nStatus: " + status);
		console.log("Task link added. Link id = " + data + "\n calling saveTask(" + taskName + ", \n" + data);
		saveTask(taskName, data[0]);
    });
*/
}
function saveTask(taskName, linkId, school_year){
	$.post("savetask.php",{
	   task_name: taskName,
	   task_link_id: linkId,
	   school_year: school_year
   },
   function(data, status){
	   alert("Data: " + data + "\nStatus: " + status);
   });
}

function getTaskData(taskId){
	console.log("Task Id = " + taskId);
	var qrTask = new QrTask("Task Fred",9,"http://vomoir.com/vertalert");
	console.log("Task name = " + qrTa)
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
					//var nName = this.nodeName;
					//alert("Node Name = " + nName);
					var taskName = $(this).find("task").text();
					$('#taskName').val(taskName);
					var task_link = $(this).find("task_link").text()
					$('#taskLinks').val(task_link);
					$('#linkTest').wrap(function() {
						var link = $('<a/>');
						link.attr('href', task_link);
						link.attr('target','_blank');
						//link.text($(this).text());
						return link;
					 });
					var task_year = $(this).find("task_year").text();
					console.log(task_year);
					$('#taskYear').val(task_year);
					//Need to generate the QR Code for the retrieved
					//task lest we create a duplicate record if
					//we want to see the code.
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