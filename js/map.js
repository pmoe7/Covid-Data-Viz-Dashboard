// The svg
let w = innerWidth;
let h = innerHeight;

function allMaps() {
  $("#map_svg").empty()
  const svg = d3.select("#map_svg");
      
  const width = w/2,
      height = h-50;

  var mapSvg = document.getElementById("map_svg");
  mapSvg.setAttribute("width",  window.innerWidth/2);
  mapSvg.setAttribute("height", window.innerHeight-50);

  let centered, world;

  // Map and projection
  const path = d3.geoPath();
  const projection = d3.geoMercator()
    .scale(200)
    .center([-20, 40])
    .translate([w/2-width/3, height/2]);

  // Data and color scale
  const data = new Map();

  // const colorScale = d3.scaleThreshold()
  //   .domain([0, 100, 500, 1000, 10000, 100000])
  //   .range(d3.schemeBlues[7]);


  // add tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add clickable background
  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true);

  // Load external data and boot


  Promise.all([
  d3.json("na_sa.geo.json"),
  d3.csv("covid_cases.csv", function(d) {
      data.set(d['Country/Other'], [d['Cases in the last 7 days'], d['Cases in the preceding 7 days'], d['Deaths in the last 7 days'], d['Deaths in the preceding 7 days']])
  })]).then(function(loadData){
      console.log(data);
      let topo = loadData[0];

      var maxTotalCases = 300000;

      // fix country name for America
      data.set("United States of America", data.get("USA"));
      data.delete("USA");
      data.set("The Bahamas", data.get("Bahamas"));
      data.delete("Bahamas");
      // data.set("Dominican Rep.", data.get("Dominican Republic"));
      // data.delete("Dominican Republic");
      // data.set("St. Kitts and Nevis", data.get("Saint Kitts and Nevis"));
      // data.delete("Saint Kitts and Nevis"); 
      
      console.log(data);

  // const colorScale = d3.scaleSequentialLog()
  //   .domain([1, maxTotalCases])
  //   .interpolator(d3.interpolateReds);

  // Define color scale
  const colorScale = d3.scaleThreshold()
    .domain([10, 100, 1000, 10000, 30000, 50000, 100000, 200000, maxTotalCases])
    .range(d3.schemeOrRd[9]);

    // Draw the map
    world = svg.append("g")
    .attr("class", "world");
    
    world.selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

        // set the color of each country
        .attr("fill", function (d) {
          d.values = data.get(d.properties.admin) || 0;
          return colorScale(d.values[0]);
        })

        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .attr("id", function(d) { return d.id})
        .style("opacity", .8)

        .on("mouseover", function(event, d) {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
              .style("stroke", "transparent");
          d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black");
          tooltip.html("<h1>" + d.properties.admin + "</h1><b>Current Week: </b>" + formatNum(d.values[0]) + " cases<br><b>Previous Week: </b>" + formatNum(d.values[1]) + " cases"+ "<br><br><b>Current Week: </b>" + formatNum(d.values[2]) + " deaths<br><b>Previous Week: </b>" + formatNum(d.values[3]) + " deaths")
              .style("left", (event.clientX + 15) + "px")
              .style("top", (event.clientY-28) + "px")
              .style("opacity", 1);
        })
      .on("mouseout", function(d) {
          d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8)
          d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
          tooltip.style("opacity", 0);
      })
      .on("click", function (event, d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
        tooltip.style("opacity", 0);
        all_features(d.properties.admin);
      });
      
      // zoom and drag
      svg.call(d3.zoom()
      .extent([[100, 100], [w/2-width/3, height]])
      .scaleExtent([0, 3])
      .on("zoom", zoomed));

      function zoomed({transform}) {
        world.attr("transform", transform);
      }

      // Legend
      const x = d3.scaleLinear()
      .domain([2.6, 75.1])
      .rangeRound([600, 860]);

    const legend = svg.append("g").attr("id", "legend");

    const legend_entry = legend.selectAll("g.legend")
      .data(colorScale.range().map(function(d) {
        d = colorScale.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append("g")
      .attr("class", "legend_entry");

    const ls_w = 30,
      ls_h = 30;

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - 2 * ls_h;
      })
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d) {
        return colorScale(d[0]);
      })
      .style("opacity", 0.8);

      legend_entry.append("text")
      .attr("x", 50)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - ls_h - 10;
      })
      .text(function(d, i) {
        if (i === 0) return "< " + formatNum(d[1]) + " cases";
        if (d[1] < d[0]) return formatNum(d[0]) + " cases +";
        return formatNum(d[0]) + " - " + formatNum(d[1]) + " cases";
      });

    legend.append("text").attr("x", 10).attr("y", height-ls_h-290).text("Legend (Active Cases)").attr("font-weight", 700);
  })
};









