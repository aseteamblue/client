<template>
  <div class="col-md-6">
    <div class="bgc-white bd bdrs-3 p-20 mB-20">
      <div :id="'chart' + index" class="chart"></div>
    </div>
  </div>
</template>

<script>

import * as d3 from 'd3'

// const data = [99, 71, 78, 25, 36, 92]
export default {
  props: {
    dataOfSession: {
      type: Array,
      required: true
    // default: 'Lucas'
    },
    index: {
      type: Number,
      required: true,
    }
  },
  data: function () {
    return {
    }
  },
  mounted () {
    this.createHistogram()
  },
  methods: {
    createHistogram: function () {
      var width = 960
      var height = 500
      // variable to define the margins of the svg
      var margin = { top: 0.1 * height, right: 30, bottom: 0.1 * height, left: 30 }
      var innerWidth = width - margin.left - margin.right
      var innerHeight = height - margin.top - margin.bottom

      // Creation of an array containing all values of the histogram
      var allValues = []
      for (var d in this.dataOfSession) {
        if (this.dataOfSession[d].message_type !== 'gas') {
          allValues.push(this.dataOfSession[d].data)
        } else {
          allValues.push(parseInt(this.dataOfSession[d].data.substr(0, this.dataOfSession[d].data.indexOf('/'))))
        }
      }

      if (allValues.length === 0) {
        var errorsvg = d3.select('#chart' + this.index)
          .append('svg')
          .attr('id', 'histogram' + this.index)
          .attr('class', 'deleteAll')
          .attr('viewBox', '0,0,' + width + ',' + height + '')

        errorsvg.append('text')
          .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
          .text('No data available')
        return
      }

      // linear Scale for x-axis
      var x = d3.scaleLinear()
        .domain(d3.extent(allValues))
        .rangeRound([0, innerWidth])

      // Use of d3.histogram() that creates an array of arrays (each array corresponds to an interval)
      var histogram = d3.histogram()
        .thresholds(d3.range(x.domain()[0], x.domain()[1], (x.domain()[1] - x.domain()[0]) / 20))(allValues)

      // Creation of a linear scale for the y-axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(histogram, function (d) {
          return d.length
        })])
        .range([innerHeight, 0])

      // Creation of a svg element that will contain all elements of the histogram
      const svg = d3.select('#chart' + this.index)
        .append('svg')
        .attr('id', 'histogram' + this.index)
        .attr('viewBox', '0,0,' + width + ',' + height + '')

      // Creation of a group that will contain all rects
      var bars1 = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // For each interval of the histogram translate to the good position
      var bars2 = bars1.selectAll('bars')
        .data(histogram)
        .enter()
        .append('g')
        .attr('transform', function (d) {
          return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'
        })

      // For each interval append a rect
      bars2.append('rect')
        .attr('class', 'histogramRect')
        .attr('x0', function (d) { return d.x0 })
        .attr('x1', function (d) { return d.x1 })
        .attr('nbOcc', function (d) { return d.length })
        .attr('x', 1)
        .attr('width', function (d) { return (x(d.x1) - x(d.x0)) })
        .attr('height', function (d) { return innerHeight - y(d.length) })
        .attr('fill', '#0e1a35')

      // Definition of the format of the text that will show the number of values in this interval
      var formatCount = d3.format(',.1f')

      var totalNumberOfMeasure = allValues.length

      // Append the text
      bars2.append('text')
        .attr('dy', '.75em')
        .attr('y', 6)
        .attr('x', function (d) { return (x(d.x1) - x(d.x0)) / 2 })
        .attr('text-anchor', 'middle')
        .text(function (d) {
          return formatCount((d.length / totalNumberOfMeasure) * 100) + '%'
        })
        .style('fill', '#f4a041')
        .style('font-size', '13px')

      // Append the x-axis at the bottom of the graph
      bars1.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + (innerHeight) + ')')
        .call(d3.axisBottom(x))

      var label = ''
      var unit = ''
      switch (this.dataOfSession[0].message_type) {
        case 'temperature':
          label = 'Temperature'
          unit = '[°C]'
          break
        case 'pressure':
          label = 'Pressure'
          unit = '[Pa]'
          break
        case 'humidity':
          label = 'Humidity'
          unit = '[%]'
          break
        case 'gas':
          label = 'CO2'
          unit = '[ppm]'
          break
        case 'light':
          unit = '????'
          break
        default:
          label = 'without unit'
          unit = '(without unit)'
      }

      svg
        .append('text')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 2) + ')')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-family', 'system-ui')
        .style('fill', 'black')
        .text('Distribution of the values [' + label + ']')

      // x-axis label
      svg
        .append('text')
        .attr('transform', 'translate(' + (margin.left + innerWidth / 2) + ',' + (height - 20) + ')')
        .style('font-size', '16px')
        .text(label + ' ' + unit)

      // Creation of the div that will contain the information about each bar
      var parent = document.getElementById('histogram' + this.index).parentNode

      var tooltip = d3.select(parent)
        .append('div')
        .attr('class', 'tooltip')

      // One div for the beginning of the interval and the other for the end
      tooltip.append('div')
        .attr('class', 'x0')
      tooltip.append('div')
        .attr('class', 'x1')
      tooltip.append('div')
        .attr('class', 'nbOcc')

      // When the mouse is on the bar
      svg.selectAll('.histogramRect')
        .on('mouseover', function (d) {
          tooltip.select('.x0').html('x0: <b>' + Math.round(d3.select(this).attr('x0') * 100) / 100 + '</b>')
          tooltip.select('.x1').html('x1: <b>' + Math.round(d3.select(this).attr('x1') * 100) / 100 + '</b>')
          tooltip.select('.nbOcc').html('Nb of elements: <b>' + Math.round(d3.select(this).attr('nbOcc') * 100) / 100 + '</b>')
          d3.select(this)
            .style('fill', '#FFFFFF')
            .style('stroke', '#000000')
            .style('stroke-width', '2px')
          tooltip.style('display', 'block')
          tooltip.style('opacity', 2)
        })

      // When the mouse is moved but still on the bar
        .on('mousemove', function (d) {
          tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX - 25) + 'px')
        })

      // When the mouse leaves a bar
        .on('mouseout', function (d) {
          d3.select(this)
            .style('stroke', 'none')
            .style('fill', '#0e1a35')
          tooltip.style('display', 'none')
          tooltip.style('opacity', 0)
        })
    }

  }
}

</script>
<style lang="scss">

.axis path
{
    fill: none;
    stroke: black;
    stroke-width: 3px;
}
/*For the box containing the information about a column*/
.tooltip {
  background: #eee;
  box-shadow: 0 0 5px #999999;
  color: #333;
  font-size: 12px;
  left: 130px;
  padding: 10px;
  position: absolute;
  text-align: center;
  top: 95px;
  z-index: 10;
  display: block;
  opacity: 0;
}

</style>
