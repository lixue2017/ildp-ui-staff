<template>
  <div class="good-info" v-if="!isHide">
    <div class="top">
      <div>
        <span class="title">查验信息</span>
      </div>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="inspectionTableColumns(formData.operationId)"
      :columnData="columnData"
      class="good-table"
    >
      <template v-slot:customRow="{ slotProps }">
        <FormSingle
          :formData="slotProps.row"
          :fieldItem="{
            id: slotProps.column.prop,
            placeholder: slotProps.column.label,
            render: slotProps.column.render,
            ...slotProps.column.fieldItem,
          }"
          :disabled="!slotProps.row.isEdit"
          @handleChange="(val, type) => handleChange(val, type, slotProps.row)"
        />
        <template v-if="slotProps.prop === 'operation'">
          <div class="operate-btn-list">
            <template v-for="(item, index) in btnList">
              <div
                class="btn"
                :key="index"
                v-if="slotProps.row.isEdit === item.isEdit"
              >
                <el-button
                  :class="`operate-icon ${
                    item.info ? 'operate-icon-info' : ''
                  }`"
                  size="small"
                  type="text"
                  :style="{ color: item.color }"
                  :icon="item.icon"
                  @click="item.handleClick(slotProps.row)"
                >
                  {{ item.text }}
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { inspectionTableColumns, handleRule } from "../model";
import { msgBox } from "@/utils/confirmBox.js";
import {
  getExamineList,
  updateExamine,
  deleteExamine,
} from "@/api/operateRecord/customsClearance";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  data() {
    return {
      inspectionTableColumns,
      columnData: [],
      btnList: [
        {
          text: "保存",
          isEdit: true,
          handleClick: this.handleSave,
        },
        {
          text: "取消",
          isEdit: true,
          handleClick: this.handleCancel,
        },
        {
          text: "修改",
          isEdit: false,
          handleClick: this.handleEdit,
        },
        {
          text: "删除",
          color: "#FF6767",
          isEdit: false,
          handleClick: this.handleDelete,
        },
      ],
      currData: [],
      isHide: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { id: clearanceId } = this.formData;
      getExamineList({ clearanceId }).then(({ rows = [] }) => {
        const tableData = this.getTableData() || [];
        const addList = [];
        const editList = [];
        tableData
          .filter((item) => item.isEdit)
          .forEach((item) => {
            !item.id ? addList.push(item) : editList.push(id);
          });
        this.columnData = [
          ...addList,
          ...rows.map((item) => ({
            ...item,
            isEdit: editList.includes(item.id),
          })),
        ];
        if (!this.columnData.length) {
          this.isHide = true;
        } else {
          this.isHide = false;
        }
        this.$refs.tableRef?.setNewTableData(this.columnData);
      });
    },
    getTableData() {
      return this.$refs.tableRef?.getNewTableData();
    },
    handleChange(val, type, row) {
      console.log(val, type, row);
      if (type === "examine") {
        const { bsNo: examineNo, customerId, customerName } = val;
        row.examineNo = examineNo;
        row.customerId = customerId;
        row.customerName = customerName;
      }
    },
    handleSave(row) {
      console.log(row);
      row.examine = row.examineNo;
      const error = handleRule(row, this.getFormRule());
      if (error) {
        this.$message.error(error);
        return;
      }
      const { product, temp_only_key, temp_secondId, isEdit, ...params } = row;
      updateExamine({ ...params }).then(() => {
        row.isEdit = false;
        this.getList();
      });
    },
    getFormRule() {
      const formRule = {};
      inspectionTableColumns(this.formData.operationId).forEach((item) => {
        if (item.request) {
          formRule[item.prop] = item.message || `${item.label}不能为空！`;
        }
      });
      return formRule;
    },
    handleCancel(row) {
      const tableData = this.getTableData().map((item) => {
        if (item.id === row.id) {
          return {
            ...this.currData[row.id],
          };
        }
        return item;
      });
      this.$refs.tableRef.setNewTableData(tableData);
      delete this.currData[row.id];
    },
    handleEdit(row) {
      this.currData = {
        ...this.currData,
        [row.id]: { ...row },
      };
      row.isEdit = true;
    },
    handleDelete({ id }) {
      const msg = "删除操作不可逆！";
      const title = "删除提示";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        this.comRepeatedRequest(this, deleteExamine, { id }).then(() => {
          this.msgSuccess("删除成功");
          this.getList();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
}
</style>