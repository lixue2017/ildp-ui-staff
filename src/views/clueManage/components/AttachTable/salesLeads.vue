<template>
  <div>
    <div class="attach-table-top">
      <div class="title">相关附件</div>
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
      tableHeight="calc(100vh - 420px)"
      :columnConfig="tableConfig.tableColumns(isCommunal)"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="getQueryParams"
      @onSelectionChange="onTableSelectionChange"
      :selectionTableRow="[...selectionRows]"
      :rowOperationBtnListFn="getOperationList"
      :paginationConfig="{
        limit: 15,
        layout: 'total, sizes, prev, pager, next, jumper',
        small: false,
        total: 15,
        pageSizes: [15, 30, 50, 100],
      }"
    >
    </ComTable>
    <ComUpload
      style="display: none"
      ref="fileUploadRef"
      :uploadConfig="{
        ...uploadConfig,
        uploadData: {
          customerId: formData.id,
          attentmentType,
        },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleError"
      @handleUploading="handleUploading"
    />
  </div>
</template>
<script>
import { getAttachPage, delAttach } from "@/api/clueManage/common.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { salesLeadsTableColumns } from "./model.js";
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
import { defaultParams, CRM_ATTACH_URL } from "_comp/ComUpload/model";
import { FullscreenLoading } from "@/utils/loading";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    attentmentType: {
      type: String,
      default: "",
    },
    isCommunal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      tableConfig: {
        tableColumns: salesLeadsTableColumns,
        httpRequest: getAttachPage,
      },
      uploadConfig: {
        ...defaultParams,
        url: CRM_ATTACH_URL,
        fragmentationUpload: false,
        type: "text",
        className: "text-uploader",
        name: "attachFile",
        showFileList: false,
        fileList: [],
        accept: ".rar,.zip,.doc,.docx,.pdf",
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
      operationList: [
        {
          text: "预览",
          handleClick: this.handleView,
        },
        {
          text: "下载",
          handleClick: this.handleDownload,
        },
        {
          text: "删除",
          color: "#FF6767",
          handleClick: this.handleDelete,
          hide: this.isCommunal,
          hasPermission: ["clueManage:attach:delete"],
        },
      ],
      btnList: [
        {
          label: "添加",
          type: "primary",
          className: "btn-type-add",
          icon: "el-icon-plus",
          handleClick: this.handleAdd,
          hide: this.isCommunal,
          hasPermission: ["clueManage:attach:add"],
        },
        {
          label: "下载",
          value: "download",
          type: "primary",
          icon: "el-icon-download",
          disabled: true,
          handleClick: this.handleBatchDownload,
        },
        {
          label: "删除",
          value: "delete",
          type: "danger",
          icon: "el-icon-delete",
          disabled: true,
          handleClick: this.handleBatchDelete,
          hide: this.isCommunal,
          hasPermission: ["clueManage:attach:delete"],
        },
      ],
      selectionRows: [],
      is_temp_throttle: {},
      loadMsg: null,
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
        attentmentId: this.formData.id,
        attentmentType: this.attentmentType,
      };
    },
    handleExport() {
      comFileDownload(this, operationRecordExport, this.getQueryParams());
    },
    refreshTable() {
      this.$refs.tableRef.refreshTable(true);
    },
    handleView(row) {
      filesPreview(row.filePath);
    },
    handleDownload(row) {
      if (this.is_temp_throttle[row.filePath]) {
        return;
      }
      if (this.loadMsg) {
        this.loadMsg.close();
      }
      this.is_temp_throttle[row.filePath] = true;
      this.loadMsg = this.$message({
        message: "文件准备中，请稍等。。。",
        type: "warning",
        duration: 0,
      });
      download(row.filePath, `${row.name}${row.suffix}`)
        .then(() => {
          this.loadMsg.close();
          this.is_temp_throttle[row.filePath] = false;
        })
        .catch(() => {
          this.loadMsg.close();
          this.is_temp_throttle[row.filePath] = false;
        });
    },
    handleBatchDownload() {
      this.selectionRows.map((row) => {
        this.handleDownload(row);
      });
      this.onTableSelectionChange();
    },
    handleBatchDelete() {
      const ids = this.selectionRows.map((row) => row.id);
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delAttach(ids.join(",")),
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
          httpMsgRequest: () => delAttach(row.id),
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
    handleUploading() {
      this.fullscreenLoading.show("正在上传中...");
    },
    handleError() {
      this.fullscreenLoading.hide();
    },
    uploadSuccess() {
      this.fullscreenLoading.hide();
      this.refreshTable();
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.handleBtn(this.btnList).map((btn) => {
        if (["download", "delete"].includes(btn.value)) {
          btn.disabled = !rows.length;
        }
      });
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    getOperationList() {
      return this.operationList.filter(
        (item) =>
          !item.hide &&
          (!item.hasPermission || hasBtnPermits(item.hasPermission))
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.attach-table-top {
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
/deep/ {
  .my-pagination-container {
    padding: 20px 0 0 20px;
  }
}
</style>
