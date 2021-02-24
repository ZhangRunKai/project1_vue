<template>
  <div>
    <el-dialog title="验证删除订单" :visible.sync="deleteDialog" width="30%">
      <el-form :model="endOrder">
        <p style="color: firebrick;font-size: 20px">请按照提示验证订单，以避免错误删除</p>
        <p style="font-size: 15px">客户姓名：{{order.name}}</p>
        <el-form-item label="客户姓名" :label-width="formLabelWidth">
          <el-input v-model="endOrder.name" autocomplete="off"></el-input>
        </el-form-item>
        <p style="font-size: 15px">订单编号：{{order.orderId}}</p>
        <el-form-item label="订单编号" :label-width="formLabelWidth">
          <el-input v-model="endOrder.orderId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="doDeleteOrder(endOrder)">确 定</el-button>
      </div>
    </el-dialog>
    <div class="block">
      <div style="margin-left: 20px;float: left">
          <span class="marginDiv">
            <a>选择日期：</a>
            <el-date-picker
                style="width: 150px"
                v-model="queryData.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始日期"
                default-time="12:00:00">
              </el-date-picker>
            至
            <el-date-picker
                style="width: 150px"
                v-model="queryData.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束日期"
                default-time="12:00:00">
              </el-date-picker>
          </span>
        <span class="marginDiv">
            <a>客户：</a>
            <el-autocomplete
                style="width: 150px"
                popper-class="my-autocomplete"
                v-model="queryData.name"
                :fetch-suggestions="querySearch"
                placeholder="请输入客户编号"
                @select="userhandleSelect2">
              <i
                  class="el-icon-edit el-input__icon"
                  slot="suffix"
                  @click="userHandleIconClick">
              </i>
              <template slot-scope="{ item }">
                <div class="name">姓名:{{ item.name}}</div>
                <span class="accountId">编号:{{ item.accountId }}</span>
              </template>
            </el-autocomplete>
          </span>
        <span class="marginDiv">
            <a>产品：</a>
            <el-select style="width: 120px" v-model="queryData.metal" placeholder="请选择">
              <el-option
                  v-for="item in otherMetalType"
                  :key="item.value"
                  :label="item.value"
                  :value="item.type">
              </el-option>
            </el-select>
            </span>
        <span class="marginDiv">
            <a>订单类型：</a>
            <el-select style="width: 120px" v-model="queryData.type" placeholder="请选择">
              <el-option
                  v-for="item in menuIdType"
                  :key="item.value"
                  :label="item.value"
                  :value="item.type">
              </el-option>
            </el-select>
            </span>
        <el-button type="primary" plain icon="el-icon-search" circle @click="getOrderDate"></el-button>
        <el-button @click="outExe">下载表格</el-button>
      </div>
      <span class="demonstration">
        <div>
      <el-table
          :data="businessData"
          :summary-method="getSummaries"
          show-summary
          stripe
          border
          style="width: 100%">
        <el-table-column
            prop="startTime"
            label="订价时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="结价时间"
            width="180">
        </el-table-column>
        <el-table-column
            prop="orderId"
            label="订单号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="客户"
            width="180">
        </el-table-column>
        <el-table-column
            prop="metalValue"
            label="产品"
            width="180">
        </el-table-column>
        <el-table-column
            prop="startPrice"
            label="每克定价"
            width="180">
        </el-table-column>
        <el-table-column
            prop="endPrice"
            label="每克结价"
            width="180">
        </el-table-column>
        <el-table-column
            prop="gram"
            label="总克重"
            width="180">
        </el-table-column>
        <el-table-column
            prop="deposit"
            label="订金"
            width="180">
        </el-table-column>
        <el-table-column
            prop="lastDeposit"
            label="订金余额"
            width="180">
        </el-table-column>
        <el-table-column
            prop="lastRent"
            label="总仓租"
            width="180">
        </el-table-column>
        <el-table-column
            prop="orderRemarks"
            label="备注"
            width="180">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button
                @click.native.prevent="deleteOrder(scope.$index, businessData)"
                type="text"
                size="small">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      </span>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment ";
