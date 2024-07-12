<template>
  <div>
    <div class="top">
      <div class="title">运价设置</div>
      <div class="btn">
        <el-button size="mini" type="primary" plain round @click="handleAdd">
          新增
        </el-button>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumnsFCL"
      :columnData="columnData"
      :rowOperationBtnListFn="rowOperationBtnListFn"
    >
      <template v-slot:customRow="{ slotProps }">
        <template
          v-if="
            slotProps.prop === 'boxModelName' &&
            [29, 32].includes(slotProps.row.boxModelId)
          "
        >
          {{ slotProps.row.boxModelName }}
        </template>
        <template v-else-if="slotProps.column.fieldItem">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              placeholder: slotProps.column.label,
              ...slotProps.column.fieldItem,
              id: !slotProps.row.isEdit
                ? slotProps.prop
                : slotProps.column.fieldItem.id || slotProps.prop,
            }"
            :dictionary="dictionary"
            :disabled="!slotProps.row.isEdit"
          />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumnsFCL } from "./model";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableColumnsFCL,
      columnData: this.handleList().columnData || [],
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
      newId: 4,
      currData: this.handleList().currData,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  methods: {
    rowOperationBtnListFn(row) {
      const btn = this.tableBtn;
      if ([29, 32].includes(row.boxModelId)) {
        return btn.filter(
          (btn) => row.isEdit === btn.isEdit && btn.type !== "delete"
        );
      }
      return this.tableBtn.filter((btn) => row.isEdit === btn.isEdit);
    },
    handleList() {
      const { freightRateSettingList } = this.formData;
      let currData = {};
      if (!freightRateSettingList || !freightRateSettingList.length) {
        const HQ40 = {
          boxModelId: 33,
          boxModelName: "40'HQ",
          currencyCode: "USD",
          currencyId: 2,
          temp_only_key: Math.random() + "",
          isEdit: true,
          newId: 1,
        };
        const GP40 = {
          boxModelId: 32,
          boxModelName: "40'GP",
          currencyCode: "USD",
          currencyId: 2,
          temp_only_key: Math.random() + "",
          isEdit: true,
          newId: 2,
        };
        const GP20 = {
          boxModelId: 29,
          boxModelName: "20'GP",
          currencyCode: "USD",
          currencyId: 2,
          temp_only_key: Math.random() + "",
          isEdit: true,
          newId: 3,
        };
        currData = {
          // newId1: HQ40,
          newId2: GP40,
          newId3: GP20,
        };
        return { columnData: [HQ40, GP40, GP20], currData };
      }
      return {
        columnData: freightRateSettingList.map((item) => ({
          ...item,
          isEdit: false,
        })),
        currData,
      };
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
            if ([29, 32, 33].includes(data.boxModelId)) {
              const err = this.handleRules(data);
              if (err) {
                this.$message.error("固定柜型需要填写，不可未填取消！");
                return;
              }
            }
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
        boxModelId: "请选择柜型",
        currencyId: "请选择币别",
        price: "请输入价格",
      };
      if (!row.boxModelId || !row.currencyId || !row.price) {
        for (let key in errMsg) {
          if (errMsg[key] && !row[key]) {
            return errMsg[key];
          }
        }
      }
    },
    handleSave(row) {
      const err = this.handleRules(row);
      if (err) {
        this.$message.error(err);
        return;
      }
      const list = this.$refs.tableRef.getNewTableData();
      const ids = list
        .filter((item) => !item.isEdit)
        .map((item) => item.boxModelId);
      if (ids.includes(row.boxModelId)) {
        this.$message.error("柜型重复！");
        return;
      }
      row.isEdit = false;
      const boxModelList = [];
      list.forEach((item) => {
        const data = this.currData[item.id || `newId${item.newId}`];
        if (!item.isEdit) {
          boxModelList.push(item.boxModelName);
        } else if (data) {
          boxModelList.push(data.boxModelName);
        }
      });
      this.$emit("handleModelList", boxModelList);
    },
    handleDelete(row) {
      const [...list] = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) =>
        row.id ? row.id === item.id : row.newId === item.newId
      );
      if (index > -1) {
        list.splice(index, 1);
        this.$refs.tableRef.setNewTableData(list);
        const boxModelList = [];
        list.forEach((item) => {
          const data = this.currData[item.id || `newId${item.newId}`];
          if (!item.isEdit) {
            boxModelList.push(item.boxModelName);
          } else if (data) {
            boxModelList.push(data.boxModelName);
          }
        });
        this.$emit("handleModelList", boxModelList);
      }
    },
    handleAdd() {
      this.newId += 1;
      const list = this.$refs.tableRef.getNewTableData();
      const params = {
        currencyCode: "USD",
        currencyId: 2,
        temp_only_key: Math.random() + "",
        newId: this.newId,
        isEdit: true,
      };
      this.$refs.tableRef.setNewTableData([params, ...list]);
    },
    getTableList() {
      const list = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) => item.isEdit);
      if (index > -1) {
        return;
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
