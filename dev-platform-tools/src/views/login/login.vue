<!--
 * @Author: Marlon
 * @Date: 2020-07-10 09:49:45
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:50:31
 * @Description: 登录-版本1
--> 
<template>
  <div class="login">
    <div class="login-con">
      <div class="gb-icon" id="animation">
        <div class="icon"></div>
      </div>
      <div class="gb-card">
        <div class="gb-login">
          <p class="gb-login-title">广联达公共交易资源大数据分析平台</p>
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
                placeholder="请输入用户名"
                autocomplete="off"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                autocomplete="off"
                size="medium"
                placeholder="请输入密码"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-button
              :loading="loadBut"
              type="primary"
              @click="submitForm('ruleForm')"
              style="width: 100%"
              >立即登录</el-button
            >
          </el-form>
        </div>
        <p class="gb-card-msg">© 广联达科技股份有限公司 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { encryptedData, setToken, Session } from "utils/lib";
import { openUrl } from "utils/jump";
import API from "api";
import { ResDatas } from "utils/res-format";
import system from "@/config/system.config.js";
import { PRODUCT } from "@/config";

const { BASEURL, LOGIN_PAGE_NAME, NODE_ENV, WEB_SESSION, PUBLIC_PAGE } = system;
let webSession = new Session();

export default {
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
        password: "",
      },
      rules: {
        userName: [{ validator: userName, trigger: "blur" }],
        password: [{ validator: password, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    /* 请求 */
    login() {
      this.loadBut = true;
      API.__publicKey()
        .then((resKey) => {
          if (resKey.data.code == 0) {
            let {
              data: { public_key },
            } = resKey;
            const { userName, password } = this.ruleForm;
            const passwordRSA = encryptedData({
              publicKey: public_key,
              data: password,
            });

            API.__publicLogin({
              username: userName.trim(),
              password: passwordRSA,
            })
              .then((res) => {
                this.loadBut = false;
                if (res.data && res.data.code == 0) {
                  setToken(res.data.userId);
                  webSession.set(WEB_SESSION, res.data);
                  if (!NODE_ENV) {
                    // dev
                    this.$router.push({
                      path: "/",
                    });
                  } else {
                    // 获取默认跳转的地址
                    const {
                      menus: { children },
                    } = res.data;
                    let systemList = children[0].children;
                    let localPath = localStorage.getItem(
                      `catchPath_${PRODUCT}`
                    );
                    if (localPath && localPath.indexOf("#") !== -1) {
                      if (
                        !PUBLIC_PAGE.includes(localPath.split("#")[1]) &&
                        localPath.split("#")[1] !== "/"
                      ) {
                        // 本地缓存页面
                        openUrl({
                          type: "replace",
                          url: localPath,
                        });
                      } else {
                        // 后端默认页面
                        openUrl({
                          type: "replace",
                          url: "/dc-manage/", //TODO systemList[0].resUrl,
                        });
                      }
                    } else {
                      // 后端默认页面
                      openUrl({
                        type: "replace",
                        url: "/dc-manage/", //TODO systemList[0].resUrl,
                      });
                    }
                  }
                } else {
                  webSession.set();
                  this.$message({
                    message: res.data.msg,
                    type: "error",
                  });
                }
              })
              .catch((err) => {
                this.loadBut = false;
              });
          } else {
            this.loadBut = false;
            this.$message({
              message: resKey.data.message,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.loadBut = false;
        });
    },
  },
  mounted() {
    bodymovin.loadAnimation({
      path: "./../../../static/json/data.json", //json文件路径
      loop: true,
      autoplay: true,
      renderer: "svg", //渲染方式，有"html"、"canvas"和"svg"三种
      container: document.getElementById("animation"),
    });
  },
};
</script>

<style lang="scss">
@import "./login.scss";
</style>
