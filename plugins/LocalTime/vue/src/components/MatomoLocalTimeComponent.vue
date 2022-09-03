<!--
  Matomo - free/libre analytics platform

  @link https://matomo.org
  @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <div>
      <div class="motomo-local-datetime">
        <p style="font-size:20px;">
          {{ localDateTime.year }}/{{ localDateTime.month }}/{{ localDateTime.date }}
          {{ localDateTime.hours }}:{{ localDateTime.minutes }}
          <span v-if="isTimeFormatTwelve">{{amOrPm}}</span>
        </p>
      </div>
  </div>
</template>

<style lang="less" scoped>
  .motomo-local-datetime {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue';

interface DateTime {
  year: string,
  month: string,
  date: string,
  hours: string,
  minutes: string,
}

interface LocalDateTimeState {
  localDateTime: DateTime;
  amOrPm: string;
  timer: number;
}

const date = new Date();
export default defineComponent({
  props: {
    isTimeFormatTwelve: Boolean,
  },
  data(): LocalDateTimeState {
    return {
      localDateTime: {
        year: date.getFullYear().toString(),
        month: this.addLeadingZeros(date.getMonth()),
        date: this.addLeadingZeros(date.getDate()),
        hours: this.addLeadingZeros(date.getHours()),
        minutes: this.addLeadingZeros(date.getMinutes()),
      },
      amOrPm: '',
      timer: 0,
    };
  },
  beforeMount() {
    this.amOrPm = this.getAmOrPm(Number(this.localDateTime.hours));
    this.timer = setInterval(this.setDateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    setDateTime() {
      const currentDate = new Date();
      let currentHours = currentDate.getHours();
      if (this.isTimeFormatTwelve) {
        currentHours = (currentHours % 12) || 12;
      }
      this.localDateTime = {
        year: currentDate.getFullYear().toString(),
        month: this.addLeadingZeros(currentDate.getMonth()),
        date: this.addLeadingZeros(currentDate.getDate()),
        hours: this.addLeadingZeros(currentHours),
        minutes: this.addLeadingZeros(currentDate.getMinutes()),
      };
    },
    getAmOrPm(dateTimeHours: number) {
      if (this.isTimeFormatTwelve) {
        return dateTimeHours >= 12 ? 'PM' : 'AM';
      }
      return '';
    },
    addLeadingZeros(num: number) {
      return String(num).padStart(2, '0');
    },

  },
});
</script>
