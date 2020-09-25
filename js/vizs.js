function sum(total, num) {
  return total + num;
}

function bar_chart(){
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 450 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var svg=d3.select("#bar_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  x.domain(cat_data.map(function(d) { return d.x; }));
  y.domain([0, d3.max(cat_data, function(d) { return d.value; })]);
  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(cat_data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill","steelblue")
      
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

function pie_chart(){
  // set the dimensions and margins of the graph
  var width = 450
      height = 450
      margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  // append the svg object to the div called 'my_dataviz'
  var svg = d3.select("#pie_chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  pie_data = []
  cat_data.forEach(function(d){
    pie_data.push(d.value)
  })
  total = pie_data.reduce(sum)

  //define the color scale
  var color = d3.scaleOrdinal(d3.schemeCategory20);  

  var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);

  var labelArc = d3.arc()
      .outerRadius(radius-40)
      .innerRadius(radius-40);

  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d; });

  var g = svg.selectAll(".arc")
      .data(pie(pie_data))
    .enter().append("g")
      .attr("class", "arc");
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });
  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".50em")
      .text(function(d) { return ((d.data/total).toFixed(2)*100).toString()+'%'; });

}

function line_chart(){
  // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 450 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#line_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
//Read the data
d3.csv("../data/line_data.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
  },

  // Now I can use this dataset:
  function(data) {

    data.forEach(function(d){
      line_data.push(+d.value)
    })

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

  })
}

function multivariate(){
  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 10, bottom: 10, left: 0},
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#multivariate")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv("./data/demo_data.csv", function(data) {

    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = d3.keys(data[0])
    
    for (i in dimensions) {
      name = dimensions[i]
      max = d3.max(data,function(d){return +d[name]})
      min = d3.min(data,function(d){return +d[name]})
      stats[name] = [min,max]
      
    }
    console.log(stats)

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
      name = dimensions[i]
      y[name] = d3.scaleLinear()
        .domain( d3.extent(data, function(d) { return +d[name]; }) )
        .range([height, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
      .range([0, width])
      .padding(1)
      .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("stroke-width", 5)
      .style("opacity", 0.8)
      .on("click",function(d){
        play_sound(d)
        console.log(d)
      })
      .on("mouseover",function(){
        $(this).css("stroke","orange")
      })
      .on("mouseout",function(){
        $(this).css("stroke","#69b3a2")
      })

    // Draw the axis:
    svg.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // And I build the axis with the call function
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      // Add axis title
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")

  })
}