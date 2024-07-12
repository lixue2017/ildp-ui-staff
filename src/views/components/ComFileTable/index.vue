<template>
  <div>
    <ComTable
      ref="fileComRef"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableTabConfig()"
      :columnData="[]"
      :rowOperationBtnListFn="(row) => tableBtnConfig()"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.column.customSlot">
          <slot :name="slotProps.column.prop" :slotProps="slotProps" />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download";
import { customMessageBox } from "@/utils/confirmBox.js";
import { deleteAttach } from "@/api/common.js";
import { getAttachList } from "@/api/overseas/fbaOrder";
import { fileTableCols } from "./model";
export default {
  props: {
    filesConf: {
      type: Object,
      default: () => ({
        fileRequest: () => {},
      }),
    },
  },
  data() {
    return {
      tableConfig: {
        tableHeight: "300px",
        statusBtnList: [
          {
            text: this.overseaLangObj.ck_see("查看", 1),
            btnType: "fView",
            handleClick: this.handlePreview,
          },
          {
            text: this.overseaLangObj.xz_download("下载"),
            btnType: "fDownload",
            handleClick: this.handleDownload,
          },
          {
            text: this.overseaLangObj.yc_delete("删除"),
            color: "#FF6767",
            btnType: "fDelete",
            handleClick: this.handleDelete,
          },
        ],
      },
    };
  },
  methods: {
    handleEditOrSee() {},
    attachRequestTable(fileParams = {}) {
      const { attachId } = fileParams;
      if (attachId) {
        getAttachList({ attachId }).then((res) => {
          this.$refs.fileComRef?.setNewTableData(res.data || []);
        });
      }
    },
    fileRequestTable(fileParams = {}) {
      const { httpFileTable } = this.filesConf;
      if (httpFileTable) {
        // 父组件传递的获取附件接口
        httpFileTable(fileParams).then((res) => {
          this.$refs.fileComRef?.setNewTableData(res.data || []);
        });
      }
    },
    fileTableList({ attachList }) {
      this.$refs.fileComRef?.setNewTableData(attachList || []);
    },
    handlePreview(row = {}) {
      row.filePath && filesPreview(row.filePath);
    },
    handleDownload(row = {}) {
      row.filePath && download(row.filePath, row.name);
    },
    handleDelete(row = {}) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => {
            const { delCustomFileRequest, delFileIdKey = "id" } =
              this.filesConf;
            if (delCustomFileRequest) {
              // 父组件传递的删除接口
              return delCustomFileRequest({
                [delFileIdKey]: row[delFileIdKey],
              });
            } else {
              return deleteAttach(row[delFileIdKey]);
            }
          },
        },
        () => {
          this.msgSuccess("删除成功");
          this.filesConf.filesRefresh && this.filesConf.filesRefresh(row);
        }
      );
    },
    tableBtnConfig() {
      const { btnFilters = ["fView", "fDownload", "fDelete"] } = this.filesConf;
      return this.tableConfig.statusBtnList.filter((e) =>
        (btnFilters || []).includes(e.btnType)
      );
    },
    tableTabConfig() {
      const { customFileTableCols } = this.filesConf;
      if (customFileTableCols) {
        // 父组件传递的表格模板
        return customFileTableCols;
      }
      return fileTableCols();
    },
  },
  created() {},
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
