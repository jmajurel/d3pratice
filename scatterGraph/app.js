const width = 600;
const height = 400;

d3.extent(birthData2011, d => d.lifeExpectancy)

const Yscale = d3.scaleLinear()
  .domain()
  .range(

d3.select('svg')	
  .attr('width', width)
  .attr('height', height)

d3.select('svg')
  .selectAll('circle')
  .data(birthData2011)
  .enter()
  .append('circle')
    .attr('cx',)
    .attr('cy',)
    .attr('r',)

