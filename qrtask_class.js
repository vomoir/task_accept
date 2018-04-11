class QrTask{
    /***Test for GitKrakenS */
    constructor(taskId, taskName, taskYear, taskLink) {
        this._taskId = taskId;
        this._taskName = taskName;
        this._taskYear = taskYear;
        this._taskLink = taskLink;
        this._taskShortLink = function(){
            if(this._taskId === 0){
                //new task, create short url
                var text = "";
                let idLen = 6;
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            
                for( var i=0; i < idLen - 1; i++ ){
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            } else {
                return getTaskShortLink(this._taskId);
            }
        };
    }
    getTaskName() {
        return this._taskName};
    }
    getTaskYear() {
        return this._taskYear;
    }    
    getTaskLink(){
        return this._taskLink;
    }
    getTaskShortLink(){

    }
}