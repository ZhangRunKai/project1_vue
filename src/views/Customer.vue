<template>
  <div>
    <div style="margin-right: 20px;float: right">
      <el-button type="primary" plain @click="updateDialogFormVisible = true">新增</el-button>
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
          <el-button type="primary" @click="createUser(form)">确 定</el-button>
        </div>
      </el-dialog>
    </div>

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
      addDialogFormVisible: false,
      updateDialogFormVisible: false,
      form: {
        name: '',
        bankCard: '',
        theBank: '',
        phone: '',
        accountId:''
      },
      formLabelWidth: '120px',
    };
  },
  created() {
      this.getCustomers();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize=val
      this.getCustomers();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCustomers();
      console.log(`当前页: ${val}`);
    },
    setData(param){
      this.form = param;
      console.log(this.form);
    },
    updateRow(index, userData){
      this.setData(this.userData[index]);
      this.updateDialogFormVisible = true;
    },
    deleteRow(index, userData) {
      console.log(userData[index].accountId)
      this.$axios.post('/customer/delete',
          userData[index].accountId,
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            },
          }).then((res)=>{
        if(res.data.status === 200 ){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      })
      this.getCustomers();
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    updateUser(param){
      this.updateDialogFormVisible = false;
      this.$axios.post('/customer/update',
          param,
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            }
          }).then((res)=>{
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
    },
    createUser(param){
      this.addDialogFormVisible = false;
      this.$axios.post('/customer/save',
          this.form,
          {
            headers:{
              Authentication:window.localStorage.getItem("authentication")
            }
          }).then((res)=>{
        if(res.data.status === 200 ){
          this.$message({
            message: '修改成功',
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
            message: '修改失败,请重试',
            type: 'warning'
          });
        }
        this.getCustomers();
      })
    },
    getCustomers(){
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$axios.post('http://localhost:8081/project1_war_exploded/customer/findAll',
      {
        "pageSize":this.pageSize,
        "pageNum":this.currentPage
      },
      {
        headers:{
          Authentication:window.localStorage.getItem("authentication")
      }
      }).then((res)=>{
        loading.close();
        console.log(res)
        if(res.data.status == 200){
            this.userData = res.data.data.data;
            this.total = res.data.data.total;
        }
        else{
          console.log(res);
        }
      })
    }
  }
}
</script>

<style scoped>

</style>