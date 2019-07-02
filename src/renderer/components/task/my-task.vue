<template>
    <div id="task-outline">
        <div id="add-task">
            <b-button @click="showAddTaskForm" block variant="primary" v-if="!allowAdd">添加任务</b-button>
            <b-button @click="addOrCancel(true)" block variant="primary" v-if="allowAdd">确认添加</b-button>
        </div>
        <div id="task-list">
            <table id="task-table">
                <tr id="content-input" class="task-item" v-show="allowAdd">
                    <td style="width: 25px">
                    </td>
                    <td id="new-task">
                        <b-input id="new-task-input" v-model="newTaskContent"></b-input>
                    </td>
                    <td class="task-del-icon">
                        <i class="fas fa-times" @click="addOrCancel(false)"></i>
                    </td>
                </tr>
                <tr class="task-item" v-for="(task,index) in taskList"
                    @mouseenter="mouseoverTask(task)"
                    @mouseleave="mouseleaveTask(task)">
                    <td class="task-check-icon"
                        @click="finishTask(task)">
                        <i class="fa fa-check" v-show="task.finished||task.hover"></i>
                    </td>
                    <td class="task-content">
                        <span :class="task.finished?'finished':''">{{ task.content }}</span>
                    </td>
                    <td class="task-del-icon">
                        <i class="fas fa-times" v-show="task.hover" @click="deleteTask(index)"></i>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'my-task',
    data: function () {
      return {
        taskList: [],
        allowAdd: false,
        newTaskContent: ''
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
        const content = this.newTaskContent.trim()
        if (content.length > 0 && add) {
          this.taskList.unshift({
            id: new Date().getTime(),
            content: content,
            finished: false,
            // 用于控制当前hover状态
            hover: false
          })
        }
        this.newTaskContent = ''
        this.allowAdd = false
      },
      finishTask (task) {
        task.finished = !task.finished
      },
      deleteTask (index) {
        this.taskList.splice(index, 1)
      },
      mouseoverTask (task) {
        task.hover = true
      },
      mouseleaveTask (task) {
        task.hover = false
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

    .task-content {
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
