<template>
        <!-- ### $App Screen Content ### -->
        <main class='main-content bgc-grey-100'>
          <div id='mainContent'>
            <div class="row gap-20 masonry pos-r">

              <map-view :session="session"></map-view>
              <average-statistics :session="session"></average-statistics>
              <div class="container-fluid">
                <div class="row">
                  <line-chart :dataOfSession="dataOfSessionTemperature" :index="1"></line-chart>
                  <line-chart :dataOfSession="dataOfSessionHumidities" :index="2"></line-chart>
                  <line-chart :dataOfSession="dataOfSessionCo2" :index="3"></line-chart>
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
export default {
  name: 'session',
  components: {
    AverageStatistics,
    MapView,
    LineChart,
  },
  data: function () {
    return {
      haveData: false,
      session: {},
      dataOfSessionTemperature: [],
      dataOfSessionHumidities: [],
      dataOfSessionCo2: [],
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getSessionData', 'gps').then(() => {
      this.session = this.$store.state.session.sessionInfo
      this.haveData = true
      this.$store.dispatch('getSessionData', 'temperatures').then(() => {
        this.dataOfSessionTemperature = this.$store.state.session.sessionDataTemp
      })
      this.$store.dispatch('getSessionData', 'humidities').then(() => {
        this.dataOfSessionHumidities = this.$store.state.session.sessionDataHumidities
      })
      this.$store.dispatch('getSessionData', 'co2').then(() => {
        this.dataOfSessionCo2 = this.$store.state.session.sessionDataCo2
      })
    }).catch(() => {
      this.$router.push('/activity')
    })
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import "~styles/index.scss";
@import "../../../node_modules/leaflet/dist/leaflet.css";
</style>
