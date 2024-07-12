<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              ref="searchFormRef"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
              :formConfig="searchFormConfig"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
              :rowOperationBtnListFn="getOperationList"
              @handleTableView="handleView"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'remark'">
                  <div
                    class="latest-follow"
                    v-html="slotProps.row.remark"
                    v-if="slotProps.row.remark"
                  ></div>
                  <span v-else>--</span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <FollowUpDialog ref="followUpDialogRef" @handleSuccess="mixinkeepTable" />
    <ComUpload
      style="display: none"
      ref="uploadExcelRef"
      :uploadConfig="productUploadConfig"
      @handleSuccess="handleImportSuccess"
      @handleError="handleImportErr"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { comFileDownload } from "@/utils/download.js";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { searchColumns, tableColumns } from "./model.js";
import {
  getFollowPage,
  importExcelFollow,
  delFollow,
} from "@/api/clueManage/followUpRecords.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { defaultParams, FOLLOW_IMPORT_EXCEL } from "_comp/ComUpload/model";
import { fullLoading } from "@/utils/loading";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";

export default {
  name: "FollowUpRecords",
  mixins: [mixinColsConf],
  components: {
    FollowUpDialog: () =>
      import("@/views/clueManage/components/FollowUpDialog"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "跟进记录",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导入",
            icon: "el-icon-download",
            handleClick: this.handleImport,
          },
        ],
      },
      searchFormConfig: {
        searchForm: true,
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "75px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 265px)",
        httpRequest: getFollowPage,
      },
      searchFromData: {},
      mixinTableColArr: [tableColumns],
      operationList: [
        {
          text: "编辑",
          handleClick: this.handleEdit,
          hasPermission: ["clueManage:followUpRecords:edit"],
        },
        {
          text: "删除",
          color: "#FF6767",
          businessType: 2,
          handleClick: this.handleDelete,
          hasPermission: ["clueManage:followUpRecords:delete"],
        },
      ],
      productUploadConfig: {
        ...defaultParams,
        url: FOLLOW_IMPORT_EXCEL,
        fragmentationUpload: false,
        type: "text",
        className: "text-uploader",
        name: "multipartFile",
        showFileList: false,
        fileList: [],
        accept: ".xlsx,.xls",
        uploadData: {},
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]([
      "crmSalesLeadsState",
      "crmFollowType",
      "crmRemindWay",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getTableList(searchFrom = {}) {
      this.searchFromData = searchFrom;
      if (this.btnType === "export") {
        comFileDownload(this, exportGoodsTrace, this.getQueryParams());
      } else {
        this.mixinkeepTable(true);
      }
    },
    getQueryParams() {
      const { createTime, ...searchObj } = this.searchFromData;
      const [createTimeGe, createTimeLe] = createTime || [];
      return {
        ...searchObj,
        createTimeGe,
        createTimeLe,
      };
    },
    handleImport() {
      this.$refs.uploadExcelRef?.handleUploadClick();
    },
    handleImportSuccess() {
      fullLoading.hide();
      this.mixinkeepTable(true);
    },
    handleImportErr() {
      fullLoading.hide();
    },
    handleUploading() {
      fullLoading.show("正在上传中...");
    },
    handleEdit(row) {
      this.$refs.followUpDialogRef.show(row);
    },
    handleDelete(row) {
      customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          msgTxt2: "，是否确定删除对应的记录？",
          msgTxtColor: "#FF6767",
          httpMsgRequest: () => delFollow(row),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable();
        }
      );
    },
    getOperationList(row) {
      return this.operationList.filter(
        (item) =>
          (!item.businessType || item.businessType !== row.businessType) &&
          (!item.hasPermission || hasBtnPermits(item.hasPermission))
      );
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.crmSalesLeadsId
      );
      this.$router.push({
        path: "/clueManage/salesClueDetail",
        query: {
          id: row.crmSalesLeadsId,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.latest-follow {
  /deep/ {
    img {
      max-height: 32px;
    }
  }
}
</style>
