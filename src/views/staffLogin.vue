<template>
  <div class="s-login staff">
    <div class="s-title">堡森云物流系统</div>
    <div class="s-sub-title">欧洲跨境物流领航者</div>
    <div class="main-content">
      <div class="logo-box">
        <img src="@/assets/logo/logo.svg" alt="logo" class="logo" />
      </div>
      <div class="form-box">
        <div class="form">
          <div class="title">账号登录</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
          >
            <el-form-item prop="username" class="username-box">
              <el-input
                v-model.trim="loginForm.username"
                type="text"
                auto-complete="off"
                @focus="isUsername = true"
                @blur="isUsername = false"
                placeholder="请输入账号"
              >
              </el-input>
              <img class="icon" src="@/assets/image/account.png" alt="" />
            </el-form-item>
            <el-form-item prop="password" class="password-box">
              <el-input
                v-model.trim="loginForm.password"
                :type="eyeSwitch ? 'text' : 'password'"
                auto-complete="off"
                placeholder="请输入密码"
                @focus="isPassword = true"
                @blur="isPassword = false"
                @keyup.enter.native="handleLogin"
              >
              </el-input>
              <img class="icon" src="@/assets/image/password.png" alt="" />
              <div
                :class="['eye-icon', eyeSwitch ? 'eye-open' : 'eye-close']"
                @click="eyeSwitch = !eyeSwitch"
              ></div>
            </el-form-item>
            <div class="btn-box">
              <el-button class="btn" @click.native.prevent="handleLogin">
                {{ !loading ? "授权并登录" : "登 录 中..." }}
              </el-button>
            </div>
            <div class="password-set">
              <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
              <!-- <div class="remember-me">
                <span>记住密码</span>
              </div> -->
              <span class="forget">忘记密码？</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="record-number-link">
      <span>版权所有 ICP证：</span>
      <a style="color: #5094ff" href="https://beian.miit.gov.cn" target="_blank"
        >粤ICP备2021079527号</a
      >
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      isUsername: false,
      isPassword: false,
      isValidCode: false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      loading: false,
      redirect: undefined,
      eyeSwitch: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch(
              "Login",
              Object.assign({}, this.loginForm, { userType: "00" })
            )
            .then(() => {
              this.$router.push({ path: this.redirect || "/index" });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "@/assets/styles/variables.scss";
@mixin center {
  width: 100%;
  display: flex;
  justify-content: center;
}
.s-login {
  width: 100%;
  height: 100%;
  background: #fff url("../assets/image/staff_bg.jpg") no-repeat left top;
  background-size: cover;
  display: flex;
  position: relative;
  .s-title,
  .s-sub-title {
    // font-family: PingFangSC-Semibold, PingFang SC;
    font-family: PingFang SC;
    font-weight: 600;
    position: absolute;
    padding-left: 120px;
  }
  .s-title {
    font-size: 90px;
    color: #ffffff;
    bottom: 251px;
  }
  .s-sub-title {
    font-size: 88px;
    color: #5094ff;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.85);
    bottom: 104px;
  }
  .main-content {
    width: 600px;
    align-self: center;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    position: absolute;
    right: 170px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .logo-box {
      @include center();
      margin-top: 80px;
      .logo {
        width: 204px;
      }
    }
    .form-box {
      @include center();
      margin: 134px 0 24px;
      .form {
        width: 410px;
      }
      .title {
        font-size: 20px;
        color: $light-blue;
        font-weight: 400;
        color: #515151;
        line-height: 28px;
      }
      .login-form {
        margin: 40px 0 82px;
        .sub-title {
          font-size: 16px;
          font-weight: 400;
          color: #515151;
          opacity: 0.5;
          margin-bottom: 13px;
        }
        .el-input__inner {
          height: 48px;
          border-radius: 4px;
          border: 1px solid #bcbcbc;
          padding: 0 50px;
        }
        .password-box {
          position: relative;
          .eye-icon {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 23px;
            bottom: 14px;
          }
          .eye-open {
            background: url("../assets/image/open_eye.png") no-repeat center
              center;
          }
          .eye-close {
            background: url("../assets/image/close_eye.png") no-repeat center
              center;
          }
        }
        .icon {
          position: absolute;
          left: 20px;
          top: 14px;
        }
        .password-set {
          display: flex;
          justify-content: space-between;
          margin: 24px 0 0;
          .el-checkbox__label {
            color: $light-blue;
            font-size: 16px;
            font-weight: 400;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: $light-blue;
            border-color: $light-blue;
          }
          .forget {
            color: $light-blue;
            font-size: 16px;
            font-weight: 400;
          }
        }
      }
      .btn-box {
        @include center();
        .btn {
          width: 410px;
          height: 54px;
          background: $light-blue;
          border-radius: 6px;
          font-size: 20px;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
  .record-number-link {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    line-height: 36px;
  }
}
$times: 0.7;
@media screen and (max-width: 1440px) {
  .s-login {
    .main-content {
      // width: $times*600px;
      right: $times * 170px;
    }
  }
}
</style>
