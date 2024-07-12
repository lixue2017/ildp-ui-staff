<template>
  <div>
    <template
      v-for="(
        { columnConfig, slotInputProp, tableColumnData, addBtnShow }, index
      ) in tableTab"
    >
      <div class="base-flex-between" :key="`title${index}`">
        <span>{{ index === 1 ? "集装箱" : "货物" }}信息</span>
        <el-button
          v-if="showAddBtnFn(addBtnShow, index)"
          size="small"
          type="primary"
          @click="handleAdd(index)"
          >新增行</el-button
        >
      </div>
      <ComTable
        :ref="`tableRef${index}`"
        :columnConfig="columnConfig"
        :columnData="tableColumnData"
        :pagination="false"
        :key="`table${index}`"
        @handleTableView="handleTableView"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-for="(item, idx) in slotInputProp">
            <template v-if="slotProps.prop === idx">
              <div :key="idx">
                <el-input
                  v-if="item.type === 'text'"
                  v-model="slotProps.row[idx]"
                  :placeholder="item.placeholder || '请选择'"
                ></el-input>
                <el-input
                  v-if="item.type == 'textarea'"
                  type="textarea"
                  v-model="slotProps.row[idx]"
                  :placeholder="item.placeholder || '请选择'"
                  :maxlength="item.maxlength || 2000"
                  :rows="item.rows || 2"
                  resize="none"
                />
                <el-input
                  v-if="item.type === 'number'"
                  v-model="slotProps.row[idx]"
                  :placeholder="item.placeholder || '请选择'"
                  oninput="value=value.replace(/[^\d]/g, '')"
                ></el-input>
                <el-input-number
                  v-if="item.type === 'inputNumber'"
                  v-model="slotProps.row[idx]"
                  :controls="false"
                  :disabled="
                    index === 1 && slotProps.rowIndex === 0 && !item.isEdit
                  "
                  :placeholder="item.placeholder || '请选择'"
                  v-input-number-limit="item.decimal"
                  :precision="item.decimal"
                  :min="
                    index === 1 && slotProps.rowIndex === 0 && !item.isEdit
                      ? -Infinity
                      : 0
                  "
                  :max="item.max || 99999999.99"
                  size="mini"
                />
                <el-select
                  v-if="item.type === 'select'"
                  v-model="slotProps.row[idx]"
                  :placeholder="item.placeholder || '请选择'"
                >
                  <el-option
                    v-for="item in dictionary.dicsData[item.basicType]"
                    :key="Number(item.value)"
                    :label="item.nameCn"
                    :value="Number(item.value)"
                  >
                  </el-option>
                </el-select>
                <template v-if="item.type === 'autocomplete'">
                  <AutoComplete
                    class="form-class"
                    :formModel="slotProps.row"
                    :fieldItem="{
                      id: idx,
                      ...item,
                      handle: (val) =>
                        handleChange(slotProps.row, val, idx, item.isBackAll),
                    }"
                  />
                </template>
              </div>
            </template>
          </template>
          <template v-if="slotProps.prop === 'operation'">
            <div class="operation-content-btn">
              <!-- 集装箱有多条数据时, 第一条数据不可删除 -->
              <template
                v-if="
                  index === 1 &&
                  tableColumnData.length > 1 &&
                  slotProps.rowIndex === 0
                "
                >--</template
              >
              <el-button
                v-else
                class="operate-icon colorRed"
                size="small"
                type="text"
                @click="handleDelete(slotProps, index)"
                >删除</el-button
              >
            </div>
          </template>
        </template>
      </ComTable>
      <slot name="total" v-if="showTotal && index === 0" />
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { tradition_goods, eCommerce_goods, eCommerce_box } from "./model";
import { delLadingOrRecover } from "@/api/operateRecord/BOLManage.js";
import { msgBox } from "@/utils/confirmBox.js";
import { countListKeyFn } from "@/utils/instructions";
import { deepCopy } from "@/utils/index";
import qs from "qs";

