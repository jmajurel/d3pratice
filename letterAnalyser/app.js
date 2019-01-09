let analyseBtn = d3.select('form');
let resetBtn = d3.select('#reset');

const width = 800;
const height = 500;
const barPadding = 20;

//configure svg element
d3.select('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', 'solid black 3px');

//Analyse feature
analyseBtn.on('submit', function(){

  d3.event.preventDefault();
  let newPhrase = getPhrase();

  d3.select('#phrase')
    .text(`Analysis of: ${newPhrase}`)

  analysis(newPhrase);

  d3.select('input')
    .property('value', '')
  
});

//Reset feature
resetBtn.on('click', function() {
  d3.event.preventDefault();
  reset();
});

function analysis(phrase){

  // count the letter occurence
  let counter = phrase.split('').reduce((acc, lt) => {
    let foundItem = acc.find(({letter}) => letter === lt);
    if(foundItem){
      let idx = acc.indexOf(foundItem);
      acc[idx].count++;
    } else {
      acc.push({letter: lt, count: 1});
    }
    return acc;
  }, []);

  const maxCount = Math.max(...counter.map(item => item.count));
  const barWidth = (width/counter.length) - barPadding;
  const heightFactor = height *0.9 / maxCount;

  let display = d3.select('svg');

  //update
  var barGraph = display.selectAll('rect')
    .data(counter, d => d.letter)
      .attr('fill', '#4173f4')

  //update
  var textInGraph = display.selectAll('text')
    .data(counter, d => d.letter)
      .text(d => d.letter)

  var countNew = 0;

  //create
    barGraph.enter()
      .append('rect')
	.attr('height', d => d.count * heightFactor)
	.attr('width', barWidth)
	.attr('y', d => height - d.count * heightFactor)
	.attr('x', (d, idx) => idx * barWidth)
        .attr('fill', '#58f441')

  //create
    textInGraph.enter()
      .append('text')
        .attr('y', d => height - d.count * heightFactor)
        .attr('x', (d, idx) => idx * barWidth + barWidth/2)
	.text(d => d.letter);

  d3.select('#count')
    .text(`New characters: ${countNew}`);


  //remove bars
  barGraph.exit()
    .remove();

  //remove text in graph
  textInGraph.exit()
    .remove();
}

function getPhrase() {
  return d3.select('input')
             .property('value');
}

function reset(){

  d3.select('svg')
    .selectAll('rect')
    .remove();

  d3.select('#phrase')
    .text('');

  d3.select('input')
    .property('value', '');

  d3.select('#count')
    .text('');
}
