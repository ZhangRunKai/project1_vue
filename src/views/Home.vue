<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="0" >客户</el-menu-item>
      <el-menu-item index="1" >提货不结价</el-menu-item>
      <el-menu-item index="2" >订价不提货</el-menu-item>
      <el-menu-item index="3" >订回购价不来料</el-menu-item>
<!--      <el-menu-item index="4" >现料买卖</el-menu-item>-->
<!--      <el-menu-item index="5" >换料实物</el-menu-item>-->
      <el-menu-item index="6" >结价单汇总</el-menu-item>
      <div style="float: right;margin-right: 10px;margin-top: 10px" @click="txflag = true">
        <el-avatar @click="txflag =true"> user </el-avatar>
      </div>
<!--      <el-menu-item index="7" style="float: right">账号</el-menu-item>-->
    </el-menu>
    <div class="line"></div>
    <el-dialog
        title="修改密码"
        :visible.sync="changePassword"
        width="30%"
        :before-close="txflagFalse">
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="密码">
          <el-input type="password"  v-model="user.password1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password"  v-model="user.password2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="changePassword = false">取 消</el-button>
    <el-button type="primary" @click="chengePassword()">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="账户"
        :visible.sync="txflag"
        width="30%"
        :before-close="txflagFalse">
      <el-form ref="form" :model="user" label-width="80px">
        <el-button @click="changePassword=true">修改密码</el-button>
        <br>
        <el-button @click="logout()">退出登陆</el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      txflag:false,
      menus:{
        "0":{"path":"/Home"},
        "1":{path:'/business1'},
        "2":{path:'/business2'},
        "3":{path:'/business3'},
        "4":{path:'/business4'},
        "5":{path:'/business5'},
        "6":{path:'/business6'}
      },
      activeIndex:"1",
      user:{},
      changePassword:false
    }
  },
  created() {
    this.activeIndex = (this.$route.path.charAt(this.$route.path.length-1)=='e')?'0':this.$route.path.charAt(this.$route.path.length-1);
    document.title="报表管理系统"
  },
  methods: {
    logout(){
      localStorage.setItem("authentication","");
      this.$message({
        message: "账户退出成功",
        type: 'success'
      })
      this.timer = setInterval(() => {
        window.location.href = "/dist"
      }, 1000)
    },
    chengePassword(){
      if(this.user.password1==null || this.user.password1 == ""|| this.user.password2 ==null||this.user.password2==""){
        alert("密码不能为空");
      }
      else if(this.user.password1 != this.user.password2){
        alert("两次密码不一致，请重新输入");
        this.user.password1=""
        this.user.password2=""
      }
      else if(this.user.password1.length>=30){
          alert("密码长度不能超过30位")
      }
      else{
        this.user.password = this.user.password1;
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('changePassword', this.user).then((res) => {
          loading.close();
          if (res.status != 200) {
            this.$message({
              message: "修改密码失败",
              type: 'warning'
            })
            return;
          }
          this.$message({
            message: "修改成功",
            type: 'success'
          })
          this.changePassword=false;
        })
      }
    },
    txflagFalse(){
      this.txflag = false;
    },
    handleSelect(key, keyPath) {
      this.$router.push(this.menus[key]);
    }
  }
}
</script>