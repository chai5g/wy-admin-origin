<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form inline size="small">
            <el-form-item label="客户名称：">
              <el-input
                v-model="listPram.customerName"
                placeholder="请输入客户名称"
                class="selWidth"
                size="small"
                clearable
                onchange="handerSearch"
              />
            </el-form-item>
            <el-form-item label="小区名称：">
              <el-input
                v-model="listPram.communityName"
                placeholder="请输入小区名称"
                class="selWidth"
                size="small"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>
        <el-button size="small" type="primary" class="mr10" v-hasPermi="['admin:article:save']" @click="addNew">新增
        </el-button>

      </div>
      <el-table
        v-loading="listLoading"
        :data="listData.list"
        size="mini"
        class="table"
        highlight-current-row
        :header-cell-style=" {fontWeight:'bold'}"
      >
        <el-table-column prop="id" label="ID" min-width="50"/>
        <el-table-column prop="id" label="客户名称" min-width="180"/>

        <el-table-column prop="id" label="小区名称" min-width="180"/>

        <el-table-column prop="id" label="物业后台域名地址" min-width="180"/>

        <el-table-column label="小程序LOGO" min-width="180">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
                style="width: 36px; height: 36px"
                :src="scope.row.imageInput"
                :preview-src-list="[scope.row.imageInput]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="小程序名称" min-width="180"/>

        <el-table-column prop="updateTime" label="状态" min-width="180"/>
        <el-table-column
          label="操作"
          min-width="100"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">

            <el-button
              type="text"
              size="small"
              @click="downLine(scope.row)"
            >下线
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="upLine(scope.row)"
            >上线
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handlerOpenEdit(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="handlerDelete(scope.row)"
              v-hasPermi="['admin:article:delete']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="listPram.page"
        :page-sizes="constants.page.limit"
        :layout="constants.page.layout"
        :total="listData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog
      :visible.sync="editDialogConfig.visible"
      :title="editDialogConfig.isEdit === 0 ? '新增部署' : '编辑部署'"
    >
      <edit
        v-if="editDialogConfig.visible"
        :is-edit="editDialogConfig.isEdit"
        :edit-data="editDialogConfig.editData"
        @hideDialog="handlerHideDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import * as articleApi from '@/api/article.js'
import * as categoryApi from '@/api/categoryApi.js'
import edit from './edit'

export default {
  // name: "list",
  components: { edit },
  data() {
    return {
      constants: this.$constants,
      listPram: {
        communityName: null,
        customerName: null,
        cid: null,
        page: 1,
        limit: this.$constants.page.limit[0]
      },
      listData: { list: [], total: 0 },
      editDialogConfig: {
        visible: false,
        data: {},
        isEdit: 0 // 0=add 1=edit
      },
      listLoading: true,
      categoryTreeData: [],
      categoryProps: {
        value: 'id',
        label: 'name',
        children: 'child',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false
      }
    }
  },
  mounted() {
    this.handlerGetListData(this.listPram)
    // this.handlerGetTreeList()
  },
  methods: {
    // handlerGetTreeList() {
    //   // categoryApi.listCategroy({ type: 3, status: '' }).then((data) => {
    //   //   this.categoryTreeData = data.list
    //   //   localStorage.setItem('articleClass', JSON.stringify(data.list))
    //   // })
    //   this.categoryTreeData = [
    //     {
    //       id: 1,
    //       name: '小区1',
    //       child: [
    //         {
    //           id: 11,
    //           name: '小区1-1'
    //         },
    //         {
    //           id: 12,
    //           name: '小区1-2'
    //         }
    //       ]
    //     },
    //     {
    //       id: 2,
    //       name: '小区2',
    //       child: [
    //         {
    //           id: 21,
    //           name: '小区2-1'
    //         },
    //         {
    //           id: 22,
    //           name: '小区2-2'
    //         }
    //       ]
    //     }
    //   ]
    // },
    handerSearch() {
      this.listPram.page = 1
      this.handlerGetListData(this.listPram)
    },
    handlerGetListData(pram) {
      this.listLoading = true
      // articleApi.ListArticle(pram).then((data) => {
      this.listData = {
        list: [
          {
            id: 1,
            customerName: '客户1',
            communityName: '小区1',
            propertyDomain: 'http://www.baidu.com',
            imageInput: 'http://www.baidu.com',
            title: '小程序1',
            updateTime: '已发布'
          },
          {
            id: 2,
            customerName: '客户2',
            communityName: '小区2',
            propertyDomain: 'http://www.baidu.com',
            imageInput: 'http://www.baidu.com',
            title: '小程序2',
            updateTime: '已发布'
          }
        ],
        total: 2
      }
      this.listLoading = false
      // })
    },
    handlerOpenEdit(isEdit, editData) {
      // 0=add 1=edit
      // if (isEdit === 1) {
      //   this.editDialogConfig.isEdit = 1
      //   this.editDialogConfig.editData = editData
      // } else {
      //   this.editDialogConfig.isEdit = 0
      // }
      this.editDialogConfig.visible = true
    },
    addNew() {
      this.editDialogConfig.visible = true
    },
    // handlerGetCategoryTreeData() {
    //   const _pram = { type: constants.categoryType[2].value, status: 1 }
    //   categoryApi.treeCategroy(_pram).then(data => {
    //     this.categoryTreeData = selfUtil.addTreeListLabelForCasCard(data)
    //   })
    // },
    handlerHideDialog() {
      this.handlerGetListData(this.listPram)
      this.editDialogConfig.visible = false
    },
    handlerDelete(rowData) {
      this.$confirm('确定删除当前数据', '提示').then((result) => {
        // articleApi.DelArticle(rowData).then((data) => {
        this.$message.success('删除数据成功')
        this.handlerGetListData(this.listPram)
        // })
      })
    },
    handleSizeChange(val) {
      this.listPram.limit = val
      this.handlerGetListData(this.listPram)
    },
    handleCurrentChange(val) {
      this.listPram.page = val
      this.handlerGetListData(this.listPram)
    },
    edit() {

    },
    downLine() {

    },
    upLine() {

    }
  }
}
</script>

<style scoped lang="scss">
.articleModal {
  z-index: 333 !important;
}
</style>
