<template>
        <!-- ### $App Screen Content ### -->
        <main class='main-content bgc-grey-100'>
          <div id='mainContent'>
            <div class="row gap-20 masonry pos-r">

              <map-view v-if="haveData" :session="session"></map-view>
              <average-statistics :session="session"></average-statistics>
              <div class="container-fluid" v-if="haveData">
                <div class="row">
                  <line-chart v-if="dataOfSessionTemperature.length" :dataOfSession="dataOfSessionTemperature" :index="1"></line-chart>
                  <line-chart v-if="dataOfSessionHumidities.length" :dataOfSession="dataOfSessionHumidities" :index="2"></line-chart>
                  <line-chart v-if="dataOfSessionCo2.length" :dataOfSession="dataOfSessionCo2" :index="3"></line-chart>
                </div>
              </div>
              <div class="container-fluid" v-if="haveData">
                <div class="row">
                  <histogram-chart v-if="dataOfSessionTemperature.length" :dataOfSession="dataOfSessionTemperature" :index="4"></histogram-chart>
                  <histogram-chart v-if="dataOfSessionHumidities.length" :dataOfSession="dataOfSessionHumidities" :index="5"></histogram-chart>
                  <histogram-chart v-if="dataOfSessionCo2.length" :dataOfSession="dataOfSessionCo2" :index="6"></histogram-chart>
                </div>
              </div>
            </div>
          </div>
        </main>
</template>

<script>
import AverageStatistics from './components/AverageStatistics'
import MapView from './components/Map'
import LineChart from './components/LineChart'
import HistogramChart from './components/HistogramChart'
export default {
  name: 'session',
  components: {
    AverageStatistics,
    MapView,
    LineChart,
    HistogramChart,
  },
  data: function () {
    return {
      haveData: false,
      session: {},
      dataOfSessionTemperature: [],
      dataOfSessionHumidities: [],
      dataOfSessionCo2: [],
      dataOfSessionGPS: []
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getSessionData', 'gps').then(() => {
      this.session = this.$store.state.session.sessionInfo
      this.dataOfSessionGPS = this.$store.state.session.sessionDataGPS
      this.$store.dispatch('getSessionData', 'temperatures').then(() => {
        this.dataOfSessionTemperature = this.$store.state.session.sessionDataTemp
        this.$store.dispatch('getSessionData', 'humidities').then(() => {
          this.dataOfSessionHumidities = this.$store.state.session.sessionDataHumidities
          this.$store.dispatch('getSessionData', 'co2').then(() => {
            this.dataOfSessionCo2 = this.$store.state.session.sessionDataCo2
            this.haveData = true
            this.$store.commit('GPSdata', true)
          })
        })
      })
    }).catch(() => {
      this.$router.push('/activity')
    })
  },
  destroyed: function () {
    this.$store.commit('GPSdata', false)
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "~styles/index.scss";
@import "../../../node_modules/leaflet/dist/leaflet.css";
</style>
