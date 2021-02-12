<template>
  <div>
    <div style="margin-right: 20px;float: right">
      <a>
        <el-button type="primary" plain @click="newOrder">新增</el-button>
        <el-button type="primary" plain @click="add()">+1</el-button>
      </a>
      <el-dialog title="新建买卖" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="order">
          <el-form-item label="时间:" :label-width="formLabelWidth"><div class="left">{{order.time}}</div></el-form-item>
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
            <el-select class="left" v-model="order.metalValue" placeholder="请选择">
              <el-option
                  v-for="item in metals"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="克重:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.gram" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="订价:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="定金:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="每日租金:" :label-width="formLabelWidth">
            <el-input class="left" v-model="order.rent" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createOrder(order)">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="block">
      <span class="demonstration">
        <div>
      <el-table
          :data="businessData"
          stripe
          border
          style="width: 100%">
        <el-table-column
            prop="time"
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
            prop="gram"
            label="克重"
            width="180">
        </el-table-column>
        <el-table-column
            prop="price"
            label="订价"
            width="180">
        </el-table-column>
        <el-table-column
            prop="deposit"
            label="订金"
            width="180">
        </el-table-column>
        <el-table-column
            prop="metalValue"
            label="产品"
            width="180">
        </el-table-column>
        <el-table-column
            prop="markValue"
            label="市场价"
            width="180">
        </el-table-column>
        <el-table-column
            prop=""
            label="余额"
            width="180">
        </el-table-column>
        <el-table-column
            prop="rent"
            label="仓租"
            width="180">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button
                @click.native.prevent="deleteRow(scope.$index, userData)"
                type="text"
                size="small">
              编辑
            </el-button>
            <el-button
                @click.native.prevent="deleteRow(scope.$index, userData)"
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
          :page-sizes="[5,10, 200, 300, 400]"
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
      pageSize:5,
      state: '',
      menuId:0,
      activeIndex: '1',
      businessData: [
          {
            time:'2021/1/21',
            name:'zhangsan',
            orderId:'zs1245',
            metal:"黄金",
            markValue:0,
            gram:'50',
            price:'200',
            deposit:'5000',
            rent:'2000'
          },
        {
          time:'2021/1/21',
          name:'lisi',
          orderId:'zs1245',
          metal:"铂金",
          gram:'30',
          price:'200',
          deposit:'5000',
          rent:'2000'
        }
      ],
      dialogFormVisible: false,
      order: {
        time:'',
        accountId:'',
        name:'',
        orderId:'',
        metalValue:'',
        metal:0,
        gram:0,
        price:0,
        deposit:0,
        rent:0,
        type:0
      },
      metals:[
        "黄金",
        "铂金",
        "白银"
      ],
      metalType: {
        "黄金":1,
        "铂金":2,
        "白银":3
      },
      metalValue: {
        "黄金": 300,
        "铂金":200,
        "白银":100
      },
      formLabelWidth: '100px'
    };
  },
  watch:{
    metalValue:{
      handler:function (){
        for(var i=0;i<this.businessData.length;i++){
          this.businessData[i].markValue = this.metalValue[this.businessData[i].metal];
        }
      },
      deep:true
    }
  },
  created() {
    this.menuId = this.$route.query.menuId;
    this.getOrderDate();
    // for(var i=0;i<this.businessData.length;i++){
    //   this.businessData[i].markValue = this.metalValue[this.businessData[i].metal];
    // }
  },
  methods: {
    getOrderDate(){
      console.log(this.menuId)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('http://localhost:8081/project1_war_exploded/order/findAll',
          {
            "pageSize":this.pageSize,
            "pageNum":this.currentPage,
            "total":parseInt(this.menuId)
          },
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            }
          }).then((res)=>{
        loading.close();
        console.log(res)
        console.log("res")
        if(res.data.status == 200){
          this.businessData = res.data.data.data;
          this.total = res.data.data.total;
        }
        else{
          console.log(res);
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.getOrderDate();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderDate();
      console.log(`当前页: ${val}`);
    },
    userhandleSelect(item) {
      this.order.accountId=item.accountId;
    },
    userHandleIconClick(ev) {
      console.log(ev);
    },
    add(){
      this.metalValue.白银++;
      this.metalValue.黄金+=3;
      this.metalValue.铂金+=2;
      console.log(this.metalValue);
    },
    querySearch(queryString, cb) {
      this.$axios.post('/customer/findCustomerId',
          this.form,
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            }
          }).then((res)=>{
        if(res.data.status === 200 ){
          console.log(res);
          var restaurants = res.data.data;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        }
        else{
          this.$message({
            message: '修改失败,请重试',
            type: 'warning'
          });
        }
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.accountId.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    newOrder(){
      this.dialogFormVisible=true;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.order.time =  year + "-" + month + "-" + day;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    createUser(param) {
      this.dialogFormVisible = false;
      this.userData.push(param);
    },
    createOrder(param){
      this.order.metal = this.metalValue[this.order.metalValue];
      this.order.type = parseInt(this.menuId)
      console.log(this.order)
      console.log("order")
      this.$axios.post('/order/save',
          this.order,
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            },
          }).then((res)=>{
        if(res.data.status === 200 ){
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.order.metal='';
          this.order.time='';
          this.order.deposit='';
          this.order.price='';
          this.order.gram='';
          this.order.userId='';
          this.order.orderId='';
          this.dialogFormVisible = false
        }
      })
    }
  },
  mounted() {
    this.menuId = this.$route.query.menuId;
    this.activeIndex=this.menuId;
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
