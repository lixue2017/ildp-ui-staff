<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <template slot="label">
            <TabSearchColumn
              :searchFormData="mixinSearchFormData"
              :tabName="tab.name"
            />
          </template>
          <keep-alive>
            <ComForm
              ref="formRef"
              :formConfig="getDynamicConfig()"
              @searchHeight="searchHeight"
              v-if="
                tabsConfig.activeName === tab.name &&
                showSearchForm &&
                mixinSearchConfParams.countType
              "
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(+mixinSearchConfParams.countType+1)"
                  :tName="tab.name"
                  @setColumnConf="(arr) => setColumnMixinConf(arr)"
                />
              </template>
            </ComForm>
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :setColumnParams="mixinColumnSetParams"
              :columnConfig="getTableMixinConfig()"
              :isMountedRequest="false"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="() => getQueryParams()"
              :rowOperationBtnListFn="getStatusList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'orderNum'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row)"
                  >
                    {{ slotProps.row.orderNum }}
                  </span>
                  <i
                    @click="handleCopyText(slotProps.row.orderNum)"
                    class="el-icon-document-copy primary-text-color"
                  />
                </template>
                <template v-if="slotProps.prop === 'isHomeDelivery'">
                  <span :style="{color: slotProps.row.isHomeDelivery?'#3179EF':''}">
                    {{ slotProps.row.isHomeDelivery === 0 ? "否" : "✓是" }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'backNum'">
                  <span
                    class="primary-text-btn"
                    @click="repulseView(slotProps.row)"
                  >
                    {{ slotProps.row.backNum }}
                  </span>
                </template>
                <template v-if="slotProps.prop === 'orderStatus'">
                  <span>
                    <i
                      class="status-dot"
                      :style="{
                        backgroundColor:
                          slotProps.dicsList && slotProps.dicsList.color,
                      }"
                    ></i>
                    {{ slotProps.dicsList && slotProps.dicsList.nameCn }}
                  </span>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
    <ConfirmDialog ref="confirmDlgRef">
      <template v-slot:tip-bottom>
        <div class="dialog-tip" v-if="repulseType === 2">{{ dialogTip }}</div>
      </template>
    </ConfirmDialog>
    <OrderReceiving ref="orderReceiving" @handleSuccess="mixinkeepTable" />
    <!-- 传统海运订单  -->
    <AirOrderReceive ref="AirOrderReceiving" @handleSuccess="mixinkeepTable" />
    <!-- 传统空运订单: 不知道之前分成两个暂时这样  -->
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <!-- 传统海运新增 -->
    <AddSeaDialog ref="addSeaDialogRef" />
    <!-- 传统空运新增 -->
    <AddAirDialog ref="addAirDialogRef" />
    <BusinessSubmit
      ref="businessSubmitRef"
      @handleSuccess="mixinkeepTable"
      @handleError="businessSubmitErr"
    />
    <!-- 新增拖车弹窗 -->
    <AddDialog ref="addDialog" />
  </div>
</template>

