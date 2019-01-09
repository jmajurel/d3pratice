const width = 800;
const height = 600;

d3.csv('./senate_committee_data.csv', function(d, i, headers) {
  var committees = headers.slice(2).filter(h => d[h] === '1');
  return {
    name: d.name,
    party: d.party,
    committees: committees
  }
}, function(error, nodes) {
  if (error) throw error;

  d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', 'black solid 2px');

  const links = makeLinks(nodes);
  console.log(links);
  const simulation = d3.forceSimulation(nodes)
		       .force('center', d3.forceCenter(width/2, height/2))
		       .force('inter', d3.forceManyBody().strength(-100))
		       .force('link', d3.forceLink(links)
			                .id(d => d.name)
					.distance(d => {
					  var count1 = d.source.committees.length;
					  var count2 = d.target.committees.length;
					  return 25 * Math.max(count1, count2);
					}))
  /* step 1 plot nodes */ //done
  const nodesUpdate = d3.select('svg')
			.selectAll('circle')
			.data(nodes);

  const linksUpdate = d3.select('svg')
			.selectAll('line')
			.data(links);

  const colorScale = d3.scaleOrdinal()
                       .domain(['R', 'D', 'I'])
		       .range(['blue', 'red', 'yellow']);

  nodesUpdate
    .enter()
    .append('circle')
      .classed('node', true)
      .attr('r', 10)
      .style('fill', d => colorScale(d.party))

  linksUpdate
    .enter()
    .append('line')
      .classed('link', true)
      .style('stroke', 'grey')
      .style('stroke-width', 0.1);

  simulation.on('tick', () => {

    d3.select('svg')
      .selectAll('.node')
	.attr('cx', d => d.x)
	.attr('cy', d => d.y);

    d3.select('svg')
      .selectAll('.link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

  })
});


function makeLinks(nodes){
  // return an array of links between senator who works for the same committee 
  // input: [{name, committies[]}, {...}]
  // output: [[source:'', target:'']]
  //
  //for each node find other node that has the same committies then generate link source current node and target found node
  //
  var links = [];
  for(let i = 0; i < nodes.length; i++) {
    for(let j = i + 1; j < nodes.length; j++) {
      let s1 = nodes[i];
      let s2 = nodes[j];

      for(var k = 0; k < s1.committees.length; k++) {
	let committee = s1.committees[k];
        if(s2.committees.includes(committee)) {
	  links.push({
	    source: s1.name,
	    target: s2.name
	  });
	  break;
	}
      }
    } 
  }
  return links;
}
/*  return nodes.reduce((acc, item) => {

    item.committees.forEach((committee) => {
      let foundNodes = nodes.filter(node => !node.committees.includes(committee));
      foundNodes.forEach(found => {
	if(!acc.includes({source: item.name, target: found.name}))
	  acc.push({source: item.name, target: found.name});
      });
    });
    return acc;
  }, []);
  */
