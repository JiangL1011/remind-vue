<template>
    <div id="detail">
        <template v-if="task">
            <h2 :style="task.finished?'text-decoration-line: line-through;':''">{{ task.title }}</h2>
            <h6>{{ '创建时间：'+ require('moment')(task.createTime,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}</h6>
            <h6 v-if="task.finished">
                {{ '完成时间：'+ require('moment')(task.finishTime,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') }}
            </h6>
            <b-form-checkbox
                    v-model="task.settingPlan"
                    checked="false"
                    v-if="!task.finished">
                添加到计划日程
            </b-form-checkbox>

            <b-form style="margin-top: 10px">
                <b-form-group label="" v-show="task.settingPlan">
                    <b>选择计划类型:</b><br>
                    <b-form-radio v-model="task.plan.type" name="plan-type" value='once' :disabled="task.finished">单次计划
                    </b-form-radio>
                    <b-form-radio v-model="task.plan.type" name="plan-type" value='repeat' :disabled="task.finished">
                        周期计划
                    </b-form-radio>
                </b-form-group>

                <b-container fluid v-show="task.settingPlan && task.plan.type==='once'">
                    <b-row class="b-row">
                        <label style="width: 60px">日期:</label>
                        <b-form-input v-model="task.plan.date" type="date" :disabled="task.finished"></b-form-input>
                    </b-row>
                    <b-row class="b-row">
                        <label style="width: 60px">时间:</label>
                        <b-form-input v-model="task.plan.time" type="time" :disabled="task.finished"></b-form-input>
                    </b-row>
                </b-container>

                <b-form-group v-show="task.settingPlan && task.plan.type==='repeat'">
                    <template slot="label">
                        <b>设置计划时间:</b><br>
                        <b-form-checkbox
                                v-model="task.plan.everyday"
                                :indeterminate="task.plan.indeterminate"
                                aria-describedby="plan.dayOfWeek"
                                aria-controls="plan.dayOfWeek"
                                @change="toggleAll"
                                :disabled="task.finished">
                            {{ task.plan.everyday ? '每日计划' :
                            (task.plan.daysOfWeek.length===0?'勾选设为每日计划或选择具体时间设为周期计划':'周期计划') }}
                        </b-form-checkbox>
                    </template>

                    <b-form-checkbox-group
                            id="flavors"
                            v-model="task.plan.daysOfWeek"
                            :options="dayOfWeek"
                            name="flavors"
                            class="ml-4"
                            :disabled="task.finished">
                    </b-form-checkbox-group>
                </b-form-group>

                <b-container fluid v-show="task.settingPlan && task.plan.type==='repeat'">
                    <b-row class="b-row">
                        <label style="width: 60px;">时间:</label>
                        <b-form-input v-model="task.plan.time" type="time"></b-form-input>
                    </b-row>
                </b-container>
                <b-button variant="primary"
                          size="sm"
                          @click="addToPlan"
                          v-show="task.settingPlan"
                          :disabled="task.finished"
                          style="margin: 3px auto;display: block;">
                    确认添加到计划日程
                </b-button>

                <b-form-textarea
                        id="textarea"
                        v-model="task.text"
                        placeholder="详细内容..."
                        rows="8"
                        :disabled="task.finished"
                        style="margin-top: 10px;">
                </b-form-textarea>
                <b-button variant="primary"
                          size="sm"
                          style="display:block;margin:3px auto"
                          v-model="task.text"
                          v-if="!task.finished"
                          @click="editText">
                    保存任务详细内容
                </b-button>
            </b-form>
        </template>
    </div>
</template>

<script>
  const common = require('../../util/common')
  const moment = require('moment')
  const db = require('../../db/remindDB')

  export default {
    name: 'detail',
    data: function () {
      return {
        taskId: '',
        taskIndex: 0,
        task: null,
        dayOfWeek: [
          {text: '周一', value: 1},
          {text: '周二', value: 2},
          {text: '周三', value: 3},
          {text: '周四', value: 4},
          {text: '周五', value: 5},
          {text: '周六', value: 6},
          {text: '周日', value: 7}
        ]
      }
    },
    methods: {
      toggleAll (checked) {
        this.task.plan.daysOfWeek = []
        if (checked) {
          for (const day of this.dayOfWeek) {
            this.task.plan.daysOfWeek.push(day.value)
          }
        }
      },
      addToPlan () {
        const stateKey = moment().format('YYYYMMDD')
        if (!this.task.plan.state[stateKey]) {
          this.task.plan.state[stateKey] = common.stateDetail()
        }
        if (this.task.plan.type === 'once') {
          // 单次计划
          if (this.task.plan.date === '' || this.task.plan.time === '') {
            alert('日期和时间不可为空或填写错误')
          } else {
            const selectDateTime =
              moment(this.task.plan.date + ' ' + this.task.plan.time, 'YYYY-MM-DD HH:mm').format('YYYYMMDDHHmm')
            const currDateTime = moment().format('YYYYMMDDHHmm')
            if (parseInt(currDateTime) >= parseInt(selectDateTime)) {
              alert('不能选择过去的日期和时间')
            } else {
              const id = this.task._id
              const date = this.task.plan.date
              const time = this.task.plan.time
              db.update({
                _id: id
              }, {
                $set: {
                  planned: true,
                  'plan.type': 'once',
                  'plan.date': date,
                  'plan.time': time
                }
              })
              // 添加为计划后从我的任务列表中删除
              this.$parent.$refs.task.removeItem(this.taskIndex)
              this.task = null
            }
          }
        } else {
          // 周期计划
          if (this.task.plan.daysOfWeek.length === 0 || this.task.plan.time === '') {
            alert('计划周期和时间不可为空或填写错误')
          } else {
            const id = this.task._id
            const daysOfWeek = this.task.plan.daysOfWeek
            const time = this.task.plan.time
            const indeterminate = this.task.plan.indeterminate
            const everyday = this.task.plan.everyday
            db.update({
              _id: id
            }, {
              $set: {
                planned: true,
                'plan.type': 'repeat',
                'plan.daysOfWeek': daysOfWeek.sort(),
                'plan.time': time,
                'plan.indeterminate': indeterminate,
                'plan.everyday': everyday
              }
            })
            // 添加为计划后从我的任务列表中删除
            this.$parent.$refs.task.removeItem(this.taskIndex)
            this.task = null
          }
        }
      },
      editText () {
        const that = this
        db.update({
          _id: that.task._id
        }, {
          $set: {
            text: that.task.text
          }
        }, {}, function (err) {
          if (!err) {
            alert('保存成功')
          } else {
            alert('保存失败，程序内部错误')
          }
        })
      }
    },
    watch: {
      taskId (newVal) {
        const that = this
        db.findOne({_id: newVal}, function (err, doc) {
          if (!err) {
            that.task = doc
          } else {
            alert('程序内部错误')
          }
        })
      },
      task (newVal, oldVal) {
        // 保存正在编辑的数据
        if (oldVal) {
          db.update({
            _id: oldVal._id
          }, {
            $set: {
              settingPlan: oldVal.settingPlan,
              plan: oldVal.plan
            }
          })
        }
      },
      'task.plan.daysOfWeek' (newVal) {
        if (newVal) {
          if (newVal.length === 0) {
            this.task.plan.indeterminate = false
            this.task.plan.everyday = false
          } else if (newVal.length === 7) {
            this.task.plan.indeterminate = false
            this.task.plan.everyday = true
          } else {
            this.task.plan.indeterminate = true
            this.task.plan.everyday = false
          }
        }
      },
      'task.settingPlan' (newVal) {
        if (newVal !== undefined) {
          // 取消添加到日程后又再次选择添加到日程时清空上一次的选项
          if (!newVal) {
            this.task.plan = common.plan()
          }
        }
      },
      'task.plan.type' (newVal) {
        if (newVal) {
          // 切换类型时初始化数据
          this.task.plan = common.plan()
          this.task.plan.type = newVal
        }
      }
    }
  }
</script>

<style scoped>
    #detail {
        width: 250px;
        min-width: 200px;
        flex-grow: 1;
        word-wrap: break-word;
    }

    .b-row {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }
</style>
