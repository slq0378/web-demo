<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-left">
        <img src="../assets/heima.png" alt="" />
        <div>电商后台管理系统</div>
      </div>
      <el-button class="header-right" type="info" @click="logoutClick"
        >退出</el-button
      >
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <div class="menu-collapse" @click="toogleMenu">|||</div>
          <el-submenu
            :index="'' + item.id"
            v-for="item in menus"
            :key="item.id"
          >
            <template slot="title">
              <i :class="menuIcons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + child.path"
              v-for="child in item.children"
              :key="child.id"
              @click="activeClick('/' + child.path)"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      menuIcons: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-danju',
        102: 'iconfont icon-shangpin',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenus()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menus = res.data
      }
    },
    activeClick(path) {
      console.log('activeClick', path)
      sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    toogleMenu() {
      this.isCollapse = !this.isCollapse
    },
    logoutClick() {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  .header-left {
    display: flex;
    //
    align-items: center;
    align-self: flex-start;
    font-size: 20px;
    color: #fff;

    div {
      margin-left: 20px;
    }
  }
}

.el-aside {
  background-color: #333744;
  // height: 100%;

  .menu-collapse {
    height: 22px;
    line-height: 22px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .menu-collapse:hover {
    background-color: #383744;
  }
  .iconfont {
    margin-right: 10px;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
