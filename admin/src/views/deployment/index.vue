<template>
  <div class="divBox">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="container">
          <el-form inline size="small">
            <el-form-item label="客户名称：">
              <el-input
                  v-model="listPram.query.name"
                  placeholder="请输入客户名称"
                  class="selWidth"
                  size="small"
                  clearable
                  @change="handerSearch"
              />
            </el-form-item>
            <el-form-item label="小区名称：">
              <el-input
                  v-model="listPram.query.plotName"
                  placeholder="请输入小区名称"
                  class="selWidth"
                  size="small"
                  clearable
                  @change="handerSearch"
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
        <el-table-column prop="name" label="客户名称" min-width="180"/>

        <el-table-column prop="id" label="小区名称" min-width="180"/>

        <el-table-column prop="dnsUrl" label="物业后台域名地址" min-width="180"/>

        <el-table-column label="小程序LOGO" min-width="180">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image
                  style="width: 36px; height: 36px"
                  :src="scope.row.miniLogoUrl"
                  :preview-src-list="[scope.row.miniLogoUrl]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="miniName" label="小程序名称" min-width="180"/>

        <el-table-column prop="status" label="状态" min-width="180">
          <template slot-scope="scope">
            <el-tag
                :type="statusEnum[scope.row.status]&&statusEnum[scope.row.status].color"
                size="small"
            >
              {{ statusEnum[scope.row.status] && statusEnum[scope.row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            min-width="100"
            fixed="right"
            align="center"
        >
          <template slot-scope="scope">

            <el-popconfirm
                title="确定下线吗？"
                v-if="scope.row.status === 1"
                @onConfirm="downLine(scope.row)"
            >
              <el-button
                  slot="reference"
                  type="text"
                  size="small"
              >下线
              </el-button>
            </el-popconfirm>
            <el-popconfirm
                title="确定上线吗？"
                @onConfirm="upLine(scope.row)"
                v-if="scope.row.status === 0||scope.row.status === -1"
            >
              <el-button
                  slot="reference"
                  type="text"
                  size="small"
              >上线
              </el-button>
            </el-popconfirm>
            <el-button
                type="text"
                size="small"
                @click="handlerOpenEdit(1,scope.row)"
                v-if="scope.row.status !==1"
            >编辑
            </el-button>
            <el-button
                type="text"
                size="small"
                @click="handlerDelete(scope.row)"
                v-hasPermi="['admin:article:delete']"
                v-if="scope.row.status !==1"

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
          :detail-data="editDialogConfig.editData"
          @hideDialog="handlerHideDialog"
      />
    </el-dialog>
  </div>
</template>

<script>
import * as deployApi from '@/api/deployment.js' // import * as categoryApi from '@/api/categoryApi.js'
import edit from './edit'

export default {
  // name: "list",
  components: { edit },
  data() {
    return {
      constants: this.$constants,
      listPram: {
        pageNum: 1,
        pageSize: this.$constants.page.limit[0],
        query: {
          name: null,
          plotName: null
        }
      },
      listData: { list: [], total: 0 },
      editDialogConfig: {
        visible: false,
        data: {},
        isEdit:false // 0=add 1=edit
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
      },
      statusEnum: {
        '1': { label: '上线', value: 1, color: 'success' },
        '0': { label: '已下线', value: -1, color: 'danger' },
        '-1': { label: '已下线', value: -1, color: 'danger' }

      }
    }
  },
  mounted() {
    this.handlerGetListData(this.listPram)
  },
  methods: {
    handerSearch() {
      this.listPram.page = 1
      this.handlerGetListData(this.listPram)
    },
    handlerGetListData(pram) {
      this.listLoading = true
      deployApi.deployList(pram).then((data) => {
        this.listData = {
          list: data.list,
          total: data.total
        }
        this.listLoading = false
      })
    },
    handlerOpenEdit(isEdit, editData) {
      // 0=add 1=edit
      if (isEdit === 1) {
        this.editDialogConfig.isEdit = true
        this.editDialogConfig.editData = editData
      } else {
        this.editDialogConfig.isEdit = false
      }
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
      this.editDialogConfig.editData = {}
      this.editDialogConfig.isEdit = false
    },
    handlerDelete(rowData) {
      this.$confirm('确定删除当前数据', '提示').then((result) => {
        // articleApi.DelArticle(rowData).then((data) => {
        deployApi.delDeploy({ id: rowData.id }).then(() => {
          this.$message.success('删除数据成功')
          this.handlerGetListData(this.listPram)
        })
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
    downLine(data) {
      deployApi.offlineDeploy({
        id: data.id
      }).then(() => {
        this.$message.success('下线成功')
        this.handlerGetListData(this.listPram)
      })
    },
    upLine(data) {
      console.log(data.id)
      deployApi.onlineDeploy({
        id: data.id
      }).then(() => {
        this.$message.success('上线成功')
        this.handlerGetListData(this.listPram)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.articleModal {
  z-index: 333 !important;
}
</style>
