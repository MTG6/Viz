//create a d3 variable
var svg = d3.select('#graph')
	//methods
	.attr('width',960)
	.attr('height',function(d,i){
		console.log(this)
		return 500
	})

//create margins
var margin = {
	top:20,
	right:20,
	bottom:20,
	left:40
}

//create working width
var width = +svg.attr('width') - margin.left - margin.right
var height = +svg.attr('height') - margin.top - margin.bottom

//create scales
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
var y = d3.scaleLinear().rangeRound([height,0])

console.log(d3.select('#graph').attr('width'))

//Create variables
var statuses = {}
var colors = ["#00A0B0","#CC333F","#EDC951","#58B947"]

//Create group
var g = svg.append('g')
	.attr('transform','translate('+margin.left+','+margin.top+')') //move to center


//Declare domain
x.domain(data.map(function(d) {
	return d.letter
}))
y.domain([0, d3.max(data, function(d) {
	return d.frequency
})])

//Create axis
xaxis = g.append('g')
	.attr('class','axis axis-x')
	.attr('transform','translate(0,'+height+')')
	.call(d3.axisBottom(x))

yaxis = g.append('g')
	.attr('class','axis axis-y')
	.call(d3.axisLeft(y).ticks(5,'%'))

bars = g.selectAll('.bar')
	.data(data) //feed it data
	.enter() //everything after enter happens for every piece of the data (array)
	.append('rect')
	.attr('class','bar') //give it a class (makes it re-usable), make later selections
	.attr('width', function(d,i){
		return x.bandwidth()
	})
	.attr('height',function(d,i){
		//Heights need to be based off data
		return height - y(d.frequency)
	})
	.attr('x',function(d,i){
		return x(d.letter)
	})
	.attr('y', function(d,i) {
		return y(d.frequency)
	})
	.on("click",sort)
	.on("mouseover",mousemove)
	.on("mouseout",mouseout);
	

//Function Parties Below!
function freqDescending(a,b) {
    return b.frequency - a.frequency
}

function sort() {
	
    data.sort(freqDescending)

    x.domain(data.map(function(d) { return d.letter; }))

    bars
        .transition()
        .ease(d3.easeCubic) //https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
        .duration(1600)
        .attr("x", function(d) { return x(d.letter); })

    xaxis
        .transition()
        .ease(d3.easeCubic)
        .duration(1600)
        .call(d3.axisBottom(x))
//}

//New colors?
    d3.selectAll(".bar")
        .transition("color")
        .ease(d3.easeLinear)
        .duration(1000)
        .delay(function(d,i){
            return i*250
        })
        .style("fill", function(d,i){
            if (!d.color_index) {
                d.color_index = 4
            }
            if (d.color_index < 4) {
                d.color_index++
            } else {
                d.color_index = 1
            }
            return colors[d.color_index-1]
        })
        .call(color)
}

function mouseout(d,i) {
	d3.select(this).style("fill",function(d,i) {
	return colors[d.color_index]})
    
    tooltip
        .style("display", "none");
};

function mousemove(d,i) {
    d3.select(this).style("fill","magenta")
    
    tooltip
        .html("Letter: <b>" + d.letter + "</b><br>Frequency: <b>" + round(d.frequency*100,2) + "</b>%")
        .style("display", "inline-block")

    var w = tooltip.node().offsetWidth/2,
        h = tooltip.node().offsetHeight*1.1;

    tooltip
        .style("left", d3.event.pageX - w + "px")
        .style("top", d3.event.pageY - h + "px");
}
	