// NORTH AMERICA
function naMap() {
  $("#map_svg").empty()
  const svg = d3.select("#map_svg");

    
  const width = w/2,
      height = h-50;

  var mapSvg = document.getElementById("map_svg");
  mapSvg.setAttribute("width",  window.innerWidth/2);
  mapSvg.setAttribute("height", window.innerHeight-50);

  let centered, world;

  // Map and projection
  const path = d3.geoPath();
  const projection = d3.geoMercator()
    .scale(200)
    .center([-20, 40])
    .translate([w/2-width/3, height/2+100]);

  // Data and color scale
  const data = new Map();

  // const colorScale = d3.scaleThreshold()
  //   .domain([0, 100, 500, 1000, 10000, 100000])
  //   .range(d3.schemeBlues[7]);


  // add tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add clickable background
  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true);

  // Load external data and boot


  Promise.all([
  d3.json("na.geo.json"),
  d3.csv("north_america_covid_weekly_trend.csv", function(d) {
      data.set(d['Country/Other'], [d['Cases in the last 7 days'], d['Cases in the preceding 7 days'], d['Weekly Case % Change'], d['Cases in the last 7 days/1M pop']])
  })]).then(function(loadData){
      console.log(data);
      let topo = loadData[0];

      var maxTotalCases = 300000;

      // fix country name for America
      // fix country name for America
      data.set("United States of America", data.get("USA"));
      data.delete("USA");
      data.set("The Bahamas", data.get("Bahamas"));
      data.delete("Bahamas");
      
      console.log(data);


  //Define color scale
  const colorScale = d3.scaleThreshold()
    .domain([10, 100, 1000, 10000, 30000, 50000, 100000, 200000, maxTotalCases])
    .range(d3.schemeOrRd[9]);

    // Draw the map
    world = svg.append("g")
    .attr("class", "world");

    world.selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

        // set the color of each country
        .attr("fill", function (d) {
          d.values = data.get(d.properties.admin) || 0;
          return colorScale(d.values[0]);
        })

        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .attr("id", function(d) { return d.id})
        .style("opacity", .8)


        .on("mouseover", function(event, d) {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
              .style("stroke", "transparent");
          d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black");
          tooltip.html("<h1>" + d.properties.admin + "</h1><b>Current Week: </b>" + formatNum(d.values[0]) + " cases<br><b>Previous Week: </b>" + formatNum(d.values[1]) + " cases")
              .style("left", (event.clientX + 15) + "px")
              .style("top", (event.clientY-28) + "px")
              .style("opacity", 1);
        })
      .on("mouseout", function(d) {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .8)
          d3.select(this)
              .transition()
              .duration(200)
              .style("stroke", "transparent")
        
          tooltip.style("opacity", 0);
      })
      .on("click", function (event, d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
        tooltip.style("opacity", 0);
        all_features(d.properties.admin);
      });


      // zoom and drag
      svg.call(d3.zoom()
      .extent([[100, 100], [w/2-width/3, height]])
      .scaleExtent([0, 3])
      .on("zoom", zoomed));

      function zoomed({transform}) {
        world.attr("transform", transform);
      }

      // Legend
      const x = d3.scaleLinear()
      .domain([2.6, 75.1])
      .rangeRound([600, 860]);

    const legend = svg.append("g").attr("id", "legend");

    const legend_entry = legend.selectAll("g.legend")
      .data(colorScale.range().map(function(d) {
        d = colorScale.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append("g")
      .attr("class", "legend_entry");

    const ls_w = 30,
      ls_h = 30;

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - 2 * ls_h;
      })
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d) {
        return colorScale(d[0]);
      })
      .style("opacity", 0.8);

    legend_entry.append("text")
      .attr("x", 50)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - ls_h - 10;
      })
      .text(function(d, i) {
        if (i === 0) return "< " + formatNum(d[1]) + " cases";
        if (d[1] < d[0]) return formatNum(d[0]) + " cases +";
        return formatNum(d[0]) + " - " + formatNum(d[1]) + " cases";
      });

    legend.append("text").attr("x", 10).attr("y", height-ls_h-290).text("Legend (Active Cases)").attr("font-weight", 700);
  })
};





