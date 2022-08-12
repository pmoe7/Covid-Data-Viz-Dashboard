// ALL
function allWc(){
  $("#change_bar").empty()
  // set the dimensions and margins of the graph
  var wc_margin = {top: 20, right: 100, bottom: 40, left: 20},
      wc_width = 650 - wc_margin.left - wc_margin.right,
      wc_height = h - 100 - wc_margin.top - wc_margin.bottom;

  // append the svg object to the body of the page
  var wc_svg = d3.select("#change_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${wc_height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", wc_width + wc_margin.left + wc_margin.right)
      .attr("height", wc_height + wc_margin.top + wc_margin.bottom)
      .append("g")
      .attr("transform", "translate(" + wc_margin.left + "," + wc_margin.top + ")");

  function normalize(val, max, min) { 
    return ((val - min) / (max - min))*100; 
  };

  // Parse the Data
  d3.csv("covid_cases.csv").then( function(data) {
      // fix country name for America and others
      // data.set("United States", data.get("USA"));
      // data.delete("USA");
      // data.set("Falkland Is.", data.get("Falkland Islands"));
      // data.delete("Falkland Islands"); 

    let wc_max = 0;
    let wc_min = 0;
    data.forEach(function(entry){ 
      wc_num = Number(entry['Weekly Case % Change']);
      //console.log(wc_num);
      if (wc_num > wc_max){
        wc_max = wc_num;
      }
      if (wc_num < wc_min){
        wc_min = wc_num;
      }
      });
    
    console.log("Max: ", wc_max);
    console.log("Min: ", wc_min);
    var norm_max = normalize(wc_max, wc_max, wc_min);
    console.log("Norm Max: ", norm_max);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([wc_min, norm_max])
      .range([0, wc_width]);

    // Y axis
    const y = d3.scaleBand()
      .range([0, wc_height ])
      .domain(data.map(d => d['Country/Other']))
      .padding(.1);


    //Bars
    wc_svg.selectAll("bars")
      .data(data)
      .join("rect")
      .attr("class", function(d) { return "bar bar--" + (d['Weekly Case % Change'] < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d['Weekly Case % Change'])); })
      .attr("y", d => y(d['Country/Other']))
      //.attr("width", d => x(d['Weekly Case % Change']))
      .attr("width", function(d) { 
        if (d['Weekly Case % Change'] > norm_max) {
          return x(norm_max);
        }
        else{
          return Math.abs(x(d['Weekly Case % Change']) - x(0));
        }
      })
      .attr("height", y.bandwidth())

      //labels
      wc_svg.selectAll("labels")        
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function(d) { return wc_width-100; })
      .style("text-anchor", "start")
      .attr("y", d => y(d['Country/Other']))
      .attr("dy", "1em")
      .text(function(d) { if (d['Weekly Case % Change'] > norm_max) {
        return d['Weekly Case % Change']; }
        else{
          return ;
        }
      }); 
      
      wc_svg.append("g")
      .attr("transform", `translate(${wc_width/2}, 0)`)
      .call(d3.axisLeft(y));

      wc_svg.append("g")
      .attr("class", "label")
      .attr("transform", `translate(0, ${wc_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  })
}

// NORTH AMERICA
function naWc(){
  $("#change_bar").empty()
  // set the dimensions and margins of the graph
  var wc_margin = {top: 20, right: 100, bottom: 40, left: 20},
      wc_width = 650 - wc_margin.left - wc_margin.right,
      wc_height = h - 100 - wc_margin.top - wc_margin.bottom;

  // append the svg object to the body of the page
  var wc_svg = d3.select("#change_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${wc_height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", wc_width + wc_margin.left + wc_margin.right)
      .attr("height", wc_height + wc_margin.top + wc_margin.bottom)
      .append("g")
      .attr("transform", "translate(" + wc_margin.left + "," + wc_margin.top + ")");

  function normalize(val, max, min) { 
    return ((val - min) / (max - min))*100; 
  };

  // Parse the Data
  d3.csv("north_america_covid_weekly_trend.csv").then( function(data) {
      // fix country name for America and others
      // data.set("United States", data.get("USA"));
      // data.delete("USA");
      // data.set("Falkland Is.", data.get("Falkland Islands"));
      // data.delete("Falkland Islands"); 

    let wc_max = 0;
    let wc_min = 0;
    data.forEach(function(entry){ 
      wc_num = Number(entry['Weekly Case % Change']);
      //console.log(wc_num);
      if (wc_num > wc_max){
        wc_max = wc_num;
      }
      if (wc_num < wc_min){
        wc_min = wc_num;
      }
      });
    
    console.log("Max: ", wc_max);
    console.log("Min: ", wc_min);
    var norm_max = normalize(wc_max, wc_max, wc_min);
    console.log("Norm Max: ", norm_max);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([wc_min, norm_max])
      .range([0, wc_width]);

    // Y axis
    const y = d3.scaleBand()
      .range([0, wc_height ])
      .domain(data.map(d => d['Country/Other']))
      .padding(.1);


    //Bars
    wc_svg.selectAll("bars")
      .data(data)
      .join("rect")
      .attr("class", function(d) { return "bar bar--" + (d['Weekly Case % Change'] < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d['Weekly Case % Change'])); })
      .attr("y", d => y(d['Country/Other']))
      //.attr("width", d => x(d['Weekly Case % Change']))
      .attr("width", function(d) { 
        if (d['Weekly Case % Change'] > norm_max) {
          return x(norm_max);
        }
        else{
          return Math.abs(x(d['Weekly Case % Change']) - x(0));
        }
      })
      .attr("height", y.bandwidth())

      //labels
      wc_svg.selectAll("labels")        
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function(d) { return wc_width-100; })
      .style("text-anchor", "start")
      .attr("y", d => y(d['Country/Other']))
      .attr("dy", "1em")
      .text(function(d) { if (d['Weekly Case % Change'] > norm_max) {
        return d['Weekly Case % Change']; }
        else{
          return ;
        }
      }); 
      
      wc_svg.append("g")
      .attr("transform", `translate(${wc_width/2}, 0)`)
      .call(d3.axisLeft(y));

      wc_svg.append("g")
      .attr("class", "label")
      .attr("transform", `translate(0, ${wc_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  })
}

// SOUTH AMERICA
function saWc(){
  $("#change_bar").empty()
  // set the dimensions and margins of the graph
  var wc_margin = {top: 20, right: 100, bottom: 40, left: 20},
      wc_width = 650 - wc_margin.left - wc_margin.right,
      wc_height = h - 100 - wc_margin.top - wc_margin.bottom;

  // append the svg object to the body of the page
  var wc_svg = d3.select("#change_bar")
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 650 ${wc_height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
      .attr("width", wc_width + wc_margin.left + wc_margin.right)
      .attr("height", wc_height + wc_margin.top + wc_margin.bottom)
      .append("g")
      .attr("transform", "translate(" + wc_margin.left + "," + wc_margin.top + ")");

  function normalize(val, max, min) { 
    return ((val - min) / (max - min))*100; 
  };

  // Parse the Data
  d3.csv("covid_south_america_weekly_trend.csv").then( function(data) {
      // fix country name for America and others
      // data.set("United States", data.get("USA"));
      // data.delete("USA");
      // data.set("Falkland Is.", data.get("Falkland Islands"));
      // data.delete("Falkland Islands"); 

    let wc_max = 0;
    let wc_min = 0;
    data.forEach(function(entry){ 
      wc_num = Number(entry['Weekly Case % Change']);
      //console.log(wc_num);
      if (wc_num > wc_max){
        wc_max = wc_num;
      }
      if (wc_num < wc_min){
        wc_min = wc_num;
      }
      });
    
    console.log("Max: ", wc_max);
    console.log("Min: ", wc_min);
    var norm_max = normalize(wc_max, wc_max, wc_min);
    console.log("Norm Max: ", norm_max);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([wc_min, norm_max])
      .range([0, wc_width]);

    // Y axis
    const y = d3.scaleBand()
      .range([0, wc_height ])
      .domain(data.map(d => d['Country/Other']))
      .padding(.1);


    //Bars
    wc_svg.selectAll("bars")
      .data(data)
      .join("rect")
      .attr("class", function(d) { return "bar bar--" + (d['Weekly Case % Change'] < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d['Weekly Case % Change'])); })
      .attr("y", d => y(d['Country/Other']))
      //.attr("width", d => x(d['Weekly Case % Change']))
      .attr("width", function(d) { 
        if (d['Weekly Case % Change'] > norm_max) {
          return x(norm_max);
        }
        else{
          return Math.abs(x(d['Weekly Case % Change']) - x(0));
        }
      })
      .attr("height", y.bandwidth())

      //labels
      wc_svg.selectAll("labels")        
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function(d) { return wc_width-100; })
      .style("text-anchor", "start")
      .attr("y", d => y(d['Country/Other']))
      .attr("dy", "1em")
      .text(function(d) { if (d['Weekly Case % Change'] > norm_max) {
        return d['Weekly Case % Change']; }
        else{
          return ;
        }
      }); 
      
      wc_svg.append("g")
      .attr("transform", `translate(${wc_width/2}, 0)`)
      .call(d3.axisLeft(y));

      wc_svg.append("g")
      .attr("class", "label")
      .attr("transform", `translate(0, ${wc_height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  })
}
