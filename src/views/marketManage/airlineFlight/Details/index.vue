<template>
  <div class="app-container">
    <ComDetailTop
      :title="`航次信息`"
      :formModel="formConfig.formModel"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            formConfig.formModel.code ? `(${formConfig.formModel.code})` : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <div class="form-content" v-if="columnConfig.isInitRes">
      <ComForm
        class="airline-from"
        :formConfig="formConfig"
        ref="myForm"
        v-if="formConfig.formModel.id"
      >
      </ComForm>
      <div :class="`form-right ${statusBtnList().length > 2 && 'btn-more'}`">
        <div class="form-right-btn">
          <template v-for="(item, index) in statusBtnList()">
            <div :key="index">
              <el-button
                type="primary"
                size="mini"
                round
                plain
                @click="item.handleClick"
                ><i :class="item.icon" v-if="item.icon"></i>
                {{ item.text }}</el-button
              >
            </div>
          </template>
        </div>
      </div>
    </div>
    <el-container class="airline-table" v-if="columnConfig.isInitRes">
      <el-aside class="airline-left" width="400px">
        <ComTableTag
          ref="comTableTag"
          :tabActive="routeProxy"
          :columnConfig="leftColumnConfig.columnConfig"
          :httpRequest="leftColumnConfig.httpRequest"
          :getQueryParams="leftColumnConfig.getQueryParams"
          :formData="{
            operationOrderNum: $route.query.operationOrderNum || '',
          }"
          @handleTabChange="(val) => (routeProxy = val)"
          @handleClick="handleTagChange"
        >
          <template v-slot:code="{ slotProps }">
            <div>
              <span
                v-if="slotProps.row.orderNum"
                class="primary-text-btn"
                @click.stop="handleView(slotProps.row)"
              >
                {{ slotProps.row.orderNum || slotProps.row.joinOrder }}
              </span>
              <span v-else>--</span>
            </div>
          </template>
          <template v-slot:isCabinRelease="{ slotProps }">
            <div>
              <span
                :style="{ color: 'red' }"
                v-if="slotProps.row.isCabinRelease"
                >√放舱</span
              >
            </div>
          </template>
          <template v-slot:operation="{ slotProps }">
            <el-button
              type="text"
              size="small"
              plain
              @click.stop="showConfirmDialog(slotProps.row, 'edit')"
              class="text-btn-primary"
              v-if="!slotProps.row.orderId"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click.stop="deleteSortBatch(slotProps.row)"
              plain
              class="text-btn-danger"
              v-if="!slotProps.row.orderId"
              >删除</el-button
            >
          </template>
        </ComTableTag>
      </el-aside>
      <el-main class="airline-right">
        <div class="tabs">
          <template v-for="tab in tabList">
            <el-button
              v-if="tab.show"
              size="small"
              plain
              :key="tab.key"
              class="tabs-change"
              :type="tabActive === tab.key ? 'activation' : ''"
              @click="tabActive = tab.key"
              >{{ tab.title }}</el-button
            >
          </template>
        </div>
        <ComTable
          ref="tableConfig"
          :tableHeight="columnConfig.tableHeight"
          :columnConfig="columnConfig.columns"
          :httpRequest="columnConfig.httpRequest"
          :getQueryParams="getQueryParams"
          :extraConfig="columnConfig.extraConfig"
          v-if="tabActive === 2"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'inWarehouseStatus'">
              <div class="display-flex">
                <span
                  :class="[
                    `${
                      slotProps.row.inWarehouseStatus !== 0 &&
                      'primary-text-color'
                    }`,
                    'ellipsis-text',
                  ]"
                >
                  {{
                    slotProps.row.inWarehouseStatus === 0 ? "未入仓" : "已入仓"
                  }}
                </span>
              </div>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="
                /totalBoxNum|totalWeight|totalVolume/.test(
                  slotProps.column.prop
                )
              "
            >
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
          </template>
        </ComTable>
        <template v-else>
          <MarketVoyageBill
            v-if="voyageBillObj.id"
            ref="voyageBillRef"
            :formModel="{
              ...voyageBillObj,
              voyageId: formConfig.formModel.id,
              customCostInfoId: voyageBillObj.id,
              newBackPathUrl:
                $refs.detailTopRef && $refs.detailTopRef.newPathUrl(),
              generateBillStatus: 1, // 生成对账单参数
              deptId: this.formConfig.formModel.deptId,
              webViewSource: 'webMarketVoyage', // 区分来源
              operateMain:voyageBillObj.businessCompany
            }"
          />
        </template>
      </el-main>
    </el-container>
    <AddEditDialog ref="dialog" @handleSuccess="getData" />
    <ConfirmDialog ref="confirmDialog" />
    <CheckInDialog ref="checkInDialog" @submitSuccess="submitSuccess" />
    <AirlineStatusDialog
      ref="airlineStatusDialog"
      @handleSuccess="handleSuccess"
    />
    <SoNoDialog ref="SoNoDialogRef" @handleSuccess="submitSuccess(true)" />
  </div>
