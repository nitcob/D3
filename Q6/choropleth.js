
  const svg = d3.select('svg');
  const g = svg.append('g');
  const projection = d3.geoAlbersUsa();
  const path_generator = d3.geoPath().projection(projection);
 
// soruce https://vizhub.com/undefined/64d13b7ba93243c6addee8ec2327f969
  
  // Get data
  Promise.all([
  	d3.csv('state-earthquakes.csv'),
    d3.json('states-10m.json')
  ]).then(([csv_data, jsondata]) => {
    
    const region = {};
    const earthquakestot = {};
    const earthquakeslog = {};
    
    csv_data.forEach(d => { 
      region[d.States] = d.Region;
      earthquakestot[d.States] = d["Total Earthquakes"];
      d["Total Earthquakes"] = Math.log((+d["Total Earthquakes"])+1);
      earthquakeslog[d.States] = d["Total Earthquakes"];
    });
     
    const states = topojson.feature(jsondata, jsondata.objects.states);
    const color = d3.scaleThreshold();
    //console.log(states);
    const color_value = d => earthquakeslog[d.properties.name];
    var dom = [0,1,2,3,4,5,6,7,8];
    var color_list = ['#ffffff', '#fff5f0', 	'#fee0d2', 	'#fcbba1', 	'#fc9272', 	'#fb6a4a', 	'#ef3b2c', 	'#cb181d', 	'#a50f15', 	'#67000d']
   	color.domain(dom)
         .range(color_list);
    // Set tooltips
  const tip = d3.tip()
          .attr('class', 'd3-tip')
          .direction('e')
          .offset([-6, 0])
          .html(
            d => "State " +d.properties.name + "<br> Region: " + region[d.properties.name] +"<br>Total: "+earthquakestot[d.properties.name]
            )
 
 svg.call(tip);
  //console.log(states.features)
    //console.log(color);
    g.selectAll('path')
    	.data(states.features)
      .enter()
      	.append('path')
    			.attr('class', 'state')
    			.attr('d', path_generator)
          .attr('fill', d => color(color_value(d)))
          .on('mouseover',function(d){
              tip.show(d);
              d3.select(this)
              .style('opacity', 1)
              .style('stroke-width', 3)
          })
          .on('mouseout', function(d){
              tip.hide(d);
              d3.select(this)
                .style('opacity', 0.9)
                .style('stroke-width',0.4);
          });

   //legend

    var labels = [1,5,10,50,100,500,1000,1500,2000];
    //var log_legend = d => d.dom;
    var legend = g.selectAll("body")
          .data([1,5,10,50,100,500,1000,1500,5000]);
    legend.enter().append("g")
          .attr("class", "legend")
          .append("rect")
          .attr("x", 850)
          .attr("y", function(d, i) {return 290 + 27*i; })
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", function(d,i){return color_list[i]})

    g.selectAll("body")
          .data(labels)
          .enter()
            .append("text")
            .attr("x", 850 + 40)
            .attr("y", function(d, i) {return 300 + 29*i; })
            .attr("width", 30)
            .attr("height", 50) 
            .style("fill", "black")
            .text(function(d){ return d})
            .attr("text-anchor", "left")


    g.append("text")
      .attr("x", 830)
      .attr("y", function(d, i) {return 275; })
      .attr("width", 30)
      .attr("height", 50) 
      .style("fill", "black")
      .text("Total Earthquakes")
      .attr("text-anchor", "left")

                
  }) 