<template>
  <div class="order-edit">
    <div class="order-content">
      <ComDetailTop
        :title="/*国内详情*/ `${
          pageSource === 'tradition_customs' ? '传统' : '电商'
        }清关交接详情`"
        :formModel="formConfig.formModel"
        ref="detailTopRef"
        class="margin-right-32"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              formConfig.formModel.operateShortName
                ? `(${formConfig.formModel.operateShortName})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
      <div class="flex" v-if="isInitRes">
        <div class="customsClearance-form">
          <ComForm class="order-from" :formConfig="formConfig" ref="myFormRef">
            <!-- <template v-slot:bailorPeople="slotProps">
              <div class="bailorPeople-class">
                <div>{{ slotProps.formModel.bailorPeople }}</div>
                <div>
									<span class="tag-blue-color ml5">{{ slotProps.dicsData.nameCn }}</span>
									<span class="tag-green-color ml5"
										v-if="getDictObj(tradeClause, slotProps.formModel.tradeClause)">
										{{ getDictObj(tradeClause, slotProps.formModel.tradeClause) }}
									</span>
                </div>
              </div>
            </template>
            <template v-slot:shipCompany="slotProps">
              <div class="shipCompany-class">
                <div>{{ slotProps.formModel.shipCompany }}</div>
                <div>
									<span class="tag-green-color ml5">{{ ["海运",  "空运"][slotProps.formModel.operationOrderType] }}</span>
                </div>
              </div>
            </template> -->
          </ComForm>
        </div>
        <div class="customsClearance-table">
          <template>
            <div class="custom-tabs-btn base-flex-between">
              <div>
                <template v-for="tItem in tabsConfig.columns">
                  <el-button
                    size="small"
                    plain
                    :key="tItem.key"
                    @click="changeTabs(tItem.key)"
                    :type="tItem.key === tabsConfig.active ? 'activation' : ''"
                    >{{
                      formConfig.formModel.orderType !== 2 && tItem.key === 1
                        ? "操作单信息"
                        : tItem.label
                    }}</el-button
                  >
                </template>
              </div>
              <div
                class="operation base-flex-between"
                v-if="
                  formConfig.formModel.orderType !== 2 &&
                  tabsConfig.active === 1
                "
              >
                <div
                  class="btn"
                  v-for="(item, index) in operationBtn"
                  :key="index"
                >
                  <span
                    @click="item.handleClick(formConfig.formModel)"
                    v-if="
                      item.showStatus.includes(formConfig.formModel.orderType)
                    "
                    >{{ item.text }}</span
                  >
                </div>
              </div>
            </div>
          </template>
          <div v-show="tabsConfig.active === 1">
            <!-- <ComForm
              class="order-from"
              :formConfig="formTableConfig"
              ref="formTableConfigRef"
            >
            </ComForm> -->
            <template>
              <template v-if="formConfig.formModel.orderType === 2">
                <ecClearanceTable
                  :formData="{
                    ...formConfig.formModel,
                    viewSource: 'gn_shjj_clearance',
                  }"
                  @handleMaintainAddress="handleMaintainAddress"
                />
              </template>
              <ComTable
                v-else
                ref="tableRef"
                :columnConfig="tableConfig.columnConfig"
                :columnData="tableConfig.columnData"
                :rowOperationBtnListFn="(r) => tableStatusList(r)"
              >
                <template v-slot:customRow="{ slotProps }">
                  <!-- <template v-if="slotProps.prop === 'UNCHARTED_TABLE_12'">
                      <PreviewOrDownload
                        btnTxt="资料下载"
                        :previewDownloadConf="
                          previewDownloadConfig(slotProps.row.operationOrderId)
                        "
                      />
                    </template> -->
                  <template v-if="slotProps.prop === 'UNCHARTED_TABLE_13'">
                    <PreviewOrDownload
                      btnTxt="资料下载"
                      :previewDownloadConf="
                        previewDownloadConfig(
                          slotProps.row.operationOrderId,
                          'HBL'
                        )
                      "
                    />
                  </template>
                </template>
              </ComTable>
            </template>
            <FileUploadTable
              :uploadTableConfig="{
                isAttachIdGetList: false,
                isGetUploadFileTypes: true,
                ...handleFileRequestCollection(),
              }"
              :uploadFileTableConfig="{
                noLengthHide: false,
              }"
            />
          </div>

          <template v-if="tabsConfig.active === 2">
            <OperationRecords
              :params="{
                operationOrderId: formConfig.formModel.id,
              }"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="order-footer" v-if="isInitRes">
      <template v-for="(btn, index) in footerBtnList()">
        <el-button
          :type="btn.type"
          @click="btn.handleClick(formConfig.formModel)"
          :key="index"
        >
          {{ btn.textRender ? btn.textRender(formConfig.formModel) : btn.text }}
        </el-button>
      </template>
    </div>
    <ConnectDialog ref="ConnectDialog" @handleSuccess="() => getDetails()" />
    <RemarkDrawer ref="drawerRef" @handleSuccess="() => getDetails()" />
    <!-- operationType 1:客户端  2：操作单 3：清关 4：国内仓库 -->
    <MaintainGoods
      ref="MaintainGoods"
      @handleChange="() => getDetails()"
      :basicData="basicData"
      :operationType="3"
    />

    <MaintainAddressDialog ref="addressDlgRef" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import {
  detailFormCols,
  // customsClearanceTable,
  tableColumns,
} from "./model.js";
import {
  getPopClearanceInfoList,
  batchExportZipDownload,
  previewDownloadHblList,
} from "@/api/performance/record.js";
import { getOrderAttachList } from "@/api/common";
import { comFileDownload } from "@/utils/download.js";
import {
  clearanceAccessory,
  delClearanceAccessory,
} from "@/api/performance/record.js";
import { getBillDetailPreview } from "@/api/operateRecord/BOLManage.js";
export default {
  props: {
    pageSource: {
      type: String,
      default: () => "ec_customs", // 默认电商
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ConnectDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/index.vue"
      ),
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    MaintainGoods: () =>
      import("@/views/operateManage/components/MaintainGoods"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
    MaintainAddressDialog: () => import("./maintainAddress"),
    ecClearanceTable: () => import("./ecClearanceTable"),
    OperationRecords: () => import("./OperationRecords/index.vue"),
  },
  computed: {
    ...mapState({
      tradeClause: (state) => state.dictionary.dicsData.tradeClause,
    }),
  },
  data() {
    return {
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "清关信息",
            key: 1,
          },
          {
            label: "操作记录",
            key: 2,
          },
        ],
      },
      formConfig: {
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "98px",
        formRules: {}, // 表单校验规则
        isAttachFileId: true,
      },
      // formTableConfig: {
      //   formModel: {},
      //   httpRequest: this.addCustomer, // 表单提交接口
      //   successFunction: this.handleSuccess, // 表单提交成功回调
      //   size: "small",
      //   labelWidth: "98px",
      //   formRules: {}, // 表单校验规则
      //   isAttachFileId: true,
      // },
      tableConfig: {
        columnData: [],
      },
      operationBtn: [
        // {
        //   text: "箱单发票 批量下载",
        //   showStatus: [2],
        //   handleClick: (row) => this.packHblDownload(row.declareCusSingle),
        // },
        {
          text: "HBL资料 批量下载",
          showStatus: [2, 3, 4], //2电商，3海运 4空运
          handleClick: (row) =>
            this.packHblDownload(row.declareCusSingle, "HBL"),
        },
      ],
      tableBtnList: [
        {
          text: "维护货物信息",
          btnShowType: "1",
          handleClick: (row) => this.handleMaintainGoods(row),
        },
        {
          text: "维护地址",
          btnShowType: "2",
          handleClick: (row) => this.handleMaintainAddress(row),
        },
      ],
      statusList: [
        // {
        //   text: "审核交接",
        //   showStatus: [0],
        //   handleClick: (row) => {
        //     this.handleHandover(row, "examineFormLists");
        //   },
        // },
        {
          textRender: (r) =>
            r.orderType == 2
              ? `${["一", "二"][r.customsClearanceStatus || 0]}审交接`
              : "清关交接",
          showStatus: [0, 1],
          handleClick: (row) => {
            this.handleHandover(row);
          },
        },
        {
          text: "交接备注记录",
          showRemarkStatus: [1, 2],
          handleClick: (row) => {
            this.handleDrawer(row);
          },
        },
        {
          text: "关闭",
          isBtnAll: true,
          handleClick: this.reBack,
        },
      ],
      isInitRes: false,
      basicData: {},
    };
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then(() => {
      this.getDetails();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getDetails() {
      const { id } = this.$route.query;
      this.isInitRes = false;
      const params = {
        operationOrderId: id,
      };
      getPopClearanceInfoList(params).then((res) => {
        const { orderType, declareCusSingle } = res.data;
        this.tableConfig = {
          ...this.tableConfig,
          columnConfig: tableColumns(orderType),
        };
        // this.formTableConfig = {
        //   ...this.formTableConfig,
        //   formModel: {
        //     attachList,
        //   },
        //   lists: customsClearanceTable().lists, // 表单渲染列表
        // };
        this.formConfig = {
          ...this.formConfig,
          formModel: {
            ...res.data,
          },
          lists: detailFormCols({ orderType }),
        };
        this.tableConfig.columnData = declareCusSingle || [];
        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails();
      }
    },
    handleHandover(row) {
      //交接
      this.$refs.ConnectDialog?.show(row);
    },
    handleDrawer(row) {
      //审核备注记录
      const { viewPage } = this.$route.query;
      if (["second_instance", "second"].includes(viewPage)) {
        row.pageRemarkNameKey = "GNQGESBZ";
      }
      this.$refs.drawerRef?.show(row);
    },
    /** 箱单发票/HBL资料 预览与下载 */
    previewDownloadConfig(oId, btnType) {
      if (btnType == "HBL") {
        const { id } = this.formConfig.formModel;
        const params = {
          operationOrderId: id,
          type: 0,
          tdisType: 2,
        };
        return { previewParam: params, previewHttp: getBillDetailPreview };
      } else {
        // const params = {
        //   type: 1,
        //   idList: this.typeConversion(oId).split(","),
        // };
        // return { previewParam: params, previewHttp: batchExportZipDownload };
      }
    },
    /** 批量下载 */
    packHblDownload(oIds, btnType) {
      // const downloadZipHttp =
      //   btnType === "HBL" ? previewDownloadHblList : batchExportZipDownload;
      const { orderType } = this.formConfig.formModel;
      comFileDownload(this, previewDownloadHblList, {
        type: 1,
        orderType,
        fileExportType: 2, // 批量
        idList: oIds.map((item) => item.operationOrderId),
      });
    },
    handleFileRequestCollection() {
      const { id, orderType } = this.formConfig.formModel;
      return {
        onGetFileType: orderType === 2 ? "QGJJYS" : "CTQGJJ",
        httpGetFileRequest: ({ explains }) => {
          return getOrderAttachList({
            operationOrderId: id,
            orderType,
            queryType: 3,
            queryTypeList: explains,
          });
        },
        httpSaveFileRequest: ({ attachId }) => {
          return clearanceAccessory({
            attachId,
            operationId: id,
          });
        },
        httpDelFileRequest: ({ deleteAttachIdList }) => {
          return delClearanceAccessory(deleteAttachIdList.join(","));
        },
      };
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleMaintainGoods(row) {
      // console.log(row);
      const {
        operationOrderId,
        operationOrderNum,
        freightType,
        orderId,
        createTime,
        bailorPeople,
        customerShortName,
      } = row;
      const { customerId, countryId } = this.formConfig.formModel;
      this.basicData = {
        operationOrderId,
        freightType,
        orderId,
        customerId,
        countryId,
      };
      this.$nextTick(() => {
        this.$refs.MaintainGoods.show({
          operationOrderNum,
          bailorPeople: customerShortName || bailorPeople,
          bailorPeopleId: customerId,
          createTime,
        });
      });
    },
    handleMaintainAddress(row) {
      this.$refs.addressDlgRef?.editShow(row, {
        editSuccess: () => this.getDetails(),
      });
    },
    tableStatusList(r) {
      const { invoiceStatus, customsClearanceStatus } =
        this.formConfig.formModel;
      return this.tableBtnList.filter((e) => {
        if (e.btnShowType === "1") {
          return r.isMainBill !== 1 && invoiceStatus === 2;
        }
        if (e.btnShowType === "2") {
          return (
            r.isMainBill !== 1 &&
            r.orderType === 2 &&
            [0, 1].includes(customsClearanceStatus)
          );
        }
        return false;
      });
    },
    footerBtnList() {
      const { viewSource } = this.$route.query;
      const { customsClearanceStatus } = this.formConfig.formModel;
      return this.statusList.filter((e) => {
        if ([1, "1"].includes(viewSource)) {
          // 列表的第一个页签显示交接按钮
          return e.showStatus
            ? e.showStatus.includes(customsClearanceStatus)
            : e.isBtnAll;
        } else {
          if (this.pageSource === "ec_customs") {
            return e.showRemarkStatus
              ? e.showRemarkStatus.includes(customsClearanceStatus)
              : e.isBtnAll;
          } else {
            // 传统
            return e.showRemarkStatus ? customsClearanceStatus > 1 : e.isBtnAll;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-edit {
  /deep/ {
    .border-right {
      border-right: 1px solid #f2f2f2;
    }
    .el-form-item {
      margin-bottom: 5px;
    }
    .download {
      color: #3179ef;
      cursor: pointer;
    }
    .tag-txt-box {
      display: flex;
    }
  }

  .order-content {
    font-size: 13px;
    color: #1f1f1f;
    padding-bottom: 100px;
    background-color: #ffffff;
    margin: 10px;
    min-height: calc(100vh - 108px);
    margin-bottom: 100px;
    .customsClearance-form {
      .tag-margin-5 {
        margin-left: 15px;
        margin-right: 5px;
      }
      .bailorPeople-class {
        display: flex;
      }
      .shipCompany-class {
        display: flex;
      }
    }
    .customsClearance-table {
      margin: 0 20px 10px;
      .operation {
        .btn {
          margin-right: 10px;
          color: #3179ef;
          cursor: pointer;
          &:nth-child(1) {
            margin-right: 50px;
          }
        }
      }
    }
  }
}
</style>
