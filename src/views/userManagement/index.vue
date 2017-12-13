<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" v-model="listQuery.actorid" style="width: 150px;" class="filter-item" :placeholder="$t('userManagement.enterId')">
      </el-input>
      <div class="block filter-item filter-date">
        <span class="demonstration">{{$t('userManagement.basicInfoTime')}}：</span>
        <el-date-picker
          v-model="filterDate1"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">{{$t('userManagement.logTime')}}：</span>
        <el-date-picker
          v-model="filterDate2"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">定位开始时间：</span>
        <el-date-picker
          v-model="filterDate3"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>
      <div class="block filter-item filter-date">
        <span class="demonstration">定位结束时间：</span>
        <el-date-picker
          v-model="filterDate4"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.crowd" :placeholder="$t('userManagement.crowdtype')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">{{$t('utils.search')}}</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出当前页数据</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownloadByAnswer">根据题目导出数据</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleBatchDownloadByGetLocalLog(1)">批量导出基本信息</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleBatchDownloadByGetLocalLog(2)">批量导出接触日志</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleBatchDownloadByGetLocalLog(3)">批量导出定位信息</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('utils.loadText')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" width="55"></el-table-column>
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <router-link class='inlineBlock' @click.native="setSessionStorage(scope.row)" :to="{path:'/userManagement/userFormDetails'}" title="点击查看用户表单详情">
            {{scope.row.id}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.assign')" width="100">
        <template scope="scope">
          <span>{{scope.row.crowd==1?$t('utils.yes'):$t('utils.no')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="设备信息" width="120">
        <template scope="scope">
          <span>{{scope.row.equipmentinfo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.basicInfoTime')" >
        <template scope="scope">
          <span v-if="scope.row.registertime">{{new Date(scope.row.registertime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接触日志开始时间" >
        <template scope="scope">
          <span v-if="scope.row.touchlog">{{new Date(scope.row.touchlog).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接触日志提交时间" >
        <template scope="scope">
          <span v-if="scope.row.sublogtime">{{new Date(scope.row.sublogtime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.participantId')" width="120">
        <template scope="scope">
          <span>{{scope.row.actorid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationStart')" >
        <template scope="scope">
          <span>{{new Date(scope.row.locationstarttime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationEnd')" >
        <template scope="scope">
          <span>{{new Date(scope.row.locationendtime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          current-page.sync="1"
          :page-size="listQuery.length"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index' // 水波纹指令
  import { parseTime } from '@/utils'

  const calendarTypeOptions = [
    { key: '2', display_name: '非指定人群' },
    { key: '1', display_name: '指定人群' }
  ]

  // arr to obj
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'user_management_list',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        filterDate1: ['', ''],
        filterDate2: ['', ''],
        filterDate3: ['', ''],
        filterDate4: ['', ''],
        total: null,
        listLoading: true,
        listQuery: {
          start: 0,
          length: 10,
          actorid: '',
          basicInfoTimeStart: '0-0-0 0:0:0',
          basicInfoTimeEnd: '0-0-0 0:0:0',
          logTimeStart: '0-0-0 0:0:0',
          logTimeEnd: '0-0-0 0:0:0',
          locationTime1Start: '0-0-0 0:0:0',
          locationTime1End: '0-0-0 0:0:0',
          locationTime2Start: '0-0-0 0:0:0',
          locationTime2End: '0-0-0 0:0:0',
          crowd: ''
        },
        temp: {
          id: undefined,
          importance: 0,
          remark: '',
          timestamp: 0,
          title: '',
          type: '',
          status: 'published'
        },
        calendarTypeOptions,
        tableKey: 0
      }
    },
    filters: {
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
      this.listLoading = true
      this.$http.get('/getUserInfo', { params: this.listQuery }).then(response => {
        this.listLoading = false
        const data = response.data
        if (data.status === 1) {
          this.list = data.data
          this.total = data.recordsFiltered
        } else {
          this.$message({
            message: data.data.msg,
            type: 'warning'
          })
        }
      }, response => {
        this.$message({
          message: response.data.data.msg,
          type: 'warning'
        })
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.basicInfoTimeStart = this.filterDate1[0] ? parseTime(this.filterDate1[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.basicInfoTimeEnd = this.filterDate1[1] ? parseTime(this.filterDate1[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.logTimeStart = this.filterDate2[0] ? parseTime(this.filterDate2[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.logTimeEnd = this.filterDate2[1] ? parseTime(this.filterDate2[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime1Start = this.filterDate3[0] ? parseTime(this.filterDate3[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime1End = this.filterDate3[1] ? parseTime(this.filterDate3[1]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime2Start = this.filterDate4[0] ? parseTime(this.filterDate4[0]).toString() : '0-0-0 0:0:0'
        this.listQuery.locationTime2End = this.filterDate4[1] ? parseTime(this.filterDate4[1]).toString() : '0-0-0 0:0:0'
        this.$http.get('/getUserInfo', { params: this.listQuery }).then(response => {
          this.listLoading = false
          const data = response.data
          if (data.status === 1) {
            this.list = data.data
            this.total = data.recordsFiltered
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            })
          }
        }, response => {
          this.$message({
            message: response,
            type: 'warning'
          })
          console.log('失败：' + response)
        })
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.start = 0
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.start = 0
        this.listQuery.start = this.listQuery.length * (val - 1)
        this.getList()
      },
      handleDownload() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = ['序号', '用户ID', '是否指定人群', '基本信息填写时间', '提交接触日志时间', '参与者ID', '定位开始时间', '定位结束时间']
          const filterVal = ['index', 'id', 'crowd', 'registertime', 'touchlog', 'actorid', 'locationstarttime', 'locationendtime']
          const listArr = this.list.concat()
          const resultArr = []
          for (const i in listArr) {
            const node = JSON.parse(JSON.stringify(listArr[i]))
            resultArr.push({
              index: Number(i) + 1,
              id: node.id,
              crowd: Number(node.crowd) === 1 ? '是' : '否',
              registertime: node.registertime,
              touchlog: node.touchlog,
              actorid: node.actorid,
              locationstarttime: node.locationstarttime,
              locationendtime: node.locationendtime,
            })
          }
          const data = this.formatJson(filterVal, resultArr)
          export_json_to_excel(tHeader, data, '用户列表')
        })
      },
      handleDownloadByAnswer() {
        this.$message({ message: '功能开发中..', type: 'warning' })
        return false
//        require.ensure([], () => {
//          const { export_json_to_excel } = require('vendor/Export2Excel')
//          const rowOpt = [
//            { tHeader: '序号', filterVal: 'index' },
//            { tHeader: '参与者ID', filterVal: 'actorid' },
//            { tHeader: '年龄', filterVal: 'age' },
//            { tHeader: '性别', filterVal: 'sex' },
//            { tHeader: '工作学习状态', filterVal: 'workStatus' },
//            { tHeader: '工作类型', filterVal: 'workType' },
//            { tHeader: '学历', filterVal: '学历' },
//            { tHeader: '收入类型', filterVal: 'incomeType' },
//            { tHeader: '收入', filterVal: 'income' },
//            { tHeader: '居住年数', filterVal: 'LivingYears' },
//            { tHeader: '同住人数', filterVal: 'WithNumber' },
//            { tHeader: '同住类型', filterVal: 'LivingType' },
//            { tHeader: '同住人年龄1', filterVal: 'LivingAge1' },
//            { tHeader: '同住人性别1', filterVal: 'LivingSex1' },
//            { tHeader: '同住人关系1', filterVal: 'LivingRelation1' },
//            { tHeader: '同住人年龄2', filterVal: 'LivingAge2' },
//            { tHeader: '同住人性别2', filterVal: 'LivingSex2' },
//            { tHeader: '同住人关系2', filterVal: 'LivingRelation2' },
//            { tHeader: '同住人年龄3', filterVal: 'LivingAge3' },
//            { tHeader: '同住人性别3', filterVal: 'LivingSex3' },
//            { tHeader: '同住人关系3', filterVal: 'LivingRelation3' },
//          ]
//          console.log(rowOpt)
//          const tHeader = rowOpt.map((item) => {
//            return item.tHeader
//          })
//          const filterVal = rowOpt.map((item) => {
//            return item.filterVal
//          })
//          const listArr = this.list.concat()
//          const resultArr = []
//          for (const i in listArr) {
//            resultArr.push({
//
//            })
//          }
//          const data = this.formatJson(filterVal, resultArr)
//          export_json_to_excel(tHeader, data, '题目')
//        })
      },
      handleBatchDownloadByGetLocalLog(sig) {
        const IDArr = this.list.map((item) => {
          return item.actorid ? item.actorid : item.id
        })
        switch (sig) {
          case 1: {
            this.list.map((item, index) => {
              const DATA = JSON.parse(item.locanswer)
              for (const i in DATA) {
                const node = DATA[i]
                node.question = this.$t('basicInfoQuestions.q' + (node.id))
              }
              this.LocationInformationDownload(DATA, IDArr[index], sig)
            })
            break
          }
          case 2: {
            this.list.map((item, index) => {
              const DATA = JSON.parse(item.answerlog)
              for (const i in DATA) {
                const node = DATA[i]
                node.question = this.$t('basicInfoQuestions.q' + (node.id))
              }
              this.LocationInformationDownload(DATA, IDArr[index], sig)
            })
            break
          }
          case 3: {
            Promise.all(this.list.map((item) => {
              return this.$http.get('/getLocalLog', { params: { phoneid: item.equipmentinfo, start: 0 }})
            })).then((res) => {
              for (const i in res) {
                const node = res[i]
                const DATA = node.data.data
                this.LocationInformationDownload(DATA, IDArr[i], sig)
              }
            }).catch((err) => {
              this.$message.error(`错误信息：${err}`)
            })
            break
          }
          default:
            this.$message.error(`错误信息：下载失败`)
        }
      },
      LocationInformationDownload(DATA, userId, sig) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          switch (sig) {
            case 1: {
              const tHeader = ['题号', '题目', '答案']
              const filterVal = ['id', 'question', 'answer']
              const basicListArr = DATA
              const resultArr = []
              for (const i in basicListArr) {
                const node = JSON.parse(JSON.stringify(basicListArr[i]))
                const id = node.id
                let answer = node.answer
                if (typeof (answer) === 'object') {
                  answer = JSON.parse(JSON.stringify(node.answer))
                }
                let answerStr = ''
                if (answer) {
                  switch (id) {
                    case 6: {
                      answerStr = `${answer.type}:${answer.scope}`
                      break
                    }
                    case 8: {
                      answerStr = `同住人数：${answer.num}；\r\n同住类型：${answer.type}`
                      break
                    }
                    case 9: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `年龄：${node.age}；性别：${node.sex}; 关系：${node.relation}\r\n`
                      }
                      break
                    }
                    case 10: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `范围：${node.scope}；频率：${node.hz}\r\n`
                      }
                      break
                    }
                    case 11: {
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `范围：${node.scope}；频率：${node.hz}\r\n`
                      }
                      break
                    }
                    case 13: {
                      answerStr = `分数：${answer.grade}；\r\n 理由：${answer.reson}`
                      break
                    }
                    default:
                      answerStr = answer.toString()
                  }
                } else {
                  answerStr = `未填写`
                }
                resultArr.push({
                  id: node.id,
                  question: node.question,
                  answer: answerStr,
                })
              }
              const data = this.formatJson(filterVal, resultArr)
              export_json_to_excel(tHeader, data, `基本信息填写问卷信息-${userId}`)
              break
            }
            case 2: {
              const tHeader2 = ['题号', '题目', '答案', '提交时间']
              const filterVal2 = ['id', 'question', 'answer', 'submitTime']
              const logListArr = DATA
              const resultArr = []
              for (const i in logListArr) {
                const node = JSON.parse(JSON.stringify(logListArr[i]))
                const id = node.id
                const answer = node.answer
                let answerStr = ''
                if (answer) {
                  switch (id) {
                    case 4:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `年龄：${node.age}；性别：${node.sex}；接触时间：${node.cTime}；关系：${node.relation}；接触类型：${node.contactType}；总时间：${node.contacttime}；接触地点：${node.contactLocation}；平时的接触频率:${node.contactHz}；提交时间:${node.submitTime}\r\n`
                      }
                      break
                    case 5:
                      if (answer.state === '是') {
                        answerStr = node.num
                      } else {
                        answerStr = `估计遗漏数量：${node.num}`
                      }
                      break
                    case 8:
                      answerStr = `种类：${node.type}；数量：${node.num}`
                      break
                    case 9:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `种类：${node.type}；频率：${node.hz}\r\n`
                      }
                      break
                    case 11:
                      for (const i in answer) {
                        const node = answer[i]
                        answerStr += `动物种类：${node.type}；数量：${node.num}；接触时间：${node.contacttime}；接触地点：${node.contactLocation}；\r\n`
                      }
                      break
                    default:
                      answerStr = answer.toString()
                  }
                } else {
                  answerStr = `未填写`
                }
                resultArr.push({
                  id: node.id,
                  question: node.question,
                  answer: answerStr,
                  submitTime: node.submitTime,
                })
              }
              const data2 = this.formatJson(filterVal2, resultArr)
              export_json_to_excel(tHeader2, data2, `接触日志填写问卷信息-${userId}`)
              break
            }
            case 3: {
              const tHeader3 = ['序号', '日期', '时间', '纬度', '经度']
              const filterVal3 = ['index', 'date1', 'date2', 'lon', 'lat']
              const localLogListArr = DATA
              const resultArr = []
              for (const i in localLogListArr) {
                const node = JSON.parse(JSON.stringify(localLogListArr[i]))
                node.locationlog = JSON.parse(node.locationlog)
                resultArr.push({
                  index: Number(i) + 1,
                  date1: node.nowtime ? this.fomentDateYMD(node.nowtime) : `无`,
                  date2: node.nowtime ? this.fomentDateHIS(node.nowtime) : `无`,
                  lon: node.locationlog.lon,
                  lat: node.locationlog.lat
                })
              }
              const data3 = this.formatJson(filterVal3, resultArr)
              export_json_to_excel(tHeader3, data3, `定位数据记录信息-${userId}`)
              break
            }
            default: {
              this.$message.error(`错误信息：生成表格失败，错误的参数`)
            }
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'registertime' || j === 'touchlog' || j === 'locationstarttime' || j === 'locationendtime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      fomentDateYMD(value) {
        if (value) {
          const date = new Date(value)
          const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}`,
            h: date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`,
            i: date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`,
            s: date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`,
          }
          return `${formatObj.y}${formatObj.m}${formatObj.d}`
        } else {
          return `无`
        }
      },
      fomentDateHIS(value) {
        if (value) {
          const date = new Date(value)
          const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}`,
            h: date.getHours().toString().length > 1 ? date.getHours() : `0${date.getHours()}`,
            i: date.getMinutes().toString().length > 1 ? date.getMinutes() : `0${date.getMinutes()}`,
            s: date.getSeconds().toString().length > 1 ? date.getSeconds() : `0${date.getSeconds()}`,
          }
          return `${formatObj.h}${formatObj.i}${formatObj.s}`
        } else {
          return `无`
        }
      },
      setSessionStorage(row) {
        sessionStorage.setItem('userInfoForm', JSON.stringify(row))
      }
    }
  }
</script>
<style lang="less" scoped>
  .filter-item{
    float: left;
    margin-right: 15px;
  }
  .filter-date{
    float: left;
  }
  table{
    .inlineBlock{
      color: blue;
      &:hover{
        color: red;
      }
    }
  }
</style>
