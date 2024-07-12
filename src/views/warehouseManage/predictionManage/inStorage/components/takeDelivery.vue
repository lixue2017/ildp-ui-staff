<template>
  <div class="take-delivery">
    <div class="content-box">
      <ComDetailTop
        :title="`${pageConfig[type] && pageConfig[type].title} `"
        ref="detailTopRef"
        :formModel="basicInfoConfig.formModel"
        :config="{}"
        :class="`title-sides-margin-none detail-top-right-none`"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            ({{ basicInfoConfig.formModel.orderNum || "--" }})
          </span>
        </template>
      </ComDetailTop>

      <div class="header-info">
        <ComForm
          class="basic-info"
          ref="basicInfoForm"
          :formConfig="basicInfoConfig"
        />
      </div>
      <template v-if="initInfo.id">
        <div class="btn-group">
          <div class="left tabs">
            <div v-for="tab in tabsConfig.tabs" :key="tab.name">
              <el-button
                class="tabs-change"
                :type="tab.name === tabsConfig.active ? 'activation' : ''"
                size="small"
                plain
                @click="tabsConfig.handleTabsClick(tab.name)"
                v-if="!(type === 'fba' && tab.name === '1')"
              >
                {{ tab.label }}
              </el-button>
            </div>
          </div>
          <div class="right">
            <el-button
              type="primary"
              size="small"
              plain
              @click="bindTrayBefore"
              :disabled="!selectRowList.length"
            >
              {{ overseaLangObj.qd_sh || "确定收货" }}
            </el-button>
          </div>
        </div>
        <div v-if="tabsConfig.active == 1">
          <ComTable
            :ref="`tableConfig${tabsConfig.active}`"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="
              tableConfig.tableColumns[`prediction${tabsConfig.active}`]
            "
            :selectionRow="(e, index) => selectionRow(e, index)"
            @onSelectionChange="selectionChange"
            :selectionTableRow="selectRowList"
            :selectionKey="selectKey[tabsConfig.active]"
            :rowKey="selectKey[tabsConfig.active]"
            :columnData="tableConfig.columnData"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'sku'">
                <span class="marking" v-if="slotProps.row.isFirstTake">
                  {{ overseaLangObj.first_entry("首次入仓") }}
                </span>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.sku }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'length'">
                <el-input
                  v-if="slotProps.row.isFirstTake"
                  v-model="slotProps.row.length"
                  size="mini"
                  type="number"
                  class="figure-type"
                  @keydown.native="inputLimit($event, 'number')"
                />
                <el-row class="ellipsis-text" v-else>
                  {{ slotProps.row.length || "--" }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'width'">
                <el-input
                  v-if="slotProps.row.isFirstTake"
                  v-model="slotProps.row.width"
                  size="mini"
                  type="number"
                  class="figure-type"
                  @keydown.native="inputLimit($event, 'number')"
                />
                <el-row class="ellipsis-text" v-else>
                  {{ slotProps.row.width || "--" }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'height'">
                <el-input
                  v-if="slotProps.row.isFirstTake"
                  v-model="slotProps.row.height"
                  size="mini"
                  type="number"
                  class="figure-type"
                  @keydown.native="inputLimit($event, 'number')"
                />
                <el-row class="ellipsis-text" v-else>
                  {{ slotProps.row.height || "--" }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'caseNo'">
                <el-row
                  :class="[index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.freightBitFields || []"
                  :key="item.id"
                >
                  <div class="inventory-method">
                    <span class="method ellipsis-text">
                      {{ item.trackingNum || "--" }}
                    </span>
                  </div>
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'boxNumberSku'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.takeSkuStatistics || []"
                  :key="item.id"
                >
                  {{ item.boxNumber || "--" }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'forecastNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.freightBitFields || []"
                  :key="item.id"
                >
                  {{ item.forecastNum }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'warehousingBoxNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.takeSkuStatistics || []"
                  :key="item.id"
                >
                  {{ item.warehousingBoxNum }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'takeNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.freightBitFields || []"
                  :key="item.id"
                >
                  {{ item.takeNum }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'takeSkuNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.takeSkuStatistics || []"
                  :key="item.id"
                >
                  {{ item.takeSkuNum }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'boxSkuNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.takeSkuStatistics || []"
                  :key="item.id"
                >
                  {{ item.boxSkuNum }}
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'warehousingSkuNum'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.takeSkuStatistics || []"
                  :key="item.id"
                >
                  {{ item.warehousingSkuNum }}
                </el-row>
              </template>
              <!-- 存库方式-->
              <template v-if="slotProps.prop === 'enterWarehouse'">
                <div class="inventory-method">
                  <span class="method ellipsis-text">
                    {{ slotProps.dicsList.nameCn || "--" }}
                  </span>
                  <!-- <el-button size="mini" type="text"> 转一件代发 </el-button> -->
                </div>
              </template>
              <template v-if="slotProps.prop === 'storageType'">
                <el-radio-group
                  v-model="slotProps.row.storageType"
                  @change="(e) => changeStorageType(e, slotProps.row.id)"
                >
                  <el-radio :label="0">FBA入仓</el-radio>
                  <el-radio :label="1">大货中转</el-radio>
                </el-radio-group>
              </template>
              <!-- 收货数量 -->
              <template v-if="slotProps.prop === 'takeAmountBox'">
                <div style="width: 140px" class="hide-spin">
                  <el-input-number
                    style="width: 80px"
                    size="mini"
                    v-model="slotProps.row.takeAmountBox"
                    v-input-number-limit="slotProps.column.decimal"
                    :controls="false"
                    :min="slotProps.column.min"
                    :max="slotProps.column.max"
                    @keyup.native="
                      formatNumber($event, 'takeAmountBox', slotProps.row)
                    "
                    @blur="formatNumber($event, 'takeAmountBox', slotProps.row)"
                  />

                  <!-- <el-row class="ellipsis-text count-txt" v-else> -- </el-row> -->
                </div>
              </template>
              <template v-if="slotProps.prop === 'takeAmount'">
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.freightBitFields || []"
                  :key="item.id"
                >
                  <div style="width: 140px" class="hide-spin">
                    <el-input
                      v-if="item.isAdvice && !item.isFullTake && !item.isTake"
                      v-model="item.takeAmount"
                      size="mini"
                      type="number"
                      class="figure-type"
                      @keydown.native="inputLimit($event, 'number')"
                      style="width: 80px"
                      @keyup.native="formatNumber($event, 'takeAmount', item)"
                      clearable
                      @clear="clearInput(slotProps.row)"
                    />
                    <el-row class="ellipsis-text count-txt" v-else> -- </el-row>
                  </div>
                </el-row>
              </template>
              <template v-if="slotProps.prop === 'operation'">
                <div class="operate-btn-list" v-if="tabsConfig.active === '1'">
                  <div
                    class="btn"
                    v-for="(item, index) in tableConfig.statusList"
                    :key="index"
                  >
                    <el-button
                      :class="`operate-icon ${
                        item.info ? 'operate-icon-info' : ''
                      }`"
                      size="mini"
                      type="text"
                      :icon="item.icon"
                      @click="item.handleClick(slotProps.row)"
                    >
                      {{ item.text }}
                    </el-button>
                  </div>
                </div>
                <el-row
                  :class="['ellipsis-text', index === 0 ? '' : 'freight-rows']"
                  v-for="(item, index) in slotProps.row.freightBitFields ||
                  slotProps.row.takeSkuStatistics"
                  :key="item.id"
                >
                  <div class="operate-btn-list">
                    <div
                      class="btn"
                      v-for="(item, index) in tableConfig.statusList"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        :icon="item.icon"
                        @click="item.handleClick(slotProps.row)"
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                </el-row>
              </template>
            </template>
          </ComTable>
          <template v-if="tabsConfig.active != 2">
            <div style="padding: 15px 0px">
              {{ overseaLangObj.sh_info || "收货信息" }}
            </div>
            <ComTable
              :ref="`receiptConfig${tabsConfig.active}`"
              :tableHeight="receiptConfig.tableHeight"
              :columnConfig="
                receiptConfig.tableColumns[`received${tabsConfig.active}`]
              "
              :rowKey="selectKey[tabsConfig.active]"
              :columnData="receiptConfig.columnData"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'sku'">
                  <span class="marking" v-if="slotProps.row.isFirstTake">
                    {{ overseaLangObj.first_entry("首次入仓") }}
                  </span>
                  <el-row class="ellipsis-text">
                    {{ slotProps.row.sku }}
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'caseNo'">
                  <el-row
                    :class="[index === 0 ? '' : 'freight-rows']"
                    v-for="(item, index) in slotProps.row.freightBitFields ||
                    []"
                    :key="item.id"
                  >
                    <div class="inventory-method">
                      <span class="method ellipsis-text">
                        {{ item.trackingNum || "--" }}
                      </span>
                    </div>
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'freightNum'">
                  <template v-if="!slotProps.row.isUpdate">
                    {{ slotProps.row[slotProps.prop] || 0 }}
                  </template>
                  <el-input-number
                    v-else
                    size="mini"
                    v-model="slotProps.row[slotProps.prop]"
                    v-input-number-limit="slotProps.column.decimal"
                    :min="slotProps.column.min"
                    :max="slotProps.column.max"
                    :controls="false"
                    :placeholder="slotProps.column.placeholder"
                  />
                </template>
                <template v-if="slotProps.prop === 'operation'">
                  <div class="operate-btn-list">
                    <div
                      class="btn"
                      v-for="(item, index) in receiptConfig.statusList[
                        slotProps.row.isUpdate || 0
                      ]"
                      :key="index"
                    >
                      <el-button
                        :class="`operate-icon ${
                          item.info ? 'operate-icon-info' : ''
                        }`"
                        size="mini"
                        type="text"
                        :icon="item.icon"
                        @click="
                          item.handleClick(slotProps.row, slotProps.rowIndex)
                        "
                      >
                        {{ item.text }}
                      </el-button>
                    </div>
                  </div>
                </template>
              </template>
              <template v-slot:bottomTotal="{ slotProps }">
                <div class="grand-total">
                  <div class="tableTotal-flex">
                    <span class="title">小计：</span>
                    <div class="tableTotal-flex">
                      <div
                        v-for="(item, index) in getDataSummary(
                          receiptConfig.columnData
                        )"
                        :key="index"
                        class="item-space"
                      >
                        <span>{{ item.label }}：</span>
                        <span>{{ item.total }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </ComTable>
          </template>
        </div>
        <div v-if="tabsConfig.active == 2">
          <SkuReceipt
            ref="skuReceiptRef"
            :formData="initInfo"
            :menuType="'buttOrder'"
            @getSkuSelect="getSkuSelect"
          />
        </div>
        <!-- :httpRequest="receiptConfig.httpRequest[tabsConfig.active]"
            :getQueryParams="() => getReceiptQueryParams(tabsConfig.active)" -->
      </template>
    </div>
    <div class="order-footer" v-if="!$route.query.isSearch">
      <el-button @click="finishStorage()" type="primary">{{
        overseaLangObj.receipt_completed || "收货完成"
      }}</el-button>
      <el-button @click="reBack()">{{
        overseaLangObj.gb_close || "关 闭"
      }}</el-button>
    </div>
    <BindingTray ref="trayDialog" @handleSuccess="handleSuccess" />
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  storehouseLists,
  eCommerceTable,
  fbaTable,
  eCommerceTotalLists,
} from "./tDmodel";
import {
  getTakeDeliveryInfo,
  getBoxList,
  editIsAdviceEc,
  editIsAdvice,
  updateReceipt,
  deleteReceipt,
  finishStorage,
  POSTRcOrderStorageInfoNew,
} from "@/api/warehouse/prediction";
import { accumulationFn } from "@/utils/instructions";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComForm: () => import("_comp/ComForm"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    BindingTray: () => import("./bindingTray"),
    SkuReceipt: () => import("./skuReceipt"),
    // HarvestPage: () => import("./harvestPage"),
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  data() {
    return {
      basicInfoConfig: {
        formModel: {},
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "142px" : "92px",
        lists: storehouseLists,
      },
      tabsConfig: {
        active: "1",
        handleTabsClick: this.changeTabs,
        tabs: [],
      },
      tabList: [
        {
          label: this.overseaLangObj.ax_sh || "按箱收货",
          isBox: [true],
          name: "1",
        },
        {
          label: this.overseaLangObj.a_sku_sh || "按SKU收货",
          isSku: [true],
          name: "2",
        },
      ],
      selectKey: {
        1: "id",
        2: "productId",
      },
      tableConfig: {
        tableHeight: "300px",
        tableColumns: eCommerceTable,
        columnData: [],
      },
      receiptConfig: {
        tableHeight: "300px",
        tableColumns: [],
        columnData: [],
        statusList: {
          0: [
            {
              text: this.overseaLangObj.bj_edit("修改"),
              handleClick: this.handleUpdate,
            },
            {
              text: this.overseaLangObj.yc_delete("删除"),
              handleClick: this.handleDelete,
            },
          ],
          1: [
            {
              text: this.overseaLangObj.bc_save("保存"),
              handleClick: this.handleSave,
            },
            {
              text: this.overseaLangObj.qx_cancel("取消"),
              handleClick: this.handleReduction,
            },
          ],
        },
      },
      httpRequest: {
        1: this.getBoxList,
        2: this.getSkuList,
      },
      selectRowList: [],
      type: "eCommerce",
      pageConfig: {
        //电商入库有按箱和按SKU， FBA入库只有按SKU，目前FBA入库页面已经停用，后续可能会启用
        eCommerce: {
          title: this.overseaLangObj.ds_tc_rkd || "电商头程入库单",
          formLabel: "头程入库单号：",
          formLabelBox: "预报箱数：",
          orderType: 0,
          tableColumns: eCommerceTable,
          inStorageSource: 2,
        },
        fba: {
          //FBA目前已停用，之后可能会启用但不知道页面会不会改要不要单独提出去做一个页面
          title: "FBA退仓入库",
          formLabel: "FBA退仓单号：",
          formLabelBox: "预报包裹数：",
          orderType: 2,
          tableColumns: fbaTable,
          inStorageSource: 0,
        },
      },
      initInfo: {},
      currRow: {},
      tableData: [],
      // isSee: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage");
    this.getInitRes(false, true);
  },
  methods: {
    getInitRes(harvestType, isCreate) {
      const { type, isSee } = this.$route.query;
      const nType = harvestType ? harvestType : type;
      const { active } = this.tabsConfig;
      this.type = nType;
      // this.isSee = isSee;
      this.selectRowList = [];
      //tab栏
      this.tabsConfig.active = nType === "fba" ? "2" : "1";
      let tableColumns = JSON.parse(
        JSON.stringify(this.pageConfig[nType].tableColumns(isSee))
      );
      // 详情
      // if (isSee && isCreate) {
      //   tableColumns[`prediction${active}`] = tableColumns[
      //     `prediction${active}`
      //   ].filter((e) => e.type || e.prop);
      //   tableColumns[`received${active}`] = tableColumns[
      //     `received${active}`
      //   ].filter((e) => e.type || e.prop);
      // }
      //fba、eCommerce展示数据
      this.tableConfig.tableColumns = tableColumns;
      this.receiptConfig.tableColumns = tableColumns;
      //获取头部信息
      const fbaCols = localStorage.getItem("fbaCols");
      const eCommerceCols = localStorage.getItem("eCommerceCols");
      const cols = {
        eCommerce: eCommerceCols,
        fba: fbaCols,
      };
      if (!cols[nType]) {
        return;
      }
      this.initInfo = JSON.parse(cols[nType]);
      console.log(this.initInfo);
      const { id, orderEcId } = this.initInfo;
      this.getDetails(orderEcId || id);
    },
    ...mapActions(["dictionary/getDictionary"]),
    changeTabs(key) {
      this.tabsConfig.active = key;
      setTimeout(() => {
        this.httpRequest[key]();
      });
    },
    finishStorage() {
      const title = "提示";
      const className = "el-icon-warning text-warning";
      const msg = "是否收货完成？确认后不可修改收货数据!";
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        const {
          orderEcId,
          id,
          orderOperationId: operationOrderId,
        } = this.initInfo;
        finishStorage({
          ecOrderId: orderEcId || id,
          operationOrderId,
        }).then(() => {
          this.reBack();
        });
      });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    getQueryParams(tab) {
      return {};
    },
    getReceiptQueryParams(tab) {
      return {};
    },
    getSkuList() {
      this.$refs.skuReceiptRef?.getTableData();
      // const active = this.tabsConfig.active;
      // setTimeout(() => {
      //   this.selectRowList = [];
      //   this.$refs[`tableConfig${active}`].clearCheckRowList();
      //   this.$refs[`tableConfig${active}`].clearSelection();
      // }, 200);
      // return new Promise((resolve) => {
      //   const { id, orderEcId, orderType } = this.initInfo;
      //   const reqs = {
      //     eCommerce: getSkuListButt,
      //     fba: getSkuList,
      //   };
      //   reqs[this.type](orderEcId || id, orderType).then((res) => {
      //     const ret = res.rows || res.data;
      //     if (ret && ret.length) {
      //       ret.forEach((item) => {
      //         if (item.takeSkuStatistics) {
      //           item.takeSkuStatistics.forEach((eles) => {
      //             eles.takeAmount = eles.warehousingSkuNum;
      //           });
      //         }
      //         if (item.freightBitFields) {
      //           item.freightBitFields.forEach((eles) => {
      //             eles.takeAmount = eles.forecastNum;
      //           });
      //         }
      //       });
      //     }
      //     this.tableData = ret || [];
      //     this.tableConfig.columnData = [...ret];
      //     console.log(this.tableData);
      //     this.$refs[`tableConfig${active}`].setNewTableData(
      //       this.tableConfig.columnData
      //     );
      //     return resolve(res);
      //   });
      // });
    },
    getBoxList() {
      const active = this.tabsConfig.active;
      setTimeout(() => {
        this.selectRowList = [];
        this.$refs[`tableConfig${active}`].clearCheckRowList();
        this.$refs[`tableConfig${active}`].clearSelection();
      }, 200);
      const {
        id,
        orderEcId,
        orderOperationId: operationOrderId,
      } = this.initInfo;
      const reqs = {
        eCommerce: POSTRcOrderStorageInfoNew,
        fba: getBoxList,
      };
      reqs[this.type](orderEcId || id, operationOrderId).then((res) => {
        let ret;
        if (res.data?.ecOkwarehouseStorages) {
          const ecOkwarehouseStorages = res.data?.ecOkwarehouseStorages;
          ret = res.data?.orderEcFreightListVos;
          ecOkwarehouseStorages.map((item) => {
            item.isUpdate = 0;
          });
          this.receiptConfig.columnData = [...ecOkwarehouseStorages];
          this.$refs[`receiptConfig${active}`].setNewTableData(
            ecOkwarehouseStorages
          );
        }
        if (!ret) {
          ret = res.rows || res.data;
        }
        if (ret && ret.length) {
          ret.forEach((item) => {
            // 收货箱数 默认预收箱数-已收箱数>0?预收箱数-已收箱数:1
            const num = item.forecastBoxNum - (item.takeFreightBoxNum || 0);
            item.takeAmountBox = num > 0 ? num : 1;
          });
        }
        this.tableData = ret || [];
        this.tableConfig.columnData = [...ret];
        this.$refs[`tableConfig${active}`].setNewTableData(ret);
        console.log(this.tableConfig.columnData);
      });
    },
    getDataSummary(rows) {
      const totalList = (eCommerceTotalLists || []).map((e) => {
        const { getParamLength = false, value } = e;
        if (getParamLength) {
          const trayNumArr = (rows || []).map((e) => e[value]);
          return {
            ...e,
            total: [...new Set(trayNumArr)].length,
          };
        } else {
          return {
            ...e,
            total: accumulationFn((rows || []).map((e) => e[value])), //电商
          };
        }
      });
      return totalList;
    },
    selectionRow(e) {
      const fields = {
        eCommerce: "takeSkuStatistics",
        fba: "freightBitFields",
      };
      if (this.tabsConfig.active == 1) {
        // 电商头程 isTake 0-未收货，1-已收货
        // flag = e.isAdvice && e.takeAmountBox && e.isTake !== 1;
        const tableData = this.selectRowList || [];
        const rSome = tableData.some(
          (item) => item.storageWay === e.storageWay
        );
        if (tableData.length && !rSome) {
          return false; // 禁止选择
        }
        return true; // 可选
      } else {
        const flag =
          e[fields[this.type]] &&
          e[fields[this.type]].some((item) => {
            return item.isAdvice == 1 && item.takeAmount && item.isTake !== 1;
          });
        if (flag) {
          return true;
        }
        return true; // 可选
      }
    },
    hideOperate(item) {
      const { id, isAdvice } = item;
      const reqs = {
        eCommerce: editIsAdviceEc,
        fba: editIsAdvice,
      };
      reqs[this.type]({ id, isAdvice: isAdvice == 0 ? 1 : 0 }).then(() => {
        this.handleSuccess();
      });
    },
    getDetails(id) {
      const {
        orderNum,
        bailorPeople,
        orderOperationNum,
        orderOperationId: operationOrderId,
      } = this.initInfo;
      const params = {
        orderId: id,
        orderType: this.pageConfig[this.type].orderType,
        operationOrderId,
      };
      getTakeDeliveryInfo(params).then((res) => {
        // console.log("details", res.data);
        const models = {
          totalSukNum: res.data.productCount,
          ...res.data,
          orderNum:
            this.type === "eCommerce"
              ? res.data.orderNum || orderOperationNum
              : orderNum,
          bailorPeople: res.data.customerName || bailorPeople,
        };
        this.basicInfoConfig.formModel = models;
        this.getTabsBtns(models);
        this.$refs.basicInfoForm &&
          this.$refs.basicInfoForm.setFormModel(models);
        this.changeTabs(this.tabsConfig.tabs[0].name);
      });
    },
    selectionChange(checkRowList = [], tableData = []) {
      // console.log("checkRowList", checkRowList, tableData);
      let list = [];
      tableData.forEach((item) => {
        checkRowList.forEach((eles) => {
          if (
            item[this.selectKey[this.tabsConfig.active]] ===
            eles[this.selectKey[this.tabsConfig.active]]
          ) {
            list.push(item);
          }
        });
      });
      list = checkRowList.filter(
        (item) => item.storageWay === list[0].storageWay
      );
      this.selectRowList = list;
      this.$refs[
        `tableConfig${this.tabsConfig.active}`
      ]._toggleRowSelectionMixin({ newCheckRows: this.selectRowList });
    },
    bindTrayBefore() {
      if (!this.selectRowList.length) {
        this.$message.error("未选中订单！");
      } else {
        const { active } = this.tabsConfig;
        const dislogTips = (this.selectRowList || []).some((e) => {
          if (active == 1) {
            return e.forecastBoxNum != e.takeAmountBox;
          } else {
            return e.forecastSkuNum != e.takeAmountSku;
          }
        });
        if (dislogTips) {
          const title = "收货提示";
          const className = "el-icon-warning text-warning";
          const msg = "预报数量和收货数量不一致，确认是否收货。";
          msgBox(
            this,
            { title, className, msg, showCancelButton: true },
            () => {
              this.bindTray();
            }
          );
        } else {
          this.bindTray();
        }
      }
    },
    bindTray() {
      const { warehouseId } = this.basicInfoConfig.formModel;
      const showInfo = {
        ...this.initInfo,
        storageWay: this.tabsConfig.active,
        inStorageSource: this.pageConfig[this.type].inStorageSource,
        warehouseId,
        trayType: this.type,
      };
      this.$refs.trayDialog.show(showInfo, this.selectRowList);
    },
    numberVerify(totalAmount, takeAmount, inputAmount) {
      // return inputAmount <= totalAmount * 1 - takeAmount * 1 && inputAmount > 0
      //   ? inputAmount.toFixed(0)
      //   : "";
      return inputAmount > 0 ? inputAmount.toFixed(0) : "";
    },
    formatNumber(e, key, formModel) {
      const {
        warehousingSkuNum,
        takeSkuNum,
        warehousingBoxNum,
        boxCount,
        forecastNum,
        takeNum,
      } = formModel;
      let tps = e.target.value * 1;
      if (warehousingSkuNum) {
        tps = this.numberVerify(warehousingSkuNum, takeSkuNum, tps); //电商
      } else if (warehousingBoxNum) {
        tps = this.numberVerify(warehousingBoxNum, takeNum, tps); //电商
      } else if (boxCount) {
        tps = this.numberVerify(boxCount, takeNum, tps); //电商
      } else if (forecastNum) {
        tps = this.numberVerify(forecastNum, takeNum, tps);
      }
      formModel[key] = tps;
      // console.log("tableData", this.tableData);
      const active = this.tabsConfig.active;
      if (active == 1) {
        //按箱
        this.tableData.forEach((item) => {
          if (item.id === formModel.id) item.takeAmountBox = tps;
        });
        this.$refs[`tableConfig${active}`].setNewTableData(this.tableData);
      }
    },
    clearInput(item) {
      const active = this.tabsConfig.active;
      this.$refs[`tableConfig${active}`].toggleRowSelection(item, false);
      if (active == 1) {
        //按箱
        this.tableData.forEach((eles) => {
          if (eles.id === item.id) eles.takeAmountBox = "";
        });
        this.$refs[`tableConfig${active}`].setNewTableData(this.tableData);
      }
    },
    handleChange(val, row) {
      if (val <= 0) {
        // 收货箱数 默认预收箱数-已收箱数>0?预收箱数-已收箱数:1
        const num = row.forecastBoxNum - (row.takeFreightBoxNum || 0);
        row.takeAmountBox = num > 0 ? num : 1;
      }
    },
    changeStorageType(e, id) {
      editIsAdviceEc({ id, storageType: e }).then(() => {
        this.handleSuccess();
      });
    },
    print() {},
    handleSuccess() {
      // this.$refs[`tableConfig${this.tabsConfig.active}`].refreshTable(true);
      this.httpRequest[this.tabsConfig.active]();
    },
    handleUpdate(row, index) {
      this.currRow[index] = {
        ...row,
      };
      row.isUpdate = 1;
    },
    handleDelete(row, index) {
      const { id } = row;
      deleteReceipt(id).then(() => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.httpRequest[this.tabsConfig.active]();
      });
    },
    handleSave(row) {
      const { id, freightNum } = row;
      const params = {
        id,
        freightNum,
      };
      this.comRepeatedRequest(this, updateReceipt, params).then(() => {
        this.msgSuccess("保存成功");
        this.httpRequest[this.tabsConfig.active]();
      });
    },
    handleReduction(row, index) {
      const { takeFreightBoxNum } = this.currRow[index];
      row.takeFreightBoxNum = takeFreightBoxNum;
      row.isUpdate = 0;
    },
    getSkuSelect(rows) {
      //获取SKU勾选数据
      this.selectRowList = rows;
    },
    getTabsBtns(row) {
      const { isBox, isSku } = row;
      this.tabsConfig.tabs = this.tabList.filter((e) => {
        if (e.isBox) {
          return e.isBox.includes(isBox);
        } else if (e.isSku) {
          return e.isSku.includes(isSku);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./takeDelivery.scss";
.tableTotal-flex {
  display: flex;
  .item-space {
    margin-right: 20px;
  }
}
</style>
