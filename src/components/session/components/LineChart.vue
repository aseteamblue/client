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
    this.createLineChart()
  },
  methods: {
    formatDate: function (date) {
      const d = new Date(date)
      return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes()
    },

    createLineChart: function () {
      var width = 960
      var height = 500
      var values = []
      for (var d in this.dataOfSession) {
        if (this.dataOfSession[d].message_type !== 'gas') {
          values.push(this.dataOfSession[d].data)
        } else {
          values.push(parseInt(this.dataOfSession[d].data.substr(0, this.dataOfSession[d].data.indexOf('/'))))
        }
      }
      var timestamps = []
      for (var z in this.dataOfSession) {
        timestamps.push(this.dataOfSession[z].date)
      }

      if (values.length === 0) {
        var errorsvg = d3.select('#chart' + this.index)
          .append('svg')
          .attr('id', 'lineChart' + this.index)
          .attr('class', 'deleteAll')
          .attr('viewBox', '0,0,' + width + ',' + height + '')

        errorsvg.append('text')
          .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')')
          .text('No data available')
        return
      }

      // Creation of the SVG
      const svg = d3.select('#chart' + this.index)
        .append('svg')
        .attr('id', 'session' + this.index)
        .attr('viewBox', '0,0,' + width + ',' + height + '')

      // Position of the two differents graphs (main graph and TimeLine) in svg
      var margin = { top: 20, right: 300, bottom: 130, left: 80 }
      var marginTimeLine = { top: 430, right: 300, bottom: 30, left: 80 }
      var innerWidth = width - margin.left - margin.right
      var innerHeight = height - margin.top - margin.bottom

      /* Store information about each line of the graph: index[i] = infos about ith sensor */
      var globalInfo = {}

      globalInfo.max = parseFloat((d3.max(values)))
      globalInfo.min = parseFloat((d3.min(values)))
      globalInfo.mean = parseFloat((d3.mean(values)))
      globalInfo.median = parseFloat((d3.median(values)))
      globalInfo.standardDeviation = parseFloat((d3.deviation(values)))

      var maxValueX = d3.max(timestamps)
      var minValueX = d3.min(timestamps)
      var maxValueY = parseFloat(d3.max(values))
      var minValueY = parseFloat(d3.min(values))

      // X axis  --> scaletime --> creation of date
      var minDate = new Date(minValueX)
      var maxDate = new Date(maxValueX)

      // X axis  of the first graph
      var xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, innerWidth])

      // Linear scale for y axis of the first graph
      var yScale = d3.scaleLinear().domain([minValueY - 5, maxValueY + 5]).range([innerHeight, 0])

      // Creation of the X axes
      var xAxis = d3.axisBottom().scale(xScale)

      // Creation of the Y axes
      var yAxis = d3.axisLeft().scale(yScale)

      // linerGenerator for th main graph: positioning the x and y coordonate with respect to xScale and yScale
      const lineFn = d3.line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(parseInt(d.data)))

      // Ordinal Scale for line coloring
      const color = d3.scaleOrdinal(d3.schemeCategory10)

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

      // Create a groupe that will contain all the lines
      var lineChart = svg
        .append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('clip-path', 'url(#clipChartLine)')

      // Draw of all lines of all sensors
      lineChart.append('path')
        .attr('d', lineFn(this.dataOfSession))
        .style('fill', 'none')
        .style('stroke', (d, i) => color(i))
        .style('stroke-width', '1')
        .attr('id', 'test')
        .attr('min', globalInfo.min)
        .attr('max', globalInfo.max)
        .attr('mean', globalInfo.mean)
        .attr('median', globalInfo.median)
        .attr('mode', globalInfo.mode)
        .attr('variance', globalInfo.variance)
        .attr('standardDeviation', globalInfo.standardDeviation)
        .attr('unit', unit)
        .attr('class', 'line')

      // Y-axis label
      svg.append('g')
        .append('text')
        .attr('transform', 'translate(' + ((margin.left / 2) - 5) + ',' + innerHeight / 2 + ')rotate(-90)')
        .text(label + ' ' + unit)
        .style('font-weight', 'bold')
        .style('font-family', 'system-ui')
        .style('font-size', '20px')

      // X-axis label
      svg.append('g')
        .append('text')
        .attr('transform', 'translate(' + (margin.left) + ',' + ((innerHeight + margin.top + marginTimeLine.top) / 2) + ')')
        .text('From: ' + this.formatDate(minDate) + ' to: ' + this.formatDate(maxDate))
        .style('font-weight', 'bold')
        .style('font-family', 'system-ui')
        .style('font-size', '18px')

      // Append a group that will contain the axes
      var focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Append X-axis and Y-axis
      focus.append('g').attr('class', 'axis axis--y').call(yAxis)
      focus.append('g').attr('class', 'axis axis--x grid').attr('transform', 'translate(0,' + (innerHeight) + ')').call(xAxis.tickSize(-height)).selectAll('.grid line')
        .attr('stroke', 'lightgrey')
        .attr('stroke-opacity', '0.7')
        .attr('shape-rendering', 'crispEdges')

        // Create a group that will contain the infos of each line
        // var svgId = '#' + 'session' + this.index
      var menu = svg.append('g')
        .attr('id', 'informationMenu')
        .attr('fill', 'black')
        .style('font-family', 'system-ui')

        // Append the title of the rectangle
      menu.append('text')
        .attr('x', (width - margin.right + width) / 2)
        .attr('y', margin.top + 30)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('font-size', '19')
        .text('Global information')

        // Minimum value
      menu.append('text')
        .attr('x', width - margin.right + 10)
        .attr('y', margin.top + 70)
        .text('Minimum value: ' + globalInfo.min.toFixed(3) + ' ' + unit)
        .attr('font-size', '16')

        // Maximum value
      menu.append('text')
        .attr('x', width - margin.right + 10)
        .attr('y', margin.top + 90)
        .text('Maximum value: ' + globalInfo.max.toFixed(3) + ' ' + unit)
        .attr('font-size', '16')

        // Mean
      menu.append('text')
        .attr('x', width - margin.right + 10)
        .attr('y', margin.top + 110)
        .text('Mean:' + globalInfo.mean.toFixed(3) + ' ' + unit)
        .attr('font-size', '16')

        // Median value
      menu.append('text')
        .attr('x', width - margin.right + 10)
        .attr('y', margin.top + 130)
        .text('Median:  ' + globalInfo.median.toFixed(3) + ' ' + unit)
        .attr('font-size', '16')

        // Standard Deviation
      menu.append('text')
        .attr('x', width - margin.right + 10)
        .attr('y', margin.top + 150)
        .text('Standard Deviation: ' + globalInfo.standardDeviation.toFixed(3) + ' ' + unit)
        .attr('font-size', '16')
    },
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
