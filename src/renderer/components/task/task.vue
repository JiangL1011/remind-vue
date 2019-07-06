<template>
    <div id="task">
        <b-nav tabs fill>
            <b-nav-item @click="tab=1" :active="tab===1">我的任务</b-nav-item>
            <b-nav-item @click="tab=2" :active="tab===2">已计划日程</b-nav-item>
        </b-nav>
        <task-list v-show="tab===1" :isPlannedList="false" :task-list="taskList"></task-list>
        <task-list v-show="tab===2" :isPlannedList="true" :task-list="taskList"></task-list>
    </div>
</template>

<script>
  import taskList from './task-list'

  export default {
    name: 'task',
    components: {
      taskList
    },
    data: function () {
      return {
        tab: 1,
        taskList: []
      }
    }
  }
</script>

<style scoped>
    #task {
        padding-left: 5px;
        padding-right: 5px;
        width: 500px;
        min-width: 400px;
        flex-grow: 1.5;
    }
</style>
