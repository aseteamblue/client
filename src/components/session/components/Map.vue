<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-12">
      <div class="bgc-white bd bdrs-3 p-20 mB-20">
        <div id="map" style="width:100%; height: 450px"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'map',
  props: {
    session: {
      type: Object,
      required: true
    // default: 'Lucas'
    }
  },
  data: function () {
    return {
      mapCreated: false,
      map: null
    }
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
      var gpsPoints = this.session.sessionData
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

<style lang="scss">
@import "../../../../node_modules/leaflet/dist/leaflet.css";
</style>
