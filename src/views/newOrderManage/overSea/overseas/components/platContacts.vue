<template>
  <div>
    <ComForm
      :class="['see-detail-form', viewModel.className]"
      :formConfig="formContactsConfig"
    >
      <template v-slot:taxId="slotProps">
        <span>({{ slotProps.dicsData && slotProps.dicsData.nameCn || '--' }}){{slotProps.formModel.taxId}}</span>
      </template>
    </ComForm>
  </div>
</template>
<script>
import { CONTACTS_FORM_COLS } from "./model"

export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    viewModel: { // 区分显示不同模板
      type: Object,
      default: () => ({
        pagePath: "overseas", // overseas-海外订单, outStorage-出库
        className: "",
      }),
    },
  },
  data() {
    return {
      formContactsConfig: {},
    }
  },
  methods: {
    
  },
  created() {
    const { labelWidth = (this.overseaLangObj.yu_yan_lang === "en-us" ? "124px" : "110px") } = this.viewModel || {}
    const { taxIdType, ...nFormData } =  this.formData || {}
    this.formContactsConfig = {
      ...this.formContactsConfig,
      labelWidth,
      formModel: {
        ...nFormData,
        taxIdType: this.typeConversion(taxIdType),
      },
      lists: CONTACTS_FORM_COLS(),
    }
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style lang="scss" scoped>
.see-detail-form {
  padding-top: 10px;
  &.out-storage-detail {
    padding: 0
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
