<template>
  <!-- 此页面是否已经弃用 -->
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="getSearchFormConfig(1)"
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
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
              :tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="tableConfig.httpRequest[tab.name]"
              :getQueryParams="() => getQueryParams(4)"
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
                <template v-if="slotProps.prop === 'operation'">
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
    <OrderSubmit ref="OrderSubmit" @handleSuccess="mixinkeepTable" />
  </div>
</template>

<script>
import { airTransport } from "../components/model";
import mixinOrder from "../components/mixinOrder";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
export default {
  mixins: [mixinOrder, mixinColsConf],
  name: "AirTransport",
  components: {
    OrderSubmit: () => import("../components/OrderSubmit"),
    OrderReceiving: () => import("./components/orderReceive"),
    ConfirmDialog: () => import("_comp/ConfirmDialog"),
  },
  data() {
    return {
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "传统空运订单",
            name: "1",
          },
        ],
      },
      mixinTableColArr: [airTransport.lists],
    };
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../components/common.scss";
.app-container {
}
</style>
