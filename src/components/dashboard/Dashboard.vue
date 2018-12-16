<template>
  <div class="dashboard">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><router-link tag="li" to="/"><a>Dashboard</a></router-link></li>
      <li class="breadcrumb-item active">Overview</li>
    </ol>

    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <div class="text-center">
            <i class="fas fa-user fa-6x"></i>
            <h3>{{ username }}</h3>
            <p>Welcome on Thingy Sport</p>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-row>
            <b-col>
              <div class="text-center">
                <i class="fas fa-info fa-2x"></i>
                <h3> Global information</h3>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card bg-variant="primary" text-variant="white" header="Total distance" class="text-center" style="height:100px;">
                <p class="card-text">{{ totalDistance.toFixed(3) }}km</p>
              </b-card>
            </b-col>
            <b-col>
              <b-card bg-variant="info" text-variant="white" header="Total time" class="text-center" style="height: 100px;">
                <p class="card-text">{{ msToTime(totalTime) }}</p>
              </b-card>
            </b-col>
            <b-col>
              <b-card bg-variant="success" text-variant="white" header="Nb. of sess." class="text-center" style="height: 100px;">
                <p class="card-text">{{ sessions.length }}</p>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="6">
          <b-row>
            <b-col>
              <div class="text-center">
                <i class="fas fa-trophy fa-2x"></i>
                <h3> Collected trophies</h3>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div id="result_panel">
                <div class="panel-body">
                  <ul class="list-group">
                    <li class="list-group-item" v-for="s in trophies" :key="s.dateStart">
                    <strong>{{s.desciption}}</strong>
                    </li>
                    <strong v-if="trophies.length === 0">No trophy yet</strong>
                  </ul>
              </div>
            </div>

            </b-col>

          </b-row>
        </b-col>
      </b-row>

      <b-row style="padding-top:30px;">
        <b-col>
          <div class="text-center">
            <i class="fas fa-running fa-2x"></i>
            <h3>5 last sessions</h3>
            <b-table responsive striped hover :items="rows.slice(0,5)" :fields="fields">
              <template slot="duration" slot-scope="row">
                {{msToTime(row.item.duration)}}
              </template>
              <template slot="dateStart" slot-scope="row">
                {{ formatDate(row.item.dateStart) }}
              </template>
              <template slot="seeDetails" slot-scope="row">
                <b-button size="sm" class="mr-2" v-on:click="seeDetails(row.item.id)">{{row.item.id}}</b-button>
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
      <b-row style="padding-top:30px;">
        <b-col>

        </b-col>

      </b-row>
    </b-container>

  </div>
</template>

<script>

export default {
  name: 'dashboard',
  data () {
    return {
      fields: ['title', 'totalDistance', 'duration', 'dateStart', 'seeDetails'],
      rows: this.$store.state.user.sessions,
      username: this.$store.state.auth.user.username,
      totalDistance: this.$store.state.auth.user.totalDistance,
      totalTime: this.$store.state.auth.user.totalTime,
      user: this.$store.state.auth.user,
      trophies: this.$store.state.auth.user.trophies,
      thingyName: this.$store.state.auth.user.thingyUri,
      sessions: this.$store.state.user.sessions,

    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  },

  methods: {
    seeDetails: function (id) {
      this.$store.dispatch('sessionDetails', id).then(() => {
        this.$router.push('sessioninfo')
      })
    },
    msToTime: function (s) {
      const ms = s % 1000
      s = (s - ms) / 1000
      const secs = s % 60
      s = (s - secs) / 60
      const mins = s % 60
      const hrs = (s - mins) / 60
      return hrs + 'h ' + mins + 'min ' + secs + 'sec'
    },
    formatDate: function (date) {
      const d = new Date(date)
      return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes()
    },
  }
}

</script>
<style lang="scss" scoped>

.list-group{
    height: 100px;
    margin-bottom: 10px;
    overflow:scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
