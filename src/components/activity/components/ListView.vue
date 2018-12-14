<template>
  <div class="text-center">
    <i class="fas fa-running fa-2x"></i>
    <h3>All sessions</h3>
    <b-table responsive striped hover :items="sessions" :fields="fields">
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
