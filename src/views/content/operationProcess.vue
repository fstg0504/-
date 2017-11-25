<template>
  <div class="app-container">
    <div class="wrapper">
      <div class="components-container">
        <code>
          操作流程富文本
        </code>
        <div>
          <div class="typeFilter">
            <template>
              <el-radio v-model="crowd" label="1">{{$t('userManagement.assignCrowd')}}</el-radio>
              <el-radio v-model="crowd" label="2">{{$t('userManagement.assignCrowdNot')}}</el-radio>
            </template>
          </div>
          <tinymce :height='200' v-model="content" @changeContent="setTinymceId"></tinymce>
          <div class="btn-save"><el-button type="primary" @click="save()">保存</el-button></div>
        </div>
        <div class="preview-con">
          <p class="preview-title">实时预览</p>
          <div class='editor-content' v-html='content'></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Qs from 'qs'
  import Cookies from 'js-cookie'

  export default {
    components: { Tinymce },
    data() {
      return {
        contentObj: {},
        content: '',
        contentId: '',
        crowd: '1',
        contentType: 3
      }
    },
    created() {
      this.getContent()
    },
    methods: {
      save() {
        const opt = {
          id: this.contentId,
          crowd: this.crowd,
          type: this.contentType,
          language: this.getLang(),
          content: this.content
        }
        this.$http({
          method: 'post',
          url: '/updateContent',
          data: Qs.stringify(opt)
        }).then(response => {
          this.getContent()
        }, response => {
          console.log('失败：' + response)
        })
      },
      getContent() {
        const opt = {
          crowd: this.crowd,
          type: this.contentType,
          language: this.getLang()
        }
        this.$http.get('/getContent', { params: opt }).then(response => {
          const contentObj = response.data.data[0]
          this.contentObj = contentObj
          this.content = contentObj.content
          this.contentId = contentObj.id
          this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(this.content))
        }, response => {
          console.log('失败：' + response)
        })
      },
      getLang() {
        if (Cookies.get('lang') === 'zh') {
          return 1
        } else {
          return 2
        }
      },
      setTinymceId(tinymceId) {
        this.tinymceId = tinymceId
      },
      setContent(val) {
        window.tinymce.get(this.tinymceId).setContent(val)
      }
    },
    watch: {
      crowd() {
        this.getContent()
      }
    }
  }
</script>

<style lang="less" scoped>
  .wrapper{
    width: 100%;
    margin: 30px auto;
    .editor-content{
      padding: 10px;
      background-color: #eef1f6;
    }
    .btn-save{
      margin: 10px 0;
      float: right;
    }
  }
  .editor-content{
  }
</style>
