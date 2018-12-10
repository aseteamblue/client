<template>
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
</template>

<script>
export default {
  name: 'listView',
  props: {
    sessions: {
      type: Array,
      required: true
    // default: 'Lucas'
    }
  },
  methods: {
    seeDetails: function (id) {
      this.$store.dispatch('sessionDetails', id).then(() => {
        this.$router.push('sessioninfo')
      })
    },
  }
}

</script>

<style lang="scss">

</style>
