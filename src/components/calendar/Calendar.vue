cal<template>
 <div id="cal">
  <div class="calendar-parent">
      <h1>Calendar</h1>
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
    <div v-if="message" class="notification is-success">{{ message }}</div>
 </div>
</template>
<script>
import config from '../../../config'
// For testing against the published version
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar'
require('vue-simple-calendar/static/css/default.css')

export default {
  name: 'Cal',
  components: {
    CalendarView,
    CalendarViewHeader,
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
      showEventTimes: true,
      newEventTitle: '',
      newEventStartDate: '',
      newEventEndDate: '',
      useDefaultTheme: true,
      useHolidayTheme: false,
      events: []
    }
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
    this.getEvents()
  },
  methods: {
    periodChanged (range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading events, etc.)
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
      this.message = `You clicked: ${e.title}`
    },
    setShowDate (d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    },
    clickTestAddEvent () {
      this.events.push({
        startDate: this.newEventStartDate,
        endDate: this.newEventEndDate,
        title: this.newEventTitle,
      })
      this.message = 'You added an event!'
    },
    getEvents () {
      let sessions = this.$store.state.user.sessions
      sessions.forEach((session) => {
        this.events.push({
          startDate: session.dateStart,
          endDate: session.dateEnd,
          id: session._id,
          classes: 'orange',
          url: config.api_url + '/activity'
        })
      })
    }
  },
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  background-color: #f7fcff;
}
#cal {
  display: flex;
  flex-direction: column;
  font-family: Calibri, sans-serif;
  width: 95vw;
  min-width: 30rem;
  max-width: 50rem;
  min-height: 40rem;
  margin-left: auto;
  margin-right: auto;
}
.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
  margin-right: 1rem;
  margin-left: 1rem;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}
</style>
