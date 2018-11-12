<template>
  <div class="sessioninfo container-fluid scrollbar">
    <h1>Details</h1>
    <br/>
    <table ref="table" border="1" id="tableInfo">
      <tbody>
        <tr>
          <td>Title:</td>
          <td>{{session._id}}</td>
        </tr>
        <tr>
          <td>Start</td>
          <td>{{session.dateStart}}</td>
          <td>Stop</td>
          <td>{{session.dateEnd}}</td>
        </tr>
      </tbody>
    </table>
    <div id="map"></div>
    <table ref="table" border="1" id="tableInfo">
      <tbody>
        <tr>
          <td>Av. speed:</td>
          <td>{{session.averageSpeed}}</td>
        </tr>
        <tr>
          <td>Av. temperature:</td>
          <td>{{session.averageTemperature}}</td>
        </tr>
        <tr>
          <td>Av. humidity:</td>
          <td>{{session.averageHumidity}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
  @import "../../../node_modules/leaflet/dist/leaflet.css";
</style>

<script>
export default {
  name: 'sessioninfo',
  data: function () {
    return {
      session: []
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getSessionData').then(() => {
      this.session = this.$store.state.session.sessionInfo
    })
  },
  mounted: function () {
    var L = require('leaflet')
    var esri = require('esri-leaflet')

    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    })

    const map = L.map('map', {
      center: [46.552273, 6.633219],
      zoom: 16
    })
    esri.basemapLayer('Streets').addTo(map)
    L.marker([46.552273, 6.633219]).addTo(map)
    var pointList = [[46.552273, 6.633219], [46.552944, 6.633691],
      [46.554176, 6.634592], [46.556527, 6.638290]]
    var firstpolyline = new L.Polyline(pointList, {
      color: 'red',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    })
    firstpolyline.addTo(map)
    L.marker([46.556527, 6.638290]).addTo(map)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  #map {
      height: 50vh;
      width: 50vw;
      margin: 0;
      padding: 0;
    }
</style>
