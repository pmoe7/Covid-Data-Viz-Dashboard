// ALL
function allBot(){
  $("#bot_bar").empty()
  // set the dimensions and margins of the graph
  const bot_margin = {top: 10, right: 30, bottom: 150, left: 60},
      bot_width = 650 - bot_margin.left - bot_margin.right,
      bot_height = h/2 - bot_margin.top - bot_margin.bottom;

  // append the svg object to the body of the page
  const bot_svg = d3.select("#bot_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", bot_width + bot_margin.left + bot_margin.right)
      .attr("height", bot_height + bot_margin.top + bot_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${bot_margin.left}, ${bot_margin.top})`);

  // Parse the Data
  d3.csv("covid_cases.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return b['Cases in the last 7 days/1M pop'] - a['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0,5);
    var bot_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });

    // X axis
    const x = d3.scaleBand()
      .range([0, bot_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      bot_svg.append("g")
      .attr("transform", `translate(0, ${bot_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, bot_max])
      .range([bot_height, 0]);

      bot_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      bot_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => bot_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#74c69d")
  })
}

// NORTH AMERICA
function naBot(){
  $("#bot_bar").empty()
  // set the dimensions and margins of the graph
  const bot_margin = {top: 10, right: 30, bottom: 150, left: 60},
      bot_width = 650 - bot_margin.left - bot_margin.right,
      bot_height = h/2 - bot_margin.top - bot_margin.bottom;

  // append the svg object to the body of the page
  const bot_svg = d3.select("#bot_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", bot_width + bot_margin.left + bot_margin.right)
      .attr("height", bot_height + bot_margin.top + bot_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${bot_margin.left}, ${bot_margin.top})`);

  // Parse the Data
  d3.csv("north_america_covid_weekly_trend.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return b['Cases in the last 7 days/1M pop'] - a['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0,5);
    var bot_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });

    // X axis
    const x = d3.scaleBand()
      .range([0, bot_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      bot_svg.append("g")
      .attr("transform", `translate(0, ${bot_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, bot_max])
      .range([bot_height, 0]);

      bot_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      bot_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => bot_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#74c69d")
  })
}

// SOUTH AMERICA
function saBot(){
  $("#bot_bar").empty()
  // set the dimensions and margins of the graph
  const bot_margin = {top: 10, right: 30, bottom: 150, left: 60},
      bot_width = 650 - bot_margin.left - bot_margin.right,
      bot_height = h/2 - bot_margin.top - bot_margin.bottom;

  // append the svg object to the body of the page
  const bot_svg = d3.select("#bot_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${h/2}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", bot_width + bot_margin.left + bot_margin.right)
      .attr("height", bot_height + bot_margin.top + bot_margin.bottom-50)
      .append("g")
      .attr("transform", `translate(${bot_margin.left}, ${bot_margin.top})`);

  // Parse the Data
  d3.csv("covid_south_america_weekly_trend.csv").then ( function(data) {
    // sort data
    data.sort(function(b, a) {
      return b['Cases in the last 7 days/1M pop'] - a['Cases in the last 7 days/1M pop'];
    });
    const top5 = data.slice(0,5);
    var bot_max = d3.max(top5, function(d) { return d['Cases in the last 7 days/1M pop']; });

    // X axis
    const x = d3.scaleBand()
      .range([0, bot_width])
      .domain(top5.map(d => d['Country/Other']))
      .padding(0.2);

      bot_svg.append("g")
      .attr("transform", `translate(0, ${bot_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, bot_max])
      .range([bot_height, 0]);

      bot_svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
      bot_svg.selectAll("top-bar")
      .data(top5)
      .enter()
      .append("rect")
        .attr("x", d => x(d['Country/Other']))
        .attr("y", d => y(d['Cases in the last 7 days/1M pop']))
        .attr("width", x.bandwidth())
        .attr("height", d => bot_height - y(d['Cases in the last 7 days/1M pop']))
        .attr("fill", "#74c69d")
  })
}