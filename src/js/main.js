var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("component-responsive-frame/child");
var discog = require("../../data/discog.sheet.json");
var votes = require("../../data/vote.sheet.json");

var albumButtons = document.querySelectorAll(".albumButtons .albumButton");
var stat = document.querySelector(".stat");

var albumDetails = document.querySelector(".albumDetails")
var year = document.querySelector(".year");
var riaa = document.querySelector(".riaa");
var billboard = document.querySelector(".billboard");
var grammy = document.querySelector(".grammy");
var fact = document.querySelector(".fact");

var select = document.querySelector("select");
var submitButton = document.querySelector(".submit");
var verify = document.querySelector(".verify");
var scriptURL = 'https://script.google.com/macros/s/AKfycbyxFKs5OM9Mhr8XtVYSWVw_jIFILBjCWN2ywP6nBzPIjBKI4HA/exec'
var form = document.forms['submit-to-google-sheet'];

var voteTotals;

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
        displayAlbuminfo(this.classList[1]);

    }
    else{
        this.classList.remove("checked");
    }
}

function displayAlbuminfo(cat){
    var album;
    for (var x = 0; x<discog.length; x++){
        if(discog[x].data == cat){
            album = discog[x];
        }
    }

    year.innerText = album.year;
    riaa.innerText = album.riaa;
    billboard.innerText = album.billboard;
    grammy.innerText = album.grammy;
    fact.innerText = album.fact;
    albumDetails.setAttribute("style", "background-color: " + album.color + ";");
}

function albumButtonListener(){
    for(var x = 0; x <albumButtons.length; x++){
        albumButtons[x].setAttribute("style", "background-color: " + discog[x].color + ";");
        albumButtons[x].addEventListener("click", albumButton);
    }
}

albumButtonListener();

//reimplement this code so that a cookie drops and so we confirm they are voting!
// function voteDropdown(){
//     // console.log(select.value);
//     verify.innerText = "";
// }
// select.addEventListener("change", voteDropdown);


// function getCookie(name) {
//     var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
//     return v ? v[2] : null;
// }

// function submit(){
//     var vote = select.value;

//     if(getCookie("vote")){
//         verify.innerText = "Looks like you've already voted, come back tomorrow to vote again";
//     }
//     else if(vote == "default"){
//         verify.innerText = "Please select an album";
//     }
//     else{
//         var albumName = select.options[select.selectedIndex].text;
//         var statNum = 50;
//         var d = new Date();
//         d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

//         document.cookie = "vote="+vote + "; expires=" + d.toGMTString() + ";";
//         stat.innerText = statNum + "% of voters agree that " + albumName + " is Dave Matthews Band's Best album"
//     }
// }

form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  });

function tallyVotes(){
    if(votes.length){  
        voteTotals = {};
        var length = votes.length;
        var add;

        for(var x = 0; x < length; x++){
            add = votes[x].album;
            if(voteTotals[add] >= 0){
                voteTotals[add] +=1;
            } else{
                voteTotals[add] = 1;
            }
        }
    }  
}

tallyVotes();


