<template>
  <div class="user container-fluid scrollbar">
    <h1>User</h1>
    <p>Username: {{ username }}</p>
    <p>Thingy: {{ thingyName }}</p>
    <h2>Sessions</h2>
    <table ref="table" border="1" id="tableSessions">
      <thead>
        <tr>
          <td>Id</td>
          <td>Start</td>
          <td>End</td>
          <td>Active</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sessions" :key="s.dateStart">
          <td> {{ s._id }} </td>
          <td> {{ s.dateStart }} </td>
          <td> {{ s.dateEnd }} </td>
          <td> {{ s.active }} </td>
          <td v-if="s.active"> <button v-on:click="seeDetails(s._id)">Show</button></td>
        </tr>
      </tbody>
    </table>
    <br/><br/>
    <div v-if="ok">
      <h2>Last data</h2>
      <table ref="table" border="1" id="tableSessionsData">
        <thead>
          <tr>
            <td>Type</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sd in sessionData" :key="sd._id">
            <td> {{ sd.message_type }} </td>
            <td> {{ sd.data }} </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<style lang="scss">
  @import "../../../node_modules/leaflet/dist/leaflet.css";
</style>

<script>
export default {
  name: 'user',
  data: function () {
    return {
      username: this.$store.state.auth.user.username,
      thingyName: this.$store.state.auth.user.thingyUri,
      sessions: this.$store.state.user.sessions,
      ok: false,
      sessionData: [],
      interval: null
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  },
  beforeDestroy: function () {
    clearInterval(this.$data.interval)
  },
  methods: {
    seeDetails: function (id) {
      clearInterval(this.interval)
      this.interval = setInterval(function () {
        this.$store.dispatch('getLastData', id).then(() => {
          this.ok = true
          this.sessionData = this.$store.state.user.sessionData
        })
      }.bind(this), 2000)
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