export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
    showTotal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableColumnData: [],
      tableTab: [],
      newId: 0,
      formData: {},
      deleteIdList: [],
    };
  },
  methods: {
    handleTableView(row) {
      const { operationOrderId } = row;
      this.$router.push({
        path: "/operateManage/onLineImport",
        query: {
          operationOrderId,
          importType: 5,
          isImport: true,
          backPath: this.$route.path,
          data: qs.stringify(this.$route.query),
          tabsActive: 5,
        },
      });
    },
    setTableData(obj = {}) {
      const {
        orderType,
        type,
        isMainBill,
        commodityInfoList,
        fclOrderGoodsList,
        freightType,
        operationOrderId,
        canEditInvoice,
      } = obj;
      this.formData = { ...obj };
      const isEdit = !this.disable && !(orderType != 2 && type === 1);
      const goodsData =
        (!commodityInfoList || !commodityInfoList.length) && isEdit
          ? [this.getNewObj()]
          : commodityInfoList || [];
      const boxData = fclOrderGoodsList || [];
      if (orderType != 2) {
        const config = tradition_goods(isEdit, {
          orderType,
          isMainBill,
          freightType,
          operationOrderId,
        });
        this.tableTab = [
          {
            addBtnShow: isEdit && Object.keys(config.formLists).length,
            columnConfig: config.column,
            slotInputProp: config.formLists,
            tableColumnData: goodsData,
          },
        ];
      } else {
        const goods = eCommerce_goods(
          isEdit,
          {
            orderType,
            isMainBill,
            freightType,
            operationOrderId,
            canEditInvoice,
          },
          type
        );
        const box = eCommerce_box(
          isEdit,
          {
            orderType,
            isMainBill,
            freightType,
            operationOrderId,
          },
          type
        );
        this.tableTab = [
          {
            addBtnShow: isEdit && Object.keys(goods.formLists).length,
            columnConfig: goods.column,
            slotInputProp: goods.formLists,
            tableColumnData: goodsData,
          },
          {
            addBtnShow:
              isEdit &&
              Object.keys(box.formLists).length &&
              ([1, 3].includes(isMainBill) || this.showLclBoxBtn),
            columnConfig: box.column,
            slotInputProp: box.formLists,
            tableColumnData: boxData,
          },
        ];
      }
    },
    handleChange(row, val, prop, isBackAll) {
      if (prop === "boxSizeId" && isBackAll) {
        const { id, boxSizeId, boxSizeCode } = val || {};
        row.goodsId = id;
        row.boxSizeId = boxSizeId;
        row.boxSizeCode = boxSizeCode;
      }
    },
    handleAdd(i) {
      let lists = [
        ...this.tableTab[i].tableColumnData,
        {
          ...this.getNewObj(i),
        },
      ];
      this.tableTab[i].tableColumnData = lists;
      this.$refs[`tableRef${i}`][0].setNewTableData(lists);
    },
    getNewObj(idx) {
      let boxDefault = {};
      if (idx === 1 && !this.tableTab[1].tableColumnData.length) {
        boxDefault = this.goodsBoxTableCount; // 集装箱新增第一行数据的默认值
      }
      const { orderType, operationOrderId, isMainBill } = this.formData;
      this.newId += 1;
      return {
        ...boxDefault,
        maitou: orderType == 2 && isMainBill !== 9 ? "N/M" : undefined, // 电商主单初始赋值
        newId: this.newId,
        newAdd: true,
        operationOrderId, // 新增列添加操作单号
        orderType,
      };
    },
    handleDelete(propRow = {}, i) {
      const lists = this.$refs[`tableRef${i}`][0]?.getNewTableData();
      if (lists.length === 1 && i !== 1) {
        // 集装箱非必填
        const mags = ["最少一条货物信息", "最少一条集装箱信息"];
        this.$message.error(mags[i]);
        return;
      }
      if (propRow.row.newAdd) {
        this.delData(propRow, i);
        return;
      }
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.deleteIdList.push(propRow.row.id);
        this.delData(propRow, i);
        // delLadingOrRecover({ id: propRow.row.id, deleted: 1 }).then(() => {
        //   this.msgSuccess("删除成功");
        //   this.delData(propRow);
        // });
      });
    },
    delData({ row }, i) {
      let index = this.tableTab[i].tableColumnData.findIndex(
        (item) =>
          (row.newId && item.newId === row.newId) ||
          (row.id && item.id === row.id)
      );
      if (index > -1) {
        this.tableTab[i].tableColumnData.splice(index, 1);
        this.$refs.tableRef?.setNewTableData(this.tableTab[i].tableColumnData);
      }
    },
    getTableList(isVerify = true) {
      const commodityInfoList = this.$refs.tableRef0[0]?.getNewTableData();
      let fclOrderGoodsList = [];
      if (this.$refs.tableRef1) {
        fclOrderGoodsList = this.$refs.tableRef1[0]?.getNewTableData();
      }
      if (isVerify) {
        let error = [];
        const reg = new RegExp(/^[^\u4e00-\u9fa5]*$/);
        this.tableTab.forEach((item, index) => {
          const lists = [commodityInfoList, fclOrderGoodsList][index];
          let text = "";
          const listIndex = lists.findIndex((list) => {
            const slotProps = Object.keys(item.slotInputProp);
            if (!list.boxSizeId) {
              list.boxSizeId = null;
              list.boxSizeCode = null;
            }
            const ki = slotProps.findIndex((k) => {
              if (item.slotInputProp[k].request && !list[k] && list[k] !== 0) {
                text = `${item.slotInputProp[k].placeholder}为必填`;
                return true;
              }
              if (
                [
                  "warehousingQuantity",
                  "warehousingTotalWeight",
                  "warehousingTotalVolume",
                ].includes(k) &&
                item.slotInputProp[k].request &&
                list[k] <= 0
              ) {
                text = `${item.slotInputProp[k].placeholder}必需要大于0`;
                return true;
              }
              if (list[k] && !reg.test(list[k])) {
                text = `${item.slotInputProp[k].placeholder}不可输入中文`;
                return true;
              }
            });
            if (ki > -1) {
              return true;
            }
            return false;
          });
          if (listIndex > -1) {
            const title = ["货物信息", "集装箱信息"];
            error.push(`${title[index]}第${listIndex + 1}行，${text}`);
          }
        });
        if (error.length) {
          this.$message.error(error[0]);
          return false;
        }
      }
      return {
        commodityInfoList,
        fclOrderGoodsList,
        deleteIdList: this.deleteIdList,
      };
    },
    showAddBtnFn(isAdd, i) {
      if (isAdd && i === 1 && this.showLclBoxBtn) {
        const lclBoxArr =
          (this.$refs[`tableRef${i}`]
            ? this.$refs[`tableRef${i}`][0]?.getNewTableData()
            : this.tableTab[i].tableColumnData) || [];
        return !lclBoxArr.length;
      }
      return isAdd;
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
    goodsBoxTableCount() {
      if (this.formData.isMainBill !== 0 && !this.showLclBoxBtn) {
        return {};
      }
      const goodsObj = countListKeyFn(this.tableTab[0]?.tableColumnData || [], {
        countKeys: [
          "warehousingQuantity",
          "warehousingTotalWeight",
          "warehousingTotalVolume",
        ],
      });
      let boxList = deepCopy(this.tableTab[1]?.tableColumnData || []);
      boxList.splice(0, 1); // 减去集装箱第一条数据后再计算
      const boxObj = countListKeyFn(boxList, {
        countKeys: [
          "warehousingQuantity",
          "warehousingTotalWeight",
          "warehousingTotalVolume",
        ],
      });
      return {
        warehousingQuantity: this.subtractFn([
          goodsObj.warehousingQuantity,
          boxObj.warehousingQuantity,
        ]),
        warehousingTotalWeight: this.subtractFn([
          goodsObj.warehousingTotalWeight,
          boxObj.warehousingTotalWeight,
        ]),
        warehousingTotalVolume: this.subtractFn([
          goodsObj.warehousingTotalVolume,
          boxObj.warehousingTotalVolume,
        ]),
      };
    },
    showLclBoxBtn() {
      // HBL 电商LCL - 非拼柜子单(原始单) 可新增一行集装箱(也可删除)
      return (
        this.formData.type == 0 &&
        this.formData.orderType == "2" &&
        this.formData.freightType == "1" &&
        [0].includes(this.formData.isMainBill)
      );
    },
  },
  watch: {
    goodsBoxTableCount: {
      deep: true,
      handler: function (newVal) {
        // console.log('newVal==', newVal)
        if (
          this.tableTab[1]?.tableColumnData.length &&
          this.$refs[`tableRef${1}`]
        ) {
          let boxList = this.$refs[`tableRef${1}`][0]?.getNewTableData();
          Object.assign(boxList[0], newVal);
          this.$refs[`tableRef${1}`][0]?.setNewTableData(boxList);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.base-flex-between {
  height: 52px;
  font-size: 14px;
  font-weight: bold;
}
.colorRed {
  color: red;
}
</style>
