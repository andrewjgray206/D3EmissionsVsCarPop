function init(){
    d3.csv("projectdata.csv").then(function(data){
        dataset = data;
        console.log("readininfo",dataset);
        createScatter(dataset);
    });

}

function createScatter(dataset){
    var w = 700;
    var h = 200;
    var barPadding=10;

    if (dataset){
        var svg = d3.select("#svgtoedit")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
    }
    else{
        alert("Error loading data...");
    }


}
window.onload=init;