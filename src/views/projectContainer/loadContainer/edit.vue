<template>
  <div class="app-container">
    <ComDetailTop
      title="排柜编辑"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :config="{}"
    />

    <ComForm
      ref="updateForm"
      :formConfig="getUpdateFormConfig()"
      v-if="isInit"
      :class="isDelivery && 'delivery-plan'"
    >
      <template v-slot:configMianOrderId="slotProps">
        <AutoComplete
          v-if="isInit"
          ref="configMianOrderIdRef"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            operationMain: firstOperationMain,
          }"
        />
      </template>
    </ComForm>
    <template v-for="(ele, idx) in [1, 2, 3]">
      <div :key="idx">
        <template v-if="tableTitle[idx].isShow">
          <div class="ec-title">
            <div class="ec-title-dec">
              <span>{{ tableTitle[idx].title }}</span>
            </div>
            <div v-if="isInit && !tLoading">
              <el-button
                v-for="(btnItem, btnIndex) in tableTitle[idx].btnList"
                :key="btnIndex"
                v-debounce
                :type="btnItem.type"
                @click="btnItem.handleClick"
                :class="btnItem.class"
              >
                <i :class="btnItem.icon"></i>
                {{ btnItem.text }}
              </el-button>
            </div>
          </div>
        </template>
        <ComTable
          v-if="idx !== 2"
          :ref="`tableConfig${idx}`"
          :tableHeight="tableHeight(idx)"
          :columnConfig="tableList[idx].columnConfig"
          :columnData="tableList[idx].columnData"
          :pagination="false"
          v-loading="tLoading"
        >
          <template v-slot:customRow="{ slotProps }">
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
                <span>{{ slotProps.dicsList.nameCn }}</span>
              </div>
            </template>

            <template v-if="slotProps.prop === 'customsDeclarationType'">
              <span :class="['ellipsis-text']">
                {{ slotProps.dicsList.nameCn || "--" }}
              </span>
            </template>

            <template v-if="slotProps.prop === 'operation'">
              <div class="operation-content">
                <div class="btn">
                  <div class="btn-list">
                    <el-button
                      class="operate-icon operate-icon-info"
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDel(slotProps.row, idx)"
                    >
                      移除
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </ComTable>
        <div :class="['grand-total', 'subtotal', `subtotal_${idx}`]">
          <div class="subtotal-tit">{{ tableTotalArr[idx].name }}</div>
          <div
            v-for="(item, i) in tableTotalArr[idx].subtotalList"
            :key="i"
            class="subtotal-des"
          >
            <span class="subtotal-label">{{ item.label }}</span>
            <span class="subtotal-num">{{
              (total_obj[idx] &&
                (i > 1
                  ? toFixedNum(total_obj[idx][i] || 0)
                  : total_obj[idx][i])) ||
              0
            }}</span>
          </div>
        </div>
      </div>
    </template>

    <addContainer ref="updateDrawer" @handleClick="addTableClick" />
    <template v-if="isInit && !tLoading">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(fBtn, index) in footBtn">
          <el-button
            :type="fBtn.type"
            @click="fBtn.handleClick"
            :key="`b_${index}`"
            :loading="isBtnLoading"
          >
            {{ fBtn.text }}
          </el-button>
        </template>
      </div>
    </template>
    <!-- <div class="base-flex-between footer-btn">
      <el-button
        v-debounce
        type="primary"
        @click="addContainerEvt"
        class="add-btn"
      >
        <i class="el-icon-plus"></i>
        添 加
      </el-button>
      <div>
        <el-button type="primary" @click="submitForm" :loading="isBtnLoading" v-debounce>
          保 存
        </el-button>
        <el-button type="info" @click="cancelEvt"> 取 消 </el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import {
  getBoxSortDes,
  getWaitSort,
  boxSortSave,
  updateBoxSort,
} from "@/api/container/arrange.js";
import { accumulationFn, deleteOrAddArr } from "@/utils/instructions";
import { duplicateRemoval } from "@/utils/index";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { mapActions, mapState } from "vuex";
import {
  editFormColumns,
  editFormRules,
  deliveryPlanFromModel,
  editTableColumns,
  subtotalList,
} from "./model";
import addContainer from "../components/addContainer.vue";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  name: "EditLoadContainer",
  mixins: [mixinEditCache],
  data() {
    return {
      updateFormConfig: {
        formModel: {
          routeManageId: null,
        },
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: () => {
          this.msgSuccess("保存成功");
          this.$refs.detailTopRef?.comReBack({ isBackRefresh: true });
        }, // 表单提交成功回调
        labelWidth: "100px",
        // lists: editFormColumns({changeBookingRoute:this.getBookingSpace()}),
        formRules: editFormRules,
      },
      tableList: [
        {
          columnConfig: editTableColumns(),
          columnData: [],
        },
        {
          columnConfig: editTableColumns(2),
          columnData: [],
        },
      ],
      tableTotalArr: [
        {
          name: "预报小计：",
          subtotalList,
        },
        {
          name: "入仓小计：",
          subtotalList,
        },
        {
          name: "合计：",
          subtotalList,
        },
      ],
      total_obj: {
        0: [],
        1: [],
        2: [],
      },
      isInit: false, // 是否完成初始化
      isDelivery: false,
      tLoading: true,
      initResArr: [],
      footBtn: [
        {
          text: "保 存",
          type: "primary",
          handleClick: () => {
            this.submitForm();
          },
        },
        {
          text: "取 消",
          type: "info",
          handleClick: () => {
            this.cancelEvt();
          },
        },
      ],
      tableTitle: {
        0: {
          isShow: true,
          title: "电商订单列表",
          btnList: [
            {
              text: "添 加",
              type: "warning",
              icon: "el-icon-plus",
              class: "add-btn",
              handleClick: this.addContainerEvt,
            },
          ],
        },
        1: { isShow: false },
        2: { isShow: false },
      },
      operationMain: "",
      firstOperationMain: "",
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      if (rows.length) {
        this.$refs.updateForm?.submitForm();
      } else {
        this.msgError("请添加排柜");
      }
    },
    editFormSubmit(formModel) {
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      const operationOrder = duplicateRemoval(rows.map((e) => e.torderId));
      const { configMianOrderId, warehouseId, ...obj } = formModel;
      const opt = {
        ...obj,
        orderIds: rows.map((e) => e.torderNo),
        operationOrder,
        addOperationIds: deleteOrAddArr(this.initResArr, operationOrder),
        removeOperationIds: deleteOrAddArr(operationOrder, this.initResArr),
        dataStatus: 1,
        type: 1,
        singleBoxSum: this.total_obj[2][1], // 总箱数
        boxNum: 1,
        singleBoxWeight: this.total_obj[2][2], // 总重量
        cbm: this.total_obj[2][3], // 总方数
        startWarehouse: formModel.id
          ? obj.startWarehouse
          : configMianOrderId.startPortId,
        endWarehouse: formModel.id
          ? obj.endWarehouse
          : configMianOrderId.endPortId,
        warehouseId: warehouseId ? warehouseId : configMianOrderId.warehouseId,
      };
      if (opt.id) {
        return comSaveRepeatedRequest(updateBoxSort, opt);
        // return updateBoxSort(opt);
      }
      return comSaveRepeatedRequest(boxSortSave, opt);
      // return boxSortSave(opt);
    },
    handleDel(row = {}, index) {
      const rows = this.tableList[index].columnData.filter(
        (e) => e.orderId !== row.orderId
      );
      this.$set(this.tableList[index], "columnData", rows);
      this.$nextTick(() => {
        this.$refs[`tableConfig${index}`][0].refreshTable();
      });
      this._totalEvt();
    },
    addTableClick(ids) {
      this._getTableList(duplicateRemoval(ids).join(","));
    },
    addContainerEvt() {
      let { warehouseId, bookingSpaceProxy, id } = this.$route.query;
      if (!bookingSpaceProxy) {
        bookingSpaceProxy = this.updateFormConfig.formModel?.bookingSpaceProxy;
      }
      if (!warehouseId) {
        warehouseId = this.updateFormConfig.formModel?.warehouseId;
      }
      // console.log("this.this.operationMain", this.operationMain);
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      const ids = rows.map((e) => e.orderId);
      this.$refs.updateDrawer?.show({
        rows,
        ids: duplicateRemoval(ids).join(","),
        bookingSpaceProxy,
        warehouseId,
        operationMain: id ? this.operationMain : undefined,
      });
    },
    mixinInitData() {
      const { idRows, id, isDelivery } = this.$route.query;
      this.isInit = false;
      this.isDelivery = isDelivery === "delivery";
      if (this.isDelivery) {
        this.updateFormConfig = {
          ...this.updateFormConfig,
          ...deliveryPlanFromModel,
          formModel: {},
        };
      } else {
        this.updateFormConfig.lists = editFormColumns(!!id);
      }
      // 选择框回显时不能分页
      this._getTableList(idRows, id, "init");
    },
    async _getTableList(orderIds, id, evtName) {
      const opt = {
        orderIds,
        id,
        type: 0, // 0 预计 1 实际
        pageNum: 1,
        pageSize: 9999,
      };
      if (id) {
        const desData = (await getBoxSortDes(id)).data || {};
        const params = {
          ...desData,
          boxModel: this.typeConversion(desData.boxModel, "number"),
          startWarehouse: this.typeConversion(desData.startWarehouse, "number"),
          endWarehouse: this.typeConversion(desData.endWarehouse, "number"),
          configMianOrderId: {
            id: desData.routeManageId,
          },
          routeManageId: desData?.routeManageId || null,
        };
        this.$set(this.updateFormConfig, "formModel", params);
        this.$refs.updateForm?.setFormModel(params);
      }
      this.tLoading = true;
      const estimateData = await getWaitSort(opt);
      const actualData = await getWaitSort({
        ...opt,
        type: 1,
      });
      const firstRow = estimateData.rows.length
        ? estimateData.rows[0]
        : actualData.rows[0];
      this.firstOperationMain = firstRow.bookingSpaceProxy || undefined;
      if (evtName === "init") {
        // 先加载表单详情数据，再加载字典词
        await this["dictionary/getDictionary"]("cabinetArrangement");
        this.isInit = true;
      }
      if (id && !orderIds) {
        // 编辑时的初始数组
        const resRows = [...estimateData.rows, ...actualData.rows];
        this.initResArr = duplicateRemoval(resRows.map((e) => e.torderId));
      }
      this.$set(this.tableList[0], "columnData", estimateData.rows);
      this.$set(this.tableList[1], "columnData", actualData.rows);
      this.$nextTick(() => {
        this.$refs[`tableConfig0`][0].refreshTable();
        this.$refs[`tableConfig1`][0].refreshTable();
        this.tLoading = false;
      });
      this._totalEvt();
    },
    _totalEvt() {
      this.tableTotalArr.forEach((e, idx) => {
        if (idx === 0 || idx === 1) {
          const rows = this.tableList[idx].columnData;
          this.total_obj[idx] = e.subtotalList.map((ele) =>
            this.accumulation(rows, ele.key)
          );
        }
      });
      // 合计
      this.total_obj[0].forEach((e, i) => {
        this.total_obj[2][i] = accumulationFn([e, this.total_obj[1][i]]);
      });
    },
    accumulation(arr = [], key) {
      if (key === "total_rows") {
        return arr.length;
      }
      return accumulationFn(arr.map((e) => e[key]));
    },
    tableHeight(idx) {
      // return null
      const lent = this.tableList[idx].columnData?.length || 0;
      return lent > 7 ? `${7 * 50}px` : null;
    },
    cancelEvt() {
      this.$refs.detailTopRef?.comReBack();
    },
    getUpdateFormConfig() {
      let { warehouseId, bookingSpaceProxy, id } = this.$route.query;
      if (!bookingSpaceProxy) {
        bookingSpaceProxy = this.updateFormConfig.formModel?.bookingSpaceProxy;
      }
      if (!warehouseId) {
        warehouseId = this.updateFormConfig.formModel?.warehouseId;
      }
      return {
        ...this.updateFormConfig,
        lists: editFormColumns({
          changeBookingRoute: this.getBookingSpace,
          isintBookingRoute: this.getBookingSpaceIsint,
          bookingSpaceProxy,
          warehouseId,
          id,
        }),
      };
    },
    getBookingSpace(row = {}) {
      const {
        id = "",
        bookingSpaceProxyName = "",
        endPortId = "",
        startPortId = "",
        operationMain = "",
      } = row;
      this.operationMain = operationMain;
      this.$refs.updateForm?.setFormModel({
        startWarehouse: startPortId,
        endWarehouse: endPortId,
        bookingSpaceProxyName,
        routeManageId: id,
      });
    },
    getBookingSpaceIsint(rows = []) {
      const { id } = this.updateFormConfig.formModel?.configMianOrderId || {};
      const obj = (rows || []).filter((e) => e.id == id);
      this.getBookingSpace(obj[0] || []);
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  computed: {
    ...mapState({
      isBtnLoading: (state) => state.settings.isRepeatedClick,
    }),
  },
  components: {
    addContainer,
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .ec-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .ec-title-dec {
      font-size: 14px;
      font-weight: bold;
      color: #515151;
    }
    .add-btn {
      background: #ff813d;
      box-shadow: 0 3px 6px 0 rgba(255, 104, 22, 0.2);
      border-color: #ff813d;
    }
  }
  .com-detail-top {
    padding: 0px;
    margin-bottom: 20px;
  }
  .delivery-plan {
    /deep/ {
      .el-form-item--small.el-form-item {
        margin-bottom: 0px;
      }
    }
    margin-bottom: 20px;
  }
}
.footer-btn {
  padding: 15px 0 18px;
}
.operation-content {
  .iconfont {
    font-size: 13px;
    margin-right: 2px;
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
