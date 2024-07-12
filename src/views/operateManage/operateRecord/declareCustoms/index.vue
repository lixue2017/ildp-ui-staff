<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="providerTable.tableHeight"
              :columnConfig="providerTable.columnConfig"
              :httpRequest="providerTable.httpRequest"
              :getQueryParams="providerTable.getQueryParams"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'code'">
                  <div
                    class="display-flex"
                    @click="handleDetails(slotProps.row)"
                  >
                    <span class="primary-text-btn ellipsis-text">
                      {{ slotProps.row.code || "--" }}
                    </span>
                  </div>
                </template>

                <template v-if="slotProps.prop === 'exportType'">
                  {{
                    (slotProps.dicsList && slotProps.dicsList.nameCn) || "--"
                  }}
                </template>

                <!-- <template v-if="slotProps.prop === 'status'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList.nameCn }}
                  </span>
                </template> -->
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content">
                    <div
                      class="btn"
                      v-if="getStatusBtnList(slotProps.row).length"
                    >
                      <div
                        class="btn-list"
                        v-for="(item, index) in getStatusBtnList(slotProps.row)"
                        :key="index"
                      >
                        <el-button
                          :class="`operate-icon ${
                            item.info ? 'operate-icon-info' : ''
                          }`"
                          size="small"
                          type="text"
                          :icon="`${item.icon}`"
                          @click="item.handleClick(slotProps.row)"
                        >
                          {{ item.text }}
                        </el-button>
                      </div>
                      <!-- <div
                       v-else
                      class="btn-list"
                      v-for="(item, index) in customerTable.statusBtnList"
                      :key="index"
                    >
                      <template v-if="slotProps.row.status === item.btnId">
                        <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="small"
                        type="text"
                        :icon="`${item.icon}`"
                        @click="item.handleClick(slotProps.row)"
                        >
                        {{ item.text }}
                        </el-button>
                      </template>
                    </div> -->
                    </div>
                    <div v-else>--</div>
                  </div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <declareCustomsDlg
      ref="declareCustomsDialog"
      @handleSuccess="mixinkeepTable"
    />
    <examineFormConfig ref="examineFormRef" />
    <recordTableDialog
      ref="recordTableDig"
      @confirmBusiness="confirmBusinessEvt"
    />
  </div>
</template>

<script>
import {
  getPopCusList,
  popCusUpdateStatus,
  delPopCus,
} from "@/api/performance/record";
import { mapActions, mapState } from "vuex";
import { DATA_STATUS } from "@/utils/mixin.js";
import { formatDate } from "@/utils/index.js";
import { msgBox } from "@/utils/confirmBox.js";
import recordTableDialog from "./recordTableDialog.vue";
import declareCustomsDlg from "./editDeclareDlg.vue";
import examineFormConfig from "./examineFormConfig.vue";
import { searchColumns, tableColumns } from "./model";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  name: "DeclareCustoms",
  mixins: [mixinColsConf],
  components: {
    recordTableDialog,
    declareCustomsDlg,
    examineFormConfig,
    ComDialog: () => import("_comp/ComDialog"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      status: DATA_STATUS,
      WEIGHTCOUNTER: [],
      CHANNELGROUP: [],
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "报关信息",
            name: "1",
          },
        ],
        // btnArr: [
        //   {
        //     table: "新增",
        //     handleClick: () =>
        //       this.addOrEditEvt({
        //         btnDictionaryType: 1,
        //       }),
        //   },
        // ],
      },
      customerTable: {
        tableHeight: "calc(100vh - 324px)",
        statusBtnList: [
          {
            btnId: [0],
            text: "报关申报",
            handleClick: (row) => this.addOrEditEvt(row, false, "报关申报"),
          },
          {
            btnId: [1],
            text: "报关放行",
            handleClick: (row) => this.addOrEditEvt(row, true, "报关放行"),
          },
          {
            btnId: [1, 2],
            text: "修改",
            handleClick: (row) => this.addOrEditEvt(row, false, "报关信息"),
          },
          {
            btnId: [],
            text: "删除",
            info: true,
            handleClick: this.handleDelete,
          },
          {
            btnId: [],
            text: "审核查验",
            handleClick: this.handleExamine,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getTableList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "90px",
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
      providerTable: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getPopCusList,
        columnConfig: tableColumns,
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("declareAtCustoms").then(() => {
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    submitSuccess() {
      this.$confirm("当前报关流程已完结", "提示", {
        confirmButtonText: "关闭",
        showCancelButton: false,
        type: "success",
        showClose: false,
      }).then(() => {
        this.mixinkeepTable();
      });
    },
    getTableList(searchFrom = {}) {
      const { createTime, declareDate, stateList, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        beginTime: createTime ? `${createTime[0]}@${createTime[1]}` : undefined,
        declareDate: declareDate
          ? `${declareDate[0]}@${declareDate[1]}`
          : undefined,
        stateList: stateList?.length ? stateList.join(",") : undefined,
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { stateList } = this.searchFromData;
      Array.isArray(stateList) &&
        (this.searchFromData.stateList = stateList.join(","));
      return this.searchFromData;
    },
    // 新增/编辑
    addOrEditEvt(row = {}, isRelease, title) {
      if (row.id) {
        this.$refs.declareCustomsDialog.show(
          {
            ...row,
            status: isRelease ? 2 : row.status || 1,
            exportType: row.exportType + "",
          },
          isRelease,
          title
        );
      } else {
        this.$refs.recordTableDig._recordDigShow();
      }
    },
    declareEvt(row) {
      const opt = {
        id: row.id,
        operationOrderId: row.operationOrderId, // 操作单ID
        status: 2,
      };
      popCusUpdateStatus(opt).then((res) => {
        this.submitSuccess();
      });
    },
    getStatusBtnList(row) {
      let btnArr = this.customerTable.statusBtnList.filter((e) =>
        e.btnId.includes(row.status)
      );
      return btnArr;
    },
    handleRecordDig() {
      this.$refs.recordTableDig._recordDigShow();
    },
    confirmBusinessEvt(row = {}) {
      // console.log('confirmBusinessEvt==', row)
      const { id, sortBoxId } = row;
      this.$refs.declareCustomsDialog.show({
        toonId: id,
        sortBoxId,
        editDetailsId: true,
      });
    },
    handleExamine(row) {
      this.$refs.examineFormRef.examineEvt(row, {
        examineSuccess: () => {
          // 审核查验成功
          this.mixinkeepTable();
        },
      });
    },
    handleDelete(row) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delPopCus(row.id).then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.mixinkeepTable();
        });
      });
    },
    handleDetails(row = {}) {
      const idList = this.$refs[
        `tableRef${+this.tabsConfig.activeName}`
      ][0].tableData.map((e) => `${e.id}_${e.busType}`);
      this.$router.push({
        path: "/operateManage/operateRecord/declareCustomsDetails",
        query: {
          id: `${row.id}_${row.busType}`, // 与详情的上下页对应
          backPath: this.$route.path,
          pageSign: idList.join(","),
        },
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation-content {
  .btn {
    display: flex;

    .operate-icon {
      display: flex;
      align-items: center;
      margin-right: 14px;

      &.operate-icon-info {
        color: #606060;
      }

      /deep/ span {
        font-size: 12px;
      }
    }
  }
}
.dialog-form {
  padding-right: 30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}

.trailer-file {
  .trailer-title {
    font-size: 16px;
    font-weight: 500;
    color: #1f1f1f;
  }
  .trailer-tips {
    color: #bcbcbc;
    font-size: 14px;
    margin-bottom: 10px;
  }
}
</style>
