<template>
  <div class="remark-box">
    <ComForm ref="remarkRef" :formConfig="basicFormConfig" />
    <div class="base-flex-end">
      <el-button type="primary" @click="saveRemark" size="small" v-throttle>
        {{overseaLangObj.bc_bz || "保存备注"}}
      </el-button>
    </div>
  </div>
</template>

<script>
import { updateEcWarehouseRemark } from "@/api/operateManage/common";
import { formRemarksCols } from "./model";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      basicFormConfig: {
        formModel: {},
        labelPosition: "top",
        labelWidth: "90px",
        lists: formRemarksCols,
      },
    };
  },
  mounted() {
    // console.log("this.formData111111111111111", this.formData);
  },
  methods: {
    saveRemark() {
      //保存操作备注
      const { warehouseRemark } = this.$refs.remarkRef?.getFormModelVal();
      const { id } = this.formData;
      const params = {
        id,
        warehouseRemark,
      };
      updateEcWarehouseRemark(params).then((e) => {
        this.msgSuccess(this.overseaLangObj.cz_cg || "操作成功");
      });
    },
    cancelRemark() {
      // this.$emit('cancelRemark')
    },
  },
  created() {
    // console.log('this.formModel==', this.formModel)
    const { businessRemark, customerRemark, remark, warehouseRemark } =
      this.formData;
    this.basicFormConfig.formModel = {
      ...this.basicFormConfig.formModel,
      businessRemark,
      customerRemark,
      remark,
      warehouseRemark,
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
