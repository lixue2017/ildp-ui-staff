<template>
  <div class="remark-box">
    <ComForm ref="remarkRef" :formConfig="basicFormConfig" />
    <div class="base-flex-end" v-if="pageType === 3">
      <el-button type="primary" @click="saveRemark" size="small" v-throttle>
        {{ overseaLangObj.bc_bz }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { updateWarehouseRemark } from "@/api/operateManage/common";
import { formRemarksCols } from "./model";

export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    pageType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      basicFormConfig: {
        formModel: {},
        labelPosition: "top",
        labelWidth: "90px",
        lists: formRemarksCols(this.pageType),
      },
    };
  },
  mounted() {
    // console.log("this.formData", this.formData);
    // console.log("this.pageType", this.pageType);
  },
  methods: {
    saveRemark() {
      //保存操作备注
      const httpRequestLists = {
        1: undefined,
        2: undefined,
        3: updateWarehouseRemark,
      };
      const { id } = this.formData;
      const { warehouseRemark } = this.$refs.remarkRef?.getFormModelVal();
      const updateReamrkRequest = httpRequestLists[this.pageType];
      const params = {
        id,
        remark: warehouseRemark,
      };
      updateReamrkRequest(params).then(() => {
        this.msgSuccess(this.overseaLangObj.cz_cg);
      });
    },
    // cancelRemark() {
    //   // this.$emit('cancelRemark')
    // },
  },
  created() {
    const { warehouseOrderDetailVo } = this.formData;
    this.basicFormConfig.formModel = {
      ...this.formData,
      warehouseRemark: warehouseOrderDetailVo?.warehouseRemark,
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
