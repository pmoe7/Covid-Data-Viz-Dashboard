function all_features(country){
    $("#map_svg").empty()
    document.getElementById("views").style.opacity = "0";
    document.getElementById("info").style.opacity = "0";
    document.getElementById("title").innerHTML = country; 
    var container = document.getElementById("all_container")
    container.style.display = "flex";
    var data = new Map();
    d3.csv("covid_cases.csv", function(d) {
        data.set(d['Country/Other'], [d['Cases in the last 7 days'], d['Cases in the preceding 7 days'], d['Weekly Case % Change'],
        d['Cases in the last 7 days/1M pop'], d['Deaths in the last 7 days'], d['Deaths in the preceding 7 days'], 
        d['Weekly Death % Change'], d['Deaths in the last 7 days/1M pop'], d['Population']])
    }).then(function(loadData){
        // fix country name for America
        data.set("United States of America", data.get("USA"));
        data.delete("USA");
        data.set("The Bahamas", data.get("Bahamas"));
        data.delete("Bahamas");

        var features = data.get(country)
        console.log(country, features);
        const cases = [{
            key: "Cases", values: [
                    {grpName:'Current Week', grpValue: features[0]},
                    {grpName:'Previous Week', grpValue: features[1]}
            ]}
        ];

        const deaths = [
            {
                key: "Deaths", values: [
                    {grpName:'Current Week', grpValue: features[4]},
                    {grpName:'Previous Week', grpValue: features[5]}
                ]
            }
        ];

        // data

        const chg = [
            { week: "Weekly % Change", category: "Cases", per_change: features[2] },
            { week: "Weekly % Change", category: "Deaths", per_change: features[6] },
        ];
        var pop_round = features[8];
        pop_round = Math.round(pop_round/1000000*10)/10;
        const pieData = [
            {name: 'Population (M)', value: pop_round, color: '#18FFFF'},
            {name: 'Cases / M', value: features[3], color: '#F9A825'},
            {name: 'Deaths / M', value: features[7], color: '#F4511E'},
          ];

        
        $("#cases").empty()
        $("#per_chg").empty()
        $("#deaths").empty()
        $("#population").empty()
        barChart(cases, "#cases", w/8+100);
        stackedBar(chg, "#per_chg", w/8-50);
        barChart(deaths, "#deaths", w/8+100);

        donutChart(pieData, "#population", w/4, features[8]);

    })
}

function barChart(groupData, id, f_width){

var margin = {top: 80, right: 10, bottom: 20, left: 80},
width = f_width - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;



var x0  = d3.scaleBand().rangeRound([0, width], .5);
var x1  = d3.scaleBand();
var y   = d3.scaleLinear().rangeRound([height, 0]);
var yRight   = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom().scale(x0).tickValues(groupData.map(d=>d.key));
var yAxis = d3.axisLeft().scale(y);

const color = d3.scaleOrdinal(["#9d4edd", "#ffb703"]);

var svg = d3.select(id).append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var categoriesNames = groupData.map(function(d) { return d.key; });
var rateNames       = groupData[0].values.map(function(d) { return d.grpName; });

x0.domain(categoriesNames);
x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(groupData, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);


svg.append("g")
.attr("class", "y axis")
.style('opacity','0')
.call(yAxis)
.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 6)
   .attr("dy", ".71em")
   .style("text-anchor", "end")
   .style('font-weight','bold')
   .text("Value");

svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

var slice = svg.selectAll(".slice")
.data(groupData)
.enter().append("g")
.attr("class", "g")
.attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

slice.selectAll("rect")
.data(function(d) { return d.values; })
.enter().append("rect")
.attr("width", x1.bandwidth())
.attr("x", function(d) { return x1(d.grpName); })
.style("fill", function(d) { return color(d.grpName) })
.attr("y", function(d) { return y(0); })
.attr("height", function(d) { return height - y(0); });


slice.selectAll("rect")
.transition()
.delay(function (d) {return Math.random()*1000;})
.duration(1000)
.attr("y", function(d) { return y(d.grpValue); })
.attr("height", function(d) { return height - y(d.grpValue); });

//Legend
var legend = svg.selectAll(".legend")
.data(groupData[0].values.map(function(d) { return d.grpName; }).reverse())
.enter().append("g")
.attr("class", "legend")
.attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
.style("opacity","0");

legend.append("rect")
.attr("x", width - 18)
.attr("y", -59)
.attr("width", 18)
.attr("height", 18)
.style("fill", function(d) { return color(d); });

legend.append("text")
.attr("x", width - 24)
.attr("y", -50)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) {return d; });

legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}


