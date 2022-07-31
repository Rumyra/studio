// import d3
import * as d3 from "https://cdn.skypack.dev/d3@7";

// availability:
// isAllDay: true
// isAllYear: false
// month-array-northern: (10) [10, 11, 12, 1, 2, 3, 4, 5, 6, 7]
// month-array-southern: (10) [4, 5, 6, 7, 8, 9, 10, 11, 12, 1]
// month-northern: "10-7"
// month-southern: "4-1"
// time: ""
// time-array: (24) [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
// [[Prototype]]: Object
// catch-phrase: "I got some seaweed! I couldn't kelp myself."
// file-name: "seaweed"
// icon_uri: "https://acnhapi.com/v1/icons/sea/1"
// id: 1
// image_uri: "https://acnhapi.com/v1/images/sea/1"
// museum-phrase: "Let it be known that seaweed is a misnomer of the highest order! That is, it is not a noxious weed so much as it is a marine algae most beneficial to life on land and sea. Seaweed, you see, provides essential habitat and food for all manner of marine creatures. And it creates a great deal of the oxygen we land lovers love to breath too, hoo! And yet, I can't help but shudder when the slimy stuff touches my toes during a swim. Hoot! The horror!"
// name: {name-USen: 'seaweed', name-EUen: 'seaweed', name-EUnl: 'zeewier', name-EUde: 'Wakame-Alge', name-EUes: 'alga wakame', …}
// price: 600
// shadow: "Large"
// speed: "Stationary"



async function draw() {
  // Data
  const origData = await d3.json('http://acnhapi.com/v1/sea/');

  // convert to array
  const dataset = Object.values(origData);
  console.log(dataset.length)

  // Dimensions
  let dim = {
    width: 800,
    height: 800,
    margins: 50
  };

  dim.ctrWidth = dim.width - dim.margins * 2
  dim.ctrHeight = dim.height - dim.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dim.width)
    .attr("height", dim.height)

  const graph = svg.append("g") // <g>
  	.classed('graph', true)
    .attr(
      "transform",
      `translate(${dim.margins}, ${dim.margins/2})`
    )
    .attr('width', dim.ctrWidth)
    .attr('height', dim.ctrHeight)

  const iconsGroup = svg.append('g')
	  .classed('icons', true)
	  .attr('width', 20)
	  .attr('height', dim.ctrHeight)
	  .attr(
	  	'transform',
	  	`translate(${dim.margins}, ${dim.margins/2})`
  	)

	const xAxisGroup = svg.append('g')
		.classed('axis', true)
  	.style('transform', `translate(
  		${dim.margins*2}px,
  		${dim.ctrHeight+dim.margins}px)`
  	)

  // update chart
  function histogram() {
  	const xAccessor = d => d.availability['month-array-northern']
  	const yAccessor = d => d.icon_uri

  	// scales
	  const xScale = d3.scaleLinear()
	  	.domain([0, 12])
	  	.range([0, dim.ctrWidth])
	  	.nice()

	  const xAxisScale = d3.scaleTime()
	  	.domain([new Date("2022-01-01"), new Date("2022-12-31")])
	  	.range([0, dim.ctrWidth])

	  const yScale = d3.scaleLinear()
	  	.domain([0, dataset.length])
	  	.range([dim.ctrHeight, 0])
	  	.nice()

	  const colorScale = d3.scaleLinear()
	  	.domain([0, dataset.length])
	  	.range([0,1])
	  	.nice()

	  // draw bars
	  // g is y, rect is x
	  const critterGroup = graph.selectAll('g')
	  	.classed('critter', true)
	  	.data(dataset)
	  	.join('g')
	  	// groups don't do x & y
	  	.style('transform', (d, i) => {
	  		return `translateY(${yScale(i)}px)`
	  	})
	  	.attr('fill', (d,i) => d3.interpolateViridis(colorScale(i)))
	  	.attr('height', (dim.ctrHeight/dataset.length)-1)
	  	.attr('width', dim.ctrWidth)

	  	.selectAll('rect')
	  	.data(d => d.availability['month-array-northern'])
	  	.join('rect')
	  	.attr('width', xScale(1))
	  	.attr('height', (dim.ctrHeight/dataset.length)-1)
	  	.attr( 'x', d => xScale(d))
	  	

	  // icons
	  iconsGroup.selectAll('image')
	  	.data(dataset)
	  	.join('image')
	  	.style('transform', 'scale(0.2)')
	  	.attr('href', d => yAccessor(d))
	  	.attr('y', (d, i) => (yScale(i)*5))

	  
	  // labelsGroup.selectAll('text')
	  // 	.data(newDataset)
	  // 	.join('text')
	  // 	.attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
	  // 	.attr('y', d => yScale(yAccessor(d))-10)
	  // 	.text(yAccessor)

	  // draw axis
	  const xAxis = d3.axisBottom(xAxisScale)
	  	.tickFormat(d3.timeFormat("%B"))

	  xAxisGroup.call(xAxis)
	  	.selectAll('.tick text')
	  	.style('transform', `translateX(${xScale(1)/2}px)`)

  }

  // events
  // d3.select('#metric')
  // 	.on('change', function(e) {
  // 		e.preventDefault();

  // 		histogram(this.value)
  // 	})

  histogram()
}

draw()

// Make sure it resizes
