<template>
  <div class="dashboard container-fluid">
    <h1>Visualizations</h1>
    <div >
      <table ref="table" border="1" id="tableSessions">
        <thead>
          <tr>
            <td>Id</td>
            <td>Start</td>
            <td>End</td>
            <td>Active</td>
            <td>Unit of measurement you want to display</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, index) in sessions" :key="s.dateStart">
            <td> {{ s._id }} </td>
            <td> {{ s.dateStart }} </td>
            <td> {{ s.dateEnd }} </td>
            <td> {{ s.active }} </td>
            <td>
              <select v-model='selected[index]'>
                <option value="temperatures">Temperature</option>
                <option value="humidities">Humidities</option>
                <option value="co2">CO2</option>
              </select>
            </td>
            <td v-if="!s.active"> <button v-on:click="generateVisualizations(s._id, selected[index], index)">Generate graphs</button></td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>

</template>

<script>

import * as d3 from 'd3'

// const data = [99, 71, 78, 25, 36, 92]
export default {

  data: function () {
    return {
      index: '',
      selected: [],
      sessions: this.$store.state.user.sessions,
      dataOfSession: this.$store.state.session.sessionData
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  },
  mounted () {

  },
  methods: {
    generateVisualizations: function (id, selected, index) {
      this.index = index
      this.$store.dispatch('sessionDetails', id).then(() => {
        this.$store.dispatch('getSessionData', selected).then(() => {
          this.dataOfSession = this.$store.state.session.sessionData
          // Vue.set(this.dataOfSession, 0, this.$store.state.session.sessionData )
          this.createLineChart(index)
          this.createHistogram(index)
        })
      })
    },

    createLineChart: function (index) {
      var width = 960
      var height = 500
      var values = []
      for (var d in this.dataOfSession) {
        values.push(this.dataOfSession[d].data)
      }
      var timestamps = []
      for (var z in this.dataOfSession) {
        timestamps.push(this.dataOfSession[z].date)
      }

      // Creation of the SVG
      const svg = d3.select(this.$el)
        .append('svg')
        .attr('id', 'session' + index)
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

      var label = ''
      var unit = ''
      switch (this.$store.state.session.sessionData[0].message_type) {
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
        .style('stroke', 'black')
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
        .on('mouseover', showInfo)
        .on('mouseout', hide)

      // Y-axis label
      svg.append('g')
        .append('text')
        .attr('transform', 'translate(' + ((margin.left / 2) - 5) + ',' + innerHeight / 2 + ')rotate(-90)')
        .text(label + ' ' + unit)

      // X-axis label
      svg.append('g')
        .append('text')
        .attr('transform', 'translate(' + (margin.left) + ',' + ((innerHeight + margin.top + marginTimeLine.top) / 2) + ')')
        .text('From: ' + minDate.toUTCString() + ' to: ' + maxDate.toUTCString())

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

      function showInfo () {
        // Create a group that will contain the infos of each line
        var svgId = '#' + 'session' + index
        var menu = d3.select(svgId)
          .append('g')
          .attr('id', 'informationMenu')
          .attr('fill', d3.select(this).style('stroke'))
          .attr('font-family', 'Times New Roman')

        // Append the title of the rectangle
        menu.append('text')
          .attr('x', (width - margin.right + width) / 2)
          .attr('y', margin.top + 30)
          .attr('text-anchor', 'middle')
          .attr('text-decoration', 'underline')
          .attr('font-size', '15')
          .text('About the selected session')

        // Minimum value
        menu.append('text')
          .attr('x', width - margin.right + 10)
          .attr('y', margin.top + 70)
          .text('Minimum value: ' + d3.select(this).attr('min') + ' ' + d3.select(this).attr('unit'))

        // Maximum value
        menu.append('text')
          .attr('x', width - margin.right + 10)
          .attr('y', margin.top + 90)
          .text('Maximum value: ' + d3.select(this).attr('max') + ' ' + d3.select(this).attr('unit'))

        // Mean
        menu.append('text')
          .attr('x', width - margin.right + 10)
          .attr('y', margin.top + 110)
          .text('Mean (rounded): ' + Math.round(d3.select(this).attr('mean') * 100) / 100 + ' ' + d3.select(this).attr('unit'))

        // Median value
        menu.append('text')
          .attr('x', width - margin.right + 10)
          .attr('y', margin.top + 130)
          .text('Median:  ' + d3.select(this).attr('median') + ' ' + d3.select(this).attr('unit'))

        // Standard Deviation
        menu.append('text')
          .attr('x', width - margin.right + 10)
          .attr('y', margin.top + 150)
          .text('Standard Deviation (rounded): ' + Math.round(d3.select(this).attr('standardDeviation') * 100) / 100 + ' ' + d3.select(this).attr('unit'))
      }

      // function hide is used when the mouse leaves each line to redraw the line
      function hide () {
        d3.selectAll('#informationMenu').remove()
        d3.select(this).style('stroke-width', '1')
      }
    },
    createHistogram: function (index) {
      var width = 960
      var height = 500
      // variable to define the margins of the svg
      var margin = { top: 0.1 * height, right: 30, bottom: 0.1 * height, left: 30 }
      var innerWidth = width - margin.left - margin.right
      var innerHeight = height - margin.top - margin.bottom

      // Creation of an array containing all values of the histogram
      var allValues = []
      for (var d in this.dataOfSession) {
        allValues.push(this.dataOfSession[d].data)
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
      const svg = d3.select(this.$el)
        .append('svg')
        .attr('id', 'histogram' + index)
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
        .style('font-size', '10px')

      // Append the x-axis at the bottom of the graph
      bars1.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + (innerHeight) + ')')
        .call(d3.axisBottom(x))

      svg
        .append('text')
        .attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / 2) + ')')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .text('Distribution of the values')

      var label = ''
      var unit = ''
      switch (this.$store.state.session.sessionData[0].message_type) {
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

      // x-axis label
      svg
        .append('text')
        .attr('transform', 'translate(' + (margin.left + innerWidth / 2) + ',' + (height - 20) + ')')
        .text(label + ' ' + unit)

      // Creation of the div that will contain the information about each bar
      var parent = document.getElementById('histogram' + index).parentNode

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
svg{
  margin: 25px;
}
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
