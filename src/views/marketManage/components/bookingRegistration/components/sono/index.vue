<template>
  <div>
    <div class="sonoTitle">
      <div class="title-left">
        <span>SO No.信息</span>
        <span>{{ tableConfig.title }}</span>
      </div>
      <div>
        <el-checkbox v-model="completeBooking" disabled>完成订舱</el-checkbox>
      </div>
    </div>
    <div class="sonoContent">
      <ComTable
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :columnData="tableConfig.columnData"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'sono'">
            <AutoComplete
              :ref="`sonoRef${slotProps.rowIndex}`"
              :formModel="slotProps.row"
              :fieldItem="{
                ...slotProps.column.putFieldItem,
                multipleNum: slotProps.row.boxNum,
                handle: changeSonoSelect,
                handleCreate: () => handleAddSoNo(slotProps.row),
                refreshRequest: refreshRequestSoNo[slotProps.rowIndex],
              }"
              :additionalParam="{
                routeNoManageId: formData.name.id || formData.name,
                boxId: slotProps.row.boxModelId,
                orderIdOrEmpty: formData.id,
              }"
            />
          </template>
        </template>
      </ComTable>
    </div>
    <SoNoDialog
      ref="soNoDialogRef"
      :appendToBody="true"
      @handleSuccess="handleSoNoSuccess"
    />
  </div>
</template>

<script>
import { tableColumns } from "./model.js";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    SoNoDialog: () =>
      import("@/views/marketManage/components/dialog/index.vue"),
  },
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableConfig: {
        title: "",
        tableHeight: "calc(100vh - 320px)",
        columnConfig: tableColumns,
        columnData: [],
      },
      completeBooking: false,
      refreshRequestSoNo: {},
    };
  },
  methods: {
    setData(rows) {
      this.tableConfig.columnData = rows;
      rows.forEach((_, index) => {
        this.$set(this.refreshRequestSoNo, index, false);
      });
      this.tableConfig.title = (rows || [])
        .map((e) => e.boxModelName)
        .join(",");
      this.$refs.tableRef?.setNewTableData(this.tableConfig.columnData);
      this.changeSonoSelect()
    },
    changeSonoSelect(row) {
      const isComplete = (this.tableConfig.columnData||[]).every(
        (e) => e.sono?.length == e.boxNum
      );
      this.completeBooking = isComplete ? true : false;
    },
    getSonoObj() {
      let soNoIds = [];
      this.tableConfig.columnData.map((e) => {
        soNoIds = soNoIds.concat(e.sono);
      });
      const params = {
        soNoIds,
        completeBooking: this.completeBooking,
      };
      return params;
    },
    handleAddSoNo(row) {
      const { name, routeNoMangeName } = this.formData;
      const { boxModelId, boxModelCode } = row;
      this.addSoNoId = row.boxModelId;
      const routeNoManageId = name?.id || name;
      this.$refs.soNoDialogRef.show(
        {
          routeNoManageId,
          isCabinRelease: 1,
          routeNoMangeName,
          boxModelId,
          boxModelCode,
        },
        "addBooking"
      );
    },
    handleSoNoSuccess(res) {
      const list = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex(
        (item) => item.boxModelId === this.addSoNoId
      );
      if (index > -1) {
        this.$set(
          this.refreshRequestSoNo,
          index,
          !this.refreshRequestSoNo[index]
        );
        const { boxNum, sono: currSoNo } = list[index];
        const addIds = res.data;
        const len = (currSoNo || []).length + addIds.length;
        if (boxNum >= len) {
          const sono = [...(currSoNo || []), ...addIds];
          list[index].sono = sono;
          this.addSoNoId = -1;
          this.changeSonoSelect();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sonoTitle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .title-left {
    :not(:last-child) {
      margin-right: 50px;
      font-size: 13px;
      font-weight: bold;
      color: #1f1f1f;
    }
  }
}
</style>
