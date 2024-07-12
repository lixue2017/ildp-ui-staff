<template>
  <!-- 此页面已合并至src\views\newOrderManage\seaTransport\index.vue，  已弃用 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(2)"
              @searchHeight="searchHeight"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            >
              <template v-slot:form-submit>
                <ComColumnConf
                  :tableCols="tableAllMixinConfig(tab.name)"
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
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[2]"
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
                  <span>
                    {{ slotProps.row.isHomeDelivery === 0 ? "否" : "是" }}
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
                <!-- <template v-if="slotProps.prop === 'operation'">
                  <div class="operation-content-btn">
                    <template
                      v-for="(item, index) in getStatusList(slotProps.row)"
                    >
                      <span v-if="item === '--'" :key="item">--</span>
                      <el-button
                        v-else
                        :key="index"
                        size="small"
                        type="text"
                        @click="item.handleClick(slotProps.row)"
                        >{{ item.text }}</el-button
                      >
                    </template>
                  </div>
                </template> -->
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
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
    <AddDialog ref="addDialog" />
  </div>
</template>

<script>
import mixinOrder from "../components/mixinOrder";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import { otherOrder } from "../components/model";
import {
  deleteOrderTradition,
  putOrderOther,
  copyOrderOther,
} from "@/api/trandition/otherOrder";
export default {
  mixins: [mixinOrder, mixinColsConf],
  name: "OtherOrder",
  components: {
    OrderSubmit: () => import("../components/OrderSubmit"),
    OrderReceiving: () => import("./components/orderReceive"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
    AddDialog: () => import("./components/AddDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "传统其他订单",
            name: "1",
          },
        ],
        btnArr: [
          {
            btnType: "dropdown",
            table: "新增",
            dropdownArr: [
              {
                name: "拖车",
                value: 1,
              },
              {
                name: "报关出证",
                value: 2,
              },
            ],
            handleClick: (_, dItem) => this.handlePlaceOrder(dItem.value),
          },
          {
            table: "导出",
            icon: "iconfont daochu",
            handleClick: () => this.handleExport("other"),
          },
        ],
      },
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
      mixinTableColArr: [otherOrder.lists],
    };
  },
  created() {},
  methods: {
    handlePlaceOrder(type) {
      switch (type) {
        case 1:
          this.$refs.addDialog.show();
          break;
        case 2:
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
      const { isHomeDelivery, id } = row;
      if (type === "editStatus") {
        putOrderOther({
          id,
          isHomeDelivery,
          orderStatus: 1,
          forecastType: 1,
        }).then(() => {
          this.mixinkeepTable(false);
        });
        return;
      } else if (type === "copy") {
        copyOrderOther(row.id).then((res) => {
          this.handleEditPage(res.data);
        });
      } else {
        this.handleEditPage(row.id);
      }
    },
    handleEditPage(id) {
      this.$router.push({
        path: "/newOrderManage/editOtherTransport",
        query: {
          id,
          backPath: "/newOrderManage/otherOrder",
        },
      });
    },
    handleDelete(row) {
      this.customMessageBox(
        this,
        {
          msgTitle: "删除提示",
          httpMsgRequest: () => deleteOrderTradition(row.id),
        },
        () => {
          this.msgSuccess("删除成功");
          this.mixinkeepTable(false);
        }
      );
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../components/common.scss";
.app-container {
}
</style>
