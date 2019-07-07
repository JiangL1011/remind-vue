<template>
    <div id="task-outline">
        <div id="add-task" v-if="!isPlannedList">
            <b-button @click="showAddTaskForm" block variant="primary" v-if="!allowAdd">添加任务</b-button>
            <b-button @click="addOrCancel(true)" block variant="primary" v-if="allowAdd">确认添加</b-button>
        </div>
        <div id="task-list">
            <table id="task-table">
                <tr id="new-task-tr" class="task-item" v-show="allowAdd">
                    <td style="width: 25px">
                    </td>
                    <td id="new-task" style="overflow: hidden">
                        <b-input id="new-task-input" v-model="newTaskTitle"></b-input>
                    </td>
                    <td class="task-del-icon">
                        <i class="fas fa-times" @click="addOrCancel(false)"></i>
                    </td>
                </tr>
                <tr class="task-item"
                    v-for="(task,index) in taskList"
                    v-if="task.planned===isPlannedList"
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
                    <td :class="isPlannedList?'':'task-del-icon'" style="width: 25px">
                        <i class="fas fa-times"
                           v-show="hoverIndex===index && !isPlannedList"
                           @click="deleteTask(index)"></i>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
  const task = require('../../util/common').task
  const db = require('../../db/remindDB')
  const moment = require('moment')

  export default {
    name: 'task-list',
    props: ['isPlannedList', 'taskList'],
    data: function () {
      return {
        allowAdd: false,
        newTaskTitle: '',
        selectedIndex: -1,
        hoverIndex: -1
      }
    },
    methods: {
      showAddTaskForm () {
        this.allowAdd = true
        const input = document.getElementById('new-task-input')
        input.focus()
        const taskListTag = document.getElementById('task-list')
        taskListTag.scrollTop = 0
      },
      addOrCancel (add) {
        const title = this.newTaskTitle.trim()
        if (title.length > 0 && add) {
          const doc = task(title)
          const that = this
          db.insert(doc, function (err, newDoc) {
            if (!err) {
              that.taskList.unshift(newDoc)
              // 添加新任务后选中的任务的索引会比原先大1
              that.selectedIndex++
            } else {
              alert('新增失败，程序内部错误')
            }
          })
        }
        this.newTaskTitle = ''
        this.allowAdd = false
      },
      finishTask (task) {
        const finished = !task.finished
        const r = confirm(finished ? '确定要完成任务吗？' : '确定要重新开启该任务吗？')
        if (!r) return

        task.finished = finished
        task.settingPlan = false
        task.finishTime = finished ? moment().format('YYYYMMDDHHmmss') : ''

        if (this.isPlannedList) {
          // 已计划的任务
        } else {
          // 未计划的任务
          const id = task._id
          db.update({
            _id: id
          }, {
            $set: {
              finished: task.finished,
              finishTime: task.finishTime,
              settingPlan: task.settingPlan
            }
          })
          // 同时更新detail列表的数据
          this.$parent.$parent.$refs.detail.task = task
        }
      },
      deleteTask (index) {
        this.taskList.splice(index, 1)
      },
      mouseoverTask (index) {
        this.hoverIndex = index
      },
      mouseleaveTask () {
        this.hoverIndex = -1
      },
      clickTask (task, index) {
        this.selectedIndex = index
        // 将数据传递到detail模块
        this.$parent.$parent.$refs.detail.taskId = (this.taskList.length === 0 ? '' : task._id)
        this.$parent.$parent.$refs.detail.taskIndex = index
      }
    }
  }
</script>

<style scoped>
    #task-outline {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
    }

    #add-task {
        text-align: center;
        padding: 3px 0 3px 0;
    }

    #task-list {
        overflow: auto;
        min-height: 28px;
    }

    .fa-check {
        color: #00b400;
    }

    .fa-times {
        color: red;
    }

    .task-title {
        word-wrap: break-word;
        outline-style: none;
    }

    .task-check-icon, .task-del-icon {
        width: 25px;
        text-align: center;
        cursor: pointer;
    }

    #task-table {
        width: 100%;
        table-layout: fixed;
    }

    .task-item {
        border-bottom: 1px solid #B2D5DF;
        line-height: 32px;
        word-wrap: break-word;
    }

    .task-item:hover {
        background: #e8eef7;
    }

    .finished {
        text-decoration-line: line-through;
    }

    #new-task-input {
        height: 30px;
    }

</style>
