<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData || []"
      :rowOperationBtnListFn="() => operationBtn"
      @onSelectionChange="onTableSelectionChange"
      :selectionTableRow="[...selectionRows]"
      selectionKey="customerId"
    >
    </ComTable>
    <CustomerDrawer ref="drawerRef" @handleSelect="handleSelect" />
  </div>
</template>

<script>
import {
  getCostBindCustomerList,
  deleteCostBindCustomer,
  addCostBindCustomer,
} from "@/api/oneConsignmentPlan/common";
import { tableColumns } from "./model.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    businessType: {
      type: Number,
      default: 1,
    },
    activeTab: {
      type: String,
      required: true,
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    CustomerDrawer: () => import("../CustomerDrawer"),
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
      },
      operationBtn: [
        {
          text: "移除",
          color: "#ff6767",
          handleClick: (row) => this.handleDelete([row.id || row.customerId]),
        },
      ],
      selectionRows: [],
      columnData: this.formData.customerList || [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { id } = this.formData;
      if (id) {
        getCostBindCustomerList({
          businessId: id,
          businessType: this.businessType,
        }).then((res) => {
          this.columnData = res.data || [];
          this.$refs.tableRef.setNewTableData(res.data || []);
        });
      }
    },
    handleDelete(idList = []) {
      if (!idList.length) return;
      const { id } = this.formData;
      if (id && this.activeTab == "detail") {
        const msg = "移除操作不可逆！";
        const title = "移除提示";
        const className = "el-icon-warning text-warning";
        msgBox(this, { title, className, msg }, () => {
          this.comRepeatedRequest(this, deleteCostBindCustomer, {
            idList,
          }).then(() => {
            this.$message.success("移除成功!");
            this.getList();
            this.$emit("handleSelection", []);
          });
        });
      } else {
        // const list = this.$refs.tableRef.getNewTableData();
        // const newList = list.filter(
        //   (item) => !idList.includes(item.customerId)
        // );
        this.columnData = this.columnData.filter(
          (item) => !idList.includes(item.id || item.customerId)
        );
        this.$refs.tableRef.setNewTableData(this.columnData);
        this.$emit("handleSelection", []);
      }
    },
    getTableList() {
      const list = this.$refs.tableRef.getNewTableData();
      const customerIdList = list.map((item) => item.customerId);
      return customerIdList;
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs.tableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
      this.$emit("handleSelection", rows);
      // this.tabsConfig.btnArr.map((e) => {
      //   this.$set(e, "disabled", !rows.length);
      // })
    },
    drawerShow() {
      const list = this.$refs.tableRef.getNewTableData();
      const excludeCustomerId = list.map((item) => item.customerId);
      this.$refs.drawerRef.show(excludeCustomerId.join(","));
    },
    handleSelect(list) {
      const customerIdList = list.map((item) => item.customerId);
      const { id } = this.formData;
      if (id && this.activeTab == "detail") {
        addCostBindCustomer({
          businessId: id,
          businessType: this.businessType,
          customerIdList,
        }).then(() => {
          this.getList();
        });
      } else {
        const data = JSON.parse(JSON.stringify(list));
        this.columnData = [...this.columnData, ...data];
        this.$refs.tableRef.setNewTableData(this.columnData);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
