//loads in the data, initialises the visualisation.
function init(){
    d3.csv("projectdata2.csv").then(function(data){

        dataset = data;
        console.log("readininfo",dataset); //reads in the csv information and logs it in the console.
        createScatter(dataset);

    });

}
/********************************
 * The following function is used to
 * improve the coherence and interactivity
 * of the visualisation, giving users
 * a chance to compare and see the
 * changes calculated between
 * two years of their choice.
 *******************************/

function compareInit(){ 
    var year1Val = document.getElementById("year1").value;
    var year2Val = document.getElementById("year2").value;
    console.log("year1=",year1Val);
    console.log("year2=",year2Val);

    d3.csv("projectdata2.csv").then(function(data){
        csvArray = data;

        data.forEach(function(d){
            if (year1Val == d.year){
                compare1year = d.year;
                compare1emissions = d.emissions;
                compare1carpop = d.carpop;
            }
            if (year2Val == d.year){
                compare2Year = d.year;
                compare2emissions = d.emissions;
                compare2carpop = d.carpop;
            }
            if ((compare1year) && (compare2Year)){
                
                var comparediv = d3.select("#svgtoedit")
                                    .append("div")
                                    .append("class","tooltip")
                                    .style("opacity",1);
            }

        })

    })

}

function compareData(csvArray,year1Val,year2Val){

}

/***************************************
 * The following function creates the
 * visualisation itself using D3v5.
 * It reads in the csv dataset and
 * plots onto an appropriate 
 * scatter plot.
 * Tooltips providing specific
 * point information can be found and utilised.
 **************************************/

function createScatter(dataset){

    var w = 900; //width of the svg
    var h = 500; //height of the svg
    var padding=90;

    if (dataset){ //if the dataset exists (eg reads in correctly)

        var xScale = d3.scaleLinear() 
                        .domain([320000,400000]) //values which the dataset lies 
                        .range([padding,w-padding]);

        var yScale = d3.scaleLinear()
                        .domain([12000000,18000000]) //values which the dataset lies.
                        .range([h-padding,padding]);

        var xAxis = d3.axisBottom()
                        .scale(xScale);
        
        var yAxis = d3.axisLeft()
                        .scale(yScale);

        var svg = d3.select("#svgtoedit") //creates the svg
                .append("svg")
                .attr("width",w)
                .attr("height",h)
                .attr("fill","grey");
        
        var tooltip = d3.select("#svgtoedit") //creates the tooltip.
                        .append("div")
                        .attr("class","tooltip")
                        .style("opacity",0);
        
        svg.selectAll("circle") //plots the points on the graph.
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
                    .attr("fill","yellow"); //mouseover goes yellow.

                var xPos = parseFloat(d3.select(this).attr("cx"))
                var yPos = parseFloat(d3.select(this).attr("cy"))
                console.log("x=",xPos);
                console.log("y=",yPos);
                
                var html  = "<b>"+d.year + "<b/> <br/>" +
                "<span>" +"Emissions(kt): " + d.emissions + "</span><br/>" +
                "<b>" +"Vehicle Population: "+ d.carpop;
                
                tooltip.html(html)
                        .style("left",(xPos-40)+"px")
                        .style("top",(yPos+150)+"px")
                        .transition()
                        .duration(500)
                        .style("opacity",0.9)
            })
            .on("mouseout",function(d,i){
                d3.select(this)
                    .attr("fill","red");
                tooltip.transition()
                        .duration(500)
                        .style("opacity",0);
            });
        
        svg.append("g") //creates the xAxis line.
            .attr("transform", "translate(0+"+ (h - padding) +")")
            .call(xAxis);

        svg.append("g") //creates the yAxis line.
            .attr("transform","translate(0"+(padding)+")")
            .call(yAxis);

        svg.append("text") //creates the xAxis Label
            .attr("transform","translate(" + (300)+ " ," + (h-20)+ ")")
            .text("Carbon Emissions of Australia in KiloTonnes");

        svg.append("text") //creates the yAxis Label.
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