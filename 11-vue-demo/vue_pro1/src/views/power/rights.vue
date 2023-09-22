<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == '0'">标签一</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success"
              >标签二</el-tag
            >
            <el-tag v-else type="warning">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [
        {
          id: 101,
          authName: '商品管理',
          level: '0',
          pid: 0,
          path: null
        }
      ]
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 参数值 list 或 tree
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('请求权限列表错误')
        return
      }
      this.$message.success('请求权限列表成功')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
