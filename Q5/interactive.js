
var margin = { left:100, right:100, top:40, bottom:100 },
height = 400 - margin.top - margin.bottom, 
width = 700 - margin.left - margin.right;

var svg = d3.select("#graph")
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var svg2 = d3.select("#chart-area").append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom);

// var g = d3.select("#graph").append("g")
// .attr("transform", "translate(" + margin.left + 
//     ", " + margin.top + ")");
// var g2 = d3.select("#chart-area").append("g")
//     .attr("transform", "translate(" + margin.left + 
//         ", " + margin.top + ")");

// Time parser for x-scale
//var parseTimeFormat = d3.parseTime
var formatYear = d3.timeFormat("%Y");
var parseTime = d3.timeParse("%Y");

var colors = d3.scaleOrdinal()
  .domain(["South", "West", "Northeast", "Midwest"])
  .range(["#4daf4a", "#984ea3" , "#377eb8", "#e41a1c"]);

// 5. X scale will use the index of our data
var x = d3.scaleTime()
          .domain([new Date("2010"), new Date("2015")])
          .range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// // Create the svg canvas in the "graph" div
// var svg = d3.select("#graph")
//         .append("svg")
//         .style("width", width + margin.left + margin.right + "px")
//         .style("height", height + margin.top + margin.bottom + "px")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform","translate(" + margin.left + "," + margin.top + ")")
//         .attr("class", "svg");

const data = d3.csv('state-year-earthquakes.csv', function(d) {
    //console.log(data);
    // Data cleaning
    return {
        'state': d.state,
        'region': d.region,
         'year' : d.year,
        'count': +d.count
        
    };
}).then(function(data) {
var nest = d3.nest()
    .key(function(d){return d.region})
    .key(function(d){return d.year})
    .rollup(function(d) {return d3.sum(d, function(v) { return +v.count; });})
    .entries(data);
// var poo = d3.nest()
//     .key(function(d){return d.region})
//     .rollup(function(d) {return d3.sum(d, function(v) { return +v.count; });})
//     .entries(data);
// console.log(poo)
var valueLine = d3.line().x(function(d) { 
        //console.log(d.key)
        return  x(new Date(d.key)) })
    .y(function(d) { 
        //console.log(+d.value)
        return y(d.value); });
//x.domain(d3.extent(data, function(d) { return d.year; }));
//console.log(nest[1])
y.domain([0, d3.max(nest[1].values, function(d) { 
    //console.log(d.value) 
    return +d.value; })]);
// Set up the x axis
    svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .attr("class", "x axis")
       .call(d3.axisBottom(x))
          //.tickSize(0, 0)
          //.tickFormat(d3.timeFormat("%Y"))
          //.tickSizeInner(0)
          //.tickPadding(10);
// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
// Add title
svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text("US Earthquakes by Region 2010-2015");


//Draw lines----
nest.forEach(function(d){
    //console.table(d.key);
    svg.append("path")
       .datum( d.values)
       //.enter()
       .attr("class", ".line")
       .attr("d",valueLine)
       .style("stroke", colors(d.key));

       ;})
//legendconsole.log(data)
//var filtered_data = [];
var filtered_bar = function(d){

var svg2 = d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "svg2")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var g2 = d3.select("#graph").append("g")
    // .attr("transform", "translate(" + margin.left + 
    //     ", " + margin.top + ")");


var filtered_data = data.filter(function(j){return j.year == d.key &&  j.region == d.region;});
    filtered_data.sort(function(d){return d.state})
    filtered_data.sort(function(a,b){return -(a.count - b.count)});

    //console.log(filtered_data)
    x = d3.scaleLinear()
    .domain([0, d3.max(filtered_data, d => d.count)])
    .range([0, width])

    y = d3.scaleBand()
    .domain(filtered_data.map(d => d.state))
    .range([0, height]);
    //.padding(0.1)
     // append the rectangles for the bar chart
  svg2.selectAll(".bar")
      .data(filtered_data)
      .enter().append("rect")
     .attr("class", "bar")
     .attr("width", function(d) {return x(+d.count); } )
     .attr("y", function(d) { return y(d.state); })
     .attr("height", y.bandwidth())
     .style("fill", "steelblue");

    // add the x Axis
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg2.append("g")
       .attr("class", "y axis")
    //    .attr('transform', 'translate(' + width + ')')
       .call(d3.axisLeft(y));

 // Add title
    svg2.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("text-decoration", "underline")  
        .text(d.region + " Region Earthquakes " + d.key);

        console.log(d)

};

//console.log(nest) 
nest.forEach(function(d){
    //console.log(d.key);
    d.values.forEach(function(v){
    v.region = d.key;
    //console.log(v.key);
    //console.log(v.value);
    svg.append("circle")
       .data(d.values)
       //.enter().append("circle")
            .attr("class", "circle")
            .attr("cx", x(new Date (v.key))
             //console.log(d.key);
             //return x(new Date(d.key))
             )
            .attr("cy", y(v.value)
                 //console.log(v.value);
                 //console.log(d[i].value)
                 //return  y(d.value)
                 )
            .attr("r",4)
            .style("fill", colors(d.key))
                .on("mouseover", filtered_bar)
                .on("mouseout", function () 
                {  console.log("hello")
                    d3.select(".svg2").remove();});
    })
})

//legend
var regions_l = ["South", "West", "Northeast", "Midwest"]
// Lengend line chart
svg.selectAll("body")
   .data(regions_l)
   .enter()
   .append("circle")
     .attr("cx", 510)
     .attr("cy", function(d,i){ return 5 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
     .attr("r", 5)
     .style("fill", function(d){ return colors(d)})

svg.selectAll("body")
     .data(regions_l)
     .enter()
     .append("text")
       .attr("x", 530)
       .attr("y", function(d,i){ return 10 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
       //.style("fill", function(d){ return colors(d)})
       .text(function(d){ return d})
       //.attr("text-anchor", "left")
       //.style("alignment-baseline", "middle")
// create bar chart
});
