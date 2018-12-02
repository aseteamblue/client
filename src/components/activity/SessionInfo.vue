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
      haveData: false,
      mapCreated: false,
      session: [],
      map: null
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getSessionData', 'gps').then(() => {
      this.session = this.$store.state.session.sessionInfo
      this.haveData = true
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

    this.map = L.map('map', {
      center: [0, 0],
      zoom: 0,
      setView: true
    })
    esri.basemapLayer('Streets').addTo(this.map)
    this.mapCreated = true
    this.drawLine()
  },
  methods: {
    drawLine: function () {
      var L = require('leaflet')
      while (this.mapCreated !== true && this.haveData !== true) {
        this.sleep(250)
      }
      var gpsPoints = this.$store.state.session.sessionData
      var nbGps = gpsPoints.length
      if (nbGps !== 0) {
        L.marker(gpsPoints[0].data).addTo(this.map)
        var pointList = []
        for (var i = 0; i < nbGps; i++) {
          pointList.push(gpsPoints[i].data)
        }
        var firstpolyline = new L.Polyline(pointList, {
          color: 'red',
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
        })
        firstpolyline.addTo(this.map)
        L.marker(gpsPoints[nbGps - 1].data).addTo(this.map)
        this.map.flyTo(new L.LatLng(gpsPoints[0].data.lat, gpsPoints[0].data.lng), 16)
      }
    }
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
