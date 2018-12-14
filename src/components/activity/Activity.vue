<template>
  <div class="activity container-fluid scrollbar">
    <h1>Activity</h1>
    <button type="button" class="btn btn-secondary" v-on:click="changeView">{{ textButton }}</button>
    <br/><br/>
    <list-view :sessions="sessions" v-if="isListView"></list-view>
    <calendar-view v-else></calendar-view>
  </div>
</template>

<script>
import ListView from './components/ListView'
import CalendarView from './components/CalendarView'
export default {
  name: 'activity',
  components: {
    ListView,
    CalendarView
  },
  data: function () {
    return {
      isListView: true,
      textButton: 'Change to Calendar view',
      sessions: this.$store.state.user.sessions,
    }
  },
  methods: {
    changeView: function () {
      this.isListView = !this.isListView
      if (this.isListView) {
        this.textButton = 'Change to Calendar view'
      } else {
        this.textButton = 'Change to List view'
      }
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  }
}

</script>
