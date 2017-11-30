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
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">{{$t('utils.derivation')}}</el-button>
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
          <span>{{new Date(scope.row.registertime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="接触日志提交时间" >
        <template scope="scope">
          <span>{{new Date(scope.row.sublogtime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
    { key: '0', display_name: '非指定人群' },
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
//        filterDate1: [new Date(2017, 9, 1, 0, 0), new Date()],
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
        this.listQuery.basicInfoTimeStart = parseTime(this.filterDate1[0]).toString()
        this.listQuery.basicInfoTimeEnd = parseTime(this.filterDate1[1]).toString()
        this.listQuery.logTimeStart = parseTime(this.filterDate2[0]).toString()
        this.listQuery.logTimeEnd = parseTime(this.filterDate2[1]).toString()
        this.listQuery.locationTime1Start = parseTime(this.filterDate3[0]).toString()
        this.listQuery.locationTime1End = parseTime(this.filterDate3[1]).toString()
        this.listQuery.locationTime2Start = parseTime(this.filterDate4[0]).toString()
        this.listQuery.locationTime2End = parseTime(this.filterDate4[1]).toString()
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
          const tHeader = ['用户ID', '是否指定人群', '基本信息填写时间', '提交接触日志时间', '参与者ID', '定位开始时间', '定位结束时间']
          const filterVal = ['id', 'assign', 'basicInfoTime', 'logTime', 'participantId', 'locationStart', 'locationEnd']
          const data = this.formatJson(filterVal, this.list)
          export_json_to_excel(tHeader, data, '用户列表')
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'basicInfoTime' || j === 'logTime' || j === 'locationStart' || j === 'locationEnd') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      setSessionStorage(row) {
        sessionStorage.setItem('userInfoForm', JSON.stringify(row))
      }
    },
    watch: {
      filterDate1() {
        console.log(this.filterDate1)
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
