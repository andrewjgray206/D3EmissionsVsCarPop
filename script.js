function init(){
    d3.csv("projectdata2.csv").then(function(data){

        dataset = data;
        console.log("readininfo",dataset); //reads in the csv information and logs it in the console.
        createScatter(dataset);

    });

}

function createScatter(dataset){

    var w = 900;
    var h = 500;
    var padding=60;

    if (dataset){

        var xScale = d3.scaleLinear()
                        .domain([320000,400000])
                        .range([padding,w-padding]);

        var yScale = d3.scaleLinear()
                        .domain([12000000,18000000])
                        .range([h-padding,padding]);

        var xAxis = d3.axisBottom()
                        .scale(xScale);
        
        var yAxis = d3.axisLeft()
                        .scale(yScale);

        var svg = d3.select("#svgtoedit")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
        
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx",function(d,i){
                return xScale(d.emissions);
            })
            .attr("cy",function(d){
                return yScale(d.carpop);
            })
            .attr("r",5)
            .attr("fill","red");
        
        svg.append("g")
            .attr("transform", "translate(0+"+ (h - padding) +")")
            .call(xAxis);
        svg.append("g")
            .attr("transform","translate(0"+(padding)+")")
            .call(yAxis);
        
    }

    else{
        alert("Error loading data...");
    }


}

window.onload=init;