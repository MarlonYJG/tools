<!--
 * @Author: Marlon
 * @Date: 2020-11-03 10:49:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 14:01:20
 * @Description: 登录-标道
-->
<template>
  <div class="login-pages">
    <div class="login-form">
      <div class="login-card">
        <div class="bd-g"></div>
        <div class="bd">标道</div>
        <div class="bd-type">手机号快捷登录</div>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="50px"
          class="gb-login-info"
        >
          <el-form-item
            label="用户名"
            prop="userName"
            style="margin-bottom: 20px"
          >
            <el-input
              v-model="ruleForm.userName"
              placeholder="请输入手机号"
              autocomplete="off"
              size="medium"
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="password">
            <el-input
              v-model="ruleForm.password"
              autocomplete="off"
              size="medium"
              placeholder="请输入验证码"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-checkbox v-model="isAgree" class="isAgree"
            >已阅读并同意《用户协议》与《隐私政策》</el-checkbox
          >
          <el-button
            :loading="loadBut"
            type="primary"
            @click="submitForm('ruleForm')"
            style="width: 100%; font-size: 20px"
            class="login"
            >登录</el-button
          >

          <el-button
            class="yzm"
            type="primary"
            @click="getVerify"
            style="width: 175px"
            :disabled="(disabled = !show)"
          >
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count">{{ count }} s</span>
          </el-button>
          <!-- <div>发送验证码</div> -->
        </el-form>
      </div>
      <p class="login-foot">© 标道产品设计 版权所有</p>
    </div>
  </div>
</template>

<script>
import API from "api";
import { ResDatas } from "utils/res-format";
import { encryptedData, setToken, Session } from "utils/lib";
import { stytemList } from "@/assets/menu";
import store from "@/store";

