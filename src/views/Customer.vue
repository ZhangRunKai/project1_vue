<template>
  <div>
    <div style="margin-right: 20px;float: right">
      <el-dialog title="编辑用户" :visible.sync="updateDialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="姓名:" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="编号:" :label-width="formLabelWidth"><a style="font-size: 20px">{{form.accountId}}</a>  (编号无法更改)
          </el-form-item>
          <el-form-item label="银行账户:" :label-width="formLabelWidth">
            <el-input v-model="form.bankCard" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="银行开户支行:" :label-width="formLabelWidth">
            <el-input v-model="form.theBank" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码:" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser(form)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="margin-right: 20px;float: right">
      <el-button type="primary" plain @click="addDialogFormVisible = true">新增</el-button>
      <el-dialog title="新建客户" :visible.sync="addDialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="姓名:" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="编号:" :label-width="formLabelWidth">
            <el-input v-model="form.accountId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="银行账户:" :label-width="formLabelWidth">
            <el-input v-model="form.bankCard" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="银行开户支行:" :label-width="formLabelWidth">
            <el-input v-model="form.theBank" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码:" :label-width="formLabelWidth">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="createUser()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="验证删除用户" :visible.sync="deleteDialog" width="30%">
      <el-form :model="endForm">
        <p style="color: firebrick;font-size: 20px">请按照提示验证客户，以避免错误删除</p>
        <p style="font-size: 15px">客户姓名：{{form.name}}</p>
        <el-form-item label="客户姓名" :label-width="formLabelWidth">
          <el-input v-model="endForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <p style="font-size: 15px">客户编号：{{form.accountId}}</p>
        <el-form-item label="客户编号" :label-width="formLabelWidth">
          <el-input v-model="endForm.accountId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="doDeleteOrder()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="goToCustomerByOrder"
        width="30%"
        :before-close="handleClose">
      <span>该用户{{userData[temp].name}}存在订单，无法进行删除</span><br>
      <span>是否查询用户 {{userData[temp].name}} 名下的订单</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="goToCustomerByOrder = false">取 消</el-button>
    <el-button type="primary" @click="selectGoToCustomerByOrder()">查询该用户订单</el-button>
  </span>
    </el-dialog>
    <div class="block">
      <span class="demonstration">
        <div>
          <el-table
              :data="userData"
              stripe
              border
              style="width: 100%">
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="accountId"
                label="编号"
                width="200">
            </el-table-column>
            <el-table-column
                prop="bankCard"
                label="银行账户"
                width="300">
            </el-table-column>
            <el-table-column
                prop="theBank"
                label="开户支行">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
              <template slot-scope="scope">
                <el-button
                    @click.native.prevent="selectRow(scope.$index, userData)"
                    type="text"
                    size="small">
                  查看
                </el-button>
                <el-button
                    @click.native.prevent="updateRow(scope.$index, userData)"
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
      activeIndex: '1',
      userData: [],
      deleteDialog:false,
      addDialogFormVisible: false,
      updateDialogFormVisible: false,
      goToCustomerByOrder:false,
      endForm: {
        name: '',
        bankCard: '',
        theBank: '',
        phone: '',
        accountId:''
      },
      nullForm: {
        name: '',
        bankCard: '',
        theBank: '',
        phone: '',
        accountId:''
      },
      form: {
        name: '',
        bankCard: '',
        theBank: '',
        phone: '',
        accountId:''
      },
      formLabelWidth: '120px',
      temp: 0,
    };
  },
  created() {
      this.getCustomers();
  },
  methods: {
    handleClose(){
      this.goToCustomerByOrder=false;
    },
    selectRow(index,userDate){
      this.$router.push({path:"/customerByOrder",query:{accountId:userDate[index].accountId}})
    },
    handleSizeChange(val) {
      this.pageSize=val
      this.getCustomers();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCustomers();
    },
    selectGoToCustomerByOrder(){
      this.goToCustomerByOrder=false
      this.selectRow(this.temp,this.userData);
    },
    setData(param){
      this.form = param;
    },
    updateRow(index, userData){
      this.setData(this.userData[index]);
      this.temp=index;
      this.updateDialogFormVisible = true;
    },
    doDeleteOrder(){
      if(this.endForm.accountId!=this.form.accountId){
        this.$message({
          message: '客户编号不一致',
          type: 'warning'
        });
      }
      else if(this.endForm.name!=this.form.name){
        this.$message({
          message: '客户姓名不一致',
          type: 'warning'
        });
      }
      else{
        this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/customer/delete',
              this.endForm.accountId
          ).then((res)=>{
            if(res.data.status === 200 ){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getCustomers();
              this.deleteDialog=false
            }
            else if(res.data.status ===402){
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
              this.goToCustomerByOrder=true;
            }
            else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
          })
          this.form=this.endForm;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    deleteRow(index, userData) {
      this.deleteDialog=true
      this.form=userData[index]

    },
    updateUser(param){
      if(this.checkFrom(param)){
        this.updateDialogFormVisible = false;
        this.$axios.post('/customer/update',
            this.form).then((res)=>{
          console.log(res)
          if(res.data.status === 200 ){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
          this.getCustomers();
        })

        this.form = {
          name: '',
          bankCard: '',
          theBank: '',
          phone: '',
          accountId:''
        };
      }
    },
    checkFrom:function (){
      if(this.form.accountId === null|| this.form.accountId === ""){
        this.$message({
          message: '用户编号不能为空',
          type: 'warning'
        });
      }
      else if(this.form.phone === null || this.form.phone === ""){
        this.$message({
          message: '用户联系方式不能为空',
          type: 'warning'
        });
      }
      else if(this.form.bankCard === null || this.form.bankCard ===""){
        this.$message({
          message: '用户银行卡号不能为空',
          type: 'warning'
        });
      }
      else if(this.form.name ===null || this.form.name ===""){
        this.$message({
          message: '用户姓名不能为空',
          type: 'warning'
        });
      }
      else if(this.form.theBank === null || this.form.theBank === ""){
        this.$message({
          message: '用户开户支行不能为空',
          type: 'warning'
        });
      }
      else{
        return true;
      }
      return false;
    },
    createUser(){
      if(this.checkFrom()){
        this.addDialogFormVisible = false;
        this.$axios.post('/customer/save',
            this.form
        ).then((res)=>{
          if(res.data.status === 200 ){
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.form = {
              name: '',
              bankCard: '',
              theBank: '',
              phone: '',
              accountId:''
            };
          }
          else{
            this.$message({
              message: res.data.message,
              type: 'warning'
            });
          }
          this.getCustomers();
        })
      }
    },
    getCustomers(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('customer/findAll',
      {
        "pageSize":this.pageSize,
        "pageNum":this.currentPage
      }).then((res)=>{
        loading.close();
        if(res.data.status == 200){
            this.userData = res.data.data.data;
            this.total = res.data.data.total;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>