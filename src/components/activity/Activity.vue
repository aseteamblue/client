<template>
  <div class="activity container-fluid scrollbar">
    <h1>Activity</h1>
    <br/>
    <button type="button" class="btn btn-primary" v-on:click="newRun()">New Run</button>
    <br/><br/>
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
          <td v-if="!s.active"> <button v-on:click="seeDetails(s._id)">Show</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'activity',
  data: function () {
    return {
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
    newRun: function () {
      this.$router.push('dashboard')
    }
  }
}

</script>