export default {
  data() {
    return {
      loadBut: false,
      ruleForm: {
        userName: "",
        password: "",
      },
      rules: {
        // userName: [{ validator: userName, trigger: "blur" }],
        // password: [{ validator: password, trigger: "blur" }],
      },
      isAgree: false,
      show: true,
      count: "", // 初始化次数
      timer: null,
    };
  },
  methods: {
    // 登录
    submitForm() {
      // 验证
      const { userName, password } = this.ruleForm;
      if (userName) {
        if (this.checkPhone()) {
        } else {
          return;
        }
      } else {
        this.$message({
          message: "请输入手机号",
          type: "warning",
        });
        return;
      }
      if (password) {
      } else {
        this.$message({
          message: "请输入验证码",
          type: "warning",
        });
        return;
      }
      if (this.isAgree) {
      } else {
        this.$message({
          message: "请勾选用户协议",
          type: "warning",
        });
        return;
      }
      this.login();
    },
    // 获取验证码
    getVerify() {
      // 验证手机号
      if (this.checkPhone() == false) {
        return false;
      } else {
        this.sendMsg();
        const TIME_COUNT = 60; //更改倒计时时间
        if (!this.timer) {
          this.count = TIME_COUNT;
          this.show = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--;
            } else {
              this.show = true;
              clearInterval(this.timer); // 清除定时器
              this.timer = null;
            }
          }, 1000);
        }
      }
    },
    // 手机号验证
    checkPhone() {
      let phone = this.ruleForm.userName;
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        this.$message({
          message: "请填写正确的手机号",
          type: "warning",
        });
        return false;
      }
      return true;
    },

    /* 请求 */
    // 获取验证码
    sendMsg() {
      API.__sendSms({ phone: this.ruleForm.userName }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
      });
    },
    // 登录
    login() {
      const { userName, password } = this.ruleForm;
      this.loadBut = true;
      API.__login({
        username: userName,
        smsCode: password,
      })
        .then((res) => {
          this.loadBut = false;
          if (res.data && res.data.code == 0) {
            let Res = res.data.data;
            setToken(Res.token);
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
            if (localStorage.getItem("catchPath_BD")) {
              location.href = localStorage.getItem("catchPath_BD");
            } else {
              this.$router.push({
                path: "/bd/home",
              });
              localStorage.setItem("systemName", "home");
            }
          } else {
            sessionStorage.removeItem("userInfo");
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((err) => {
          sessionStorage.removeItem("userInfo");
          this.loadBut = false;
        });
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.login-pages {
  width: 100%;
  height: 100%;
  background: url(../../../assets/img/bd/login.png) no-repeat;
  background-size: 100% 100%;
  .login {
    &-form {
      position: relative;
      float: right;
      width: 602px;
      height: 100%;
      background: rgba(0, 0, 0, 0.78);
      color: #fff;
    }
    &-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -64%);
      width: 365px;
      overflow: hidden;
      box-sizing: border-box;
      .bd-g {
        width: 191px;
        text-align: center;
        height: 18px;
        line-height: 33px;
        font-size: 20px;
        background: url(../../../assets/img/bd/bd@191_18.png) no-repeat;
        margin: 0 auto;
      }
      .bd {
        text-align: center;
        height: 35px;
        line-height: 33px;
        font-size: 26px;
        margin-top: 20px;
        font-family: PingFang-SC-Medium;
        letter-spacing: 1px;
      }
      .bd-type {
        text-align: center;
        height: 35px;
        line-height: 33px;
        font-size: 21px;
        margin-top: 60px;
        font-family: PingFang-SC-Medium;
        letter-spacing: 0.5px;
      }
      .gb-login-info {
        position: relative;
        margin-top: 35px;
        font-family: PingFang-SC-Medium;
        font-size: 16px;
        .isAgree {
          height: 25px;
          line-height: 23px;
          margin-bottom: 30px;
          margin-top: 5px;
          color: #fff;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          letter-spacing: 0.5px;
        }
      }
      .yzm {
        width: 100px !important;
        height: 34px !important;
        line-height: 32px !important;
        text-align: center !important;
        letter-spacing: 1px !important;
        border-radius: 2px !important;
        border: 1px solid #fff !important;
        position: absolute !important;
        bottom: 140px !important;
        right: 0 !important;
        font-family: "Microsoft YaHei" !important;
        font-size: 14px !important;
        color: #fff !important;
        cursor: pointer !important;
        background: transparent !important;
        padding: 0 !important;
        &:hover {
          border: 1px solid #24befd !important;
          color: #24befd !important;
        }
      }

      /deep/ .el-form-item {
        box-sizing: border-box;
        border-bottom: 1px solid #929292;
      }
      /deep/ .el-form-item__label {
        position: relative;
        top: -2px;
        text-align-last: justify;
        color: #fff;
        font-size: 16px;
      }
      /deep/ .el-button--primary {
        background: linear-gradient(142deg, #24befd, #0047d6);
        box-shadow: 0px 8px 15px 0px rgba(15, 123, 247, 0.15);
        border: 0;
        border-radius: 4px;
        border-color: transparent;
        color: #fff;
        letter-spacing: 1.5px;
        font-size: 16px;
        font-weight: 400;
        height: 50px;
        line-height: 33px;
        i {
          position: relative;
          top: -7px;
        }
        transition: background 0.3s ease;
        &:hover {
          background: linear-gradient(142deg, #59cefa 0%, #2b7eec 100%);
          border-color: transparent;
          -webkit-transition: all 0.2s ease-in-out;
          transition: all 0.2s ease-in-out;
        }
      }
      /deep/ .el-input__inner {
        background-color: transparent;
        border: 0;
      }

      button {
        margin-top: 10px;
      }
      /deep/ .el-input--medium .el-input__inner {
        letter-spacing: 1px;
        padding-left: 20px;
        color: #fff;
        font-size: 16px;
        font-family: "Microsoft YaHei";
      }
      /deep/ .el-form-item__error {
        background-color: #000;
        left: 19px;
        color: #bf565b;
      }
      /deep/ .el-form-item.is-error .el-input__icon,
      .el-form-item.is-error .el-input__validateIcon {
        color: #bf565b;
      }
      /deep/ .el-checkbox__inner {
        background-color: transparent;
        border: 1px solid #fff;
        &:hover {
          background-color: transparent;
        }
      }
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        border-color: #fff;
      }
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner::after {
        border-color: #fff;
      }
    }

    &-foot {
      position: absolute;
      bottom: 22px;
      left: 50%;
      margin-left: -68px;
      color: rgba(255, 255, 255, 0.451);
      letter-spacing: 1.5px;
    }
  }
  /* 去除Chrome自带输入样式 */
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时
  }
  input {
    background-color: transparent;
  }
}
</style>
