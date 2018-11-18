<template>
  <div class="dashboard container-fluid">
    <h1>Dashboard</h1>
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

      <ul v-for="d in dataOfSession" :key="d.date">
        <li> {{ d.data }} </li>
      </ul>

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
          this.createGraph()
        })
      })
    },

    createGraph: function () {
      var test = []
      for (var d in this.dataOfSession) {
        // console.log(this.dataOfSession[d].data)
        test.push(this.dataOfSession[d].data)
      }

      const svg = d3.select(this.$el)
        .append('svg')
        .attr('width', 500)
        .attr('height', 270)
        .append('g')
        .attr('transform', 'translate(0, 10)')
      const x = d3.scaleLinear().range([0, 430])
      const y = d3.scaleLinear().range([210, 0])
      d3.axisLeft().scale(x)
      d3.axisTop().scale(y)
      x.domain(d3.extent(test, (d, i) => i))
      y.domain([0, d3.max(test, d => d)])
      const createPath = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
      svg.append('path').attr('d', createPath(test))
    }
  },
}

</script>
<style lang="scss">
svg{
  margin: 25px;
}
path
{
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
}
</style>
