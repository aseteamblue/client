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
                <p class="card-text">{{ totalDistance }}</p>
              </b-card>
            </b-col>
            <b-col>
              <b-card bg-variant="info" text-variant="white" header="Total time" class="text-center" style="height: 100px;">
                <p class="card-text">{{ totalTime }}</p>
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
                    <strong>{{s}}</strong>
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
            <template slot="seeDetails" slot-scope="row">
              <b-button size="sm" class="mr-2">{{row.item.id}}</b-button>
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
