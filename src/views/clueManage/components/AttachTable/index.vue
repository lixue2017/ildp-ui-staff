<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="getQueryParams"
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
  </div>
</template>
<script>
import { getAttachPage, delAttach } from "@/api/clueManage/common.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { tableColumns } from "./model.js";
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
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
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        httpRequest: getAttachPage,
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
      is_temp_throttle: {},
      loadMsg: null,
    };
  },
  methods: {
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
.operation-top {
  padding: 15px 0 6px;
  .title {
    font-weight: bold;
    font-size: 13px;
    color: #1f1f1f;
    line-height: 18px;
  }
  .el-date-editor {
    width: 350px;
  }
  .el-button {
    height: 28px;
    margin-left: 20px;

    i {
      font-size: 13px;
    }
  }
}
/deep/ {
  .my-pagination-container {
    padding: 20px 0 0 20px;
  }
}
</style>
