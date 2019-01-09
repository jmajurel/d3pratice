const width = 800;
const height = 600;
const padding = 60;

d3.json('./sample_geo.json', (err, data) => {
  if(err) throw err;  
  console.log(data);

  const path = d3.geoPath();
  d3.select('svg')
      .attr('width', width)
      .attr('height', height)
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
      .attr('d', path)
      .attr('fill', d => d.properties.color);
});
