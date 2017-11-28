<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" :placeholder="$t('userManagement.enterId')" v-model="listQuery.enterId">
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
        <span class="demonstration">{{$t('userManagement.userRealTimeLocation')}}：</span>
        <el-date-picker
          v-model="filterDate3"
          type="daterange"
          :range-separator="$t('utils.to')"
          :start-placeholder="$t('utils.startTime')"
          :end-placeholder="$t('utils.endTime')">
        </el-date-picker>
      </div>

      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.crowdType" :placeholder="$t('userManagement.crowdtype')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">{{$t('utils.search')}}</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">{{$t('utils.derivation')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('utils.loadText')" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column align="center" label="ID" width="65">
        <template scope="scope">
          <router-link class='inlineBlock' @click.native="setSessionStorage(scope.row)" :to="{path:'/userManagement/userFormDetails'}">
            {{scope.row.id}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.assign')" width="120">
        <template scope="scope">
          <span>{{scope.row.assign==1?$t('utils.yes'):$t('utils.no')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('userManagement.basicInfoTime')" >
        <template scope="scope">
          <span>{{scope.row.basicInfoTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.logTime')" >
        <template scope="scope">
          <span>{{scope.row.logTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.participantId')" width="120">
        <template scope="scope">
          <span>{{scope.row.participantId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationStart')" >
        <template scope="scope">
          <span>{{scope.row.locationStart | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('userManagement.locationEnd')" >
        <template scope="scope">
          <span>{{scope.row.locationEnd | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetchList } from '@/api/article'
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
  const list = [
    {
      id: 1,
      assign: 1,
      basicInfoTime: new Date().getTime() + 1256,
      logTime: new Date().getTime() + 25475,
      participantId: 5555,
      locationStart: new Date().getTime() + 25475,
      locationEnd: new Date().getTime() + 25475
    },
    {
      id: 2,
      assign: 1,
      basicInfoTime: new Date().getTime() + 1256,
      logTime: new Date().getTime() + 25475,
      participantId: 5555,
      locationStart: new Date().getTime() + 25475,
      locationEnd: new Date().getTime() + 25475
    },
    {
      id: 3,
      assign: 0,
      basicInfoTime: new Date().getTime() + 1256,
      logTime: new Date().getTime() + 25475,
      participantId: 5555,
      locationStart: new Date().getTime() + 25475,
      locationEnd: new Date().getTime() + 25475
    },
    {
      id: 4,
      assign: 1,
      basicInfoTime: new Date().getTime() + 1256,
      logTime: new Date().getTime() + 25475,
      participantId: 5555,
      locationStart: new Date().getTime() + 25475,
      locationEnd: new Date().getTime() + 25475
    },
    {
      id: 5,
      assign: 1,
      basicInfoTime: new Date().getTime() + 1256,
      logTime: new Date().getTime() + 25475,
      participantId: 5555,
      locationStart: new Date().getTime() + 25475,
      locationEnd: new Date().getTime() + 25475
    }
  ]
  export default {
    name: 'user_management_list',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        filterDate1: [new Date(2017, 9, 1, 0, 0), new Date()],
        filterDate2: [new Date(2017, 9, 1, 0, 0), new Date()],
        filterDate3: [new Date(2017, 9, 1, 0, 0), new Date()],
        total: null,
        listLoading: true,
        listQuery: {
          enterId: undefined,
          basicInfoTimeStart: undefined,
          basicInfoTimeEnd: undefined,
          logTimeStart: undefined,
          logTimeEnd: undefined,
          locationTimeStart: undefined,
          locationTimeEnd: undefined,
          crowdType: undefined,
          page: 1,
          limit: 20
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
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    created() {
//    this.getList()
      this.list = list
      this.listLoading = false
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.listQuery.basicInfoTimeStart = this.filterDate1[0]
        this.listQuery.basicInfoTimeEnd = this.filterDate1[1]
        this.listQuery.logTimeStart = this.filterDate2[0]
        this.listQuery.logTimeEnd = this.filterDate2[1]
        this.listQuery.locationTimeStart = this.filterDate3[0]
        this.listQuery.locationTimeEnd = this.filterDate3[1]
//        this.getList()
        console.log(this.listQuery)
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
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
