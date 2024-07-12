<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :columnData="columnData"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="['minPrice', 'maxPrice'].includes(slotProps.prop)">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              id: slotProps.column.prop,
              placeholder: slotProps.column.label,
              render: slotProps.column.render,
              ...slotProps.column.fieldItem,
            }"
            :disabled="slotProps.row.chargingType === 1"
          />
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model.js";
import { getWeightSectionTempList } from "@/api/oneConsignmentPlan/saleCost";
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
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  data() {
    return {
      tableConfig: {
        tableColumns: tableColumns(this.isDetail),
      },
      columnData: this.formData.itemList || [],
    };
  },
  methods: {
    getWeightSectionTempList(params) {
      const { costPartitionSchemeId, weightSectionTempId } = params;
      if (costPartitionSchemeId && weightSectionTempId) {
        getWeightSectionTempList(params).then((res) => {
          this.columnData = res.data;
          this.$refs.tableRef.setNewTableData(res.data);
        });
      } else {
        this.columnData = [];
        this.$refs.tableRef.setNewTableData([]);
      }
    },
    getTableList() {
      return this.$refs.tableRef.getNewTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>