<script>
import mixinOrder from "../components/mixinOrder";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { seaTransport,otherOrder,allConfig,airTransport } from "../components/model";
import {
  deleteTradition,
  putTradition,
  copyTradition,
  GETTraditionNewList,
} from "@/api/trandition/seaAirTransport";
import {
  deleteOrderTradition,
  putOrderOther,
  copyOrderOther,
} from "@/api/trandition/otherOrder";
export default {
  mixins: [mixinOrder, mixinColsConf],
  name: "SeaTransport",
  components: {
    OrderSubmit: () => import("../components/OrderSubmit"),
    OrderReceiving: () => import("./components/orderReceive"),
    AirOrderReceive: () => import("./components/AirOrderReceive"),
    AddSeaDialog: () =>
      import("@/views/newOrderManage/seaTransport/components/AddSeaDialog"),
    AddAirDialog: () =>
      import("@/views/newOrderManage/seaTransport/components/AddAirDialog"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    TabSearchColumn: () => import("_comp/ComColumnConf/SearchColumn"),
    AddDialog: () =>
      import("@/views/newOrderManage/otherOrder/components/AddDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        className: "slot-label-state",
        isTabStateCount: true,
        isGetRightBtn: true,
        handleTabsClick: () => {
          this.handleTabsClick();
          // const {countType}=this.mixinSearchConfParams
          // this.tabsConfig.activeName=countType
        },
        tabs: [
          {
            label: "传统订单",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport(),
          },
        ],
      },
      rightBtn: [
        {
          table: "海运订单",
          showCountType: ["540",540],
          handleClick: () => this.handlePlaceOrder(1),
        },
        {
          table: "空运订单",
          showCountType: ["541",541],
          handleClick: () => this.handlePlaceOrder(2),
        },
        {
          btnType: "dropdown",
          showCountType: ["542",542],
          table: "新增",
          dropdownArr: [
            {
              name: "拖车",
              value: 3,
            },
            {
              name: "报关出证",
              value: 4,
            },
          ],
          handleClick: (_, dItem) => this.handlePlaceOrder(dItem.value),
        },
        {
          table: "导出",
          icon: "iconfont daochu",
          handleClick: () => this.handleExport(),
        },
      ],
      tableStatusBtnList: [
        {
          status: [0, 9],
          text: "修改",
          handleClick: this.handleUpdate,
        },
        {
          status: [0, 9],
          text: "预报",
          icon: "iconfont icon-yubao",
          handleClick: (row) => this.handleUpdate(row, "editStatus"),
        },
        {
          text: "接单",
          status: [1],
          handleClick: (row) => {
            this.handleReceiving(row);
          },
        },
        {
          text: "提交",
          status: [10],
          handleClick: (row) => {
            this.handleReceiving(row, "businessSubmit");
          },
        },
        {
          text: "打回",
          status: [10],
          color: "#FF6767",
          handleClick: (row) => {
            this.repulseType = 2;
            this.handleVoid(row, 0);
          },
        },
        {
          text: "撤回提交",
          status: [15],
          handleClick: this.handleWithdraw,
        },
        {
          allStatus: true,
          text: "复制",
          icon: "el-icon-copy-document",
          handleClick: (row) => this.handleUpdate(row, "copy"),
        },
        {
          text: "打回",
          status: [1],
          color: "#FF6767",
          handleClick: (row) => {
            this.repulseType = 1;
            this.handleVoid(row, 0);
          },
        },
        {
          status: [0, 9],
          text: "删除",
          handleClick: this.handleDelete,
        },

      ],
      tableConfig: {
        httpRequest: GETTraditionNewList,
      },
      mixinTableColArr: {
        1000:allConfig.lists,
        10:allConfig.lists,
        540:seaTransport.lists,
        541:airTransport.lists,
        542:otherOrder.lists,
        100:allConfig.lists,
      },
    };
  },
  methods: {
    handlePlaceOrder(type) {
      switch (type) {
        case 1:
          this.$refs.addSeaDialogRef.show();
          break;
        case 2:
          this.$refs.addAirDialogRef.show();
          break;
        case 3:
          this.$refs.addDialog.show();
          break;
        case 4:
          this.$router.push({
            path: "/newOrderManage/editOtherTransport",
            query: {
              backPath: "/newOrderManage/otherOrder",
            },
          });
          break;
        default:
          break;
      }
    },
    handleUpdate(row, type) {
      const { isHomeDelivery, id, orderType } = row;
      const editHttpRequest = [3, 4].includes(orderType)
        ? putTradition
        : putOrderOther;
      const copyHttpRequest = [3, 4].includes(orderType)
        ? copyTradition
        : copyOrderOther;
      if (type === "editStatus") {
        editHttpRequest({
          id,
          isHomeDelivery,
          orderStatus: 1,
          forecastType: 1,
        }).then(() => {
          this.mixinkeepTable(false);
        });
        return;
      } else if (type === "copy") {
        copyHttpRequest(row.id).then((res) => {
          this.handleEditPage({
            orderType,
            id: res.data,
          });
        });
      } else {
        this.handleEditPage(row);
      }
    },
    handleEditPage({ orderType, id }) {
      const path = {
        3: `/newOrderManage/editSeaTransport`,
        4: `/newOrderManage/editAirTransport`,
        5: "/newOrderManage/editOtherTransport",
        6: "/newOrderManage/editOtherTransport",
      }[orderType];
      this.$router.push({
        path,
        query: {
          id,
          backPath: "/newOrderManage/seaTransport",
        },
      });
    },
    handleDelete(row) {
      const { orderType } = row;
      const deleteHttpRequest = [3, 4].includes(orderType)
        ? deleteTradition
        : deleteOrderTradition;
      this.customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          httpMsgRequest: () => deleteHttpRequest(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable(false);
        }
      );
    },
    handleTabsClick() {
      const { countType } = this.mixinSearchConfParams;
      const arr=this.rightBtn.filter((e)=>{
        return (e.showCountType?e.showCountType.includes(countType):true)
      })
      this.$set(this.tabsConfig, "btnArr", arr);
      this.$nextTick(() => {
        this.$refs.formRef[0].renewForm();
      });
    },
    getTableMixinConfig(){
      const { countType } = this.mixinSearchConfParams;
      const lists=this.mixinTableColArr[countType]
      return lists
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../components/common.scss";
.app-container {
}
</style>
