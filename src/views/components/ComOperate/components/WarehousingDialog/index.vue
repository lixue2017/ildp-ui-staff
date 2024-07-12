<template>
  <ComDialog
    v-if="dialogShow"
    ref="myDialog"
    :customDialog="dialogConfig"
    @onClose="handleClose"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <div class="warehousing-form">
        <ComForm :formConfig="formConfig" ref="myComForm" />
      </div>
      <div class="warehousing-table">
        <div class="new-line">
          <div class="title">货物信息</div>
          <el-button
            size="mini"
            type="primary"
            plain
            round
            @click="handleAddLine()"
            >新增行</el-button
          >
        </div>
        <ComTable
          ref="tableConfig"
          :tableHeight="tableConfig.tableHeight"
          :columnConfig="tableConfig.columnConfig"
          :httpRequest="tableConfig.httpRequest"
          :pagination="false"
          :extraConfig="{
            stripe: false,
          }"
          v-if="Object.keys(dictDataObj).length"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'indexSlot'">
              <div class="tag passing" v-if="slotProps.row.isMachine === 1">
                已过机
              </div>
              <div
                class="tag new"
                :style="{ top: slotProps.row.isMachine === 1 ? '17px' : 0 }"
                v-if="!slotProps.row.deleted && slotProps.row.isNew"
              >
                新
              </div>
              <div
                class="tag delete"
                :style="{ top: slotProps.row.isMachine === 1 ? '17px' : 0 }"
                v-if="slotProps.row.deleted"
              >
                删
              </div>

              <span>{{ slotProps.rowIndex + 1 }}</span>
            </template>
            <template v-if="slotProps.prop === 'shipmentId'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.row.shipmentId || "--" }}
                </el-row>
                <el-row>
                  {{ slotProps.row.referenceId || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.shipmentId"
                    placeholder="Shipment ID"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.referenceId"
                    placeholder="Reference ID"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'sku'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
                <el-row v-if="formConfig.formModel.operationOrderType !== 1">
                  {{ slotProps.row.sku || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
                <el-row
                  class="ellipsis-text"
                  v-if="formConfig.formModel.operationOrderType !== 1"
                >
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.sku"
                    placeholder="SKU"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'customsDeclarationType'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-select
                    v-model="slotProps.row.customsDeclarationType"
                    style="width: 100%"
                    :clearable="false"
                  >
                    <el-option
                      v-for="selectItem in dictDataObj.customsDeclarationType"
                      :key="selectItem.value"
                      :label="selectItem.nameCn"
                      :value="selectItem.value"
                    />
                  </el-select>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'packType'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text">
                  {{ slotProps.dicsList.nameCn || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-select
                    v-model="slotProps.row.packType"
                    style="width: 100%"
                    :clearable="false"
                  >
                    <el-option
                      v-for="selectItem in dictDataObj.packagingCode"
                      :key="selectItem.value"
                      :label="selectItem.nameCn"
                      :value="selectItem.value"
                    />
                  </el-select>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'boxCount'">
              <template v-if="!slotProps.row.isUpdate">
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="slotProps.row.boxCount"
                  :verifyVal="slotProps.row.warehousingBoxNum"
                  :decimal="slotProps.column.decimal"
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    slotProps.row.boxCount || "--"
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    slotProps.row.warehousingBoxNum
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ slotProps.row.boxCount || "--" }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row.warehousingBoxNum"
                    size="mini"
                    :min="0"
                    :max="slotProps.column.colMax"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="slotProps.column.decimal || 0"
                    @change="
                      () => handleChange(slotProps.row, 'warehousingBoxNum')
                    "
                  />
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'boxLength'">
              <template
                v-if="!slotProps.row.isUpdate || slotProps.row.isMachine === 3"
              >
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="slotProps.row.boxLength"
                  :verifyVal="slotProps.row.warehousingLength"
                  :decimal="slotProps.column.decimal"
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    toFixedNum(
                      slotProps.row.boxLength || "--",
                      slotProps.column.decimal
                    )
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    slotProps.row.warehousingLength
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{
                    toFixedNum(
                      slotProps.row.boxLength || "--",
                      slotProps.column.decimal
                    )
                  }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row.warehousingLength"
                    size="mini"
                    :min="0"
                    :max="slotProps.column.colMax"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="slotProps.column.decimal"
                  />
                </el-row>
              </template>
            </template>

            <template v-if="slotProps.prop === 'boxWidth'">
              <template
                v-if="!slotProps.row.isUpdate || slotProps.row.isMachine === 3"
              >
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="slotProps.row.boxWidth"
                  :verifyVal="slotProps.row.warehousingWidth"
                  :decimal="slotProps.column.decimal"
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    toFixedNum(
                      slotProps.row.boxWidth || "--",
                      slotProps.column.decimal
                    )
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    slotProps.row.warehousingWidth
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{
                    toFixedNum(
                      slotProps.row.boxWidth || "--",
                      slotProps.column.decimal
                    )
                  }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row.warehousingWidth"
                    size="mini"
                    :min="0"
                    :max="slotProps.column.colMax"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="slotProps.column.decimal"
                  />
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'boxHeight'">
              <template
                v-if="!slotProps.row.isUpdate || slotProps.row.isMachine === 3"
              >
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="slotProps.row.boxHeight"
                  :verifyVal="slotProps.row.warehousingHeight"
                  :decimal="slotProps.column.decimal"
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    toFixedNum(
                      slotProps.row.boxHeight || "--",
                      slotProps.column.decimal
                    )
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    slotProps.row.warehousingHeight
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{
                    toFixedNum(
                      slotProps.row.boxHeight || "--",
                      slotProps.column.decimal
                    )
                  }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row.warehousingHeight"
                    size="mini"
                    :min="0"
                    :max="slotProps.column.colMax"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="slotProps.column.decimal"
                  />
                </el-row>
              </template>
            </template>

            <template
              v-if="['boxWeight', 'totalWeight'].includes(slotProps.prop)"
            >
              <!-- 单重与总重 -->
              <template
                v-if="!slotProps.row.isUpdate || slotProps.row.isMachine === 3"
              >
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="toFixedNum(slotProps.row[slotProps.column.prop])"
                  :verifyVal="
                    toFixedNum(slotProps.row[slotProps.column.verifyProp])
                  "
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    toFixedNum(slotProps.row[slotProps.column.prop] || "--")
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    toFixedNum(slotProps.row[slotProps.column.verifyProp])
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ toFixedNum(slotProps.row[slotProps.column.prop] || "--") }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row[slotProps.column.verifyProp]"
                    size="mini"
                    :min="0"
                    :max="slotProps.column.colMax"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="
                      slotProps.column ? slotProps.column.decimal : null
                    "
                    @change="
                      () =>
                        handleChange(slotProps.row, slotProps.column.verifyProp)
                    "
                  >
                  </el-input-number>
                </el-row>
              </template>
            </template>

            <template
              v-if="['boxVolume', 'totalVolume'].includes(slotProps.prop)"
            >
              <!-- 单体积与总体积 -->
              <template
                v-if="
                  !slotProps.row.isUpdate ||
                  orderType == 2 ||
                  slotProps.row.isMachine === 3
                "
              >
                <DiffMark
                  v-if="!slotProps.row.isNew || slotProps.row.isMachine === 3"
                  :currentVal="toFixedNum(slotProps.row[slotProps.column.prop])"
                  :verifyVal="
                    toFixedNum(slotProps.row[slotProps.column.verifyProp])
                  "
                />
                <template v-else>
                  <el-row class="ellipsis-text">{{
                    toFixedNum(slotProps.row[slotProps.column.prop] || "--")
                  }}</el-row>
                  <el-row class="ellipsis-text show-overflow-tooltip">{{
                    toFixedNum(slotProps.row[slotProps.column.verifyProp] || 0)
                  }}</el-row>
                </template>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  {{ toFixedNum(slotProps.row[slotProps.column.prop] || "--") }}
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input-number
                    v-model="slotProps.row[slotProps.column.verifyProp]"
                    size="mini"
                    :min="0"
                    placeholder="请输入"
                    :controls="false"
                    v-input-number-limit="
                      slotProps.column ? slotProps.column.decimal : null
                    "
                    @change="
                      () =>
                        handleChange(slotProps.row, slotProps.column.verifyProp)
                    "
                  >
                  </el-input-number>
                </el-row>
              </template>
            </template>

            <template v-if="slotProps.prop === 'code'">
              <template v-if="!slotProps.row.isUpdate">
                <el-row class="ellipsis-text show-overflow-tooltip">
                  {{ slotProps.row.warehousingProductName || "--" }}
                </el-row>
                <el-row class="ellipsis-text show-overflow-tooltip">
                  {{ slotProps.row.customsCode || "--" }}
                </el-row>
              </template>
              <template v-else>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.warehousingProductName"
                    placeholder="品名"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
                <el-row class="ellipsis-text">
                  <el-input
                    type="text"
                    size="mini"
                    v-model="slotProps.row.customsCode"
                    placeholder="HSCODE"
                    maxlength="50"
                    class="text-align-left"
                  ></el-input>
                </el-row>
              </template>
            </template>
            <template v-if="slotProps.prop === 'operation'">
              {{ slotProps.row.index }}
              <template v-if="slotProps.row.deleted">
                <el-button
                  class="operate-icon"
                  size="small"
                  type="text"
                  @click="handleRecovery(slotProps.row)"
                  >恢复</el-button
                >
              </template>
              <template v-else>
                <template
                  v-for="(iBtn, index) in tableConfig.statusList[
                    slotProps.row.isUpdate || 0
                  ]"
                >
                  <el-button
                    :class="`operate-icon`"
                    size="small"
                    type="text"
                    :key="index"
                    :style="{ color: iBtn.color }"
                    v-if="iBtn.showBtnFn ? iBtn.showBtnFn(slotProps.row) : true"
                    v-hasPermi="
                      orderType === 2 ? iBtn.hasPermission : undefined
                    "
                    @click="iBtn.handleClick(slotProps.row)"
                    >{{ iBtn.text }}</el-button
                  >
                </template>
              </template>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template v-if="/shipmentId|sku|code/.test(slotProps.column.prop)">
              <div>{{ slotProps.column.labelTop }}</div>
              <div>{{ slotProps.column.labelBtm }}</div>
            </template>
          </template>
        </ComTable>
        <div class="grand-total">
          <template v-for="gross in grossTotalConfig">
            <span :key="gross.prop">
              <template v-if="gross.hideDiffMark">
                <span class="label">{{ gross.label }}</span>
                <span class="value">
                  {{ grossTotal[gross.prop] }}{{ gross.util && gross.util }}
                </span>
              </template>
              <DiffMark
                v-else
                :key="gross.prop"
                :currentVal="grossTotal[gross.propVery] || 0"
                :verifyVal="grossTotal[gross.prop] || 0"
                :label="gross.label"
                :decimal="gross.decimal"
                :calculationMethod="'old-new'"
                :grossTotal="!!grossTotal[gross.propVery]"
              />
            </span>
          </template>
        </div>
      </div>
    </template>
  </ComDialog>
</template>
<script>
import { mapState } from "vuex";
import {
  freightVerify,
  getListByOperationId,
} from "@/api/operateManage/common";
import { comSaveRepeatedRequest } from "@/api/common";
import { getEcFreightEdit } from "@/api/order/firstTransport";
import { calculation } from "@/utils/calculation";
import { handleDecimal } from "@/utils/validate";
import {
  multiplicationFn,
  dividedFn,
  accumulationFn,
  subtractFn,
} from "@/utils/instructions";
import { msgTipBox } from "@/utils/confirmBox.js";
import { config, formConfig } from "./model";

export default {
  props: {
    againVerify: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    DiffMark: () => import("_comp/DiffMark"),
  },
  data() {
    return {
      dialogShow: false,
      grossTotalConfig: config.grossTotal,
      dialogConfig: {
        title: "入仓数据核实", // 国内
        width: "1300px",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.myDialog.handleClose();
            },
          },
          {
            text: "保存",
            type: "primary",
            handleClick: this.submitSave,
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth: "92px",
        lists: formConfig(),
      },
      tableConfig: {
        // tableHeight: "500px",
        statusList: {
          0: [
            {
              text: "修改",
              handleClick: (row) => {
                row.isUpdate = 1;
                const id = row.id ? row.id : `newId${row.newId}`;
                this.currRow = { ...this.currRow, [id]: { ...row } };
              },
              showBtnFn: (r) => {
                return r.isMachine !== 1;
              },
            },
            {
              text: "复制",
              handleClick: (row) => this.handleAddLine("copy", row),
              showBtnFn: (r) => {
                return r.isMachine === 1;
              },
            },
            {
              text: "删除",
              color: "#FF6767",
              handleClick: this.handleDelete,
              showBtnFn: (r) => {
                return r.isMachine !== 1;
              },
              hasPermission: ["operateManage:warehousing:delete"],
            },
          ],
          1: [
            {
              text: "取消",
              handleClick: (row) => {
                const key = row.id ? row.id : `newId${row.newId}`;
                if (this.currRow[key].newAdd) {
                  const lists = this.$refs.tableConfig.getNewTableData();
                  const index = lists.findIndex(
                    (item) => (item.newId = row.newId)
                  );
                  lists.splice(index, 1);
                  this.formConfig.formModel.lists.rows = [...lists];
                  this.$refs.tableConfig.refreshTable(true);
                  return;
                }
                const {
                  warehousingBoxNum,
                  warehousingLength,
                  warehousingWidth,
                  warehousingHeight,
                  warehousingWeight,
                  warehousingVolume,
                  customsCode,
                  warehousingProductName,
                  warehousingTotalVolume,
                  warehousingTotalWeight
                } = this.currRow[key];
                row.isUpdate = 0;
                row.warehousingBoxNum = warehousingBoxNum;
                row.warehousingLength = warehousingLength;
                row.warehousingWidth = warehousingWidth;
                row.warehousingHeight = warehousingHeight;
                row.warehousingWeight = warehousingWeight;
                row.warehousingVolume = warehousingVolume;
                row.customsCode = customsCode;
                row.warehousingProductName = warehousingProductName;
                row.warehousingTotalVolume=warehousingTotalVolume;
                row.warehousingTotalWeight=warehousingTotalWeight
              },
            },
            {
              text: "保存",
              handleClick: this.handleSave,
            },
          ],
        },
        httpRequest: () => {
          return new Promise((resolve) => {
            resolve(this.formConfig.formModel.lists);
          });
        },
        columnConfig: config.CTTableColumn,
      },
      grossTotal: {},
      newId: 0,
      orderType: "",
    };
  },
  computed: {
    ...mapState({
      dictDataObj: (state) => state.dictionary.dicsData,
    }),
  },
  methods: {
    handleDecimal,
    handleAddLine(btnType = "add", copyRow = {}) {
      const lists = this.$refs.tableConfig.getNewTableData();
      const fObj = lists.find((e) => e.id) || {};
      this.newId += 1;
      const newId = this.newId;
      this.currRow = {
        ...(this.currRow || {}),
        [`newId${newId}`]: {
          newId,
          newAdd: true,
        },
      };
      let addRow = {
        newId,
        isNew: 1,
        freightId: "",
        // shipmentId: fObj.shipmentId || "",
        // referenceId: fObj.referenceId || "",
        shipmentId: "",
        referenceId: "",
        // sku: "", //sku号
        packType: "",
        customsDeclarationType: "",
        boxCount: 0,
        boxLength: 0,
        boxWidth: 0,
        boxHeight: 0,
        boxWeight: this.orderType==2?0:undefined,
        boxVolume: this.orderType==2?0:undefined,
        // customsCode: "", //海关编码
        // warehousingProductName: "",
        isUpdate: 1,
        warehousingBoxNum: "",
        warehousingLength: "",
        warehousingWidth: "",
        warehousingHeight: "",
        warehousingWeight: undefined,
        warehousingVolume: "",
        warehousingTotalWeight: "",
        warehousingTotalVolume: "",
        totalWeight: 0, //重量
        totalVolume: 0, //体积
        deleted: 0, //是否删除 0-否 1-是
      };
      if (btnType === "copy") {
        // 过机复制
        const { id, temp_secondId, isNew, newId, isMachine, ...cRow } =
          copyRow || {};
        Object.assign(addRow, {
          ...cRow,
          isNew: 1,
          isUpdate: 1,
          isMachine: 3,
        });
        // console.log('===xx', this.newId, newId, addRow)
      } else {
        // 新增
        if (lists.some((e) => e.isMachine === 1)) {
          Object.assign(addRow, {
            isMachine: 2, // 过机新增
          });
        }
      }

      this.formConfig.formModel.lists = {
        rows: [addRow, ...(lists || [])],
      };
      this.$refs.tableConfig.refreshTable(true);
    },
    handleData(row) {
      const lists = {
        totalWeight: 0,
        totalVolume: 0,
        warehousingTotalWeight: 0,
        warehousingTotalVolume: 0,
        totalBoxCount: 0,
        warehousingTotalBoxNum: 0,
        consigneeCount: row.lists.consigneeCount,
        total: row.lists.total,
      };
      const boxParams = row.lists.rows.map((item) => {
        let data = {
          ...item,
          freightId: item.freightId || item.id,
          // sku: item.sku,
          customsDeclarationType: item.customsDeclarationType,
          packType: item.packType,
          shipmentId: item.shipmentId,
          referenceId: item.referenceId,
          boxCount: item.boxCount || item.packNum || item.quantity || 0,
          boxLength: item.boxLength || item.length || 0,
          boxWidth: item.boxWidth || item.width || 0,
          boxHeight: item.boxHeight || item.height || 0,
          boxWeight: this.orderType==2?item.boxWeight || item.weight || 0:undefined,
          boxVolume: this.orderType==2?item.boxVolume || item.volume || 0:undefined,
          customsCode: item.customsCode || "",
          warehousingProductName:
            item.warehousingProductName || item.productNameCn || "",
          isUpdate: 0,
          deleted: item.deleted || 0,
        };
        const warehousingBoxNum =
          item.warehousingBoxNum === null
            ? data.boxCount
            : item.warehousingBoxNum;
        const warehousingLength =
          item.warehousingLength === null
            ? data.boxLength
            : item.warehousingLength;
        const warehousingWidth =
          item.warehousingWidth === null
            ? data.boxWidth
            : item.warehousingWidth;
        const warehousingHeight =
          item.warehousingHeight === null
            ? data.boxHeight
            : item.warehousingHeight;
        const warehousingWeight =
          item.warehousingWeight === null
            ? data.boxWeight
            : item.warehousingWeight;
        const warehousingVolume =
          item.warehousingVolume === null
            ? data.boxVolume
            : item.warehousingVolume;
        data = {
          ...data,
          warehousingBoxNum,
          warehousingLength,
          warehousingWidth,
          warehousingHeight,
          warehousingWeight,
          warehousingVolume,
        };
        if(this.orderType==2){
          data.warehousingTotalWeight = multiplicationFn([
          data.warehousingWeight,
          data.warehousingBoxNum,
        ]);
        data.warehousingTotalVolume = multiplicationFn([
          data.warehousingVolume,
          data.warehousingBoxNum,
        ]);

        data.totalWeight = multiplicationFn([data.boxWeight, data.boxCount]);

        data.totalVolume = multiplicationFn([data.boxVolume, data.boxCount]);
        }

        // console.log('data.warehousingTotalVolume==', data.warehousingTotalWeight, data.warehousingTotalVolume)

        if (!data.isNew) {
          lists.totalWeight = accumulationFn([
            lists.totalWeight,
            data.totalWeight,
          ]);
          lists.totalVolume = accumulationFn([
            lists.totalVolume,
            data.totalVolume,
          ]);
          lists.totalBoxCount = accumulationFn([
            lists.totalBoxCount,
            data.boxCount,
          ]);
        }
        if (!data.deleted) {
          lists.warehousingTotalWeight = accumulationFn([
            lists.warehousingTotalWeight,
            data.warehousingTotalWeight,
          ]);

          lists.warehousingTotalVolume = accumulationFn([
            lists.warehousingTotalVolume,
            data.warehousingTotalVolume,
          ]);

          lists.warehousingTotalBoxNum = accumulationFn([
            lists.warehousingTotalBoxNum,
            data.warehousingBoxNum,
          ]);
        }

        return data;
      });
      return {
        lists,
        boxParams,
      };
    },
    async show(row, type, showTransportMode) {
      const { isMainBill, operationId, orderType } = row;
      if (isMainBill === 5) {
        try {
          row.lists = await getListByOperationId({
            operationOrderId: operationId,
          });
        } catch {
          return this.$message.error("无核实信息！");
        }
      }
      this.orderType = orderType;
      console.log("this.orderType", this.orderType);
      if (type === "inStorage") {
        this.formConfig.lists = formConfig(type, showTransportMode);
      }
      if (!row.lists || !row.lists.total) {
        return this.$message.error("无核实信息！");
      }
      if (row.orderType == 2) {
        //电商
        this.tableConfig.columnConfig = config.tableColumn;
      } else {
        //传统
        this.tableConfig.columnConfig = config.CTTableColumn;
      }
      const { lists, boxParams } = this.handleData(row);
      this.grossTotal = {
        consigneeCount: lists.consigneeCount,
        totalWeight: lists.totalWeight,
        totalVolume: lists.totalVolume,
        warehousingTotalWeight: lists.warehousingTotalWeight,
        warehousingTotalVolume: lists.warehousingTotalVolume,
        totalBoxCount: lists.totalBoxCount,
        warehousingTotalBoxNum: lists.warehousingTotalBoxNum,
      };
      lists.rows = boxParams;
      this.formConfig.formModel = {
        operationId: row.operationId,
        orderId: row.orderId,
        orderType: row.orderType,
        freightType: row.freightType,
        operationOrderNum: row.operationOrderNum,
        bailorPeople: row.bailorPeople,
        createTime: row.createTime,
        operationOrderType: row.operationOrderType,
        headTransportModeName: row.headTransportModeName,
        outWarehouseWayName: row.outWarehouseWayName,
        lists,
      };
      this.dialogShow = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.myDialog.show();
        });
      });
    },
    handleClose() {
      this.dialogShow = false;
    },
    handleSave(row) {
      const {
        // sku,
        warehousingBoxNum,
        warehousingLength,
        warehousingWidth,
        warehousingHeight,
        warehousingWeight,
        warehousingVolume,
        customsCode,
        warehousingProductName,
        customsDeclarationType,
        packType,
        shipmentId,
        warehousingTotalVolume:inputWarehousingTotalVolume,
        warehousingTotalWeight:inputWarehousingTotalWeight
      } = row;
      // if(!shipmentId&&this.orderType == 2){
      //   this.$message.error("请输入shipmentId");
      //   return;
      // }
      if (!warehousingBoxNum) {
        this.$message.error("请输入核实件数");
        return;
      }
      if (!warehousingLength && this.orderType == 2) {
        this.$message.error("请输入核实箱长");
        return;
      }
      if (!warehousingWidth && this.orderType == 2) {
        this.$message.error("请输入核实箱宽");
        return;
      }
      if (!warehousingHeight && this.orderType == 2) {
        this.$message.error("请输入核实箱高");
        return;
      }
      if (!warehousingWeight && this.orderType == 2) {
        this.$message.error("请输入核实单件毛重");
        return;
      }
      if (this.formConfig.formModel.orderType != 2) {
        // if (!sku && this.formConfig.formModel.operationOrderType !== 1) {
        //   this.$message.error("请输入sku");
        //   return;
        // }
        // if (!warehousingProductName) {
        //   this.$message.error("请输入品名");
        //   return;
        // }
        // if (!customsCode) {
        //   this.$message.error("请输入海关编码");
        //   return;
        // }
        if (!customsDeclarationType) {
          this.$message.error("请选择报关方式");
          return;
        }
        if (!packType) {
          this.$message.error("请选择包装");
          return;
        }
      }
      row.boxNumber = this.getBoxNo(row);

      const TJ_NUM = multiplicationFn([
        warehousingLength,
        warehousingWidth,
        warehousingHeight,
      ]);

      if (this.orderType == 2) {
        //电商才取值
        row.warehousingVolume = dividedFn(TJ_NUM, 6);
      }

      const key = row.id ? row.id : `newId${row.newId}`;
      const {
        warehousingBoxNum: currBoxNum = 0,
        warehousingWeight: currBoxWeight = 0,
        warehousingVolume: currBoxVolume = 0,
        warehousingTotalWeight:singleWarehousingTotalWeight,
        warehousingTotalVolume:singleWarehousingTotalVolume
      } = this.currRow[key];
      row.warehousingTotalWeight = this.orderType == 2 ? multiplicationFn([
        warehousingWeight,
        warehousingBoxNum,
      ]) : inputWarehousingTotalWeight;//一：电商只能填写单件需要计算单件*数量，传统只能填写小计，直接取小计
      // calculation.multiply(
      //   warehousingWeight,
      //   warehousingBoxNum,
      //   2
      // );
      row.warehousingTotalVolume = this.orderType == 2 ? multiplicationFn([
        row.warehousingVolume,
        warehousingBoxNum,
      ]) : inputWarehousingTotalVolume;//一
      // calculation.multiply(
      //   row.warehousingVolume,
      //   warehousingBoxNum,
      //   2
      // );
      const currWarehousingTotalWeight = this.orderType == 2 ? multiplicationFn([
        currBoxWeight,
        currBoxNum,
      ]) : singleWarehousingTotalWeight;//一
      // calculation.multiply(
      //   currBoxWeight,
      //   currBoxNum,
      //   2
      // );
      const currWarehousingTotalVolume = this.orderType ==2 ? multiplicationFn([
        currBoxVolume,
        currBoxNum,
      ]) : singleWarehousingTotalVolume; // 体积使用6位小数计  一
      // calculation.multiply(
      //   currBoxVolume,
      //   currBoxNum,
      //   2
      // );
      const warehousingTotalWeight = accumulationFn([
        subtractFn([
          this.grossTotal.warehousingTotalWeight,
          currWarehousingTotalWeight || 0,
        ]),
        row.warehousingTotalWeight,
      ]);
      const warehousingTotalVolume = accumulationFn([
        subtractFn([
          this.grossTotal.warehousingTotalVolume,
          currWarehousingTotalVolume || 0,
        ]),
        row.warehousingTotalVolume,
      ]);
      const warehousingTotalBoxNum = accumulationFn([
        this.grossTotal.warehousingTotalBoxNum,
        subtractFn([warehousingBoxNum, currBoxNum]),
      ]);
      this.grossTotal = {
        ...this.grossTotal,
        warehousingTotalWeight: Number(warehousingTotalWeight),
        warehousingTotalBoxNum: Number(warehousingTotalBoxNum),
        warehousingTotalVolume: Number(warehousingTotalVolume),
      };
      console.log("this.grossTotal", this.grossTotal);
      row.isUpdate = 0;
      delete this.currRow[key];
    },
    handleDelete(row) {
      this.handleTotal(row, subtractFn);
      if (row.newId) {
        const lists = this.$refs.tableConfig.getNewTableData();
        const index = lists.findIndex((item) => (item.newId = row.newId));
        lists.splice(index, 1);
        this.formConfig.formModel.lists.rows = [...lists];
        this.$refs.tableConfig.refreshTable(true);
        return;
      }
      row.deleted = 1;
    },
    handleRecovery(row) {
      this.handleTotal(row, accumulationFn);
      row.deleted = 0;
    },
    handleTotal(row, calculationType) {
      const {
        warehousingTotalWeight = 0,
        warehousingTotalVolume = 0,
        warehousingBoxNum = 0,
      } = row;
      const totalWeight = calculationType([
        this.grossTotal.warehousingTotalWeight,
        warehousingTotalWeight,
      ]);
      const totalVolume = calculationType([
        this.grossTotal.warehousingTotalVolume,
        warehousingTotalVolume,
      ]);
      const totalBoxNum = calculationType([
        this.grossTotal.warehousingTotalBoxNum,
        warehousingBoxNum,
      ]);
      this.grossTotal = {
        ...this.grossTotal,
        warehousingTotalWeight: Number(totalWeight),
        warehousingTotalBoxNum: Number(totalBoxNum),
        warehousingTotalVolume: Number(totalVolume),
      };
    },
    handleChange(row, prop) {
      //核实货物单价与总价的互相计算
      const {
        warehousingBoxNum,
        warehousingVolume,
        warehousingWeight,
        warehousingTotalVolume,
        warehousingTotalWeight,
      } = row;
      if (prop == "warehousingBoxNum") {
        row.warehousingTotalVolume = multiplicationFn(
          [warehousingBoxNum, warehousingVolume],
          2
        );
        row.warehousingTotalWeight = multiplicationFn(
          [warehousingBoxNum, warehousingWeight],
          2
        );
      } else if (prop == "warehousingVolume") {
        row.warehousingTotalVolume = multiplicationFn(
          [warehousingBoxNum, warehousingVolume],
          2
        );
      } else if (prop == "warehousingWeight") {
        row.warehousingTotalWeight = multiplicationFn(
          [warehousingBoxNum, warehousingWeight],
          2
        );
      } else if (prop == "warehousingTotalVolume") {
        const weight = (
          Number(warehousingTotalVolume) / Number(warehousingBoxNum)
        ).toFixed(2);
        row.warehousingVolume = weight == Infinity ? 0 : weight;
      } else if (prop == "warehousingTotalWeight") {
        const weight = (
          Number(warehousingTotalWeight) / Number(warehousingBoxNum)
        ).toFixed(2);
        row.warehousingWeight = weight == Infinity ? 0 : weight;
      }
    },
    getBoxNo(formModel) {
      const {
        shipmentId = "",
        boxCount,
        warehousingBoxNum,
        quantity,
      } = formModel;
      if (!shipmentId) return undefined;
      let num = "00000";
      let boxNumber = shipmentId;
      let count = warehousingBoxNum || boxCount || 0;
      if (count) {
        if (count > 1) {
          num = num.substring(0, 5 - (count + "").length) + count;
          boxNumber = `${shipmentId}00001~${num}`;
        } else {
          boxNumber = `${shipmentId}00001`;
        }
      }
      formModel.boxNumber = boxNumber;
      return boxNumber;
    },
    submitSave() {
      const freightVerifyVoList = this.$refs.tableConfig.getNewTableData();
      const { orderType, operationOrderType } = this.formConfig.formModel;
      if (freightVerifyVoList.findIndex((item) => item.isUpdate) > -1) {
        return this.$message.error("有数据未保存，请保存！");
      }
      let index = -1;
      if (orderType != 2) {
        index = freightVerifyVoList.findIndex(
          (item) =>
            // (!item.sku && operationOrderType !== 1) ||
            !(item.warehousingBoxNum >= 0) ||
            // !(item.warehousingLength >= 0) ||
            // !(item.warehousingWidth >= 0) ||
            // !(item.warehousingHeight >= 0) ||
            // !(item.warehousingWeight >= 0) ||
            // !(item.warehousingVolume >= 0) ||
            !(item.warehousingTotalWeight >= 0) ||
            !(item.warehousingTotalVolume >= 0) ||
            // !item.warehousingProductName ||
            // !item.customsCode ||
            !item.customsDeclarationType
        );
      } else {
        index = freightVerifyVoList.findIndex(
          (item) =>
            !(item.warehousingBoxNum >= 0) ||
            !(item.warehousingLength >= 0) ||
            !(item.warehousingWidth >= 0) ||
            !(item.warehousingHeight >= 0) ||
            !(item.warehousingWeight >= 0) ||
            !(item.warehousingVolume >= 0) ||
            !(item.warehousingTotalWeight >= 0) ||
            !(item.warehousingTotalVolume >= 0)
        );
      }
      if (index > -1) {
        this.$message.error(`第${index + 1}行数据未补充完整，请补充！`);
        return;
      }
      const { totalBoxCount, warehousingTotalBoxNum } = this.grossTotal;
      if (totalBoxCount !== warehousingTotalBoxNum) {
        msgTipBox(
          this,
          { msg: "实际收货箱数与预报箱数不一致，是否确认保存。" },
          () => {
            this.saveRequest();
          }
        );
      } else {
        this.saveRequest();
      }
    },
    async saveRequest() {
      const freightVerifyVoList = this.$refs.tableConfig.getNewTableData();
      const { operationId, orderType, freightType, orderId } =
        this.formConfig.formModel;

      if (this.againVerify) {
        await comSaveRepeatedRequest(
          getEcFreightEdit,
          freightVerifyVoList.map((item) => ({
            ...item,
            orderType,
            freightType,
            operationOrderId: operationId,
            orderEcId: orderId,
          }))
        );
      } else {
        await comSaveRepeatedRequest(freightVerify, {
          operationId,
          orderType,
          freightType,
          orderId,
          freightVerifyVoList,
        });
      }
      this.$message.success("核实成功！");
      this.$emit("handleSuccess");
      this.handleClose();
    },
  },
};
</script>
<style lang="scss" scoped>
.warehousing-form {
  border-bottom: 1px solid #e2e2e2;
  margin-top: -5px;
  padding-bottom: 20px;
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
  }
}
.warehousing-table {
  .tag {
    font-size: 12px;
    width: 40px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 0px 0px 19px 0px;
    color: #fff;

    &.delete {
      background: #f59ead;
    }
    &.new {
      background: #96dcb7;
    }
    &.passing {
      background: #5094ff;
    }
  }
  .new-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    font-weight: bold;
    font-size: 14px;
    padding: 14px 0 16px;
    color: #515151;
  }
  .text-align-left {
    /deep/ .el-input__inner {
      text-align: left;
    }
  }
  .text-align-right {
    /deep/ .el-input__inner {
      text-align: right;
    }
  }
  /deep/ {
    .el-input__inner {
      padding: 0 0 0 5px;
    }
    .el-table--medium td,
    .el-table--medium th {
      padding: 12px 0;
    }
  }
  /deep/ .el-row {
    line-height: 18px;
    &:last-child {
      margin-top: 13px;
    }
  }
  /deep/ .show-overflow-tooltip {
    margin-bottom: 10px;
  }
}
.operate-icon-info {
  color: #8b8b8b;
}
</style>
