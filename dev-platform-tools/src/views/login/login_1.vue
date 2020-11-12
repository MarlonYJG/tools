<!--
 * @Author: Marlon
 * @Date: 2020-07-10 09:49:45
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-12 15:12:06
 * @Description: 登录-版本2
--> 
<template>
  <div class="login">
    <div class="login-con">
      <div class="gb-card">
        <div class="gb-card-head">
          <p>欢迎登录</p>
        </div>
        <div class="gb-card-body">
          <div class="form-con">
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="60px"
              class="gb-card-body"
            >
              <el-form-item label="用户名：" prop="userName" style="margin-bottom: 20px;">
                <el-input v-model="ruleForm.userName" autocomplete="off" size="medium"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="password">
                <el-input
                  type="password"
                  v-model="ruleForm.password"
                  autocomplete="off"
                  size="medium"
                  @keyup.enter.native="submitForm('ruleForm')"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-button
              :loading="loadBut"
              type="primary"
              @click="submitForm('ruleForm')"
              style="width:100%;"
            >登录</el-button>
          </div>
        </div>

        <!-- <login-form @on-success-valid="handleSubmit"></login-form> -->
        <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
      </div>
    </div>
  </div>
</template>

<script>
// import LoginForm from '_c/login-form'
import { mapActions } from "vuex";
import { encryptedData, setToken } from "utils/lib";
import API from "api";
import { ResDatas } from "utils/res-format";
import system from "@/config/system.config.js";

const { BASEURL, LOGIN_PAGE_NAME } = system;
export default {
  components: {
    // LoginForm
  },
  data() {
    var userName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 250);
    };
    var password = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 250);
    };
    return {
      loadBut: false,
      ruleForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [{ validator: userName, trigger: "blur" }],
        password: [{ validator: password, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions({
      getUserInfo: "getUserInfo"
    }),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 请求 */
    login() {
      this.loadBut = true;
      API.__publicKey()
        .then(resKey => {
          if (resKey.data.code == 0) {
            let {
              data: { public_key }
            } = resKey;
            const { userName, password } = this.ruleForm;
            const passwordRSA = encryptedData({
              publicKey: public_key,
              data: password
            });
            API.__publicLogin({
              username: userName.trim(),
              password: passwordRSA
            })
              .then(res => {
                this.loadBut = false;
                if (res.data.code == 0) {
                  this.getUserInfo().then(res => {
                    if (res.data.code == 200 || res.data.code == 0) {
                      let userId = "";
                      if (res.data.data) {
                        // ETL 等
                        userId = res.data.data.userId || "";
                      } else {
                        // 数据采集 等
                        userId = res.data.userId || "";
                      }
                      if (userId) {
                        this.$router.push({
                          path: "/"
                        });
                      } else {
                        // 无权限访问
                        this.$router.push({
                          name: LOGIN_PAGE_NAME
                        });
                      }
                    } else {
                      this.$router.push({
                        name: LOGIN_PAGE_NAME
                      });
                    }
                  });
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                this.loadBut = false;
              });
          } else {
            this.loadBut = false;
            this.$message({
              message: resKey.data.message,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.loadBut = false;
        });
    }
  }
};
</script>

<style lang="scss">
@import "./login_1.scss";
</style>