// SOUTH AMERICA
function saMap() {
  $("#map_svg").empty()
  const svg = d3.select("#map_svg");

    
  const width = w/2,
      height = h-50;

  var mapSvg = document.getElementById("map_svg");
  mapSvg.setAttribute("width",  window.innerWidth/2);
  mapSvg.setAttribute("height", window.innerHeight-50);

  let centered, world;

  // Map and projection
  const path = d3.geoPath();
  const projection = d3.geoMercator()
    .scale(500)
    .center([-20, 40])
    .translate([w/2-width/4, 0]);

  // Data and color scale
  const data = new Map();

  // const colorScale = d3.scaleThreshold()
  //   .domain([0, 100, 500, 1000, 10000, 100000])
  //   .range(d3.schemeBlues[7]);


  // add tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add clickable background
  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    // Class to make it responsive.
    .classed("svg-content-responsive", true);

  // Load external data and boot


  Promise.all([
  d3.json("sa.geo.json"),
  d3.csv("covid_south_america_weekly_trend.csv", function(d) {
      data.set(d['Country/Other'], [d['Cases in the last 7 days'], d['Cases in the preceding 7 days'], d['Weekly Case % Change'], d['Cases in the last 7 days/1M pop']])
  })]).then(function(loadData){
      console.log(data);
      let topo = loadData[0];

      var maxTotalCases = 300000;

      // fix country name for America
      // data.set("Falkland Is.", data.get("Falkland Islands"));
      // data.delete("Falkland Islands");
      // data.set("Dominican Rep.", data.get("Dominican Republic"));
      // data.delete("Dominican Republic");
      // data.set("St. Kitts and Nevis", data.get("Saint Kitts and Nevis"));
      // data.delete("Saint Kitts and Nevis"); 
      
      console.log(data);


  //Define color scale
  const colorScale = d3.scaleThreshold()
    .domain([10, 100, 1000, 10000, 30000, 50000, 100000, 200000, maxTotalCases])
    .range(d3.schemeOrRd[9]);

    // Draw the map
    world = svg.append("g")
    .attr("class", "world");

    world.selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )

        // set the color of each country
        .attr("fill", function (d) {
          d.values = data.get(d.properties.admin) || 0;
          return colorScale(d.values[0]);
        })

        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .attr("id", function(d) { return d.id})
        .style("opacity", .8)


        .on("mouseover", function(event, d) {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .5)
              .style("stroke", "transparent");
          d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
              .style("stroke", "black");
          tooltip.html("<h1>" + d.properties.admin + "</h1><b>Current Week: </b>" + formatNum(d.values[0]) + " cases<br><b>Previous Week: </b>" + formatNum(d.values[1]) + " cases")
              .style("left", (event.clientX + 15) + "px")
              .style("top", (event.clientY-28) + "px")
              .style("opacity", 1);
        })
      .on("mouseout", function(d) {
          d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .8)
          d3.select(this)
              .transition()
              .duration(200)
              .style("stroke", "transparent")
        
          tooltip.style("opacity", 0);
      })
      .on("click", function (event, d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
        tooltip.style("opacity", 0);
        all_features(d.properties.admin);
      });


      // zoom and drag
      svg.call(d3.zoom()
      .extent([[100, 100], [w/2-width/3, height]])
      .scaleExtent([0, 3])
      .on("zoom", zoomed));

      function zoomed({transform}) {
        world.attr("transform", transform);
      }

      // Legend
      const x = d3.scaleLinear()
      .domain([2.6, 75.1])
      .rangeRound([600, 860]);

    const legend = svg.append("g").attr("id", "legend");

    const legend_entry = legend.selectAll("g.legend")
      .data(colorScale.range().map(function(d) {
        d = colorScale.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append("g")
      .attr("class", "legend_entry");

    const ls_w = 30,
      ls_h = 30;

    legend_entry.append("rect")
      .attr("x", 10)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - 2 * ls_h;
      })
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", function(d) {
        return colorScale(d[0]);
      })
      .style("opacity", 0.8);

    legend_entry.append("text")
      .attr("x", 50)
      .attr("y", function(d, i) {
        return height - (i * ls_h) - ls_h - 10;
      })
      .text(function(d, i) {
        if (i === 0) return "< " + formatNum(d[1]) + " cases";
        if (d[1] < d[0]) return formatNum(d[0]) + " cases +";
        return formatNum(d[0]) + " - " + formatNum(d[1]) + " cases";
      });

    legend.append("text").attr("x", 10).attr("y", height-ls_h-290).text("Legend (Active Cases)").attr("font-weight", 700);
  })
};