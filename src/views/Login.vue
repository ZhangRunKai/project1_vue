<template>
  <div id="bbb">

    <div id="aaa">
      <h1>登陆</h1>
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="账户">
          <el-input v-model="user.account"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input type="password"  v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登陆</el-button>
          <el-button @click="clear('user')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        account:'',
        password:''
      }
    }
  },
  methods: {
    clear(){
      this.user.account="";
      this.user.password="";
    },
    onSubmit: function () {
      const _this = this;
      if (this.user.account == "" || this.user.account == null) {
        this.$message({
          message: '您还没输入账户噢',
          type: 'warning'
        });
        return;
      } else if (this.user.password == "" || this.user.password == null) {
        this.$message({
          message: '您还没输入密码噢',
          type: 'warning'
        });
        return;
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$axios.post('login', this.user).then((res) => {
          console.log("登陆返回")
          console.log(res);
          loading.close();
          if (res.data.status != 200) {
            this.$message({
              message: "账号不存在或密码错误，如忘记密码请联系管理员",
              type: 'warning'
            })
            return;
          }
          else{
            this.$message({
              message: '登陆成功',
              type: 'success'
            });
            const token = res.headers['authentication'];
            window.localStorage.setItem("authentication", token);
            _this.$router.push("/Home")
          }
        })
      }

    }
  }
}
</script>

<style>
  #aaa{
    width:300px;
    height: 400px;
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    margin: auto;
  }
  #bbb{
    background-image:url("../../pc/bg.jpg");
    width:100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    margin: auto;
  }
</style>