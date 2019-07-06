<template>
    <div>
        <div id="plannedTask-list">
            <table id="task-table">
                <tr class="task-item"
                    v-for="(task,index) in plannedComputedList"
                    @mouseenter="mouseoverTask(index)"
                    @mouseleave="mouseleaveTask()"
                    @click="clickTask(task, index)"
                    :style="selectedIndex===index?'background:#e8eef7':''">
                    <td class="task-check-icon" @click="finishTask(task)">
                        <i class="fa fa-check" v-show="task.finished||hoverIndex===index"></i>
                    </td>
                    <td class="task-title">
                        <span :class="task.finished?'finished':''">{{ task.title }}</span>
                    </td>
                    <td class="task-del-icon">
                        <i class="fas fa-times" v-show="hoverIndex===index" @click="deleteTask(index)"></i>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'planned-task',
    data: function () {
      return {
        plannedTaskList: []
      }
    },
    computed: {
      plannedComputedList: function () {
        return this.plannedTaskList.filter(function (item) {
          return item.planned
        })
      }
    }
  }
</script>

<style scoped>

</style>
