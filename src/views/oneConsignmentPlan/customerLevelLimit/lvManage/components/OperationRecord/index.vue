<template>
  <div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableConfig.tableColumns"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="tableConfig.getQueryParams"
    >
    </ComTable>
  </div>
</template>

<script>
import { tableColumns } from "./model.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
  data() {
    return {
      tableConfig: {
        tableColumns,
        httpRequest: () => {
          return new Promise((resolve, reject) => {
            resolve({
              total: 1,
              rows: [
                {
                  table_xx_1: "table_xx_1",
                  table_xx_2: "table_xx_2",
                  table_xx_3: "table_xx_3",
                  table_xx_4: "table_xx_4",
                },
              ],
            });
          });
        },
        getQueryParams: this.getQueryParams,
      },
    };
  },
  methods: {
    getQueryParams() {
      return {};
    },
  },
};
</script>

<style lang="scss" scoped>
</style>