function stackedBar(data, id, f_width){
// set up

const margin = {top: 80, right: 10, bottom: 20, left: 50};

const width = f_width - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select(id)
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const keys = ["Cases", "Deaths"];
const months = Array.from(new Set(data.map(d => d.week))).sort(d3.ascending);


// get a map from the month_started to the member_casual to the count_of_rides
const monthToTypeToCount = d3.rollup(
  data,
  // g is an array that contains a single element
  // get the count for this element
  g => g[0].per_change,
  // group by month first
  d => d.week,
  // then group by member of casual
  d => d.category
);

// put the data in the format mentioned above
const countsByMonth = Array.from(monthToTypeToCount, ([month, counts]) => {
  // counts is a map from member_casual to count_of_rides
  counts.set("month", month);
  counts.set("total", d3.sum(counts.values()));
  // turn the map into an object
  return Object.fromEntries(counts);
});

const stackedData = d3.stack()
    .keys(keys)
    // return 0 if a month doesn't have a count for member/casual
    .value((d, key) => d[key] ?? 0)
    (countsByMonth);

// scales

const x = d3.scaleBand()
    .domain(months)
    .range([0, width])
    .padding(0.25);

const y = d3.scaleLinear()
    .domain([0, d3.max(countsByMonth, d => d.total)])
    .range([height, 0]);

const color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#ffc300","#ef233c"]);

// axes

const xAxis = d3.axisBottom(x);

svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

const yAxis = d3.axisLeft(y);

svg.append('g')
    .call(yAxis);

// draw bars

const groups = svg.append('g')
  .selectAll('g')
  .data(stackedData)
  .join('g')
    .attr('fill', d => color(d.key));

groups.selectAll('rect')
  .data(d => d)
  .join('rect')
    .attr('x', d => x(d.data.month))
    .attr('y', d => y(d[1]))
    .attr('width', x.bandwidth())
    .attr('height', d => y(d[0]) - y(d[1]));

// title

svg.append('g')
    .attr('transform', `translate(${width/2},${-40})`)
    .attr('font-family', 'sans-serif')
  .append('text')
    .attr('text-anchor', 'middle')
    .call(
      text => text.append('tspan')
        .attr('fill', color('Cases'))
        .text('Cases')
    )
    .call(
      text => text.append('tspan')
        .attr('fill', 'white')
        .text(' vs. ')
    )
    .call(
      text => text.append('tspan')
        .attr('fill', color('Deaths'))
        .text('Deaths')
    )
}

function donutChart(d, id, f_width, pop) {
    let activeSegment;
    const data = d.sort( (a, b) => b['value'] - a['value']),
          viewWidth = f_width,
          viewHeight = 450,
          svgWidth = viewHeight,
          svgHeight = viewHeight,
          thickness = 40,
          colorArray = data.map(k => k.color),
          el = d3.select(id),
          radius = Math.min(svgWidth, svgHeight) / 2,
          color = d3.scaleOrdinal()
            .range(colorArray);
  
    const max = d3.max(data, (maxData) => maxData.value );
  
    const svg = el.append('svg')
    .attr('viewBox', `0 0 ${viewWidth + thickness} ${viewHeight + thickness}`)
    .attr('class', 'pie')
    .attr('width', viewWidth)
    .attr('height', svgHeight);
  
    const g = svg.append('g')
    .attr('transform', `translate( ${ (svgWidth / 2) + (thickness / 2) }, ${ (svgHeight / 2) + (thickness / 2)})`);
  
    const arc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius);
  
    const arcHover = d3.arc()
    .innerRadius(radius - ( thickness + 5 ))
    .outerRadius(radius + 8);
  
    const pie = d3.pie()
    .value(function(pieData) { return pieData.value; })
    .sort(null);
    

    // Population title
    svg.append("text")
        .attr("x", (viewWidth))             
        .attr("y", 50)
        .attr("text-anchor", "end")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Population: " + formatNum(pop))
        .attr('class', 'legend-text');

  
    const path = g.selectAll('path')
    .attr('class', 'data-path')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'data-group')
    .each(function(pathData, i) {
      const group = d3.select(this)
  
      group.append('text')
        .text(`${pathData.data.value}`)
        .attr('class', 'data-text data-text__value')
        .attr('text-anchor', 'middle')
        .attr('dy', '1rem')
  
      group.append('text')
        .text(`${pathData.data.name}`)
        .attr('class', 'data-text data-text__name')
        .attr('text-anchor', 'middle')
        .attr('dy', '3.5rem')
  
      // Set default active segment
      if (pathData.value === max) {
        const textVal = d3.select(this).select('.data-text__value')
        .classed('data-text--show', true);
  
        const textName = d3.select(this).select('.data-text__name')
        .classed('data-text--show', true);
      }
  
    })
    .append('path')
    .attr('d', arc)
    .attr('fill', (fillData, i) => color(fillData.data.name))
    .attr('class', 'data-path')
    .on('mouseover', function() {
      const _thisPath = this,
            parentNode = _thisPath.parentNode;
  
      if (_thisPath !== activeSegment) {
  
        activeSegment = _thisPath;
  
        const dataTexts = d3.selectAll('.data-text')
        .classed('data-text--show', false);
  
        const paths = d3.selectAll('.data-path')
        .transition()
        .duration(250)
        .attr('d', arc);
  
        d3.select(_thisPath)
          .transition()
          .duration(250)
          .attr('d', arcHover);
  
        const thisDataValue = d3.select(parentNode).select('.data-text__value')
        .classed('data-text--show', true);
        const thisDataText = d3.select(parentNode).select('.data-text__name')
        .classed('data-text--show', true);
      }
  
  
    })
    .each(function(v, i) {
      if (v.value === max) {
        const maxArc = d3.select(this)
        .attr('d', arcHover);
        activeSegment = this;
      }
      this._current = i;
    });
  
    const legendRectSize = 15;
    const legendSpacing = 10;
  
    const legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(legendData, i) {
      const itemHeight =    legendRectSize + legendSpacing;
      const offset =        legendRectSize * color.domain().length;
      const horz =          svgWidth + 80;
      const vert =          (i * itemHeight) + legendRectSize + (svgHeight - offset) / 2;
      return `translate(${horz}, ${vert})`;
    });
  
    legend.append('circle')
      .attr('r', legendRectSize / 2)
      .style('fill', color);
  
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .attr('class', 'legend-text')
      .text( (legendData) => legendData )
  }

