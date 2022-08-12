// ALL
function allTop(){
  $("#top_bar").empty()
  // set the dimensions and margins of the graph
  const top_margin = {top: 50, right: 30, bottom: 150, left: 60},
      top_width = 650 - top_margin.left - top_margin.right,
      top_height = h/2 - top_margin.top - top_margin.bottom;

  // append the svg object to the body of the page
  const top_svg = d3.select("#top_bar")
    // Container class to make it responsive.
    .classed("svg-container", true)
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", top_width + top_margin.left + top_margin.right)
      .attr("height", top_height + top_margin.top + top_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${top_margin.left}, ${top_margin.top})`);

  // Parse the Data
  d3.csv("covid_cases.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return a['Cases in the last 7 days/1M pop'] - b['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0,5);
    //var top_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });
    var top_max = 0;
    data.forEach(function(entry){ 
      var num = Number(entry['Cases in the last 7 days/1M pop']);
      //console.log(wc_num);
      if (num > top_max){
        top_max = num;
      }
      });
    // X axis
    const x = d3.scaleBand()
      .range([0, top_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      top_svg.append("g")
      .attr("transform", `translate(0, ${top_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, top_max+100])
      .range([top_height, 0]);

      top_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      top_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => top_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#e63946")
  })
}



// NORTH AMERICA
function naTop(){
  $("#top_bar").empty()
  // set the dimensions and margins of the graph
  const top_margin = {top: 50, right: 30, bottom: 150, left: 60},
      top_width = 650 - top_margin.left - top_margin.right,
      top_height = h/2 - top_margin.top - top_margin.bottom;

  // append the svg object to the body of the page
  const top_svg = d3.select("#top_bar")
    // Container class to make it responsive.
    .classed("svg-container", true)
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", top_width + top_margin.left + top_margin.right)
      .attr("height", top_height + top_margin.top + top_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${top_margin.left}, ${top_margin.top})`);

  // Parse the Data
  d3.csv("north_america_covid_weekly_trend.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return a['Cases in the last 7 days/1M pop'] - b['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0,5);
    //var top_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });
    var top_max = 0;
    data.forEach(function(entry){ 
      var num = Number(entry['Cases in the last 7 days/1M pop']);
      //console.log(wc_num);
      if (num > top_max){
        top_max = num;
      }
      });
    // X axis
    const x = d3.scaleBand()
      .range([0, top_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      top_svg.append("g")
      .attr("transform", `translate(0, ${top_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, top_max+100])
      .range([top_height, 0]);

      top_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      top_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => top_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#e63946")
  })
}



// SOUTH AMERICA
function saTop(){
  $("#top_bar").empty()
  // set the dimensions and margins of the graph
  const top_margin = {top: 50, right: 30, bottom: 150, left: 60},
      top_width = 650 - top_margin.left - top_margin.right,
      top_height = h/2 - top_margin.top - top_margin.bottom;

  // append the svg object to the body of the page
  const top_svg = d3.select("#top_bar")
    // Container class to make it responsive.
    .classed("svg-container", true)
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", top_width + top_margin.left + top_margin.right)
      .attr("height", top_height + top_margin.top + top_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${top_margin.left}, ${top_margin.top})`);

  // Parse the Data
  d3.csv("covid_south_america_weekly_trend.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return a['Cases in the last 7 days/1M pop'] - b['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0, 5);
    console.log(top5);
    //var top_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });
    var top_max = 0;
    data.forEach(function(entry){ 
      var num = Number(entry['Cases in the last 7 days/1M pop']);
      //console.log(wc_num);
      if (num > top_max){
        top_max = num;
      }
      });

    // X axis
    const x = d3.scaleBand()
      .range([0, top_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      top_svg.append("g")
      .attr("transform", `translate(0, ${top_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, top_max+100])
      .range([top_height, 0]);

      top_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      top_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => top_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#e63946")
  })
}