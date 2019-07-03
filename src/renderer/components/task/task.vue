<template>
    <div id="task">
        <b-nav tabs fill>
            <b-nav-item @click="chooseTab(1)" :active="tab===1">我的任务</b-nav-item>
            <b-nav-item @click="chooseTab(2)" :active="tab===2">已计划日程</b-nav-item>
        </b-nav>
        <my-task ref="myTask" v-show="tab===1"></my-task>
        <planned-task v-show="tab===2" :planned-task-list="plannedTaskList"></planned-task>
    </div>
</template>

<script>
  import myTask from './my-task'
  import plannedTask from './planned-task'

  export default {
    name: 'task',
    components: {
      myTask, plannedTask
    },
    data: function () {
      return {
        tab: 1,
        plannedTaskList: []
      }
    },
    methods: {
      chooseTab (page) {
        this.tab = page
        if (page === 2) {
          this.plannedTaskList = this.$refs.myTask.taskList
        }
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
