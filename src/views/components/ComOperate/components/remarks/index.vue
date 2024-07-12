<template>
  <div class="remark-box">
    <ComForm ref="remarkRef" :formConfig="basicFormConfig" />
    <div class="base-flex-end">
      <el-button type="primary" @click="saveRemark" size="small" v-throttle>
        保存备注
      </el-button>
      <!-- <el-button
        size="small"
        @click="cancelRemark"
        plain
      >
        取 消
      </el-button> -->
    </div>
  </div>
</template>
<script>
// import { editOperationRemark } from "@/api/operateManage/common";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { formRemarksCols } from "./model";

export default {
  props: {
    formModel: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      basicFormConfig: {
        formModel: {},
        labelPosition: "top",
        size: "small",
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
        lists: formRemarksCols({ isMainBill: this.formModel.isMainBill }),
      },
    };
  },
  methods: {
    saveRemark() {
      //保存操作备注
      const { operationOrderId } = this.formModel;
      const { operationRemark,operationOrderNum } = this.$refs.remarkRef?.getFormModelVal();
      // const params = {
      //   id: operationOrderId,
      //   operationRemark: operationRemark || "", // 为null时转为字符串类型
      //   operationOrderNum
      // };
      // editOperationRemark(params)

      httpDictRequest(
        {
          pageRemarkNameKey: "CZBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark: operationRemark || "",
          businessId: operationOrderId,
        }
      ).then(() => {
        this.msgSuccess("操作备注保存成功");
      });
    },
    cancelRemark() {
      // this.$emit('cancelRemark')
    },
  },
  created() {
    // console.log('this.formModel==', this.formModel)
    this.basicFormConfig.formModel = {
      ...this.formModel,
    };
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style lang="scss" scoped>
.remark-box {
  margin-top: 44px;
}
</style>
