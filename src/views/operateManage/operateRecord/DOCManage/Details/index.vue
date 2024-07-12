<template>
  <div class="app-container">
    <div class="title-col">
      <div class="title">扣货详情({{ formConfig.formModel.code }})</div>
      <div class="create-info">
        <span>
          <span class="label">创建人：</span>
          <span class="value">{{ formConfig.formModel.createBy }}</span>
        </span>
        <span>
          <span class="label">创建时间：</span>
          <span class="value">{{ formConfig.formModel.createTime }}</span>
        </span>
      </div>
    </div>
    <div class="order-content">
      <ComForm
        class="order-from"
        :formConfig="formConfig"
        ref="myForm"
        v-if="Object.keys(dictionary.dicsData).length"
      >
        <template v-slot:accessory>
          <div class="accessory">
            <!-- <el-row class="accessory-title">附件信息</el-row> -->
            <el-row class="accessory-tips">
              支持扩展名：{{
                uploadConfig.accept.split(",").join(" ")
              }}，单个文件大小支撑到最大{{ uploadConfig.size }}M，最多上传{{
                uploadConfig.limit
              }}个附件
            </el-row>
            <ComUpload :uploadConfig="uploadConfig"> </ComUpload>
          </div>
        </template>
      </ComForm>
    </div>

    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button :type="btn.type" @click="btn.handleClick" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>

  <!-- <div class="order-edit">
    <div class="order-content">
      <div class="flex" v-if="formConfig.lists.length">
        <div class="order-left">
          <ComForm
            class="order-from"
            :formConfig="formConfig"
            ref="myForm"
            v-if="Object.keys(dictionary.dicsData).length"
          >
            <template v-slot:accessory>
              <div class="accessory">
                <el-row class="accessory-tips">
                  支持扩展名：{{
                    uploadConfig.accept.split(",").join(" ")
                  }}，单个文件大小支撑到最大{{ uploadConfig.size }}M，最多上传{{
                    uploadConfig.limit
                  }}个附件
                </el-row>
                <ComUpload :uploadConfig="uploadConfig"> </ComUpload>
              </div>
            </template>
          </ComForm>
        </div>
      </div>
    </div>
    <div class="order-footer">
      <el-button @click="reBack()"> 关 闭 </el-button>
    </div>
  </div> -->
</template>
<script>
import { getPopDetail } from "@/api/operateRecord/DOCManage.js";
import { config } from "./model";
import { mapActions, mapState } from "vuex";
import { defaultTextParams } from "_comp/ComUpload/model";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "98px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
      },
      uploadConfig: {
        ...defaultTextParams,
        fileList: [],
        disabled: true,
      },
      footerBtn: [
        {
          text: "关闭",
          handleClick: this.reBack,
        },
      ],
      detailId: this.$route.query.operateId ? this.$route.query.operateId : "",
    };
  },
  created() {
    this["dictionary/getDictionary"]("DocTypeEn");
  },
  mounted() {
    this.getPopDetail();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getPopDetail() {
      getPopDetail(this.detailId).then((res) => {
        this.formConfig.formModel = {
          ...res.data,
          operationOrderNum: res.data.sortBoxCode
            ? res.data.sortBoxCode
            : res.data.operationOrderNum,
        };

        this.$refs.myForm &&
          this.$refs.myForm.setFormModel(this.formConfig.formModel);
        this.uploadConfig.fileList = res.data.attachList || [];
      });
    },
    addCustomer() {},
    handleSuccess() {},
    reBack() {
      this.$router.push("/operateManage/operateRecord/DOCManage");
    },
    // reBack() {
    //   this.$router.push("/operateRecord/DOCManage");
    // },
  },
};
</script>


<style lang="scss" scoped>
.app-container {
  width: 1214px;
  margin: auto;
  margin-bottom: 100px;
}
.order-edit {
  background: #f9f9f9;
  /deep/ {
    .el-radio__input.is-disabled + span.el-radio__label {
      color: #515151;
    }
    .el-radio__input.is-disabled.is-checked + .el-radio__label {
      color: #5094ff;
    }
    .el-radio__input.is-disabled.is-checked .el-radio__inner {
      border-color: #5094ff;
      background-color: #fff;
      &::after {
        background-color: #5094ff;
      }
    }
    .form-class {
      .border-bottom-solid {
        margin-bottom: 0;

        &::after {
          padding-top: 14px;
        }

        &.margin-top-14 {
          margin-top: 14px;
        }
      }
    }
  }
  .detail-card {
    display: flex;
    padding: 14px 50px 14px 32px;
    justify-content: space-between;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 14px;

    & > div {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 26px 20px;
      margin-right: 20px;
      .iconfont {
        font-size: 42px;
        margin-right: 16px;
      }
      .label {
        font-size: 14px;
        margin-bottom: 6px;
      }
      .value {
        font-size: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .card-addr {
      flex: 1;

      .value {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }
      .line {
        flex: 1;
        border-bottom: 1px #ff813d dashed;
      }
    }
  }
  .order-content {
    width: 1280px;
    min-height: calc(100vh - 108px);
    padding-bottom: 100px;
    margin: auto;
    background: #fff;

    // .title-col {
    //   display: flex;
    //   justify-content: space-between;
    //   padding: 29px 50px 0;
    //   color: #515151;
    //   .title {
    //     font-weight: 600;
    //     padding-bottom: 6px;
    //     border-bottom: 1px solid #515151;
    //   }
    //   .create-info {
    //     flex: 1;
    //     color: #606060;
    //     padding-bottom: 6px;
    //     border-bottom: 1px solid #f3f3f3;

    //     & > span {
    //       margin-left: 20px;
    //     }
    //     .label {
    //       font-size: 12px;
    //       color: #8b8b8b;
    //     }
    //   }
    //   .page-turn {
    //     border-bottom: 1px solid #f3f3f3;
    //     .el-button {
    //       margin-left: 22px;
    //     }
    //     .back {
    //       color: #7d7d7d;
    //     }
    //     .disable-change {
    //       color: #7d7d7d;
    //     }
    //   }
    // }
    .flex {
      display: flex;

      .order-left {
        width: 1280px;
        .order-from {
          padding: 0 50px 50px;

          /deep/ {
            .el-form-item {
              margin-bottom: 0;
            }
            .select-contacts-item {
              .el-form-item {
                margin-top: 14px;
              }
            }
          }
        }
      }
    }
  }
  .accessory {
    .accessory-title {
      font-size: 14px;
      color: #515151;
      font-weight: bold;
    }
    .accessory-tips {
      color: #bcbcbc;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
.title-col {
  display: flex;
  justify-content: space-between;
  padding: 15px 30px 0;
  color: #515151;
  .title {
    font-weight: 600;
    padding-bottom: 6px;
    border-bottom: 1px solid #515151;
  }
  .create-info {
    flex: 1;
    color: #606060;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e2e2;

    & > span {
      margin-left: 20px;
    }
    .label {
      font-size: 12px;
      color: #8b8b8b;
    }
  }
  .page-turn {
    border-bottom: 1px solid #e2e2e2;
    .el-button {
      margin-left: 22px;
    }
    .back {
      color: #7d7d7d;
    }
    .disable-change {
      color: #7d7d7d;
    }
  }
}
.order-content {
  margin-top: 14px;
}
</style>

