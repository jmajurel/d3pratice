const width = 800;
const height = 600;

d3.queue()
  .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
  .defer(d3.csv, './data/country_data.csv', function(row) {
      return {
	country: row.country,
	countryCode: row.countryCode,
	population: +row.population,
	medianAge: +row.medianAge,
	fertilityRate: +row.fertilityRate,
	populationDensity: +row.population / +row.LandArea
      };
  })
  .await(function(err, mapData, populationData) {

    if(err) throw err;

    const geoData = topojson.feature(mapData, mapData.objects.countries).features;

    populationData.forEach(row => {
      var countries = geoData.filter(d => d.id = row.countryCode);
      countries.forEach(country => country.properties = row);
    });

    const projection = d3.geoMercator()
                         .scale(125)
			 .translate([width / 2, height /1.4]);

    const path = d3.geoPath()
                   .projection(projection);

    d3.select('svg')
	.attr('width', width)
	.attr('height', height)
      .selectAll('path')
        .data(geoData)
	.enter()
	  .append('path')
	  .classed('country', true)
	  .attr('d', path);

    var select = d3.select('select');
    select.on('change', () => setColor(d3.event.target.value));
    setColor(select.property('value'));

    function setColor(val) {
      
      var colorRanges = {
	population: ['white', 'purple'],
	populationDensity: ['white', 'red'],
	medianAge: ['white', 'black'],
	fertilityRate: ['black', 'orange']
      };

      var scale = d3.scaleLinear()
	            .domain([0, d3.max(populationData, d => d[val])])
		    .range(colorRanges[val]);

      d3.selectAll('.country')
        .transition()
        .duration(750)
        .ease(d3.easeBackIn)	
	.attr('fill', d => {
	  var data = d.properties[val];
	  return data ? scale(data): '#ccc';
	});
    }
  })
