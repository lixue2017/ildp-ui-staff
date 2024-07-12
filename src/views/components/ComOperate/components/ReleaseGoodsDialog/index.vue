<template>
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    class="release-goods-dialog"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:operationOrderNum="slotProps">
          <span>{{ slotProps.formModel.operationOrderNum }}</span>
          <el-tag
            type="success"
            size="mini"
            color="#35D06F1A"
            :style="{
              color: '#35D06F',
            }"
            class="release-tag"
            v-if="slotProps.formModel.operationOrderType !== 2"
          >
            {{ orderType[slotProps.formModel.operationOrderType].nameCn
            }}{{
              Number(slotProps.formModel.orderBusinessType) === 1
                ? "进口"
                : "出口"
            }}
          </el-tag>
        </template>
        <template v-slot:hBlNo="slotProps">
          <span>{{ slotProps.formModel.hBlNo || "--" }}</span>
          <el-tag
            type="success"
            size="mini"
            color="#66A5FF1A"
            :style="{
              color: '#66A5FF',
            }"
            class="release-tag"
            v-if="slotProps.formModel.operationOrderType !== 2"
          >
            {{
              dictionary.dicsData.freightType &&
              dictionary.dicsData.freightType[
                slotProps.formModel.freightType
              ] &&
              dictionary.dicsData.freightType[slotProps.formModel.freightType]
                .nameCn
            }}
          </el-tag>
        </template>
        <template v-slot:customerExpress="slotProps">
          <div class="flex input-slot">
            <el-select
              slot="append"
              v-model="slotProps.formModel.customerExpress"
              placeholder="-请选择-"
              class="input-slot-left"
            >
              <el-option
                v-for="selectItem in slotProps.dicsList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="slotProps.formModel.customerExpressNum"
              class="input-slot-right figure-type"
              maxlength="50"
              placeholder="此处填写快递单号"
            />
          </div>
        </template>
        <template v-slot:filialeExpress="slotProps">
          <div class="flex input-slot">
            <el-select
              slot="append"
              v-model="slotProps.formModel.filialeExpress"
              placeholder="-请选择-"
              class="input-slot-left"
            >
              <el-option
                v-for="selectItem in slotProps.dicsList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="slotProps.formModel.filialeExpressNum"
              class="input-slot-right figure-type"
              maxlength="50"
              placeholder="此处填写快递单号"
            />
          </div>
        </template>
        <template v-slot:attachId>
          <div class="accessory">
            <el-row class="accessory-title">附件信息</el-row>
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
    </template>
  </ComDialog>
</template>
<script>
import { config } from "./model";
import { mapState } from "vuex";
import { defaultTextParams } from "_comp/ComUpload/model";
import {
  releaseCargoRecord,
  getReleaseCargoRecord,
} from "@/api/operateManage/common";
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      status: 0,
      orderType: [
        {
          color: "#35D06F",
          nameCn: "海运",
        },
        {
          color: "#35D06F",
          nameCn: "空运",
        },
      ],
      customDialogConfig: {
        title: "放货信息",
        width: "830px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
        ],
        type: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "100px",
        lists: config.lists, // 表单渲染列表
        formRules: config.formRules, // 表单校验规则
        visibleAll: true,
      },
      uploadConfig: {
        ...defaultTextParams,
        fileList: [],
      },
    };
  },
  created() {},
  methods: {
    submitFormRequest(formModel) {
      console.log(formModel);
      console.log(this.uploadConfig.fileList);
      const attachList = [];
      if (this.uploadConfig.fileList.length > 0) {
        console.log(this.uploadConfig.fileList);
        this.uploadConfig.fileList.forEach((item) => {
          if (item.response && item.response.data) {
            attachList.push(...item.response.data);
          } else if (item.id) {
            attachList.push(item.id);
          }
        });
      }
      formModel.attachId = attachList.toString();
      formModel.isPrintTakeEntrust = formModel.isPrintTakeEntrust ? 1 : 0;
      delete formModel.remarkLabel;
      return releaseCargoRecord(formModel);
    },
    show({
      id: operationId,
      operationOrderNum,
      bailorPeople,
      destinationPort,
      freightType,
      operationOrderType,
      orderBusinessType,
      hBlNo,
      shipCompany,
    }) {
      this.formConfig.formModel = {
        operationId,
        operationOrderNum,
        bailorPeople,
        destinationPort,
        freightType,
        operationOrderType,
        orderBusinessType,
        hBlNo,
        shipCompany,
      };
      getReleaseCargoRecord(operationId);
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess(res = {}) {
      this.$emit("handleSuccess", res.data);
      this.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.content-padding-20 {
  padding: 0 20px;
}
.input-slot {
  /deep/ {
    .input-slot-left {
      .el-input__inner {
        border-radius: 4px 0 0 4px;
        border-right: none;
        width: 95px;
        text-align: center;
        background: #f4f4f4;

        &::-webkit-input-placeholder {
          color: #8b8b8b;
        }

        &::-moz-placeholder {
          color: #8b8b8b;
        }

        &::-ms-input-placeholder {
          color: #8b8b8b;
        }

        &::placeholder {
          color: #8b8b8b;
        }
      }
    }
    .input-slot-right .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
.release-tag {
  margin-left: 14px;
}
</style>