export default {
  data() {
    return {
      total:0,
      currentPage:1,
      pageSize:10,
      state: '',
      menuId:0,
      userData:[],
      businessData: [],
      metalType: [
        {},
        {type:0,value:"黄金"},
        {type:1,value:"铂金"},
        {type:2,value:"白银"}
      ],
      menuIdType:[
        {},
        {type:1,value:"提货不结价"},
        {type:2,value:"订价不提货"},
        {type:3,value:"订回购价不来料"}
      ],
      otherMetalType: [
        {},
        {type:0,value:"黄金"},
        {type:1,value:"铂金"},
        {type:2,value:"白银"}
      ],
      endQueryData:{
        startTime:'',
        endTime:'',
        accountId:'',
        metal:'',
        page:'',
        pageSize:'',
        status:1,
        otype:'',
      },
      queryData:{
        startTime:'',
        endTime:'',
        accountId:'',
        metal:'',
        page:'',
        pageSize:'',
        status:1,
        otype:'',
      },
      order: {
        startTime:'',
        accountId:'',
        name:'',
        orderId:'',
        metal:0,
        gram:0,
        startPrice:'',
        price:0,
        deposit:0,//订金
        lastDeposit:0,
        lastRent:0,
        rent:0,
        otype:'',
        orderRemarks:''
      },
      formLabelWidth: '100px',
      order: {
        startTime:'',
        accountId:'',
        name:'',
        orderId:'',
        metal:0,
        gram:0,
        startPrice:'',
        price:0,
        deposit:0,//订金
        lastDeposit:0,
        getGram:0,
        endPrice:0,
        lastRent:0,
        rent:0,
        otype:1,
        orderRemarks:''
      },
      nullOrder:{
        startTime:'',
        accountId:'',
        name:'',
        orderId:'',
        metal:'',
        gram:0,
        startPrice:'',
        price:0,
        deposit:0,//订金
        lastDeposit:0,
        getGram:0,
        endPrice:0,
        lastRent:0,
        rent:0,
        otype:1,
        orderRemarks:''
      },
      endOrder:{
        startTime:'',
        accountId:'',
        name:'',
        orderId:'',
        metal:0,
        gram:0,
        startPrice:'',
        price:0,
        deposit:0,//订金
        lastDeposit:0,
        getGram:0,
        endPrice:0,
        lastRent:0,
        rent:0,
        otype:1,
        orderRemarks:''
      },
      excelData:[],
      deleteDialog:false,
      metals:["黄金","铂金","白银"],
    };
  },
  created() {
    this.menuId = this.$route.query.menuId;
  },
  methods: {
    outExe() {
      this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.excelData = this.businessData;//你要导出的数据list。
        this.export2Excel()
      }).catch(() => {

      });
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require('../excel/Export2Excel'); //这里必须使用绝对路径
        const tHeader = ['orderId', 'name']; // 导出的表头名 （就是你的字段）
        const filterVal = ['orderId', 'name']; // 导出的表头字段名
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        var nowTime = new Date().toLocaleString();
        export_json_to_excel(tHeader, data, `[${nowTime}]提现管理excel`);// 导出的表格名称，根据需要自己命名
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    userhandleSelect(item) {
      this.order.accountId=item.accountId;
    },
    userhandleSelect2(item) {
      console.log("userhandleSelect2")
      console.log(item.accountId.toLowerCase())
      this.queryData.accountId=item.accountId;
      this.queryData.name=item.name;
    },
    userHandleIconClick(ev) {
      console.log(userHandleIconClick)
      console.log(ev);
    },
    querySearch(queryString, cb) {
      var results = queryString ? this.userData.filter(this.createFilter(queryString)) : this.userData;
      // 调用 callback 返回建议列表的数据
      this.queryData.accountId=queryString
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.accountId.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });
      sums[1]=''
      sums[2]=''
      sums[3]=''
      // sums[5]=(Math.floor(parseFloat(sums[5])*100/data.length)/100)+"元/克"
      // sums[6]=(Math.floor(parseFloat(sums[6])*100/data.length)/100)+"元/克"
      sums[5]=''
      sums[6]=''
      sums[7]=sums[7]+'元'
      sums[9]=sums[9]+'元'
      sums[10]=sums[10]+'元'
      return sums;
    },
    getOrderDate(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.queryData.pageSize=this.pageSize
      this.queryData.page=(this.currentPage-1)*this.pageSize
      this.queryData.status=1;
      this.$axios.post('/order/findAllEnd',
          this.queryData).then((res)=>{
        loading.close();
        if(res.data.status == 200){
          this.businessData = res.data.data.data;
          for(var i = 0;i<this.businessData.length;i++){
            this.businessData[i].metalValue = this.metals[this.businessData[i].metal];
          }
          this.total = res.data.data.total;
          // this.queryData=JSON.parse(JSON.stringify(this.endQueryData))
        }
      })
    },
    Settlement(index, orderData){
      this.dialogFormVisible1 = true;
      this.endOrder = orderData[index];
    },
    updateOrder(index,orderData){
      this.dialogFormVisible2 = true;
      this.order = orderData[index]
      console.log(this.order)
    },
    deleteOrder(index,orderData){
      this.deleteDialog = true;
      this.order = orderData[index];
      // this.$axios.post('/order/delete',
      //     orderData[index]).then((res)=>{
      //   if(res.data.status === 200 ){
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success'
      //     });
      //     this.getOrderByAccountID();
      //   }
      //   else{
      //     this.$message({
      //       message: '删除失败,请重试',
      //       type: 'warning'
      //     });
      //   }
      // })
    },
    doDeleteOrder(param){
      if(this.endOrder.name!=this.order.name){
        this.$message({
          message: '订单客户姓名不一致，无法进行删除',
          type: 'warning'
        });
      }
      else if(this.endOrder.orderId!=this.order.orderId||this.order.orderId==null){
        this.$message({
          message: '订单编号不一致，无法进行删除',
          type: 'warning'
        });
      }
      else{
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/order/delete',
              this.endOrder).then((res)=>{
            if(res.data.status === 200 ){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getOrderDate()
            }
            else{
              this.$message({
                message: '删除失败,请重试',
                type: 'warning'
              });
            }
            this.order = JSON.parse(JSON.stringify(this.nullOrder))
            this.endOrder = JSON.parse(JSON.stringify(this.nullOrder))
            this.deleteDialog=false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },

    handleSizeChange(val) {
      this.pageSize=val
      this.getOrderDate();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderDate();
    },

  },
  mounted() {
    this.$axios.post('/customer/findCustomerIdAndName',
        this.form).then((res)=>{
      if(res.data.status === 200 ){
        this.userData = res.data.data;
      }
    })
  }
}
</script>

<style>

.left{
  width: 80%;
  float: left;
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.accountId {
  font-size: 12px;
  color: #b4b4b4;
}

</style>
