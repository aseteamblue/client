<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-12">
      <div class="bgc-white bd bdrs-3 p-20 mB-20">
        <div>
          <h6 class="c-grey-900 mB-20" style="float:left;">{{session.title}}</h6>
          <button type="button" style="float:right"
            v-if="this.session.share"
            v-on:click="changeSessionStatus"
            class="btn cur-p btn-danger"
          >
            Change the privacy to private
          </button>
          <button type="button" style="float:right"
            v-else
            v-on:click="changeSessionStatus"
            class="btn cur-p btn-primary"
          >
            Change the privacy to public
          </button>
        </div>
        <div id="mapPlace" style="width:100%; height: 450px"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'mapDisplay',
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
      map: null,
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

    this.map = L.map('mapPlace', {
      center: [0, 0],
      zoom: 0,
      setView: true
    })
    esri.basemapLayer('Streets').addTo(this.map)
    this.mapCreated = true
    this.drawLine()
  },
  methods: {
    changeSessionStatus: function () {
      this.$store.dispatch('changePrivacy')
      this.$store.dispatch('getSessionData', 'gps').then(() => {
        this.session = this.$store.state.session.sessionInfo
      }).catch(() => {
        this.$router.push('/activity')
      })
    },
    drawLine: async function () {
      var L = require('leaflet')
      while (this.mapCreated === false || this.$store.state.session.haveData === false) {
        await this.sleep(250)
      }
      var gpsPoints = this.$store.state.session.sessionDataGPS
      if (gpsPoints === null || gpsPoints === undefined) {
        return
      }
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
    },
    sleep: function (ms){
      return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
    }
  }
}
</script>

<style lang="scss">
@import "../../../../node_modules/leaflet/dist/leaflet.css";
</style>
