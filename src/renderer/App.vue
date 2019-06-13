<template>
    <div id="app">
        <calendar></calendar>
    </div>
</template>

<script>
  import Vue from 'vue'
  import BootstrapVue from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import calendar from './components/calendar'

  Vue.use(BootstrapVue)

  export default {
    name: 'remind-vue',
    components: {
      calendar
    }
  }
</script>

<style>
#app{
    margin: 3px;
}
</style>
