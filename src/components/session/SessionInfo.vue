<template>
        <!-- ### $App Screen Content ### -->
        <main class='main-content bgc-grey-100'>
          <div id='mainContent'>
            <div class="row gap-20 masonry pos-r">
              <map-view :session="session"></map-view>
              <average-statistics :session="session"></average-statistics>

            </div>
          </div>
        </main>
</template>

<script>
import AverageStatistics from './components/AverageStatistics'
import MapView from './components/Map'
export default {
  name: 'session',
  components: {
    AverageStatistics,
    MapView,
  },
  data: function () {
    return {
      haveData: false,
      session: [],
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getSessionData', 'gps').then(() => {
      this.session = this.$store.state.session.sessionInfo
      this.haveData = true
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
