//loads in the data, initialises the visualisation.
function init(){
    d3.csv("projectdata2.csv").then(function(data){

        dataset = data;
        console.log("readininfo",dataset); //reads in the csv information and logs it in the console.
        createScatter(dataset); //calls the createScatter function whenever the script is loaded.
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

    d3.select(".compareTip")
        .remove(); //removes any previous tips that might be on the screen.

    d3.csv("projectdata2.csv").then(function(data){ //reloads the data in for this function
        csvArray = data;
        var compare1Year;
        var compare1emissions;
        var compare1CarPop;
        var compare2Year;
        var compare2emissions;
        var compare2CarPop;

        data.forEach(function(d){
            if (year1Val == d.year){

                compare1Year = d.year;
                compare1emissions = d.emissions;
                compare1CarPop = d.carpop;
            }
        });

        data.forEach(function(d){

            if (year2Val == d.year){

                compare2Year = d.year;
                compare2emissions = d.emissions;
                compare2CarPop = d.carpop;
            }
        });

            if (compare2CarPop && compare1CarPop){

                var comparedCarPop = ((compare2CarPop / compare1CarPop)*100)-100;
                comparedCarPop = comparedCarPop.toFixed(2);

                var comparedEmissions = ((compare2emissions/compare1emissions)*100)-100;
                comparedEmissions = comparedEmissions.toFixed(2);
                
                var compareDiv = d3.select("#compareform")
                                    .append("div")
                                    .attr("class","compareTip");

                var compareHtml = "Between " + compare1Year + " and " + compare2Year
                + " there was been a " + comparedCarPop + "% change" +" in Car Population,"+
                " and a " + comparedEmissions + "% change in Emissions.";

                compareDiv.html(compareHtml)
                            .style("opacity",0)
                            .transition()
                            .duration(1500)
                            .style("opacity",0.9);
            }
        })
}

/***************************************
 * The following function creates the
 * visualisation itself using D3 version 5.
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
                        .style("top",(yPos+250)+"px")
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