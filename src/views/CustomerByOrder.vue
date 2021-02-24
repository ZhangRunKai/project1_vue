<template>

  <div class="block">

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
      <span class="demonstration">
        <div>
      <el-table
          :data="businessData"
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
            prop="ddtype"
            label="订单类型"
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
            prop="risk"
            label="风险价"
            width="180">
        </el-table-column>
        <el-table-column
            prop="deposit"
            label="订金"
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
</template>

<script>
export default {
name: "CustomerByOrder",
  data(){
    return{
      queryData:{
        startTime:'',
        endTime:'',
        accountId:'',
        metal:'',
        page:'',
        pageSize:''
      },
      currentPage:1,
      customer:{
        accountId:''
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
      deleteDialog:false,
      businessData:[],
      order:[],
      allOrder:[],
      total:0,
      pageSize:10,
      menuIdType:["","提货不结价","订价不提货","订回购价不来料"],
      metals:[
        "黄金",
        "铂金",
        "白银"
      ],
      metalType: {
        "黄金":0,
        "铂金":1,
        "白银":2
      },
      metalValue: [100,200,300],
    }
  },
  methods: {
    // tableRowClassName({row, rowIndex}) {
    //   console.log(row+" "+rowIndex)
    //   console.log(this.businessData[rowIndex].status)
    //   if (this.businessData[rowIndex].status) {
    //     return 'warning-row';
    //   } else{
    //     return 'success-row';
    //   }
    //   return '';
    // },
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
    getOrderDate(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.queryData.pageSize=this.pageSize
      this.queryData.page=(this.currentPage-1)*this.pageSize
      this.$axios.post('/order/findAll',
          this.queryData).then((res)=>{
        loading.close();
        if(res.data.status == 200){
          this.businessData = res.data.data.data;
          for(var i = 0;i<this.businessData.length;i++){
            this.businessData[i].metalValue = this.metals[this.businessData[i].metal];
            if(this.businessData[i].status==false){
              this.businessData[i].endTime="未结价"
            }
            this.businessData[i].ddtype = this.menuIdType[this.businessData[i].otype]
          }
          console.log(this.businessData)
          this.total = res.data.data.total;
        }
      })
    },
  },
  created() {
    this.queryData.accountId = this.$route.query.accountId;
    this.getOrderDate();
  }
}
</script>

<style scoped>
.warning-row {
  background: #E6A23C;
}

.success-row {
  background: #67C23A;
}
</style>