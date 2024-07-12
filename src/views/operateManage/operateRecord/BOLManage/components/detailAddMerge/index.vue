<template>
  <!-- 详情左下角合并订单 -->
  <ComDialog
    ref="customDialog"
    class="dialog-container"
    :customDialog="customDialogConfig"
  >
    <template v-slot:title>
      <div class="title">
        <div class="titleContent">
          <span>{{ customDialogConfig.title }}</span>
        </div>
        <div class="title-des">
          <i class="el-icon-warning-outline"></i>
          <span>{{ customDialogConfig.des }}</span>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <ComTable
        class="content-table"
        ref="tableConfig"
        :columnConfig="tableConfig.tableColumns"
        :columnData="tableConfig.columnData"
        :httpRequest="tableConfig.httpRequest"
        :currentRow="true"
        :extraConfig="tableConfig.extraConfig"
        :pagination="false"
        @onSelectionChange="selectRow"
        v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
      >
      </ComTable>
    </template>
  </ComDialog>
</template>

<script>
import { tableColumns } from "./model";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  computed: {},
  data() {
    return {
      customDialogConfig: {
        title: "合并提单",
        des: "当前委托人存在其他待提柜信息，如需合并请选择合并信息",
        width: "514px",
        slotTitle: true,
        dataStatus: 0,
        footer: [
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确 定",
            plain: true,
            type: "primary",
            handleClick: (params) => {
              this.submit();
              // this.$refs.dialogForm.submitForm();
            },
          },
        ],
      },
      Visible: false,
      tableConfig: {
        tableColumns,
        // httpRequest: getPrivateWarehouseList,
        // FBAHttpRequest: getWarehouseList,
        columnData: [],
        extraConfig: {
          showHeader: true,
          loadMore: true,
          stripe: false,
        },
      },
      currentRow: [], //用户选择的数据
			ids: [],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show(rows, selfId) {
			this.ids = selfId ? [selfId] : [];
      this.tableConfig.columnData = [...rows];
			this.currentRow = [];
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    submit() {
      this.currentRow.forEach((item) => {
				this.ids.push(item.id);
      });
      const obj = {
        mergeOperationId: this.ids.join(","),
        id: this.currentRow[0]?.code,
        type: 0,
      };
      // this.$emit("mergeData", obj, "0"); //0是HBL单
      this.$emit("mergeData", obj, "merge"); //0是HBL单   2022/9/2之后删除替换成新接口
      this.hide();
    },
    selectRow(val) {
      this.currentRow = val;
    },
    refreshTable() {
      this.$refs.tableConfig && this.$refs.tableConfig.refreshTable(true);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-container {
  /deep/.el-dialog__body {
    padding: 0px;
  }
  .title {
    display: flex;
    .titleContent {
      font-size: 14px;
      color: #515151;
      margin-right: 15px;
    }
    .title-des {
      font-size: 12px;
      color: #8b8b8b;
      i {
        font-size: 14px;
      }
    }
  }
  .content-table {
    margin-top: 30px;
    margin-bottom: 40px;
  }
}
</style>
