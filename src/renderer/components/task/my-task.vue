<template>
    <div id="task-outline">
        <div id="add-task">
            <b-button @click="showAddTaskForm" block variant="primary" v-if="!allowAdd">添加任务</b-button>
            <b-button @click="addOrCancel(false)" block variant="primary" v-if="allowAdd">取消添加</b-button>
        </div>
        <div id="task-list">
            <table id="task-table">
                <tr id="content-input" class="task-item" v-show="allowAdd">
                    <td style="width: 25px">
                    </td>
                    <td id="new-task" contenteditable="true">
                    </td>
                    <td class="task-plus-icon">
                        <i class="fa fa-plus" @click="addOrCancel(true)"></i>
                    </td>
                </tr>
                <tr class="task-item" v-for="(task, index) in taskList">
                    <td class="task-check-icon"
                        @click="finishTask(task)"
                        @mouseenter="mouseoverCheckIcon(task)"
                        @mouseleave="mouseleaveCheckIcon(task)">
                        <i class="fa fa-check" v-show="task.finished||task.tempShow"></i>
                    </td>
                    <td class="task-content">
                        <span :class="task.finished?'finished':''">{{ task.content }}</span>
                    </td>
                    <td class="task-plus-icon">
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
        allowAdd: false
      }
    },
    methods: {
      showAddTaskForm () {
        this.allowAdd = true
        const taskListTag = document.getElementById('task-list')
        taskListTag.scrollTop = 0
        this.taskList.unshift({
          id: new Date().getTime(),
          content: '',
          finished: false,
          // 用于控制鼠标移动到图标上临时显示的参数
          tempShow: false
        })
        // 触发一个异步操作，保证能获取到task-content
        setTimeout(function () {
          const currContentInput = document.getElementsByClassName('task-content')[0]
          currContentInput.innerText = ''
          currContentInput.focus()
        })
      },
      addOrCancel (add) {
        const taskContent = document.getElementsByClassName('task-content')[0]
        if (!add || taskContent.innerText.trim().length === 0) {
          this.taskList.shift()
          if (this.taskList.length > 0) {
            taskContent.innerText = this.taskList[0].content
          }
        } else {
          this.taskList[0].content = taskContent.innerText.trim()
        }
        this.allowAdd = false
      },
      finishTask (task) {
        task.finished = !task.finished
      },
      mouseoverCheckIcon (task) {
        task.tempShow = true
      },
      mouseleaveCheckIcon (task) {
        task.tempShow = false
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

    .fa-plus {
        color: #3361ff;
    }

    .fa-check {
        color: #00b400;
    }

    .task-content {
        word-wrap: break-word;
        outline-style: none;
    }

    .task-check-icon, .task-plus-icon {
        width: 25px;
        text-align: center;
        cursor: pointer;
    }

    #task-table {
        width: 100%;
    }

    .task-item {
        border-bottom: 1px solid #B2D5DF;
        line-height: 32px;
    }

    .task-item:hover {
        background: #e8eef7;
    }

    .finished{
        text-decoration-line: line-through;
    }

</style>
