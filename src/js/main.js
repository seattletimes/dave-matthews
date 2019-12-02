var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");

var albumButtons = document.querySelectorAll(".albumButtons .albumButton");
var select = document.querySelector("select");
var submitButton = document.querySelector(".submit");
var verify = document.querySelector(".verify");
var stat = document.querySelector(".stat");


//button check and uncheck
function albumButton(){
    var classes = this.classList.value;

    if(classes.indexOf("checked") == -1){
        var checked = document.querySelectorAll(".checked");
        if(checked.length>0){
            for(var x = 0; x < checked.length; x++){
                checked[x].classList.remove("checked");
            }
        }
        this.classList.add("checked");  
    }
    else{
        this.classList.remove("checked");
    }
}

function albumButtonListener(){
    for(var x = 0; x <albumButtons.length; x++){
        albumButtons[x].addEventListener("click", albumButton);
    }
}

albumButtonListener();

function voteDropdown(){
    // console.log(select.value);
    verify.innerText = "";
}
select.addEventListener("change", voteDropdown);


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function submit(){
    var vote = select.value;

    if(getCookie("vote")){
        verify.innerText = "Looks like you've already voted, come back tomorrow to vote again";
    }
    else if(vote == "default"){
        verify.innerText = "Please select an album";
    }
    else{
        var albumName = select.options[select.selectedIndex].text;
        var statNum = 50;
        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

        document.cookie = "vote="+vote + "; expires=" + d.toGMTString() + ";";
        stat.innerText = statNum + "% of voters agree that " + albumName + " is Dave Matthews Band's Best album"
    }
}

submitButton.addEventListener("click", submit);

