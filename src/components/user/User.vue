<template>
  <div class="user container-fluid">
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
          <td> <a v-on:click="seeDetails(s.id)">{{ s.id }}</a> </td>
          <td> {{ s.dateStart }} </td>
          <td> {{ s.dateEnd }} </td>
          <td> {{ s.active }} </td>
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
      clearInterval(this.$data.interval)
      this.$data.interval = setInterval(function () {
        this.$store.dispatch('getLastData', id).then(() => {
          this.$data.ok = true
          this.$data.sessionData = this.$store.state.user.sessionData
        })
      }.bind(this), 1000)
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
