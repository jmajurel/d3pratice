const width = 800;
const height = 600;
const [minYear, maxYear] = d3.extent(birthData, d => d.year)

d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', 'solid black 2px')
  .append('g')
    .classed('chart', true)
    .attr('transform', `translate(${width/2}, ${height/2})`)

const data = birthData.filter(d => d.year = minYear);

const colorScaleOut = d3.scaleOrdinal()
                     .domain(['January', 'December'])
		     .range(d3.schemeCategory10);

const colorScaleInner = d3.scaleOrdinal()
                     .domain(['Q1','Q2', 'Q3', 'Q4'])
		     .range(d3.schemeCategory10);

const arcs = d3.pie()
  .value(d => d.births)
  .sort(({month: a}, {month: b}) => {
    if( a > b) return -1;
    else if( a < b) return 1;
    else return a-b;
  })
  (data)

const pathOuter = d3.arc()
               .outerRadius(width/3 -200)
               .innerRadius(width/3);

const pathInner = d3.arc()
                    .outerRadius(width/5)
                    .innerRadius(0);
function update(item){

  let scale = item === 'arc-out' ? colorScaleOut : colorScaleInner;
  let path  = item === 'arc-out' ? pathOuter : pathInner;
  let update = d3.select('.chart')
    .selectAll(`.${item}`)
    .data(arcs);

  update
    .exit()
    .remove();

  update
    .enter()
    .append('path')
      .classed(item, true)
    .merge(update)
      .attr('fill', d => {
	if (item === 'arc-in') {
	  var res ='';
	  if('January' <= d.data.month <= 'March') res = 'Q1'
	  else if('March' < d.data.month <= 'June') res = 'Q2'
	  else if('June' < d.data.month <= 'September') res = 'Q3'
	  else res = 'Q4'
	  return scale(res);
	} else {
	  return scale(d.data.month);
	}
      })
      .attr('d', path)
}

update('arc-out');
update('arc-in');
