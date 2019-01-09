const width = 600;
const height = 600;
const barPadding = 10;
const numBars = 12;
const barWidth = width / numBars - barPadding;

const minYear = d3.min(birthData, d => d.year);
const maxYear = d3.max(birthData, d => d.year);
const maxBirth = d3.max(birthData, d => d.births);

const yScale = d3.scaleLinear()
  .domain([0, maxBirth])
  .range([height, 0]);


d3.select('input[type="range"]')
  .property('min', minYear) 
  .property('max', maxYear)
  .property('value', minYear);

d3.select('svg')
    .attr('width', width)
    .attr('height', height)
  .selectAll('rect')
  .data(birthData.filter(d=> d.year === minYear))
  .enter()
  .append('rect')
    .attr('width', barWidth)
    .attr('height', d => height - yScale(d.births))
    .attr('y', d => yScale(d.births))
    .attr('x', (d, i) => (barWidth + barPadding) *i)
    .attr('fill', 'purple');

d3.select('input')
  .on('input', function(){
    let year = +d3.event.target.value;
    d3.selectAll('rect')
      .data(birthData.filter(d => d.year === year))
      .attr('height', d => height - yScale(d.births))
      .attr('y', d => yScale(d.births))

  })

/*let barWidth = svgWidth / 20;
let barPad = barWidth; 

const update = svg
  .selectAll('rect')
  .data(birthData, d => d.year)

update
  .enter()
  .append('rect')
    .attr('width', '50px')
    .attr('height', d => (d.births/svgHeight)*1.7)    
    .attr('x', (d, idx) => idx * (barWidth + barPad))
    .attr('y', d => svgHeight - (d.births/svgHeight)*1.7)
    .style('fill', 'purple');
*/
