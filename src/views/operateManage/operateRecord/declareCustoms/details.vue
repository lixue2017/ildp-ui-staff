<template>
  <div class="proInfo-details">
    <ComDetailTop
      title="报关信息"
      class="title-sides-margin-none"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    />

    <div class="flex-space-between">
      <ComForm
        ref="detailsForm"
        :formConfig="detailFormConfig"
        style="width: 100%"
        v-if="detailFormConfig.lists"
      >
        <template v-slot:exportType="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${
                slotProps.formModel.registerNo ||
                slotProps.formModel.operationOrderNum ||
                '--'
              }`"
              refName="tooltipOver"
              :style="{
                width: 'calc(100% - 170px)',
                flex: 1,
                minWidth: '10px',
              }"
            />
            <span class="tag-green-color">{{
              busTypeFind(slotProps.formModel.busType)
            }}</span>
            <span class="tag-blue-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
          </div>
        </template>
        <template v-slot:shipCompany="slotProps">
          <div class="base-flex-align ellipsis-text">
            <TooltipOver
              :content="`${
                slotProps.formModel.name
                  ? `${slotProps.formModel.shipCompany}[${slotProps.formModel.name}]`
                  : slotProps.formModel.shipCompany || '--'
              }`"
              refName="tooltipOver"
              :style="{
                width: 'calc(100% - 170px)',
                flex: 1,
                minWidth: '10px',
              }"
            />
            <!-- <span class="tag-green-color">{{
              busTypeFind(slotProps.formModel.busType)
            }}</span> -->
            <span class="tag-blue-color">{{
              slotProps.dicsData.nameCn || "--"
            }}</span>
          </div>
        </template>
        <template v-slot:nameAxs="slotProps">
          <span class="tag-blue-color">{{
            slotProps.formModel.busType == 2 ? "拼柜状态" : "操作单状态"
          }}</span>
        </template>
      </ComForm>
      <!--  && detailFormConfig.formModel.status == 0 -->
      <!-- <div v-if="detailFormConfig.formModel.busType == 1">
        <el-button
          type="primary"
          @click="addOrEditEvt"
          size="small"
          icon="el-icon-plus"
        >
          报关
        </el-button>
      </div> -->
    </div>
    <div class="operation-info">
      <div>
        <span class="title">操作单信息</span>
        <span class="subtitle">
          <i class="el-icon-warning-outline"></i
          >报关类型为“客户无单证”所有操作单合并导出箱单发票
        </span>
      </div>
      <div class="operation-btn">
        <template v-for="(item, index) in btnList">
          <el-button
            :class="`operate-icon ${item.info ? 'operate-icon-info' : ''}`"
            size="small"
            type="primary"
            :plain="item.plain === false ? item.plain : true"
            :disabled="!!item.disable"
            :icon="`${item.icon}`"
            @click="item.handleClick()"
            :key="index"
            v-if="!item.hide"
          >
            {{ item.text }}
          </el-button>
        </template>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :tableHeight="providerTable.tableHeight"
      :columnConfig="providerTable.columnConfig"
      :httpRequest="providerTable.httpRequest"
      :getQueryParams="providerTable.getQueryParams"
      :pagination="false"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'operationOrderNum'">
          <span class="primary-text-btn" @click="handleView(slotProps.row)">
            {{ slotProps.row.operationOrderNum }}
          </span>
        </template>
        <template v-if="['declareData'].includes(slotProps.prop)">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="batchDownloadAttach(2, slotProps.row)"
            v-if="slotProps.row.showClearanceCustomer"
          >
            附件下载
          </el-button>
          <span v-else>--</span>
        </template>
        <template v-if="['releaseData'].includes(slotProps.prop)">
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="batchDownloadAttach(5, slotProps.row)"
            v-if="slotProps.row.showClearanceStaff"
          >
            附件下载
          </el-button>
          <span v-else>--</span>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content">
            <div class="btn">
              <div class="btn-list">
                <el-button
                  class="operate-icon"
                  size="small"
                  type="text"
                  @click="handleRelease(slotProps.row)"
                >
                  维护放行资料
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </template>
    </ComTable>
    <ConfirmDialog ref="confirmDialog" />

    <!-- <ComTabs class="custom-tabs-box" :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template v-if="tab.name === '1' && detailFormList.length">
            <template v-for="(desItem, idx) in detailFormList">
              <recordDetail :key="idx" :detailFormModel="desItem" />
            </template>
          </template>
          <template v-if="tab.name === '2'">
            <ComTable
              :ref="`tableRef${tab.name}`"
              :tableHeight="providerTable.tableHeight"
              :columnConfig="providerTable.columnConfig"
              :httpRequest="providerTable.httpRequest"
              :getQueryParams="providerTable.getQueryParams"
              :pagination="false"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'orderStatus'">
                  <div class="operate-status">
                    <span>
                      <i
                        class="status-dot"
                        :style="{
                          backgroundColor: slotProps.dicsList.color,
                        }"
                      ></i>
                      {{ slotProps.dicsList.nameCn }}
                    </span>
                  </div>
                </template>
              </template>
            </ComTable>
          </template>
        </el-tab-pane>
      </template>
    </ComTabs> -->

    <declareCustomsDlg
      ref="declareCustomsDialog"
      @handleSuccess="initRequest"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { BUS_TYPE } from "@/utils/mixin";
import {
  popCusOperationTit,
  popCusOperationContent,
  popCusOperationList,
  getAttachInfoList,
  updateAttachInfo,
  batchDownloadAttach,
} from "@/api/performance/record";
import {
  tableDetailCols,
  detailFormCols,
  maintainReleaseFormCols,
} from "./model";
import recordDetail from "./recordDetail.vue";
import declareCustomsDlg from "./editDeclareDlg.vue";
import { download } from "@/utils/download";

export default {
  components: {
    recordDetail,
    declareCustomsDlg,
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    TooltipOver: () => import("_comp/TooltipOver"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "2",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          // {
          //   label: "报关信息",
          //   name: "1",
          // },
          {
            label: "操作单信息",
            name: "2",
          },
        ],
        btnArr: [],
      },
      formModel: {},
      detailFormList: [],
      detailFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "80px",
        formRules: {},
      },
      providerTable: {
        tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: this.popCusOperationList,
        columnConfig: tableDetailCols,
      },
      btnList: [
        {
          text: "导出箱单发票",
          handleClick: () => this.batchDownloadAttach(1),
          plain: false,
          disable: true,
          hide: true,
          type: 1,
        },
        {
          text: "批量下载报关资料",
          handleClick: () => this.batchDownloadAttach(2),
          type: 2,
        },
        {
          text: "SO No.下载",
          handleClick: () => this.batchDownloadAttach(3),
          type: 3,
        },
        {
          text: "拖车附件下载",
          handleClick: () => this.batchDownloadAttach(4),
          type: 4,
        },
      ],
      attachData: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("declareAtCustoms");
    this.initRequest(false);
  },
  methods: {
    popCusOperationList(params) {
      return popCusOperationList(params).then((res) => {
        const { declareCusList: rows, showButton, idList } = res.data;
        this.btnList[0].disable = !showButton;
        this.btnList[0].hide = !showButton;
        this.idList = idList;
        const orderIds = [];
        const operationOrderIds = [];
        rows.forEach((item) => {
          item.orderId && orderIds.push(item.orderId);
          item.operationOrderId &&
            operationOrderIds.push(item.operationOrderId);
        });
        this.attachData = {
          1: idList,
          2: orderIds,
          3: operationOrderIds,
          4: operationOrderIds,
        };
        return {
          rows,
          total: rows.length,
        };
      });
    },
    initRequest(isTable = true) {
      const { id } = this.$route.query;
      const ids = id?.split("_") || [];
      const opt = {
        id: ids[0],
        busType: ids[1],
      };
      this.$set(this.detailFormConfig, "lists", undefined);
      popCusOperationTit(opt).then((res) => {
        const resData = res.rows[0] || {};
        const data = {
          ...resData,
          busType: resData.busType === null ? ids[1] : resData.busType,
        };

        // 单票/整柜/拼柜 -- 表单渲染列表
        this.$set(this.detailFormConfig, "lists", detailFormCols);
        this.detailFormConfig.formModel = data;

        // 报关信息
        // this.detailFormList = [];
        // popCusOperationContent({
        //   ...opt,
        //   // id: resData.toonId // 操作单id
        // }).then((res) => {
        //   if (res.rows?.length) {
        //     this.detailFormList = res.rows;
        //   } else {
        //     this.detailFormList = [{}];
        //   }
        //   const { shortName, dcNumbers, releaseTime, remark } =
        //     this.detailFormList[0];
        //   this.$refs.detailsForm.setFormModel({
        //     shortName,
        //     dcNumbers,
        //     releaseTime,
        //     remark,
        //   });
        // });
      });
      if (isTable) {
        this.$refs.tableRef.refreshTable();
      }
    },
    batchDownloadAttach(type, row) {
      const params = {
        type,
      };
      if (row) {
        params.idList = type === 2 ? [row.orderId] : [row.operationOrderId];
      } else {
        params.idList = this.attachData[type];
      }
      batchDownloadAttach(params).then((res) => {
        if (res.msg) {
          download(res.msg);
          // this.openUrl(res.msg)
        } else {
          this.$message.info("暂无下载资料");
        }
      });
    },
    openUrl(rows) {
      if (!rows.filePath) return;
      const isOpen = /.jpg|.jpeg|.png|.pdf/.test(rows.suffix);
      if (isOpen) {
        window.open(rows.filePath);
      } else {
        download(rows.filePath, `${rows.name}${rows.suffix}`);
      }
    },
    addOrEditEvt() {
      this.$refs.declareCustomsDialog.show({
        toonId: this.detailFormConfig.formModel?.toonId,
        editDetailsId: true,
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.initRequest(true);
      }
    },
    busTypeFind(val) {
      const obj = BUS_TYPE.find((e) => e.value == val) || {};
      return obj.label || "--";
    },
    getQueryParams() {
      const { id } = this.$route.query;
      const ids = id?.split("_") || [];
      return {
        id: ids[0],
        busType: ids[1],
      };
    },
    handleView(row) {
      const operationRouter = {
        0: "/operateManage/seaTransDetails", // 海运操作单
        1: "/operateManage/airTransDetails", // 空运操作单
        2: "/operateManage/otherDetails", // 其他操作单
      };
      let pathUrl = operationRouter[row.operationOrderType];
      if (row.orderType === 2) {
        pathUrl = "/operateManage/ecOperateDetails";
      }
      this.$router.push({
        path: pathUrl,
        query: {
          id: row.operationOrderId,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleRelease(row) {
      getAttachInfoList({
        id: row.operationOrderId,
        type: 1,
      }).then((res) => {
        this.$refs.confirmDialog.handleFormDialog("customConfirmModel", {
          customFormConfig: maintainReleaseFormCols,
          httpRequest: (formModel) => {
            const {
              id,
              attachId: clearanceAttachId,
              deleteAttachIdList,
            } = formModel;
            return updateAttachInfo({
              id,
              clearanceAttachId,
              deleteAttachIdList,
            });
          },
          successMessage: "提交成功", // 成功提示
          successFunction: () => {
            // this.getCustomsClearance();
          }, // 接口成功回调
          formModel: {
            id: row.operationOrderId,
            attachList: res.data,
            operationOrderNum: row.operationOrderNum,
          },
        });
      });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.proInfo-details {
  height: calc(100vh - 80px);
  padding: 0 20px 32px;
  font-size: 14px;
  color: #515151;
  background-color: #ffffff; //新增标记
  margin: 10px; //新增标记
  .tag-green-color {
    margin-right: 5px;
  }
  .custom-tabs-box {
    padding-top: 29px;
    &::after {
      content: "";
      border-top: 1px solid $divisionBorder;
      position: absolute;
      top: 0;
      left: 0px;
      right: 0px;
    }
    /deep/ .el-tabs__header {
      .el-tabs__nav-scroll {
        padding-bottom: 10px;
      }
      .el-tabs__active-bar {
        background-color: transparent;
      }
      .el-tabs__item {
        padding: 4px 15px;
        font-weight: 500;
        color: $tabBtnTxt;
        line-height: 20px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid $tabBtnBorder;
        margin-right: 12px;
        transition: 0.2s all;
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          border: 1px solid $text-btn-primary;
          color: $text-btn-primary;
        }
        &.is-active {
          border: 1px solid $text-btn-primary;
          color: $text-btn-primary;
        }
      }
    }
  }
  /deep/ .accessory {
    margin: 0 0 20px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 20px;
    .accessory-title {
      margin-top: 0;
    }
  }
  .flex-space-between {
    margin-bottom: 14px;
  }
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .border-right {
      position: relative;
      &::after {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        content: "";
        width: 1px;
        height: 64px;
        background: #e2e2e2;
      }
    }
  }
  .operation-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e2e2e2;
    padding: 20px 0 10px;

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-right: 10px;
    }
    .subtitle {
      font-size: 12px;
      color: #bcbcbc;
      i {
        font-size: 14px;
        margin-right: 2px;
        color: #ff813d;
      }
    }
  }
}
</style>
