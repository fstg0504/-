<template>
  <div class="app-container calendar-list-container">
    <p>个人中心</p>
    <p>
      <span>用户名：</span>
      <span>{{name}}</span>
    </p>
    <!--<p>-->
      <!--<span>真实姓名：</span>-->
      <!--<span>{{rel_name}}</span>-->
    <!--</p>-->
    <p>
      <span>权限等级：</span>
      <span>{{ad_level.indexOf('1')>-1?'一级':'二级'}}</span>
    </p>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'personal_center',
    data() {
      return {}
    },
    computed: {
      ...mapGetters([
        'name',
        'rel_name',
        'ad_level'
      ])
    }
  }
</script>
<style lang="less" scoped>
  .el-table-container{
    table{
      tr{

      }
    }
  }
</style>
