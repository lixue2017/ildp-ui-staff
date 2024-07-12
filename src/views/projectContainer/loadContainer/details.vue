<template>
  <div class="proInfo-details" v-if="Object.keys(detailModel.formModel).length">
    <ComDetailTop
      title="排柜信息"
      ref="detailTopRef"
      :formModel="detailModel.formModel"
      @handleClick="handleTopClick"
    />
    <div class="des-tit-box">
      <ComForm :formConfig="detailModel" />
    </div>
    <div class="customs-clearance-content">
      <div class="customs-clearance-des" v-if="detailModel.routeNoId">
        <p class="voyage-num-tit black-text-color">航次信息</p>
        <div class="voyage-num-list">
          <template v-for="(item, index) in voyageNumber.cols">
            <div
              :key="index"
              :class="['base-flex-align', 'voyage-num-box', item.className]"
            >
              <div
                :style="{ width: voyageNumber.labelWidth }"
                class="voyage-num-label grey-text-color"
              >
                {{ item.label }}
              </div>
              <div class="voyage-num-value black-text-color">
                <div class="base-flex-between">
                  <span class="voyage-txt"
                    >{{ voyageNumFrom[item.id] || item.placeholder
                    }}{{
                      item.nameTxt &&
                      voyageNumFrom[item.nameTxt] &&
                      `[${voyageNumFrom[item.nameTxt]}]`
                    }}</span
                  >
                  <div
                    class="voyage-line"
                    v-if="item.customRow && item.id === 'routeCode'"
                  >
                    <span
                      class="tag-green-color"
                      v-if="getDictObj(transportMode, voyageNumFrom.lineType)"
                      >{{
                        getDictObj(transportMode, voyageNumFrom.lineType)
                      }}</span
                    >
                  </div>
                  <!-- <div
                    //排柜新增账单入口，，2022/08/31暂时隐藏
                    class="voyage-line"
                    v-if="item.customRow && item.id === 'name_x12'"
                  >
                    <el-button
                      size="small"
                      plain
                      type="primary"
                      @click="addBill"
                      round
                      >新增拖车费</el-button
                    >
                  </div> -->
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="customs-clearance-table">
        <div class="table-title base-flex-between">
          <!-- <div class="tabs"> -->
          <div class="tabsTitle">
            <template v-for="tab in tabList">
              <!-- <el-button
                size="small"
                plain
                :key="tab.key"
                class="tabs-change"
                :type="tabActive === tab.key ? 'activation' : ''"
                @click="tabActive = tab.key"
                >{{ tab.title }}</el-button
              > -->
              <!-- 说是暂时改成不展示tags -->
              <span :key="tab.key"> {{ tab.title }}</span>
            </template>
          </div>
          <div>
            <el-button type="primary" size="small" @click="exportFile"
              >导出</el-button
            >
          </div>
        </div>
        <ComTable
          :ref="`detailTable`"
          :maxTableHeight="null"
          :columnConfig="detailTable.columnConfig"
          :httpRequest="detailTable.httpRequest"
          :getQueryParams="detailTable.getQueryParams"
          @getResult="getResult"
          @handleTableView="(r) => handleOrderDetail(r)"
          :rowOperationBtnListFn="getStatusBtn"
          v-if="tabActive === 1"
          :paginationConfig="{
            limit: 50,
            total: 50,
            pageSizes: [50, 100],
          }"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'code'">
              <div class="display-flex" @click="handleDetail(slotProps.row)">
                <span class="primary-text-btn ellipsis-text">
                  {{ slotProps.row.code || "--" }}
                </span>
              </div>
            </template>
            <template v-if="slotProps.prop === 'customsDeclarationType'">
              <span :class="['ellipsis-text']">
                {{ slotProps.dicsList.nameCn || "--" }}
              </span>
            </template>
            <template
              v-if="
                ['meansNum', 'declareNum', 'dataMsg'].includes(slotProps.prop)
              "
            >
              <div
                :class="[
                  'operation-content',
                  `${
                    slotProps.row[slotProps.prop]
                      ? 'wanzheng-tip-color'
                      : 'queshi-tip-color'
                  }`,
                ]"
              >
                <i
                  :class="[
                    'iconfont',
                    `${
                      slotProps.row[slotProps.prop] ? 'wanzheng2' : 'queshi2'
                    }`,
                  ]"
                />
                <span>{{ slotProps.dicsList.nameCn || "缺失" }}</span>
              </div>
            </template>
          </template>
        </ComTable>
        <!-- <chargeInfo
          ref="chargeInfo"
          :formModel="detailModel.formModel"
          @handleUpdateBill="handleUpdateBill"
          v-else-if="detailModel.formModel.id"
        /> -->
        <div class="grand-total">
          <template v-for="gross in grossTotal">
            <span :key="gross.prop">
              <span class="label">{{ gross.label }}</span>
              <span>{{
                toFixedNum(detailModel.formModel[gross.prop], gross.decimal)
              }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>
    <BillEditDialog ref="billEditDialog" @handleSuccess="handleBillSuccess" />
    <div class="order-footer">
      <template
        v-for="(btn, index) in getOperation(detailModel.formModel.dataStatus)"
      >
        <el-button :type="btn.type" @click="btn.handleClick" :key="index">
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <WarehousingDialog
      ref="warehousingDialog"
      @handleSuccess="handleWarehousingSuccess"
      :againVerify="true"
    />
    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import { WAREHOUSE_TYPE } from "@/utils/mixin";
import { comFileDownload } from "@/utils/download.js";
import {
  tableDetailCols,
  voyageNumber,
  detailFromDigModel,
  deliveryPlanFromModel,
  grossTotal,
  subtotalList,
  cabinetRemarkCols,
} from "./model";
import {
  getBoxSortDes,
  getOperateRouteNo,
  getWaitSort,
  getExportList,
  getSortBoxStatus,
  postRowCabinetRemark,
  POSTEditOperationRemark,
} from "@/api/container/arrange.js";
import { getEcFreightList } from "@/api/order/firstTransport.js";

export default {
  data() {
    return {
      grossTotal,
      detailModel: {
        ...detailFromDigModel,
        formModel: {},
      },
      tabActive: 1,
      tabList: [
        {
          title: "操作单信息",
          key: 1,
        },
        // {
        //   title: "应收应付",
        //   key: 2,
        // },
      ],
      detailTable: {
        // tableHeight: "calc(100vh - 324px)",
        getQueryParams: this.getQueryParams,
        httpRequest: getWaitSort,
        columnConfig: tableDetailCols,
        statusList: [
          // 0-待入仓，1-已入仓 2-已出仓
          // {
          //   text: "收货核实",
          // 	stateArr: [3],
          //   handleClick: this.handleUpdate,
          // },
          {
            text: "激活收货核实",
            stateArr: [2], //入仓状态
            nodeState: [3], //节点状态，3为已进行过装柜完成
            showMenuType: ["deliveryPlan"],
            handleClick: (val) => this.handleVerification(val, 1),
          },
          {
            text: "关闭收货核实",
            stateArr: [1],
            nodeState: [3],
            showMenuType: ["deliveryPlan"],
            handleClick: (val) => this.handleVerification(val, 2),
          },
          {
            text: "备注",
            stateArr: [0, 1, 2, 3, 4],
            nodeState: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            handleClick: this.handleRemark,
          },
        ],
      },
      voyageNumber,
      voyageNumFrom: {},
      footerBtn: [
        {
          text: "修 改",
          type: "primary",
          handleClick: (rows) => {
            this.editDetail(rows);
          },
        },
        {
          text: "关 闭",
          handleClick: (rows) => {
            this.reBack(rows);
          },
        },
      ],
      tableTotalArr: [
        {
          name: "合计：",
          subtotalList,
        },
      ],
      total_obj: {
        0: [],
      },
    };
  },
  computed: {
    ...mapState({
      transportMode: (state) => state.dictionary.dicsData.transportMode,
    }),
  },
  created() {
    const { isDelivery } = this.$route.query;
    if (isDelivery) {
      this.footerBtn = [
        {
          text: "装柜完成",
          type: "primary",
          handleClick: (rows) => {
            this.handleCabinetDone(rows);
          },
        },
        ...this.footerBtn,
      ];
      this.detailTable.statusList.unshift({
        text: "收货核实",
        stateArr: [3], // 0-待入仓，1已入仓
        handleClick: this.handleUpdate,
      });
      this.detailModel = {
        ...deliveryPlanFromModel,
        formModel: {},
      };
    }
  },
  mounted() {
    this["dictionary/getDictionary"]("cabinetArrangement");
    this._getBoxSortHttp(this.$route.query.id);
  },
  methods: {
    handleCabinetDone() {
      const { id } = this.$route.query;
      getSortBoxStatus({
        id,
        status: 3,
      })
        .then((res) => {
          this.detailModel.formModel.dataStatus = 3;
          this.$refs.detailTable.refreshTable();
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 1002) {
            const title = `当前出库计划存在<span class='draft-state'>${err.msg}票</span>未入库的货物 ！`;
            const className = "el-icon-warning text-warning";
            const msg = "全部货物入库之后才能进行最后出库";
            const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
            msgBox(
              this,
              {
                title: "",
                html,
                showClose: false,
                confirmButtonText: "知道了",
                customClass: "delivery-box",
              },
              () => {}
            );
          }
        });
    },
    handleDetail(row = {}) {
      // console.log('handleDetail==', row)
      // this.detailModel.recordFormModel = {};
      // this.$nextTick(() => {
      //   this.detailModel.recordFormModel = {
      //     ...row
      //   };
      // })
    },
    handleOrderDetail(row = {}) {
      const idList = this.$refs.detailTable.tableData.map(
        (item) => item.torderId
      );
      this.$router.push({
        path: "/domesticWarehouse/verifyDetails",
        query: {
          id: row.torderId,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          backPath: this.$refs.detailTopRef?.newPathUrl(),
        },
      });
    },
    // 收货核实
    handleUpdate(row) {
      const {
        userShortName: bailorPeople,
        torderId: operationOrderId,
        torderNo: operationOrderNum,
        createTime,
        orderId,
      } = row;
      getEcFreightList({
        operationOrderId,
        isVerified: 1,
        isCheckGoods: 1,
      }).then((res) => {
        const params = {
          operationId: operationOrderId,
          orderId,
          orderType: 2,
          freightType: 1,
          operationOrderNum,
          bailorPeople,
          createTime,
          lists: res,
        };
        this.$refs.warehousingDialog.show(params, "inStorage");
      });
    },
    handleWarehousingSuccess() {
      this.$refs.detailTable.refreshTable();
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id;
        this._getBoxSortHttp(id);
      }
    },
    async _getBoxSortHttp(id) {
      this.$set(this.detailModel, "formModel", {});
      this.$set(this, "voyageNumFrom", {});
      const desData = (await getBoxSortDes(id)).data || {};
      this.$set(this.detailModel, "formModel", desData);
      let voyageNum = {};
      if (desData.routeNoId) {
        voyageNum = (await getOperateRouteNo(desData.routeNoId)).data || {};
        // this.$set(this, 'voyageNumFrom', voyageNum.data)
      }
      this.$set(this, "voyageNumFrom", {
        ...voyageNum,
        tcode: desData.tcode,
        consigneeType:
          desData.consigneeType || desData.consigneeType === 0
            ? WAREHOUSE_TYPE[desData.consigneeType]
            : null,
        consigneeName: desData.consigneeName,
        shortName: desData.shortName,
      });
    },
    getQueryParams() {
      return {
        // orderNos: this.detailModel.formModel.joinOrder,
        sortBoxId: this.detailModel.formModel.id,
        isMainBill: 9,
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
    addBill() {
      const {
        id: orderId,
        code: orderNum,
        deptId,
      } = this.detailModel.formModel;
      this.$refs.billEditDialog.show({
        businessType: 2, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId, //排柜id
        orderNum, //订单号
        deptId: deptId,
      });
    },
    handleUpdateBill(row) {
      const { deptId } = this.detailModel.formModel;
      this.$refs.billEditDialog.show({
        ...row,
        businessType: 2, //0操作单 1订舱单 2拼柜单 3清关单 4订单
        orderId: row.orderId, //订单id
        orderNum: row.orderNum, //订单号
        deptId: deptId,
      });
    },
    handleBillSuccess() {
      this.$refs.chargeInfo.refreshTable();
    },
    getOperation(status) {
      const btnArr = [...this.footerBtn];
      switch (status) {
        case 1: //已登记
          return btnArr;
        default:
          //其他
          return [btnArr.pop()];
      }
    },
    /** 备注编辑 */
    handleRemark(row) {
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: cabinetRemarkCols,
        formModel: {
          id: row.id,
          rowCabinetRemark: row.rowCabinetRemark,
          rowCabinetSort: row.rowCabinetSort,
        },
        httpRequest: postRowCabinetRemark,
        successFunction: this.handleWarehousingSuccess,
      });
    },
    editDetail(rows) {
      const { id, isDelivery } = this.$route.query;
      this.$router.push({
        path: "/projectContainer/editLoadContainer",
        query: {
          id: id,
          isDelivery,
          backPath: this.$refs.detailTopRef?.newPathUrl(),
        },
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    exportFile() {
      const params = {
        // orderNos,
        sortBoxId: this.detailModel.formModel.id,
        isMainBill: 9,
        pageNum: 1,
        pageSize: 99992,
      };
      comFileDownload(this, getExportList, params);
    },
    getResult({ total }) {
      // 汇总计算
      this.$set(this.detailModel.formModel, "totalRows", total);
    },
    getStatusBtn(row) {
      const { menuType } = this.$route.query;
      const { inWarehouseStatus, dataStatus } = row;
      const btnArr = this.detailTable.statusList.filter((e) => {
        const { stateArr, nodeState, showMenuType } = e;
        return (
          stateArr.includes(inWarehouseStatus) &&
          nodeState.includes(dataStatus) &&
          (showMenuType ? !showMenuType.includes(menuType) : true)
        );
      });
      return btnArr;
    },
    // handleActivate(row){
    //   console.log('handleActivate',row)
    //   this.$confirm("核销之后核销结束，是否继续", "提示", {
    //     confirmButtonText: "确定",
    //     type: "warning",
    //   }).then(() => {});
    // },
    // handleClose(row){
    //   console.log('close',row)
    //   this.$confirm("核销之后核销结束，是否继续", "提示", {
    //     confirmButtonText: "确定",
    //     type: "warning",
    //   }).then(() => {});
    // },
    handleVerification(row, status) {
      const { id } = row;
      const params = {
        id,
        warehousingStatus: status,
      };
      const tips = {
        1: "已成功激活收货核实",
        2: "已成功关闭收货核实",
      }[status];
      POSTEditOperationRemark(params).then((res) => {
        this.msgSuccess(tips);
        this.handleWarehousingSuccess();
      });
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    BillEditDialog: () =>
      import(
        "@/views/settlementManage/statementManage/billDetailed/components/EditDialog"
      ),
    chargeInfo: () => import("./components/chargeInfo"),
    WarehousingDialog: () =>
      import("_comp/ComOperate/components/WarehousingDialog"), // 入仓（散货）核实
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";

.proInfo-details {
  font-size: 13px;
  color: #1f1f1f;
  min-height: calc(100vh - 108px);
  padding-bottom: 100px;
  background-color: #ffffff; //新增标记
  margin: 10px; //新增标记
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
  }
}
.customs-clearance-content {
  display: flex;
  padding: 15px 20px 0;
  position: relative;
  margin-top: 22px;
  &::after {
    content: "";
    border-top: 1px solid #e2e2e2;
    position: absolute;
    top: 0;
    left: 0px;
    right: 0px;
  }
  .voyage-num-tit {
    font-size: 14px;
    margin-bottom: 20px;
  }
  .table-title {
    font-size: 14px;
    margin-bottom: 20px;
    // justify-content: flex-start;
  }
  .customs-clearance-des {
    flex: 1 0 300px;
    padding-right: 36px;
    position: relative;
    max-width: 380px;
    &::after {
      content: "";
      border-right: 1px solid #e2e2e2;
      position: absolute;
      top: -15px;
      bottom: 0;
      right: 8px;
    }
  }
  .voyage-num-box {
    line-height: 32px;
    &.divider {
      border-bottom: 1px solid #dcdfe6;
    }
    &.trailer {
      margin: 5px 0;
      .voyage-num-label {
        text-align: left;
      }
    }
    .voyage-num-label {
      text-align: right;
      padding-right: 12px;
    }
    .voyage-num-value {
      width: calc(100% - 130px);
      word-break: break-all;
    }
  }
  .voyage-txt {
    line-height: 20px;
  }
  .voyage-line {
    flex: 0 0 52px;
    text-align: right;
  }
  .customs-clearance-table {
    flex: 1;
    overflow: hidden;
    .tabsTitle {
      font-size: 14px;
      font-weight: bold;
      color: #515151;
    }
  }
}
.rg-btn {
  flex: 0 0 100px;
  align-items: flex-end;
  .el-button + .el-button {
    margin-left: 0;
    margin-top: 10px;
  }
}
.subtotal {
  height: 50px;
  background: rgba(80, 148, 255, 0.12);
  color: #515151;
  &.subtotal_2 {
    background: rgba(80, 148, 255, 0.2);
  }
  .subtotal-tit {
    font-size: 14px;
    font-weight: 500;
    margin-right: 10px;
  }
  .subtotal-des {
    margin-right: 50px;
  }
  .subtotal-label {
    font-size: 13px;
    color: #8b8b8b;
  }
  .subtotal-num {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
