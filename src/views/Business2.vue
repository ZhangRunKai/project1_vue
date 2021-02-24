<template>
  <div>
    <div>
      <div>
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
          <el-button type="primary" plain icon="el-icon-search" circle @click="getOrderDate"></el-button>
        </div>
        <div style="margin-right: 20px;float: right">
          <el-button type="primary" plain @click="newOrder">新增订单</el-button>
        </div>
      </div>
      <el-dialog title="结价订单" :visible.sync="dialogFormVisible1" width="30%">
        <el-form :model="endOrder">
          <el-form-item label="开始日期:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.startTime" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结价时间:" :label-width="formLabelWidth">
            <div style="float: left">
              <el-date-picker
                  v-model="endOrder.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                  default-time="12:00:00">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="客户:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.name" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.metalValue" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="每克订价:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.startPrice" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总克重:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.gram" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结价克重:" :label-width="formLabelWidth">
            <el-input class="left" type="number" v-model="endOrder.getGram" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结价价格:" :label-width="formLabelWidth">
            <el-input class="left" type="number" v-model="endOrder.endPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="定金余额:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.lastDeposit" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总共租金:" :label-width="formLabelWidth">
            <el-input class="left" v-model="endOrder.lastRent" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="updateEnd()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑订单" :visible.sync="dialogFormVisible2" width="30%">
        <el-form :model="order">
          <el-form-item label="时间:" :label-width="formLabelWidth">
            <div style="float: left">
              <el-date-picker
                  v-model="order.startTime"
                  type="date"
                  placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="客户:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.name" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户编号:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.accountId" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.metalValue" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="每克定价:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.startPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总克重:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.gram" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="定金:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="每日租金:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.rent" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注:" :label-width="formLabelWidth">
            <el-input type="textarea" class="left" v-model="order.orderRemarks" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="update(order)">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新建订单" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="order">
          <el-form-item label="时间:" :label-width="formLabelWidth">
            <div style="float: left">
              <el-date-picker
                  v-model="order.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="客户:" :label-width="formLabelWidth">
            <el-autocomplete
                style="float: left"
                popper-class="my-autocomplete"
                v-model="order.accountId"
                :fetch-suggestions="querySearch"
                placeholder="请输入客户编号"
                @select="userhandleSelect">
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
          </el-form-item>
          <el-form-item label="产品:" :label-width="formLabelWidth">
            <el-select class="left" v-model="order.metal" placeholder="请选择">
              <el-option
                  v-for="item in metalType"
                  :key="item.value"
                  :label="item.value"
                  :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每克订价:" :label-width="formLabelWidth">
            <el-input type="number" class="left" v-model="order.startPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总克重:" :label-width="formLabelWidth">
            <el-input type="number" class="left" v-model="order.gram" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="订金:" :label-width="formLabelWidth">
            <el-input type="number"  class="left" v-model="order.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="每日租金:" :label-width="formLabelWidth">
            <el-input type="number"  class="left" v-model="order.rent" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createOrder(order)">确 定</el-button>
        </div>
      </el-dialog>

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
    </div>

    <div class="block">
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
            label="时间"
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
            prop="gram"
            label="总克重"
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
            prop="rent"
            label="仓租"
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
                @click.native.prevent="updateOrder(scope.$index, businessData)"
                type="text"
                size="small">
              编辑
            </el-button>
            <el-button
                @click.native.prevent="Settlement(scope.$index, businessData)"
                type="text"
                size="small">
              结价
            </el-button>
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
export default {
  data() {
    return {
      total:0,
      currentPage:1,
      pageSize:10,
      state: '',
      businessData: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      deleteDialog:false,
      userData:[],
      queryData:{
        startTime:'',
        endTime:'',
        accountId:'',
        metal:'',
        page:'',
        pageSize:'',
        status:'',
        otype:2,
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
        getGram:0,
        endPrice:0,
        lastRent:0,
        rent:0,
        otype:2,
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
        otype:2,
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
      metalType: [
        {},
        {type:0,value:"黄金"},
        {type:1,value:"铂金"},
        {type:2,value:"白银"}
      ],
      otherMetalType: [
        {},
        {type:0,value:"黄金"},
        {type:1,value:"铂金"},
        {type:2,value:"白银"}
      ],
      metals:["黄金","铂金","白银"],
      formLabelWidth: '100px'
    };
  },
  methods: {
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
      sums[4]=(Math.floor(parseFloat(sums[4])*100/data.length)/100)+"元/克"
      sums[5]=sums[5]+"克"
      sums[6]=''
      sums[7]=sums[7]+'元'
      sums[8]=''
      sums[9]=''
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
      this.queryData.status=0;
      this.$axios.post('/order/findAll',
          this.queryData).then((res)=>{
        loading.close();
        if(res.data.status == 200){
          this.businessData = res.data.data.data;
          for(var i = 0;i<this.businessData.length;i++){
            this.businessData[i].metalValue = this.metals[this.businessData[i].metal];
          }
          console.log(this.businessData)
          this.total = res.data.data.total;
        }
      })
    },
    update(param){
      if(this.checkOrder()){
        this.$axios.post('/order/update',
            param).then((res)=>{
          if(res.data.status === 200 ){
            this.$message({
              message: '更新成功',
              type: 'success'
            });
            this.order = this.nullOrder
            this.dialogFormVisible2 = false;
            this.getOrderDate()
          }
          else{
            this.$message({
              message: '更新失败,请重试',
              type: 'warning'
            });
          }
        })
      }
    },
    updateEnd(){
      if(isNaN(this.endOrder.getGram)||this.endOrder.getGram==null||this.endOrder.getGram<0){
        this.$message({
          message: '结价克重不能为空',
          type: 'warning'
        });
      }
      else if(this.endOrder.getGram>this.endOrder.gram){
        this.$message({
          message: '结价克重不能大于订价克重',
          type: 'warning'
        });
      }
      else if(isNaN(this.endOrder.endPrice)||this.endOrder.endPrice==null||this.endOrder.endPrice<0){
        this.$message({
          message: '结价价格不能为空',
          type: 'warning'
        });
      }
      else if(this.endOrder.endTime==null||this.endOrder.endTime===""){
        this.$message({
          message: '结价时间不能为空',
          type: 'warning'
        });
      }
      else if(this.endOrder.endTime<this.endOrder.startTime){
        this.$message({
          message: '结价时间不能比订价时间早',
          type: 'warning'
        });
      }
      else{
        this.$axios.post('/order/updateEnd',
            this.endOrder).then((res)=>{
          if(res.data.status === 200 ){
            this.$message({
              message: '结价成功',
              type: 'success'
            });
            this.dialogFormVisible1=false;
            this.getOrderDate()
          }
          else{
            this.$message({
              message: '更新失败,请重试',
              type: 'warning'
            });
          }
        })
      }
    },
    Settlement(index, orderData){
      this.dialogFormVisible1 = true;
      this.endOrder = orderData[index];
    },
    updateOrder(index,orderData){
      this.dialogFormVisible2 = true;
      this.order = orderData[index]
    },
    deleteOrder(index,orderData){
      this.deleteDialog = true;
      this.order = orderData[index];

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
              this.order).then((res)=>{
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
            this.order = this.nullOrder
            this.endOrder = this.nullOrder
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
    userhandleSelect(item) {
      this.order.accountId=item.accountId;
    },
    userhandleSelect2(item) {
      this.queryData.accountId=item.accountId;
      this.queryData.name=item.name;
    },
    userHandleIconClick(ev) {
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
    newOrder(){
      this.dialogFormVisible=true;
      this.order=JSON.parse(JSON.stringify(this.nullOrder))
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    checkOrder(){
      if(this.order.startTime==undefined||this.order.startTime==null||this.order.startTime===""){
        this.$message({
          message: '请填写订单时间',
          type: 'warning'
        });
      }
      else if(this.order.accountId==""){
        this.$message({
          message: '请填写客户编号',
          type: 'warning'
        });
      }
      else if(this.order.metal===''||isNaN(this.order.metal)){
        this.$message({
          message: '请选择产品',
          type: 'waring'
        });
      }
      else if(isNaN(this.order.startPrice)||this.order.startPrice<0){
        this.$message({
          message: '请输入订价，且订价不能为负数',
          type: 'waring'
        });
      }
      else if(isNaN(this.order.gram)|| this.order.gram <0){
        this.$message({
          message: '请输入产品克重，且订价不能为负数',
          type: 'waring'
        });
      }
      else if(isNaN(this.order.deposit) || this.order.deposit <0){
        this.$message({
          message: '请输入订金，且订价不能为负数',
          type: 'waring'
        });
      }
      else if(isNaN(this.order.rent) || this.order.rent<0){
        this.$message({
          message: '请输入每日租金，且订价不能为负数',
          type: 'waring'
        });
      }
      else return true;
      return false;
    },
    createOrder(param){
      if(this.checkOrder()){
        this.$axios.post('/order/save',
            this.order).then((res)=>{
          if(res.data.status === 200 ){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.order=this.nullOrder;
            this.dialogFormVisible = false
            this.getOrderDate()
          }
        })
      }
    }
  },
  watch:{
    endOrder: {
      handler: function() {
        this.endOrder.getGram=parseFloat(this.endOrder.getGram)
        this.endOrder.endPrice=parseFloat(this.endOrder.endPrice)
        if(this.endOrder.endTime!=null&&(this.endOrder.endPrice>=0)&&(this.endOrder.getGram>0)&&(this.endOrder.getGram<=this.endOrder.gram)){
          this.endOrder.lastRent=Math.floor(Math.floor(((new Date(this.endOrder.endTime)-new Date(this.endOrder.startTime))/86400000))*this.endOrder.rent*this.endOrder.getGram/10)/100
          this.endOrder.lastDeposit=this.endOrder.deposit-Math.floor((this.endOrder.endPrice-this.endOrder.startPrice)*this.endOrder.getGram*100)/100-this.endOrder.lastRent;
        }
      },
      deep: true
    }
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
.marginDiv {
  margin:0 8px;
}

</style>
