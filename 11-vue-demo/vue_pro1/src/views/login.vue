<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="formRef"
      :rules="rules"
      :model="loginForm"
      label-width="0px"
    >
      <el-form-item class="login-logo">
        <img src="../assets/logo.png" alt="" />
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          prefix-icon="iconfont icon-user"
          placeholder="请输入用户名"
          v-model="loginForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          prefix-icon="iconfont icon-3702mima"
          placeholder="请输入密码"
          v-model="loginForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-button">
        <el-button type="primary" @click="loginClick">登陆</el-button>
        <el-button type="info" @click="resetClick">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 5,
            message: '长度在2-5之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    loginClick() {
      console.log(this.loginForm)
      // 预先验证
      this.$refs.formRef.validate(async (valid) => {
        console.log(valid)
        if (valid) {
          // 验证成功
          // 登陆接口
          const { data: res } = await this.$http.post('login', this.loginForm)
          console.log(res)
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg)
            // 保存token到sessionStorage
            sessionStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message.error(res.meta.msg)
          }
        }
      })
    },
    resetClick() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: lightblue;

  .login-form {
    position: absolute;
    width: 400px;
    height: 350px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 0 20px;

    .login-logo {
      position: relative;
      width: 100px;
      height: 100px;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #ddd;
      border-radius: 50%;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 0 10px #eee;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ddd;
        border-radius: 50%;
      }
    }
  }

  .login-button {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