</template>

<script>
import {
  getAirFlightDetails,
  getAirlineList,
  deleteSortBatch,
  getRouteOrder,
  getOperateSoNoList,
  deleteOperateSono,
  editOperateSono,
  getsonoDetailsData,
  addOperateSono,
} from "@/api/marketManage/airline";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { config, settlementTableColumns } from "./model";
import { mapActions, mapState } from "vuex";
import {GETCurrencyConfigList} from "@/api/settlementManage/feeSet.js"
export default {
  name: "AirlineFlightDetails",
  mixins: [mixinEditCache],
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComTableTag: () => import("_comp/ComTableTag"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
    CheckInDialog: () => import("../../forBooking/components/CheckInDialog"),
    AirlineStatusDialog: () => import("../components/AirlineStatusDialog"),
    MarketVoyageBill: () => import("_comp/CostInfo/billings/marketBill"),
    AddEditDialog: () => import("../components/AddEditDialog/index.vue"),
    SoNoDialog: () =>
      import("@/views/marketManage/components/dialog/index.vue"),
  },
  computed: {},
  provide() {
    return {
      PROVIDECURRFILTER:true,
    };
  },
  data() {
    return {
      billingMainId: 187, // 航次信息详情费用主体默认为市场部，暂时不可更改 10/26
      joinOrderActive: null,
      formConfig: {
        formModel: {},
        labelWidth: "90px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.formLists,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      routeProxy: "",
      leftColumnConfig: {
        tableHeight: "calc(100% - 72px)",
        columnConfig: {
          title: "SO No.信息",
          ...config.leftTableColumns,
        },
        httpRequest: getOperateSoNoList,
        getQueryParams: this.getRouteQueryParams,
        extraConfig: {
          showHeader: false,
        },
        paginationConfig: {
          limit: 10,
          layout: "total, prev, pager, next",
        },
      },
      tabActive: 1,
      tabList: [
        {
          title: "应收应付",
          show: true,
          key: 1,
        },
        {
          title: "操作单信息",
          show: true,
          key: 2,
        },
      ],
      columnConfig: {
        tableHeight: "calc(100% - 72px)",
        columns: config.tableColumns,
        httpRequest: (params) => {
          if (this.joinOrderActive) {
            return getsonoDetailsData(this.joinOrderActive);
          } else {
            return new Promise((resolve) => {
              resolve({
                total: 0,
                rows: [],
              });
            });
          }
        },
        extraConfig: {
          stripe: true,
        },
        isInitRes: false,
      },
      settlementColumnConfig: {
        tableHeight: "calc(100% - 72px)",
        columns: settlementTableColumns,
        httpRequest: (params) => {
          if (!this.joinOrderActive && this.refreshTable) {
            return new Promise((resolve) => {
              resolve({
                total: 0,
                rows: [],
              });
            });
          } else {
            return getRouteOrder(params);
          }
        },
        extraConfig: {
          stripe: true,
        },
      },
      statusList: [
        // {
        //   text: "离港",
        //   handleClick: () => this.handleUpdate(2),
        // },
        {
          text: "修改",
          btnStatus: [1],
          handleClick: () => this.handleUpdate("edit"),
        },
        {
          text: "舱位",
          btnStatus: [1, 2],
          icon: "el-icon-plus",
          handleClick: this.showConfirmDialog,
        },
        // {
        //     text: "到港",
        //     handleClick: () => this.handleUpdate(3),
        //   },
      ],
      chargeForm: {},
      voyageBillObj: {},
    };
  },
  computed: {
    // ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("airlineFlight");
  },
  mounted() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    mixinInitData() {
      this.getData();
    },
    getData(id) {
      if (!id) {
        id = this.$route.query.id;
      }
      this.columnConfig.isInitRes = false;
      getAirFlightDetails(id).then((res) => {
        this.formConfig.formModel = res.data || {};
        this.columnConfig.isInitRes = true;
      });
    },
    getAirlineList(params) {
      return getAirlineList(params);
    },
    getRouteQueryParams() {
      const { id: routeId } = this.formConfig.formModel;
      return {
        routeNoManageId: routeId,
      };
    },
    async handleTagChange(row) {
      // if (!row) {
      //   return;
      // }
      const {businessCompany}=row
      const {data}=await GETCurrencyConfigList({customerId:businessCompany})
      const currencyList=(data[0]&&data[0].currencyList||[]).map((e)=>e.currencyId)
      const convertCurrencyList=(data[0]&&data[0].convertCurrencyList||[]).map((e)=>e.currencyId)
      this.voyageBillObj = {};
      // isBind - 0:未绑定/1:已绑定 是否绑定过操作单
      this.tabList[0].show = !!row.orderNum || !!row.isBind;
      this.tabActive = this.tabList[0].show ? 1 : 2;
      this.routeProxy = row.id;
      this.refreshTable = true;
      this.joinOrderActive = row.id;
      const { id: routeId } = this.formConfig.formModel;
      this.chargeForm = {
        orderNos: row.soNo,
        routeId,
        orderId: row.id,
      };
      this.$nextTick(() => {
        // 重新加载费用账单
        this.voyageBillObj = {
          ...row,
          currencyIdConfig:currencyList,//当前点击SONO可选币种
          convertCurrencyIdConfig:convertCurrencyList,//当前点击SONO可选折合币种
        };
        // this.$refs.voyageBillRef?.voyageRefreshBill();
      });

      this.$refs.tableConfig?.refreshTable();
    },
    getQueryParams() {
      const { id: routeId } = this.formConfig.formModel;
      return {
        orderNos: this.joinOrderActive,
        routeId,
      };
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.voyageBillObj = {};
        this.getData(id);
      }
    },
    // 新增（编辑）舱位
    showConfirmDialog(rows = {}, type = "add") {
      const { id: routeNoManageId, name: routeNoMangeName } =
        this.formConfig.formModel;
      this.$refs.SoNoDialogRef.show(
        { ...rows, routeNoManageId, routeNoMangeName },
        type,
        true
      );
    },
    // showConfirmDialog(rows = {}) {
    //   const { id, name, flightName, sailOpenTime } = this.formConfig.formModel;
    //   if (rows.shippingRouteStatus) {
    //     const params = {
    //       type: rows.type,
    //       routeId: id,
    //       boxModelId: rows.boxModelId,
    //       boxModel: rows.boxModel,
    //       boxNum: rows.type == 1 ? 1 : rows.boxNum, //拼柜数量只有一个
    //       orderNo: rows.joinOrder,
    //       id: rows.id,
    //       code: rows.code,
    //     };
    //     this.$refs.checkInDialog.show(params, true);
    //     return;
    //   }
    //   let formModel = {
    //     name,
    //     flightName,
    //     sailOpenTime,
    //     routeNoManageId: id,
    //   };
    //   let httpRequest = addOperateSono;
    //   if (rows.id) {
    //     //初始化数据
    //     httpRequest = editOperateSono;
    //     formModel = {
    //       ...formModel,
    //       id: rows.id, //id
    //       routeNoManageId: rows.routeNoManageId, //航次id
    //       sono: rows.sono, //sono号
    //       boxModelId: rows.boxModelId, //柜型id
    //       orderId: rows.orderId, //操作单id
    //       isCabinRelease: rows?.isCabinRelease, //是否放舱
    //       remark: rows?.remark, //备注说明
    //       attachId: rows?.attachId, //附件
    //     };
    //   }
    //   this.$refs.confirmDialog.handleFormDialog("shippingSpace", {
    //     dialogTitle: rows.id ? "修改舱位" : "新增舱位",
    //     httpRequest: (formModel) => {
    //       console.log("未处理的数据", formModel);
    //       const params = {
    //         id: formModel?.id,
    //         sono: formModel?.sono, //sono号
    //         boxModelId: formModel?.boxModelId, //柜型
    //         routeNoManageId: formModel?.routeNoManageId,
    //         isCabinRelease: formModel?.isCabinRelease, //是否放舱
    //         remark: formModel?.remark, //备注说明
    //         attachId: formModel?.attachId, //附件
    //       };
    //       return httpRequest(params);
    //     },
    //     successMessage: "提交成功", // 成功提示
    //     successFunction: () => {
    //       this.$refs.comTableTag && this.$refs.comTableTag.refreshTable(true);
    //     }, // 接口成功回调
    //     formModel,
    //   });
    // },
    submitSuccess(bol = false) {
      this.$refs.comTableTag && this.$refs.comTableTag.refreshTable(bol);
    },
    // 删除舱位
    deleteSortBatch(row) {
      this.$refs.confirmDialog.delete().then(() => {
        deleteOperateSono(row.id).then(() => {
          this.$refs.comTableTag && this.$refs.comTableTag.refreshTable(true);
        });
      });
    },
    handleUpdate(status) {
      if (status === "edit") {
        this.$refs.dialog.show({ ...this.formConfig.formModel }, true);
      } else {
        // const { id } = this.formConfig.formModel;
        // this.$refs.airlineStatusDialog.show(id, status);
      }
    },
    handleSuccess(status) {
      this.formConfig.formModel = {
        ...this.formConfig.formModel,
        status,
      };
      this.$refs.myForm &&
        this.$refs.myForm.setFormModel({
          status,
        });
    },
    addBill(row) {
      if (this.routeProxy !== row.id) {
        this.routeProxy = row.id;
        return this.handleTagChange(row);
      }
      if (!this.$refs.voyageBillRef) {
        this.$message({
          message: "请先切换到应收应付后再新增账单",
          type: "warning",
        });
        return;
      }
      this.$refs.voyageBillRef?.addVoyageBill();
    },
    getBillQueryParams() {
      const { id: routeNoId } = this.formConfig.formModel;
      const { orderId, orderNos } = this.chargeForm;
      const params = {
        businessType: 1, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        // isMainOrder: 1,
      };
      if (!orderId) {
        params.routeNoId = routeNoId;
      } else {
        params.orderId = orderId;
        params.orderNum = orderNos;
      }
      delete params.businessType;
      delete params.orderNum;
      return params;
    },
    handleView(row) {
      const { operationOrderType, orderType, orderId } = row; //operationOrderType  0-海运  1-空运
      const routeLists = {
        0: "/operateManage/seaTransDetails",
        1: "/operateManage/airTransDetails",
      };
      let path = routeLists[operationOrderType];
      if (orderType == 2) {
        path = "/operateManage/ecOperateDetails";
      }
      if (path) {
        this.$router.push({
          path,
          query: {
            id: orderId, // 操作单ID
            backPath: this.$route.fullPath,
          },
        });
      }
    },
    statusBtnList() {
      // 放开舱位添加
      const { status } = this.formConfig.formModel || {};
      return this.statusList.filter((t) =>
        t.btnStatus ? t.btnStatus.includes(status) : true
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-upload-list__item {
  //解决修改图片时候，左侧SONO信息过渡效果过于明显的BUG
  transition: none !important;
}
.app-container {
  padding: 0;
  .el-tag {
    border: none;
  }
  .el-button--primary.is-plain {
    color: #5094ff;
    background: transparent;
    border-color: #5094ff;
  }
  .el-button--mini {
    padding: 4.5px 19px;
  }
  .el-button--small {
    font-size: 13px;
    border-radius: 2px;
  }
  .form-content {
    display: flex;
    .airline-from {
      flex: 1;
      padding: 10px 20px;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
      .green {
        color: #53c88a;
      }
      .tab-form {
        white-space: nowrap;
        .el-tag {
          height: auto;
          line-height: initial;
          padding: 2px 13px;
          border-radius: 12px;
          margin-left: 5px;
        }
      }
    }
    .form-right {
      padding: 10px 20px 10px 0;
      &.btn-more {
        display: flex;
        align-items: flex-end;
        .status {
          margin-left: 6px;
        }
      }
      .status {
        width: 60px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        padding: 0 12px;
        margin: 6px 0;
        color: #fff;
        background: #5094ff;
        border-radius: 4px;
      }
      .form-right-btn {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        & > div {
          margin: 6px 0;
        }
      }
    }
  }

  .airline-table {
    height: calc(100vh - 235px);
    border-top: 1px solid #e2e2e2;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .airline-left {
      background: #fff;
      border-right: 1px solid #e2e2e2;
      margin-bottom: 0;
      padding: 8px 0 0 0;

      .el-tag {
        margin-left: 4px;
      }
      .tableData {
        height: calc(100% - 34px);
      }
    }

    .airline-right {
      padding: 0px 8px 15px 8px;
      background: #fcfcfc;
      .tabs {
        margin-bottom: 8px;
        padding: 10px;
      }
      .tableData {
        height: calc(100% - 42px);
      }
    }
  }
}
</style>
