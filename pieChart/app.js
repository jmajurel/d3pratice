const width = 800;
const height = 600;

const pieChart = d3.pie()
  .value(d => d.population)
  (birthData2011);

d3.select('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', 'solid black 2px')
  .data(pieChart)
   .selectAll('')
      .enter()
      .append()

  


