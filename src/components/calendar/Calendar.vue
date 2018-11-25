<template>
  <div id="global" class="container-fluid">
   <h1>Calendar</h1>
   <div id="cal">
    <div class="calendar-parent">
     <calendar-view
      :events="events"
      :show-date="showDate"
      :time-format-options="{hour: 'numeric', minute:'2-digit'}"
      :enable-drag-drop="false"
      :disable-past="disablePast"
      :disable-future="disableFuture"
      :show-event-times="showEventTimes"
      :display-period-uom="displayPeriodUom"
      :display-period-count="displayPeriodCount"
      :starting-day-of-week="startingDayOfWeek"
      :class="themeClasses"
      :period-changed-callback="periodChanged"
      @click-date="onClickDay"
      @click-event="onClickEvent"
     >
      <calendar-view-header slot="header" slot-scope="{ headerProps }" :header-props="headerProps" @input="setShowDate" />
     </calendar-view>
    </div>
    <!-- <div v-if="message" class="notification is-success">{{ message }}</div> -->

   </div>
 </div>
</template>

<script>
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar'
require('./default.css')

export default {
  name: 'Cal',
  components: {
    CalendarView,
    CalendarViewHeader
  },
  mixins: [CalendarMathMixin],
  data () {
    return {
      /* Show the current month, and give it some fake events to show */
      showDate: this.thisMonth(1),
      message: '',
      startingDayOfWeek: 1,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: 'month',
      displayPeriodCount: 1,
      showEventTimes: false,
      newEventTitle: '',
      newEventStartDate: '',
      newEventEndDate: '',
      useDefaultTheme: false,
      useHolidayTheme: false,
      events: this.$store.state.user.sessions
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  },
  computed: {
    userLocale () {
      return this.getDefaultBrowserLocale
    },
    dayNames () {
      return this.getFormattedWeekdayNames(this.userLocale, 'long', 0)
    },
    themeClasses () {
      return {
        'theme-default': './default.css'
      }
    },
  },
  mounted () {
    this.newEventStartDate = this.isoYearMonthDay(this.today())
    this.newEventEndDate = this.isoYearMonthDay(this.today())
  },
  methods: {
    periodChanged (range, eventSource) {
      console.log(eventSource)
      console.log(range)
    },
    thisMonth (d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onClickDay (d) {
      this.message = `You clicked: ${d.toLocaleDateString()}`
    },
    onClickEvent (e) {
      window.alert(
        'Title:' + e.title + '\n' +
        'Start: ' + e.startDate + '\n' +
        'End: ' + e.endDate + '\n' +
        'Distance: ' + e.originalEvent.totalDistance + '\n' +
        'Average speed: ' + e.originalEvent.averageSpeed + '\n'
      )
    },
    setShowDate (d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    }
  },
}
</script>
