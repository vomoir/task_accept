/*
window.onload = function() {
  
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var img = document.getElementById("img");
  ctx.drawImage(img, 0, 0);
};

var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
	document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
};

var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {

	var qr = qrcode(typeNumber || 10, errorCorrectLevel || 'L');
	qr.addData(text);
	qr.make();

//	return qr.createTableTag();
	return qr.createImgTag();
};

var update_qrcode = function() {
	var text = $('#txtRpt').val().replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
	//Max chars for QR Code is about 2192/10. Trim the text to be less than that.
	text = text.substring(0,219);
	document.getElementById('qr').innerHTML = create_qrcode(text);
};

*/
$(document).on("click", ".button-remove", function() {
    $(this).closest(".box").remove();
});
/*                <div class="row" id="qr_template">
                    <div class="col-md-6 highlight">
                        <h2 class="text-muted">Step 1.</h2>
                        <div class="form-group"> 
                            <label class="control-label" for="qrInput">Enter Text (about 200 characters) then click "QR Code Me!"</label>                             
                            <textarea class="form-control qr_message" rows="3" cols="12" id="qrInput"></textarea>
                            
                        </div>
                    </div>
                    
                    <div class="col-md-3 highlight">
                        <h2>Step 2.</h2>
                        <button onclick="update_qrcode();">QR Code Me!</button>
                        <div class="form-group" id="qr"></div>
                    </div>                                          
                    <div class="col-md-3 highlight">
                        <h2 class="text-muted">Step 3.</h3>
                        <div class="form-group">
                            <button onclick="addRow();">Save</button>
                        </div>
                    </div>
                </div>
*/
function addRow() {
    /* Add dynamic controls */
    var row = $("#qr_container").append("div").addClass("row");
    $(row).attr('id', 'qr1');
    var iCnt = 0;
    for(var i = 0; i < 1; i++){
        iCnt = iCnt + 1;
        var col = $(document.createElement('div'));
        $(col).attr('id', 'rub' + iCnt);
        col.addClass("col-md-6 highlight");
        $(col).append('h2').text("Step 1.");
        $(col).append('div').addClass('form-group');
        $(col).append('label').addClass('control-label').text('Enter text (about 200 characters) then click "QR Code Me!"');

        $(col).append('<textarea class="form-control qr_message" rows="3" cols="12" id="qr' + parseInt(iCnt - i) + '" />');

        $("#qr1").after(col);
    }
}
