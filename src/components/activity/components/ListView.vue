<template>
  <div class="text-center">
    <i class="fas fa-running fa-2x"></i>
    <h3>All sessions</h3>
    <b-table responsive striped hover :items="sessions" :fields="fields">
      <template slot="duration" slot-scope="row">
        {{ msToTime(row.item.duration) }}
      </template>
      <template slot="dateStart" slot-scope="row">
        {{ formatDate(row.item.dateStart) }}
      </template>
      <template slot="seeDetails" slot-scope="row">
        <b-button size="sm" class="mr-2" v-on:click="seeDetails(row.item.id)">{{row.item.id}}</b-button>
      </template>
    </b-table>
  </div>
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
  data () {
    return {
      fields: ['title', 'totalDistance', 'duration', 'dateStart', 'seeDetails'],
    }
  },
  methods: {
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
