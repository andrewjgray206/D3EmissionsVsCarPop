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
        
        var tooltip = d3.select("#svgtoedit")
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);
        
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
            .attr("r",6)
            .attr("fill","red")
            .on("mouseover",function(d){
                d3.select(this)
                    .attr("fill","yellow");

                var xPos = parseFloat(d3.select(this).attr("cx"))
                var yPos = parseFloat(d3.select(this).attr("cy"))
                console.log("x=",xPos);
                console.log("y=",yPos);
                
                var html  = "<b>"+d.year + "<b/> <br/>" +
                "<span>" +"Emissions(kt): " + d.emissions + "</span><br/>" +
                "<b>" +"Vehicle Population: "+ d.carpop;
                
                tooltip.html(html)
                        .style("left",(xPos-40)+"px")
                        .style("top",(yPos+80)+"px")
                        .transition()
                        .duration(200)
                        .style("opacity",0.9)
            })
            .on("mouseout",function(d,i){
                d3.select(this)
                    .attr("fill","red");
                tooltip.style("opacity",0);
            });
        
        svg.append("g")
            .attr("transform", "translate(0+"+ (h - padding) +")")
            .call(xAxis);
        svg.append("g")
            .attr("transform","translate(0"+(padding)+")")
            .call(yAxis);
        svg.append("text")
            .attr("transform","translate(" + (300)+ " ," + (h-20)+ ")")
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