<template>
  <div class="proInfo-details" v-if="isInitRes">
    <ComDetailTop
      :title="/*海外详情*/ `${overseaLangObj.qg_customs_clearance('清关信息')}`"
      ref="detailTopRef"
      :formModel="detailFormConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            detailFormConfig.formModel.nlCode
              ? `(${detailFormConfig.formModel.nlCode})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <div class="flex-box">
      <div class="order-left">
        <CustomsHeadCard :infoData="detailFormConfig.formModel" />
        <div class="head-info-box flex-space-between">
          <ComForm
            ref="detailsForm"
            :formConfig="detailFormConfig"
            style="width: 100%"
          >
            <template v-slot:aimCountry="slotProps">
              <div class="base-flex-align ellipsis-text">
                <TooltipOver
                  :content="`${slotProps.formModel.countryName || '--'}`"
                  refName="tooltipOver"
                  :style="{
                    width: 'calc(100% - 150px)',
                    flex: 1,
                    minWidth: '10px',
                  }"
                />
                <span class="tag-blue-color">{{
                  slotProps.formModel.type === 2 ? "拼柜" : "整柜"
                }}</span>
                <span class="tag-green-color clearance-type"
                  >{{
                    CLEARANCE_TYPE[slotProps.formModel.operationOrderType] ||
                    "--"
                  }}{{
                    CLEARANCE_BUSINESS_TYPE[
                      slotProps.formModel.orderBusinessType
                    ] || "--"
                  }}</span
                >
              </div>
            </template>
            <template v-slot:nameAxs="slotProps">
              <div class="flex">
                <span>{{
                  slotProps.formModel.nameAxs || "已离港 海运 堡森承接"
                }}</span>
              </div>
            </template>
          </ComForm>
        </div>

        <ComTabs class="details-tabs-btn" :tabsConfig="tabsConfig">
          <template v-for="tab in tabsConfig.tabs">
            <el-tab-pane
              :label="tab.label"
              :name="tab.name"
              :key="tab.name"
              v-if="
                tab.name !== '3' || detailFormConfig.formModel.freightType === 0
              "
            >
              <template v-if="tab.name === '1'">
                <!-- <detailInfo :detailFormModel="detailFormConfig.formModel" /> -->
              </template>

              <template
                v-if="tab.name === '2' && tabsConfig.activeName === tab.name"
              >
                <div class="tabName2">
                  <el-button
                    v-for="(btn, btnIndex) in getTagsBtnList(tab.name)"
                    :key="btnIndex"
                    :type="btn.type"
                    :size="btn.size"
                    :round="btn.round || false"
                    @click="btn.handleClick"
                    >{{ btn.table }}</el-button
                  >
                </div>
                <div>
                  <ComTable
                    :ref="`tableRef${tab.name}`"
                    :tableHeight="providerTable.tableHeight"
                    :columnConfig="tableDetailConfCols()"
                    :httpRequest="providerTable.httpRequest"
                    :getQueryParams="getTableQueryParams"
                    :paginationConfig="{ limit: 999 }"
                    :pagination="false"
                  >
                    <template v-slot:customRow="{ slotProps }">
                      <template v-if="slotProps.prop === 'indexSlot'">
                        <span>{{
                          slotProps.row.index || ''
                        }}</span>
                      </template>
                      <template v-if="slotProps.prop === 'xdfp'">
                        <PreviewOrDownload
                          btnTxt="资料下载"
                          :previewDownloadConf="
                            previewDownloadConfig(
                              slotProps.row.orderOperationId
                            )
                          "
                        />
                      </template>
                      <template v-if="slotProps.prop === 'hblzl'">
                        <PreviewOrDownload
                          btnTxt="资料下载"
                          :previewDownloadConf="
                            previewHBLDownloadConfig(slotProps.row)
                          "
                        />
                      </template>
                      <template v-if="slotProps.prop === 'operation'">
                        <span v-if="slotProps.row.isCheck">--</span>
                        <el-button
                          v-else
                          size="small"
                          type="text"
                          class="operate-icon"
                          @click="handleBtnClick(slotProps.row)"
                          >查验登记</el-button
                        >
                      </template>
                    </template>
                  </ComTable>
                </div>
              </template>

              <template
                v-if="tab.name === '3' && tabsConfig.activeName === tab.name"
              >
                <operateTrailerInfo
                  :trailer-mode-type="1"
                  :operateId="detailFormConfig.formModel.joinOrderId"
                />
              </template>

              <template
                v-if="tab.name === '4' && tabsConfig.activeName === tab.name"
              >
                <CustomsCostBill
                  :formModel="{
                    ...detailFormConfig.formModel,
                    customerId: detailFormConfig.formModel.bailorPeopleId,
                    ISPROFITSLOT:true
                  }"
                />
              </template>

              <template
                v-if="tab.name === '5' && tabsConfig.activeName === tab.name"
              >
                <OverseaGoodsTable
                  :goodsObj="{
                    id: detailFormConfig.formModel.joinOrderId,
                    viewHwSource: '1',
                  }"
                />
                <ExamineInfo
                  :formData="{
                    id: detailFormConfig.formModel.id,
                    operationId: detailFormConfig.formModel.joinOrderId,
                  }"
                />
              </template>

              <template
                v-if="tab.name === '6' && tabsConfig.activeName === tab.name"
              >
                <ComLogistTrack
                  :activities="{
                    title: overseaLangObj.logistics_trajectory || '物流轨迹',
                    id: detailFormConfig.formModel.joinOrderId,
                    operationOrderNum:
                      detailFormConfig.formModel.operationOrderNo,
                  }"
                  :orderSourceObj="{
                    trackSource: 'clearanceDetails',
                    requestKey: 'clearance',
                  }"
                  isNoDrawer
                />
              </template>
              <template
                v-if="tab.name === '7' && tabsConfig.activeName === tab.name"
              >
                <FileUploadTable
                  :uploadTableConfig="{
                    isGetUploadFileTypes: true,
                    ...handleFileRequestCollection(),
                  }"
                  :uploadFileTableConfig="{
                    noLengthHide: false,
                  }"
                />
              </template>
              <template
                v-if="tab.name === '8' && tabsConfig.activeName === tab.name"
              >
                <StorageDelivery
                  :dispatchObj="{
                    psId: detailFormConfig.formModel.joinOrderId,
                    searchRelatedOrder: true,
                    psType: 1, // 国内
                    viewSource: 'clearanceTab',
                  }"
                />
              </template>
              <template
                v-if="tab.name === '9' && tabsConfig.activeName === tab.name"
              >
                <ecClearanceTable
                  :formData="{
                    ...detailFormConfig.formModel,
                    id: detailFormConfig.formModel.joinOrderId,
                    customsClearanceStatus: detailFormConfig.formModel.status,
                    viewSource: 'hw_clearance_tab', // 海外
                  }"
                  source
                />
              </template>
            </el-tab-pane>
          </template>
        </ComTabs>
      </div>

      <div>
        <CustomsSideOperationBar
          :formData="detailFormConfig.formModel"
          @handleRegistration="handleEdit"
          @handleSuccess="initRequest"
          @devanningWarehousing="devanningWarehousing"
        />
      </div>
    </div>

    <editDialogForm ref="dialogFormRef" @handleSuccess="initRequest" />

    <!-- <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtn">
          <el-button
            v-if="
              btn.isAllBtn ||
              btn.statusArr.includes(detailFormConfig.formModel.status)
            "
            @click="btn.handleClick"
            :key="`f_${index}`"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { formatDate, duplicateRemoval } from "@/utils/index.js";
import { comFileDownload } from "@/utils/download.js";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { tableDetailCols, detailFromCols } from "./model";
import detailInfo from "./components/detailInfo.vue";
import editDialogForm from "./editDialog.vue";
import { uploadAttach } from "@/api/operateRecord/customsClearance";
import {
  CLEARANCE_TYPE,
  CLEARANCE_BUSINESS_TYPE,
  CLEARANCE_FREIGHT_TYPE,
} from "../components/recordModel";
import {
  popClearanceInfoList,
  popClearanceDetail,
  popBillClearanceDetail,
  batchExportZipDownload,
  previewDownloadHblList,
  POSTClearanceUmaExport,
  POSTClearancePvaExport,
  batchExportZipDownloadEC,
  delClearanceAccessory,
} from "@/api/performance/record";
import overseaLangObj from "@/language/overseasLang.js";
import { exportClearanceInvoice } from "@/api/operateRecord/clearanceGoods.js";

export default {
  name: "CustomsClearanceInfo",
  mixins: [mixinEditCache],
  components: {
    detailInfo,
    editDialogForm,
    CustomsHeadCard: () => import("./components/headCard.vue"),
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
    operateTrailerInfo: () =>
      import("@/views/operateManage/components/TrailerInfo/index.vue"), // 拖车信息
    CustomsCostBill: () =>
      import("_comp/CostInfo/billings/customsClearanceBill"),
    // DispatchInfo: () =>
    //   import(
    //     "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/dispatchInfo/dispatch.vue"
    //   ),
    OverseaGoodsTable: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/overseaGoods/index.vue"
      ),
    StorageDelivery: () =>
      import(
        "@/views/warehouseManage/predictionManage/inStorage/detailsTabInfo/storage/delivery.vue"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    CustomsSideOperationBar: () =>
      import("_comp/ComOperate/views/CustomsSideBar.vue"),
    ExamineInfo: () =>
      import(
        "@/views/overseasBusiness/components/TabTable/components/ExamineInfo.vue"
      ),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
    ecClearanceTable: () =>
      import(
        "@/views/operateManage/operateRecord/components/ClearanceDetial/ecClearanceTable"
      ), // 清关信息
  },
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    return {
      overseaLangObj,
      CLEARANCE_TYPE,
      CLEARANCE_BUSINESS_TYPE,
      CLEARANCE_FREIGHT_TYPE,
      tabsConfig: {
        activeName: "5",
        slotTabs: true,
        handleTabsClick: () => {
          // const bArr = this.tabBtnArr[this.tabsConfig.activeName];
          // const bArr = this.tabsConfig.activeName === "2" ? this.tabBtnArr : [];
          // this.$set(this.tabsConfig, "btnArr", bArr);
        },
        tabs: [
          // {
          //   label: "清关信息",
          //   name: "1",
          // },
          {
            label: overseaLangObj.cargo_details || "货物信息",
            name: "5",
          },
          {
            label: overseaLangObj.cc_ps || "存仓派送",
            name: "8",
          },
          {
            label: overseaLangObj.qg_customs_clearance("交接信息"),
            name: "2",
          },
          {
            label: overseaLangObj.trailer_info || "拖车信息",
            name: "3",
          },
          {
            label: overseaLangObj.receivable_payable || "应收应付",
            name: "4",
          },
          {
            label: overseaLangObj.qg_customs_clearance("清关信息"),
            name: "9",
          },
          {
            label: overseaLangObj.fj_attachment || "附件信息",
            name: "7",
          },
          {
            label: overseaLangObj.logistics_trajectory || "物流轨迹",
            name: "6",
          },
        ],
        // btnArr: [
        //   {
        //     table: "修 改",
        //     handleClick: this.handleEdit,
        //   },
        // ],
      },
      tabBtnArr: {
        1: [
          // {
          //   table: "修 改",
          //   handleClick: this.handleEdit,
          // },
        ],
        2: [
          {
            table: "UMA导出",
            type: "primary",
            size: "small",
            round: true,
            showOrderType: [2],
            showFreightType: [0],
            showIsmainBill: [1],
            handleClick: () =>
              this.handleUmaPvaExport({ httpRequest: POSTClearanceUmaExport }),
          },
          {
            table: "PVA导出",
            type: "primary",
            size: "small",
            round: true,
            showOrderType: [2],
            showFreightType: [0],
            showIsmainBill: [1],
            handleClick: () =>
              this.handleUmaPvaExport({ httpRequest: POSTClearancePvaExport }),
          },
          {
            table: overseaLangObj.xd_batch_download || "箱单信息 批量下载",
            type: "text",
            size: "small",
            handleClick: () => this.handleBtnDownload(-1),
          },
          {
            table: overseaLangObj.hbl_batch_download || "HBL资料 批量下载",
            type: "text",
            size: "small",
            handleClick: () => this.handleBtnDownload(0),
          },
          // {
          //   table: "MBL资料 下载",
          //   type: "text",
          //   handleClick: () => this.handleBtnDownload(1),
          // },
        ],
      },
      formModel: {},
      detailFormConfig: {
        formModel: {},
        labelWidth: overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: detailFromCols(0), // 表单渲染列表
      },
      providerTable: {
        tableHeight: "calc(100vh - 324px)",
        httpRequest: popClearanceInfoList,
      },
      // footBtn: [
      //   {
      //     text: "清关登记",
      //     statusArr: [0],
      //     handleClick: this.handleEdit,
      //   },
      //   {
      //     text: "关闭",
      //     isAllBtn: true,
      //     handleClick: () => {
      //       this.$refs.detailTopRef?.comReBack();
      //     },
      //   },
      // ],
      isInitRes: false,
      // attIds: [],
    };
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance");
  },
  // beforeRouteEnter(to, from, next) {
  //   if (to.query?.isSourceBill == 1) {
  //     // 对账单跳转获取操作单ID后再进入页面
  //     popBillClearanceDetail(to.query.id).then((res) => {
  //       next({
  //         path: to.path,
  //         query: {
  //           ...to.query,
  //           isSourceBill: undefined,
  //           id: res.data?.joinOrderId,
  //         },
  //       });
  //     });
  //   } else {
  //     next();
  //   }
  // },
  methods: {
    mixinInitData() {
      this.initRequest();
    },
    async initRequest() {
      this.isInitRes = false;
      const { id } = this.$route.query;
      const { data } = await popBillClearanceDetail(id);
      this.detailFormConfig.formModel = data || {};
      // this.attIds = data.attachId;
      this.isInitRes = true;
    },
    handleBtnDownload(type) {
      const operationIds = this.$refs[`tableRef${2}`][0]?.tableData.map(
        (e) => e.orderOperationId
      );
      if (!operationIds.length) {
        this.msgError("没有可下载文件");
        return false;
      }
      this.downloadBtnClick(duplicateRemoval(operationIds).join(","), type);
    },
    // 箱单发票参数与接口
    previewDownloadConfig(oId) {
      return {
        previewParam: {
          importType: 4,
          operationOrderId: oId,
          operationOrderIdList: [oId],
        },
        previewHttp: exportClearanceInvoice,
      };
    },
    previewHBLDownloadConfig(row) {
      return {
        previewParam: {
          type: 1,
          idList: [row.orderOperationId],
          importType: 4,
          orderType: row.orderType,
          fileExportType: 1, // 1-单个
        },
        previewHttp: previewDownloadHblList,
      };
    },
    downloadBtnClick(oIds, type) {
      const params = {
        idList: this.typeConversion(oIds).split(","),
        type: 1,
        importType: 4,
      };
      if (type === -1) {
        // 箱单发票
        comFileDownload(this, batchExportZipDownloadEC, params);
      } else {
        const { orderType } = this.detailFormConfig.formModel;
        comFileDownload(this, previewDownloadHblList, {
          ...params,
          orderType,
          fileExportType: 2, // 批量
        });
      }
    },
    handleBtnClick(row = {}) {
      this.$refs.dialogFormRef?.show({
        id: row.id,
        checkStartTime: formatDate(new Date(), "/"), // 默认当天
        type_num: 5,
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.initRequest();
      }
    },
    handleFileRequestCollection() {
      const { id, attachId, orderType, canUploadFile } =
        this.detailFormConfig.formModel;
      return {
        onGetFileType: orderType==2?"QGGL":'CTQGGL',
        attachId,
        // webEditUpload: !!canUploadFile,
        attachParams: {
          opId: this.detailFormConfig.formModel.joinOrderId,
        },
        httpSaveFileRequest: ({ attachAllList }) => {
          return uploadAttach({
            attachIds: attachAllList,
            id,
            updateSource: 1,
          }).then(() => {
            this.detailFormConfig.formModel.attachId = attachAllList.join(",");
          });
        },
        isDelGetAttachList: true,
        httpDelFileRequest: ({ deleteAttachIdList, attachAllList }) => {
          return delClearanceAccessory(deleteAttachIdList.join(",")).then(
            () => {
              this.detailFormConfig.formModel.attachId =
                attachAllList.join(",");
            }
          );
        },
      };
    },
    getTableQueryParams() {
      const { id } = this.detailFormConfig.formModel;
      return {
        clearanceId: id,
      };
    },
    handleEdit() {
      const params = {
        operationOrderId: this.detailFormConfig.formModel.joinOrderId,
        type_num: 0, //0是打开编辑弹窗
      };
      this.$refs.dialogFormRef?.show(params);
    },
    tableDetailConfCols() {
      const { orderType } = this.detailFormConfig.formModel;
      return tableDetailCols(orderType);
    },
    devanningWarehousing(btn) {
      const {
        joinOrderId: operationOrderId,
        nlCode,
        operationOrderNo: operationOrderNum,
        bailorPeopleName,
        operationMainName,
        businessNnitName,
      } = this.detailFormConfig.formModel;
      this.$refs.dialogFormRef?.show({
        packingMethod: btn.packingMethod,
        operationOrderId,
        nlCode,
        operationOrderNum,
        bailorPeopleName,
        operationMainName,
        businessNnitName,
        type_num: 1,
      });
    },
    getTagsBtnList(tName) {
      const { freightType, orderType, isMainBill } =
        this.detailFormConfig.formModel;
      const btnList = this.tabBtnArr[tName].filter((e) => {
        const { showOrderType, showFreightType, showIsmainBill } = e;
        if (showIsmainBill) {
          return (
            (showOrderType.includes(orderType) &&
              showFreightType.includes(freightType)) ||
            showIsmainBill.includes(isMainBill)
          );
        } else {
          return showOrderType ? showOrderType.includes(orderType) : true;
        }
      });
      return btnList;
    },
    handleUmaPvaExport(row = {}) {
      const { httpRequest } = row;
      const { activeName } = this.tabsConfig;
      const tableData =
        this.$refs[`tableRef${activeName}`][0]?.getNewTableData();
      const idList = tableData.map((e) => {
        return e.orderOperationId;
      });
      if (!idList.length) {
        this.msgError("没有可下载文件");
        return false;
      }
      comFileDownload(this, httpRequest, { idList });
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.proInfo-details {
  // padding: 24px 0 24px 24px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff; //新增标记
  margin: 10px; //新增标记
  .flex-box {
    padding-left: 14px;
    display: flex;
    .order-left {
      min-width: 800px;
      flex: 0 1 100%;
      padding-right: 46px;
      padding-bottom: 20px;
    }
  }
  .head-info-box {
    margin-top: 15px;
  }
  .head-info-box,
  .details-tabs-btn {
    /deep/ .el-form-item--small.el-form-item {
      margin-bottom: 2px;
    }
    /deep/.el-tabs__header {
      padding: 0;
      position: relative;
      margin: 0px 0px;
    }
  }
  .details-tabs-btn {
    &::after {
      content: "";
      // border-top: 1px solid $divisionBorder;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    /deep/ .tabs-right-btn {
      top: 15px;
    }
    /deep/ .el-tabs__header {
      .el-tabs__nav-scroll {
        padding: 14px 0px;
      }
      .el-tabs__active-bar {
        background-color: transparent;
      }
      .el-tabs__item {
        padding: 4px 15px;
        // font-weight: 500;
        // color: $tabBtnTxt;
        line-height: 20px;
        font-size: 14px;
        border-radius: 2px;
        // border: 1px solid $tabBtnBorder;
        margin-right: 12px;
        transition: 0.2s all;
        &:last-child {
          margin-right: 0;
        }
        // &:hover {
        //   border: 1px solid $text-btn-primary;
        //   color: $text-btn-primary;
        // }
        // &.is-active {
        //   border: 1px solid $text-btn-primary;
        //   color: $text-btn-primary;
        // }
      }
    }
    .tabName2 {
      margin: 10px 0px;
      text-align: right;
    }
  }
  .com-detail-top {
    margin-bottom: 15px;
  }
  .clearance-type {
    margin: 0 5px;
  }
}
</style>
