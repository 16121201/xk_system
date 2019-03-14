<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号" clearable></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" clearable></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  // import { requestLogin } from '../api/api';
  // //import NProgress from 'nprogress'
  import {Login} from '../api/api';
  export default {
    data() {
      var validateAccount = (rule, value, callback) => {
        let reg = /[~#^$@%&!?%*/？【】‘；：”“'。，、<>]/gi;
        if (reg.test(value.trim())) {
          callback(new Error('用户名中含有非法字符'));
        }
        else{
          callback();
        }
      };
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { validator: validateAccount ,trigger: 'blur'}
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ruleForm2) {
        this.logining = true;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            let para = {id: this.ruleForm2.account,password:this.ruleForm2.checkPass};
            Login(para).then((res) => {
              console.log(res);
              if(res.data[0].status === 'no user'){
                this.$notify.error({
                  title: '错误',
                  message: '用户名错误'
                });
              }
              else if(res.data[0].status === 'wrong password'){
                this.$notify.error({
                  title: '错误',
                  message: '密码错误'
                });
              }
              else{
                this.$notify({
                  title: '成功',
                  message: '用户登录成功',
                  type: 'success'
                });
                if(res.data[0].permission === 2 ){
                  sessionStorage.setItem('user', JSON.stringify(res.data[0]));
                  this.$router.push({ path: '/page4'});
                }
                else if(res.data[0].permission === 1){
                  sessionStorage.setItem('user', JSON.stringify(res.data[0]));
                  this.$router.push({ path: '/table'});
                }
                else{
                  sessionStorage.setItem('user', JSON.stringify(res.data[0]));
                  this.$router.push({ path: '/table'});
                }
              }
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: '登录失败'
            });
            return false;
          }
          this.logining = false;
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
