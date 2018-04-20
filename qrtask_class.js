class QrTask{
    /***Test for GitKrakenS */
    constructor(taskId, taskName, taskYear, taskLink) {
        console.log("In QrTask - initialising: id= " + taskId + " :name= " + taskName);
        this._taskId = taskId;
        this._tsl = "";
        this._taskName = taskName;
        this._taskYear = taskYear;
        this._taskLink = taskLink;
        this.getTaskShortLink();
    }
    getTaskName() {
        return this._taskName;
    }
    getTaskYear() {
        return this._taskYear;
    }    
    getTaskLink(){
        return this._taskLink;
    }
    getTaskShortLinkURL(){
        //public getter for shortened URL.
        //Don't directly call getTaskShortLink()...
        return this._tsl;
    }

    getTaskShortLink(){
        console.log("In getTaskShortLink() method!");
        if(this._taskId === 0){
            console.log("new task, create short url...");
            var text = "";
            let idLen = 6;
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
            for( var i=0; i < idLen - 1; i++ ){
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            this._tsl = text;
        } else {
            console.log("existing task, getting short url...");
            this._tsl = this._getTaskShortLink(this._taskId);
        }
    };
        
    _getTaskShortLink(taskId){
        var msg = "";
        console.log("taskId = " + taskId);
        $.ajax({
            url: "task_get_short_link.php",
            cache: false,
            type: 'POST',
            data: {'task_id': taskId},
            success: function(resp) {
                console.log("\n\getTaskShortLink: resp = " + resp);
                this._tsl = resp;
            },
            error: function(xhr, textStatus, error){
                displayMessage( "Error getting short url: " + error ); 
            }
        });
    
    }
    saveNewTask(){
        var msg = "";
        var long_link = this.getTaskLink();
        var task_name = this.getTaskName();
        var task_year = this.getTaskYear();

        if(this._taskId === 0){
            //new task.
            $.ajax({
                url: "savetasklinks.php",
                cache: false,
                type: 'POST',
                data: { 'long_link': long_link, 
                        'short_link': this.getTaskShortLinkURL(), 
                        'task_name': task_name, 
                        'school_year': task_year
                    }
            })
            .done(function(resp) {
                    console.log("\n\nsaveTaskLinks: resp = " + resp);
                    //console.log("school year after ajax = " + school_year);
                    //taskName = resp.split(",")[1];
                    var linkId = resp.split(",")[0];
                    //school_year = resp.split(",")[2];
                    _saveTask(task_name, linkId, task_year);										
            })
            .fail(function(xhr, textStatus, error){
                displayMessage( "Error deleting data: " + error ); 
            });
            
        } else {
            //editing existing task
            $.ajax({
                url: "updatetasklinks.php",
                cache: false,
                type: 'POST',
                data: {'long_link': this.getTaskLink(), 'short_link': this.getTaskShortLinkURL(), 'task_name': this.getTaskName(), 'school_year': this.taskYear},
                success: function(resp) {
                    console.log("\n\nsaveTaskLinks: resp = " + resp);
                    console.log("school year after ajax = " + school_year);
                    //taskName = resp.split(",")[1];
                    linkId = resp.split(",")[0];
                    //school_year = resp.split(",")[2];
                    _saveTask(this.getTaskName(), linkId, this.taskYear);										
                },
                error: function(xhr, textStatus, error){
                    displayMessage( "Error deleting data: " + error ); 
                }
            });
        }

    }

}
function _saveTask(taskName, linkId, school_year){
    $.post("savetask.php",{
       task_name: taskName,
       task_link_id: linkId,
       school_year: school_year
   })
   .done(function(resp) {
       console.log("\nStatus: ", resp);
   });
}