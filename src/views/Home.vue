<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1" >客户</el-menu-item>
      <el-menu-item index="2" >提货不提价</el-menu-item>
      <el-menu-item index="3" >订价不提货</el-menu-item>
      <el-menu-item index="4" >订回购不来料</el-menu-item>
      <el-menu-item index="5" >现料买卖</el-menu-item>
      <el-menu-item index="6" >换料实物</el-menu-item>
      <el-menu-item index="7" style="float: right">账号</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus:{
        "1":{"path":"/Home"},
        "7":{path:'/user'},
        "2":{path:'/business',query:{menuId:2}},
        "3":{path:'/business',query:{menuId:3}},
        "4":{path:'/business',query:{menuId:4}},
        "5":{path:'/business',query:{menuId:5}},
        "6":{path:'/business',query:{menuId:6}}
      },
      activeIndex: '1'
    }
  },
  methods: {

    handleSelect(key, keyPath) {
      if(key == "7"){

      }
      this.$router.push(this.menus[key]);
    }

  }
}
</script>