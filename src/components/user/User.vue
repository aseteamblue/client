<template>
  <div class="user">
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
        <tr v-for="s in sessions" :key="s._id">
          <td> {{ s.id }} </td>
          <td> {{ s.dateStart }} </td>
          <td> {{ s.dateEnd }} </td>
          <td> {{ s.active }} </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'user',
  data: function () {
    return {
      username: this.$store.state.auth.user.username,
      thingyName: this.$store.state.auth.user.thingyUri,
      sessions: this.$store.state.user.sessions
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
</style>
