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
    var padding=90;

    if (dataset){ //if the dataset exists (eg reads in correctly)

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
                .attr("height",h)
                .attr("fill","grey");
        
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
        svg.append("text")
            .attr("transform",
                    "translate(" + (300)+ " ," +
                                    (h-20)+ ")")
            .text("Carbon Emissions of Australia in KiloTonnes");
        svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",20)
            .attr("x",-300)
            .text("Vehicle Population");
        
    }

    else{
        alert("Error loading data...");
    }


}

window.onload=init;