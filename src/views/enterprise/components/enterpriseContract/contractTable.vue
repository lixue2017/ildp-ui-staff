<template>
  <div>
    <ComTable
      ref="contractTableRef"
      :tableHeight="contractTable.tableHeight"
      :columnConfig="contractTable.columnConfig"
      :httpRequest="contractTable.httpRequest"
      :getQueryParams="() => getQueryParams()"
      :defaultExpandAll="true"
      :rowOperationBtnListFn="(row) => tableBtnList"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'expand'">
          <div
            v-if="!slotProps.row.attachList || !slotProps.row.attachList.length"
            class="noData"
          >
            暂无附件信息
          </div>
          <div v-else>
            <ComAttachTable
              :paramObj="{
                initFileList: slotProps.row.attachList,
              }"
              :fileTitle="null"
            />
            <!-- 
							@delRequestFile="handleDelete"
							:fileTableBtnArr="operationBtn" -->
          </div>
        </template>
      </template>
    </ComTable>

    <EnterpriseContract ref="contractRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  postContactsList,
  delContactsRow,
} from "@/api/customerManage/customerList.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { contractTableConfig } from "./model";
export default {
  props: {
    billContactObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      contractTable: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: contractTableConfig,
        httpRequest: postContactsList,
      },
      tableBtnList: [
        {
          text: "修改",
          handleClick: (row) => {
            this.$refs.contractRef?.handleCustomDialog(row, {
              successFn: () => {
                this.handleContractRefresh();
              },
            });
          },
        },
        {
          text: "删除",
          color: "#FF6767",
          handleClick: (row) => {
            this.handleRowDelete(row);
          },
        },
      ],
      operationBtn: [
        {
          text: "删除",
          btnOpnType: "delRequest",
        },
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
    };
  },
  methods: {
    handleContractRefresh() {
      this.$refs.contractTableRef.refreshTable();
    },
    handleRowDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delContactsRow(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.handleContractRefresh();
        }
      );
    },
    getQueryParams() {
      const { customerId } = this.billContactObj;
      return {
        customerId,
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["trueOrFalse"]);
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
    EnterpriseContract: () => import("./index.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .el-table__expand-column {
    .cell {
      display: none !important;
    }
  }
}
</style>
