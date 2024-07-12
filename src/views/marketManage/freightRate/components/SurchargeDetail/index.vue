<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:content>
        <SurchargeTable
          ref="surchargeTableRef"
          :packingMode="formData.packingMode"
          :isDetail="true"
          :formData="formData"
          :showTitle="false"
          v-if="formData.id"
        />
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { tableColumnsLeft, tableColumnsRight } from "./model";
import { getSurchargeList } from "@/api/marketManage/freightRate";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    SurchargeTable: () => import("../SurchargeTable"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "附加费",
        width: "800px",
        appendToBody: this.appendToBody,
        footer: [],
      },
      tableColumnsLeft,
      tableColumnsRight,
      tableColumnsExtra: [],
      columnData: [],
      formData: {},
    };
  },
  created() {},
  methods: {
    async show(row) {
      this.formData = {};
      getSurchargeList(row.id).then((res) => {
        this.formData = {
          id: row.id,
          packingMode: row.packingMode || 0,
          freightRateSurchargeList: res.rows,
        };
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog__body {
    padding: 20px 20px 30px;

    .tableData {
      border-left: 1px solid #e2e2e2;
      border-right: 1px solid #e2e2e2;
    }
  }
  .el-dialog__footer {
    display: none;
  }
}
</style>
