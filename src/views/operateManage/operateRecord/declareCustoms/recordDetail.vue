<template>
  <div>
    <ComForm
      ref="dialogForm"
      :formConfig="detailFormConfig"
      style="width: 100%"
    >
    <template v-slot:exportType="slotProps">
      <div class="base-flex-align">
        <span class="tag-green-color">{{ slotProps.dicsData.nameCn || '--' }}</span>
        <span class="tag-blue-color">{{ busTypeFind(slotProps.formModel.busType)}}</span>
      </div>
    </template>
    </ComForm>
  </div>
</template>

<script>
import { BUS_TYPE } from "@/utils/mixin"
import { recordDetailCols } from "./model";
export default {
  props: {
    detailFormModel: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComUpload: () => import("_comp/ComUpload")
  },
  data() {
    return {
      detailFormConfig: {
        formModel: this.detailFormModel,
        isAttachFileId: true,
        size: "small",
        labelWidth: "80px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: recordDetailCols,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      },
    }
  },
  methods: {
    busTypeFind(val) {
      const obj = BUS_TYPE.find(e => e.value == val) || {}
      return obj.label || '--'
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tag-blue-color {
  margin-left: 5px;
}
</style>
