const [minYear, maxYear] = d3.extent(birthData, d => d.year);
const width = 600;
const height = 600;


d3.select('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`)
    .classed('chart', true)

const path = d3.arc()
               .outerRadius(width/2 -10)
               .innerRadius(width/4)
	       .padAngle(0.02)
	       .cornerRadius(20)

d3.select('input')
  .attr('min', minYear) 
  .attr('max', maxYear) 
  .attr('value', minYear) 
  .on('input', () => {
    updateGraph(+d3.event.target.value);
  });

updateGraph(minYear);

function updateGraph(year){

  var yearData = birthData.filter(d => d.year === year);
  var data = yearData.reduce((acc, {continent}) => {
     if(!acc.includes(continent)){ 
       acc.push(continent)  
     }
     return acc;
  }, []);

  var colorScale = d3.scaleOrdinal()
		       .domain(data)
		       .range(d3.schemeCategory10);
  var arcs = d3.pie()
	       .value(d => d.births)
	       .sort(({continent: a}, {continent: b}) => {
		 if(a > b) return -1;
		 else if (a < b) return 1;
		 else return a -b;
	       })
	       (yearData);

  /* d3 update pattern */
  var update = d3.select('.chart')
                 .selectAll('.arc')
                 .data(arcs);
  update
    .exit()
    .remove();

  update
    .enter()
    .append('path')
      .classed('arc', true)
    .merge(update)
      .attr('fill', d => colorScale(d.data.continent))
      .attr('stroke', 'black')
      .attr('d', path)
}
