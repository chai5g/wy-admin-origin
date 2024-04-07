<template>
  <div class="divBox">
    <el-card class="box-card">
      <el-row class="Jcommon-search-box" :gutter="16">
        <el-form @submit.native.prevent :inline="true" :model="formInline">
          <!--          <el-col :span="5">-->
          <el-form-item label="付款方式">
            <el-select v-model="query.payMethod" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in payMethodOptions"
                :key="index"
                :label="item.name"
                :value="item.code"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--          </el-col>-->
          <!--          <el-col :span="4">-->
          <el-form-item label="类型">
            <el-select v-model="query.type" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--          </el-col>-->
          <!--          <el-col :span="7">-->
          <el-form-item label="缴费时间">
            <el-date-picker
              v-model="pickerVal"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="timestamp"
              clearable
              :editable="false"
            ></el-date-picker>
          </el-form-item>
          <!--          </el-col>-->
          <!--          <el-col :span="3">-->
          <el-form-item label="客户名称">
            <el-select v-model="query.ownerId"
                       filterable
                       remote
                       reserve-keyword
                       :remote-method="getClients" placeholder="请选择" clearable
            >
              <el-option
                v-for="(item, index) in customerList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--          </el-col>-->
          <!--          <el-col :span="3">-->
          <el-form-item label="小区名称">
            <el-select v-model="query.houseBlockId" filterable
                       remote
                       reserve-keyword
                       :remote-method="getCommunityList" clearable
            >
              <el-option
                v-for="(item, index) in communityList"
                :key="index"
                :label="item.name"
                :value="item.id"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--          </el-col>-->
          <!--          <el-col :span="3">-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
          </el-form-item>
          <!--          </el-col>-->
        </el-form>
      </el-row>
      <div class="Jcommon-layout-main Jflex-main">
        <el-table v-loading="listLoading" :data="list">
          <el-table-column prop="payNo" label="缴费单号" align="left" width="150px"/>
          <el-table-column prop="name" label="缴费内容" align="left" width="150px"/>
          <el-table-column prop="payerName" label="付款人" align="left"/>
          <el-table-column prop="type" label="类型" align="left">
            <template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.type == '支付'">付款</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.type == '退款'">退款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="payTime" label="付款时间" align="left" width="150px"/>
          <el-table-column prop="payMethod" label="付款方式" align="left"/>
          <el-table-column prop="lateFeeMoney" label="滞纳金（元）" align="left"/>
          <el-table-column prop="discountMoney" label="优惠金额（元）" align="left"/>
          <el-table-column prop="receivableMoney" label="应收金额（元）" align="left"/>
          <el-table-column prop="payMoney" label="收款金额（元）" align="left"/>
          <!--                    <el-table-column prop="prePayMoney" label="预存款支付（元）" align="left" />-->
          <el-table-column prop="changeMoney" label="找零金额（元）" align="left"/>
          <!--                    <el-table-column prop="preSaveMoney" label="找零结转金额（元）" align="left" />-->
        </el-table>

        <el-pagination
          :page-size="listQuery.pageSize"
          :current-page="listQuery.currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>

  </div>
</template>

<script>
import request from '@/utils/request'
import { listPaymentMethod } from '@/api/payment/paymentMethod'

export default {
  components: {},
  data() {
    return {
      query: {
        payMethod: undefined,
        type: undefined,
        name: undefined,
        ownerId: undefined,
        houseBlockId: undefined
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      pickerVal: [],
      typeOptions: [
        { label: '付款', value: 'pay' },
        { label: '退款', value: 'refund' }
      ],
      payMethodOptions: [],
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: 'pay_time'
      },
      customerList: [],
      communityList: [],
      columnList: [
        { prop: 'payTime', label: '付款时间' },
        { prop: 'payMethod', label: '支付方式' },
        { prop: 'money', label: '单行输入' },
        { prop: 'type', label: '支付和退款' },
        { prop: 'describe', label: '描述' },
        { prop: 'certificate', label: '支付凭证' }
      ]
    }
  },
  computed: {},
  created() {
    this.initData()
    this.getPayMethodOptions()
  },
  methods: {
    getPayMethodOptions() {
      listPaymentMethod().then(res => {
        this.payMethodOptions = res.list
      })
    },
    initData() {
      this.listLoading = true
      if (this.pickerVal && this.pickerVal.length) {
        this.query.payBeginDate = this.pickerVal[0]
        this.query.payEndDate = this.pickerVal[1]
      } else {
        this.query.payBeginDate = ''
        this.query.payEndDate = ''
      }
      let query = {
        ...this.listQuery,
        ...this.query
      }
      request({
        url: `${process.env.VUE_APP_BASE_API3}/statistics/PaymentPayLog`,
        method: 'get',
        params: query
      }).then(res => {
        this.list = res.list
        this.total = res.pagination.total

        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      })
      .then(() => {
        request({
          url: `${process.env.VUE_APP_BASE_API3}/wuye/PaymentPayLog/${id}`,
          method: 'DELETE'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      })
      .catch(() => {
      })
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: 'pay_time'
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      for (let key in this.query) {
        this.query[key] = undefined
      }
      this.pickerVal = []
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: 'pay_time'
      }
      this.initData()
    },
    pageChange(page) {
      this.listQuery.currentPage = page
      this.initData()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.initData()
    },
    getClients(query) {
      request({
        baseURL: '/',
        url: `${process.env.VUE_APP_BASE_API2}/api/admin/ds/owner/list`,
        method: 'get',
        params: { name: query }
      }).then(res => {
        console.log(res)
        this.customerList = res.map(item => {
          return {
            id: item.id,
            name: item.userName
          }
        })
      })
    },
    getCommunityList(query) {
      request({
        baseURL: '/',
        url: `${process.env.VUE_APP_BASE_API2}/api/admin/ds/HouseBlock/list`,
        method: 'get',
        params: { name: query }
      }).then(res => {
        console.log(res)
        this.communityList = res.map(item => {
          return {
            id: item.id,
            name: item.name
          }
        })
      })
    }
  }
}
</script>
