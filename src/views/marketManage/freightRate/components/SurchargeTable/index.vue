<template>
  <div>
    <div class="top" v-if="showTitle">
      <div class="title">附加费</div>
      <div class="btn" v-if="!isDetail">
        <el-button size="mini" type="primary" plain round @click="handleAdd">
          新增
        </el-button>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="columnData"
      :rowOperationBtnListFn="rowOperationBtnListFn"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.column.fieldItem">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              placeholder:
                slotProps.column.fieldItem.placeholder ||
                slotProps.column.label,
              ...slotProps.column.fieldItem,
              id: !slotProps.row.isEdit
                ? slotProps.prop
                : slotProps.column.fieldItem.id || slotProps.prop,
            }"
            :dictionary="dictionary"
            :disabled="
              !slotProps.row.isEdit ||
              handleDisabled(slotProps.row, slotProps.prop)
            "
          />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    isDetailView: {
      type: Boolean,
      default: false,
    },
    packingMode: {
      type: Number,
      default: 0,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const { freightRateSurchargeList } = this.formData;
    let boxModelList = undefined;
    if (freightRateSurchargeList && freightRateSurchargeList.length) {
      boxModelList = freightRateSurchargeList[0].boxModelList;
    }
    return {
      tableColumns: tableColumns(
        this.packingMode,
        this.isDetail,
        boxModelList,
        this.isDetailView
      ),
      columnData: (freightRateSurchargeList || []).map((item) => ({
        ...item,
        ...item.boxModelMap,
        isEdit: false,
      })),
      boxModelList: boxModelList || ["40'GP", "20'GP"],
      tableBtn: [
        {
          text: "保存",
          isEdit: true,
          type: "save",
          handleClick: this.handleBtnClick,
        },
        {
          text: "取消",
          isEdit: true,
          type: "cancel",
          handleClick: this.handleBtnClick,
        },
        {
          text: "修改",
          isEdit: false,
          type: "edit",
          handleClick: this.handleBtnClick,
        },
        {
          text: "删除",
          isEdit: false,
          type: "delete",
          color: "#ff6767",
          handleClick: this.handleBtnClick,
        },
      ],
      newId: 0,
      currData: {},
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  watch: {
    packingMode(val) {
      this.tableColumns = tableColumns(
        val,
        this.isDetail,
        [],
        this.isDetailView
      );
      this.$refs.tableRef.setNewTableData([]);
    },
  },
  methods: {
    handleDisabled(row, prop) {
      if (prop === "price") {
        const index = this.boxModelList.findIndex((key) => row[key]);
        if (index > -1) {
          return true;
        }
      } else if (this.boxModelList.includes(prop)) {
        return !!row.price;
      }
    },
    rowOperationBtnListFn(row) {
      return this.tableBtn.filter((btn) => row.isEdit === btn.isEdit);
    },
    handleBtnClick(row, btn) {
      switch (btn.type) {
        case "save":
          this.handleSave(row);
          break;
        case "cancel":
          const data = this.currData[row.id || `newId${row.newId}`];
          console.log(this.currData);
          if (!data) {
            this.handleDelete(row);
          } else {
            row.boxModelId = data.boxModelId;
            row.boxModelName = data.boxModelName;
            row.currencyCode = data.currencyCode;
            row.currencyId = data.currencyId;
            row.price = data.price;
            row.isEdit = false;
          }
          break;
        case "edit":
          this.currData[row.id || `newId${row.newId}`] = {
            ...row,
          };
          row.isEdit = true;
          break;
        case "delete":
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    handleRules(row) {
      const errMsg = {
        costId: "请选择费用名称！",
        currencyId: "请选择币别！",
      };
      if (!row.costId || !row.currencyId) {
        for (let key in errMsg) {
          if (errMsg[key] && !row[key]) {
            return errMsg[key];
          }
        }
      }
      if (!row.price) {
        if (this.packingMode === 0) {
          const index = this.boxModelList.findIndex((key) => row[key]);
          if (index === -1) {
            return "请输入价格！";
          }
        } else {
          return "请输入价格！";
        }
      }
    },
    handleSave(row) {
      const err = this.handleRules(row);
      if (err) {
        this.$message.error(err);
        return;
      }
      row.isEdit = false;
    },
    handleDelete(row) {
      const [...list] = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) =>
        row.id ? row.id === item.id : row.newId === item.newId
      );
      if (index > -1) {
        list.splice(index, 1);
        this.$refs.tableRef.setNewTableData(list);
      }
    },
    handleAdd() {
      this.newId += 1;
      const list = this.$refs.tableRef.getNewTableData();
      const params = {
        temp_only_key: Math.random() + "",
        newId: this.newId,
        isEdit: true,
      };
      this.$refs.tableRef.setNewTableData([params, ...list]);
    },
    handleChangeList(boxModelList) {
      this.boxModelList = boxModelList;
      this.tableColumns = tableColumns(
        0,
        this.isDetail,
        boxModelList,
        this.isDetailView
      );
    },
    getTableList() {
      const list = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) => item.isEdit);
      if (index > -1) {
        return;
      }
      if (this.packingMode == 0) {
        return list.map((item) => {
          const boxModelMap = {};
          this.boxModelList.forEach((key) => {
            boxModelMap[key] = item[key];
          });
          const { newId, temp_only_key, isEdit, ...data } = item;
          return {
            ...data,
            boxModelMap,
            boxModelList: this.boxModelList,
          };
        });
      }
      return list;
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    padding: 24px 0 15px;
  }
}
</style>
