<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in stateSearchSumList(1)">
        <el-tab-pane
          :label="tab.nameCn"
          :name="`${tab.countType}`"
          :key="`${tab.countType}`"
        >
          <template slot="label">
            <TabItem :sItem="tab" />
          </template>
          <keep-alive>
            <ComForm
              ref="searchFormRef"
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
              :formConfig="searchFormConfig"
            >
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              v-if="showSearchForm && tabsConfig.activeName == tab.countType"
              :ref="`tableRef${tab.countType}`"
              :tableHeight="tableConfig.tableHeight"
              :columnConfig="tableMixinConfig(tab.countType)"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams(tab.countType)"
              :rowOperationBtnListFn="() => handleBtn(operationList)"
              @handleTableView="handleView"
            >
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <contactsDialog ref="contactsDialogRef" @handleSuccess="mixinkeepTable" />
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
  getSalesLeadsContact,
  exportSalesLeadsContact,
  delContact,
} from "@/api/clueManage/contacts.js";
import { customMessageBox } from "@/utils/confirmBox.js";
import { defaultParams, CONTACT_IMPORT_EXCEL } from "_comp/ComUpload/model";
import { fullLoading } from "@/utils/loading";
import { mixinConfSearch } from "_comp/ComColumnConf/SearchColumn/mixinConfSearch.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";

export default {
  name: "ClueContacts",
  mixins: [mixinColsConf, mixinConfSearch],
  components: {
    contactsDialog: () =>
      import("@/views/clueManage/components/contactsDialog"),
    ComUpload: () => import("_comp/ComUpload"),
    TabItem: () => import("_comp/ComColumnConf/SearchColumn/TabItem"),
  },
  data() {
    return {
      showCount: false,
      searchFormConfig: {
        searchForm: true,
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        labelWidth: "80px",
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
        httpRequest: getSalesLeadsContact,
        tableColumns,
      },
      searchFromData: {},
      mixinTableColArr: {
        999: tableColumns,
        565: tableColumns,
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
      productUploadConfig: {
        ...defaultParams,
        url: CONTACT_IMPORT_EXCEL,
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
    this.tabsConfig.btnArr = this.handleBtn([
      {
        table: "添加",
        className: "btn-type-add",
        icon: "el-icon-plus",
        handleClick: this.handleEdit,
        hasPermission: ["clueManage:contacts:add"],
      },
      // {
      //   table: "导入",
      //   icon: "el-icon-download",
      //   handleClick: this.handleImport,
      // },
      {
        table: "导出",
        icon: "iconfont daochu",
        handleClick: () => {
          this.btnType = "export";
          this.$refs.searchFormRef[0]?.submitForm();
        },
      },
    ]);
    this["dictionary/getDictionary"]([
      "crmHonorific",
      "crmRole",
      "crmRemind",
      "crmRemindWay",
    ]).then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    getTableList(searchFrom = {}) {
      const { webAllSearchFormData, ...searchObj } = searchFrom;
      this.searchFromData[this.tabsConfig.activeName] = {
        ...searchObj,
      };
      if (this.btnType === "export") {
        this.btnType = null;
        comFileDownload(
          this,
          exportSalesLeadsContact,
          this.getQueryParams(this.tabsConfig.activeName)
        );
      } else {
        this.mixinkeepTable(true, {
          isTableSearch: true,
          webAllSearchFormData,
        });
        // this.handleRouteStateCount();
      }
    },
    getQueryParams(tabName) {
      const { lastContactTime, lastFollowTime, ...searchObj } =
        this.searchFromData[tabName] || {};
      const [lastContactTimeGe, lastContactTimeLe] = lastContactTime || [];
      const [lastFollowTimeGe, lastFollowTimeLe] = lastFollowTime || [];
      return {
        ...(this.mixinSearchConfParams || {}),
        ...searchObj,
        lastContactTimeGe,
        lastContactTimeLe,
        lastFollowTimeGe,
        lastFollowTimeLe,
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
      this.$refs.contactsDialogRef.show(row);
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
          this.mixinkeepTable();
        }
      );
    },
    handleView(row) {
      const { activeName } = this.tabsConfig;
      const idList = this.$refs[`tableRef${activeName}`][0]?.tableData.map(
        (item) => item.id
      );
      this.$router.push({
        path: "/clueManage/clueContactsDetail",
        query: {
          id: row.id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
        },
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>
