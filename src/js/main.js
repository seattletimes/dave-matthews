var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");

var albumButtons = document.querySelectorAll(".albumButtons .albumButton");
//var colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "DarkSlateBlue", "OrangeRed"];

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