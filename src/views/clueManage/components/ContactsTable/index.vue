<template>
  <div>
    <div class="table-top">
      <div class="title">联系人</div>
      <div>
        <template v-for="(btn, i) in handleBtn(btnList)">
          <el-button
            v-if="!btn.hide"
            :key="i"
            :type="btn.type"
            size="small"
            :icon="btn.icon"
            :class="btn.className"
            :disabled="btn.disabled"
            @click="btn.handleClick()"
            >{{ btn.label }}</el-button
          >
        </template>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.tableColumns(isCommunal)"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="getQueryParams"
      @onSelectionChange="onTableSelectionChange"
      :selectionTableRow="[...selectionRows]"
      :rowOperationBtnListFn="
        () => (isCommunal ? [] : handleBtn(operationList))
      "
    >
    </ComTable>
    <ContactsDialog ref="contactsDialogRef" @handleSuccess="refreshTable" />
  </div>
</template>
<script>
import {
  exportSalesLeadsContact,
  getSalesLeadsContact,
  delContact,
  batchDelContact,
} from "@/api/clueManage/contacts.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { tableColumns } from "./model.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isCommunal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ContactsDialog: () =>
      import("@/views/clueManage/components/contactsDialog"),
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        httpRequest: getSalesLeadsContact,
      },
      operationList: [
        {
          text: "编辑",
          handleClick: this.handleEdit,
          hasPermission: ["clueManage:contacts:edit"],
        },
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
          hasPermission: ["clueManage:contacts:delete"],
        },
      ],
      btnList: [
        {
          label: "添加",
          type: "primary",
          className: "btn-type-add",
          icon: "el-icon-plus",
          handleClick: this.handleEdit,
          hide: this.isCommunal,
          hasPermission: ["clueManage:contacts:add"],
        },
        {
          label: "导出",
          type: "primary",
          icon: "el-icon-upload2",
          handleClick: this.handleExport,
        },
        {
          label: "删除",
          value: "delete",
          type: "danger",
          icon: "el-icon-delete",
          disabled: true,
          handleClick: this.handleBatchDelete,
          hide: this.isCommunal,
          hasPermission: ["clueManage:contacts:delete"],
        },
      ],
      selectionRows: [],
    };
  },
  methods: {
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    getQueryParams() {
      return {
        crmSalesLeadsId: this.formData.id,
      };
    },
    handleEdit(row = {}) {
      if (!row?.id) {
        row.crmSalesLeadsId = this.formData.id;
      }
      this.$refs.contactsDialogRef.show(row, "salesLeads");
    },
    handleExport() {
      comFileDownload(this, exportSalesLeadsContact, this.getQueryParams());
    },
    refreshTable() {
      this.$refs.tableRef.refreshTable(true);
    },
    handleBatchDelete() {
      const ids = this.selectionRows.map((row) => row.id);
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => batchDelContact(ids),
        },
        () => {
          this.msgSuccess("删除成功");
          this.onTableSelectionChange();
          this.refreshTable();
        }
      );
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delContact(row),
        },
        () => {
          this.msgSuccess("删除成功");
          this.refreshTable();
        }
      );
    },
    handleAdd() {
      this.$refs.fileUploadRef?.handleUploadClick();
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.btnList.map((btn) => {
        if (btn.value === "delete") {
          btn.disabled = !rows.length;
        }
      });
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 5px;
  .title {
    font-weight: bold;
    font-size: 13px;
    color: #1f1f1f;
    line-height: 50px;
  }
}
</style>
