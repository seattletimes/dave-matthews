var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

const Tabletop = require('tabletop');
require("component-responsive-frame/child");
var d3 = require("d3");

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
var viewResults = document.querySelector(".viewResults");
var submitButton = document.querySelector(".submit");
var verify = document.querySelector(".verify");
var scriptURL = 'https://script.google.com/macros/s/AKfycbyxFKs5OM9Mhr8XtVYSWVw_jIFILBjCWN2ywP6nBzPIjBKI4HA/exec'
var form = document.forms['submit-to-google-sheet'];
var svgContainer = document.querySelector(".svg-container");

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


//poll section

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}



function submitHandler(e){
    var vote = select.value;

    if(vote == "default"){
        verify.innerText = "Please select an album";
    }
    else if(getCookie("vote")){
        verify.innerText = "Looks like you've already voted, come back tomorrow to vote again";
        init();
        svgContainer.style.display = "inline-block";
    }
    else{
        verify.innerText = "";
        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

        document.cookie = "vote="+vote + "; expires=" + d.toGMTString() + ";";
        
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
          .then(response => console.log('Success!', response))
          .catch(error => console.error('Error!', error.message));
        setTimeout(function() { init(); }, 1000);
        svgContainer.style.display = "inline-block";
    }
}



function tally(voteData){
    if(voteData.length > 0){  
        var totals =      [   { name: "underTheTableAndDreaming", label: "Under the Table and Dreaming", count: 0},
        { name: "crash", label: "Crash", count: 0},
        { name: "beforeTheseCrowdedStreets", label: "Before These Crowded Streets", count: 0},
        { name: "everyday", label: "Everyday", count: 0 },
        { name: "bustedStuff", label: "Busted Stuff", count: 0},
        { name: "standUp", label: "Stand Up", count: 0},
        { name: "bigWhiskey", label: "Big Whiskey", count: 0}, 
        { name: "awayFromTheWorld", label: "Away From The World", count: 0 },
        { name: "comeTomorrow", label: "Come Tomorrow", count: 0} ];
        var length = voteData.length;
        var add = "";

        for(var x = 0; x < length; x++){
            add = voteData[x].album;
                for(var y = 0; y < totals.length; y++){
                    if(totals[y].name == add){
                        totals[y].count += 1;
                }
            }
        }
        for(var x = 0; x < totals.length; x++){
            var percent = totals[x].count/voteData.length;
            totals[x].count = percent;
         }
    }
    return totals;
}  



var publicSpreadSheetUrl = "https://docs.google.com/spreadsheets/d/1odzOwj1yo6HAwE4pMyvH4OkG2CR6cNcnXouPSPoLHe8/edit?usp=sharing"

function init() {
    Tabletop.init( { key: publicSpreadSheetUrl,
                     callback: showInfo,
                     simpleSheet: false } )
  }

function showInfo(data, tabletop) {
    var allVotes = tabletop.sheets("vote").elements;
    var totals = tally(allVotes);
    
    totals.sort(function(a, b){
        return d3.ascending(a.count, b.count);
    });
      
    var svg = d3.select("svg");
    var margin = {top: 10, right: 20, bottom: 100, left: 10};
    var width = +svg.attr("width") - margin.left - margin.right ;
    var height = +svg.attr("height") - margin.top - margin.bottom;


    var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    x.domain(totals.map(function(d) { return d.label; }));
    y.domain([0, d3.max(totals, function(d) { return d.count; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var bar = g.selectAll(".bar")
      	.data(totals)
        .enter().append("rect")
        .attr("x", function(d) { return x(d.label); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); });

    g.selectAll("text")
        .attr("transform", "rotate(30)")
        .style("font-size", "12px")
        .style("text-anchor", "start");
  }


form.addEventListener('submit', function(a){
    submitHandler(a);
});

viewResults.addEventListener('click', function(a){
    verify.innerText = "";
    init();
    svgContainer.style.display = "inline-block";
});

