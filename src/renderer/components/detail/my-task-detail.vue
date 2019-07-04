<template>
    <div v-show="Object.keys(task).length>0">
        <h2 :style="task.finished?'text-decoration-line: line-through;':''">{{ task.title }}</h2>
        <b-form-checkbox
                v-model="task.settingPlan"
                checked="false"
                :disabled="task.finished">
            添加到计划日程
        </b-form-checkbox>

        <b-form>
            <b-form-group v-show="task.settingPlan">
                <template slot="label">
                    <b>设置计划时间:</b><br>
                    <b-form-checkbox
                            v-model="task.plan.everyDay"
                            :indeterminate="task.plan.indeterminate"
                            aria-describedby="plan.dayOfWeek"
                            aria-controls="plan.dayOfWeek"
                            @change="toggleAll">
                        {{ task.plan.everyDay ? '每日计划' : '特定日期' }}
                    </b-form-checkbox>
                </template>

                <b-form-checkbox-group
                        id="flavors"
                        v-model="task.plan.selected"
                        :options="dayOfWeek"
                        name="flavors"
                        class="ml-4">
                </b-form-checkbox-group>
            </b-form-group>

            <b-form-textarea
                    id="textarea"
                    v-model="task.text"
                    placeholder="详细内容..."
                    rows="8"
            ></b-form-textarea>
        </b-form>
    </div>
</template>

<script>
  export default {
    name: 'my-task-detail',
    props: ['task'],
    data: function () {
      return {
        dayOfWeek: [
          {text: '周一', value: '1'},
          {text: '周二', value: '2'},
          {text: '周三', value: '3'},
          {text: '周四', value: '4'},
          {text: '周五', value: '5'},
          {text: '周六', value: '6'},
          {text: '周日', value: '0'}
        ]
      }
    },
    methods: {
      toggleAll (checked) {
        this.task.plan.selected = []
        if (checked) {
          for (const day of this.dayOfWeek) {
            this.task.plan.selected.push(day.value)
          }
        }
      }
    },
    watch: {
      'task.plan.selected' (newVal) {
        if (newVal.length === 0) {
          this.task.plan.indeterminate = false
          this.task.plan.everyDay = false
        } else if (newVal.length === 7) {
          this.task.plan.indeterminate = false
          this.task.plan.everyDay = true
        } else {
          this.task.plan.indeterminate = true
          this.task.plan.everyDay = false
        }
      },
      'task.settingPlan' (newVal) {
        // 取消添加到日程后又再次选择添加到日程时清空上一次的选项
        if (!newVal) {
          this.task.plan = {
            selected: [],
            everyDay: false,
            indeterminate: false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
