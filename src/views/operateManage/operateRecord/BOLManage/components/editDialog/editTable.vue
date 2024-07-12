<template>
  <div>
    <div class="base-flex-between">
      <span>{{ modeObj.mode_type === 1 ? "集装箱" : "货物" }}信息</span>
      <el-button v-if="isEdit" size="small" type="primary" @click="handleAdd()"
        >新增行</el-button
      >
    </div>
    <ComTable
      :ref="`tableRef`"
      :columnConfig="tableTabConfig()"
      :columnData="tableColumnData"
      :pagination="false"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-for="(item, idx) in slotInputProp">
          <template v-if="slotProps.prop === item">
            <div :key="idx">
              <el-input
                v-if="slotProps.row.isColEdit"
                v-model="slotProps.row[item]"
                placeholder="请输入"
              ></el-input>
              <span v-else>{{ slotProps.column.decimal ? toFixedNum(slotProps.row[item], slotProps.column.decimal) : slotProps.row[item] || "--" }}</span>
            </div>
          </template>
        </template>

        <template v-if="slotProps.prop === 'packTypeId'">
          <el-select
            :disabled="!slotProps.row.isColEdit"
            v-model="slotProps.row.packTypeId"
            :placeholder="slotProps.row.isColEdit ? '请选择' : '--'"
          >
            <el-option
              v-for="item in packagingCode"
              :key="item.value"
              :label="item.nameCn"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- <el-input v-model="slotProps.row.packTypeName"></el-input> -->
        </template>

        <template v-if="slotProps.prop === 'boxSizeId'">
          <AutoComplete
            class="form-class"
            :formModel="slotProps.row"
            :fieldItem="{
              ...autoFieldItem,
              disabled: !slotProps.row.isColEdit,
              className: !slotProps.row.isColEdit && 'auto-dis-no-icon',
              placeholder: slotProps.row.isColEdit
                ? slotProps.column.placeholder
                : '--',
            }"
          />
        </template>

        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content-btn">
            <template v-for="(item, index) in tableConfig.statusBtnList">
              <el-button
                :key="index"
                :class="`operate-icon`"
                size="small"
                type="text"
                v-if="item.isColBtn === slotProps.row.isColEdit"
                @click="item.handleClick(slotProps)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { typeConversion, deepCopy } from "@/utils/index";
import { httpCabinetTypeSelect } from "@/comModel/httpSelect.js";
import { delLadingOrRecover } from "@/api/operateRecord/BOLManage.js";
import { msgBox } from "@/utils/confirmBox.js";
import { goodsInfo, containerTableCols } from "./model";
export default {
  props: {
    isEdit: {
      // 默认编辑，详情页为查看
      type: [String, Boolean],
      default: () => true,
    },
  },
  data() {
    return {
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        statusBtnList: [
          {
            text: "编辑",
            isColBtn: false,
            handleClick: (row) => this.handleEdit(row, "edit"),
          },
          {
            text: "删除",
            isColBtn: false,
            handleClick: this.handleDelete,
          },
          {
            text: "保存",
            isColBtn: true,
            handleClick: this.handleEdit,
          },
          {
            text: "取消",
            isColBtn: true,
            handleClick: (row) => this.handleEdit(row, "cancel"),
          },
        ],
      },
      autoFieldItem: {
        ...httpCabinetTypeSelect,
        id: "boxSizeId",
      },
      modeObj: {},
      tableColumnData: [],
      tempList: [], // 临时数组，用于取消时还原数据
      slotInputProp: [
        "maitou",
        "warehousingQuantity",
        "productName",
        "customsCode",
        "warehousingTotalWeight",
        "warehousingTotalVolume",
        "ontainerSno",
        "sealingStripSno",
      ],
      containerSlot: ["ontainerSno", "sealingStripSno"],
    };
  },
  methods: {
    handleEdit(slotProps = {}, type) {
      const { row, rowIndex } = slotProps;
      const colEdit = this.tableColumnData[rowIndex].isColEdit;
      if (type === "cancel") {
        this.tableColumnData.splice(rowIndex, 1, {
          ...this.tempList[rowIndex],
          isColEdit: false,
        });
      } else {
        this.tableColumnData.splice(rowIndex, 1, {
          ...row,
          isColEdit: colEdit === undefined ? true : !colEdit,
        });
      }
      if (type === "edit") {
        this.tempList[rowIndex] = deepCopy(this.tableColumnData[rowIndex]);
      }
      this.$refs.tableRef?.setNewTableData(this.tableColumnData);
    },
    handleDelete(propRow = {}) {
      if (!propRow.row.id) {
        this.delData(propRow);
        return;
      }
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delLadingOrRecover({ id: propRow.row.id, deleted: 1 }).then(() => {
          this.msgSuccess("删除成功");
          this.delData(propRow);
        });
      });
    },
    delData(row = {}) {
      this.tableColumnData.splice(row.rowIndex, 1);
      this.tempList.splice(row.rowIndex, 1); // 下标保持一致
      this.$refs.tableRef?.setNewTableData(this.tableColumnData);
    },
    handleAdd() {
      const addArr = this.tableTabConfig().filter(
        (e) => e.type !== "index" && !["operation"].includes(e.prop)
      );
      const addObj = addArr.reduce(
        (m, i) => {
          m[i.prop] = "";
          return m;
        },
        {
          isColEdit: true,
          operationOrderId: this.modeObj.operationOrderId, // 新增列添加操作单号
          orderType: this.modeObj.order_type,
        }
      );
      this.tableColumnData.push(addObj);
      this.tempList.push(deepCopy(addObj));
      this.$refs.tableRef?.setNewTableData(this.tableColumnData);
    },
    setTableData(obj = {}) {
      // 0-货物 1-集装箱
      const { tableList: arr = [] } = obj;
      this.modeObj = obj;
      if (obj.mode_type === 1) {
        this.slotInputProp = this.containerSlot;
      }
      arr.forEach((e) => {
        e.packTypeId = typeConversion(e.packTypeId);
        e.isColEdit = false; // 默认不可编辑
        e["boxSizeId"] = e.boxSizeId || "";
      });
      this.tableColumnData = arr;
      this.tempList = deepCopy(arr);
      this.$refs.tableRef?.setNewTableData(arr);
    },
    tableTabConfig() {
      const { order_type = 0, mode_type = 0 } = this.modeObj;
      return [
        goodsInfo(order_type, this.isEdit),
        containerTableCols(this.isEdit),
      ][mode_type];
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState({
      packagingCode: (state) => state.dictionary.dicsData.packagingCode,
    }),
  },
};
</script>
