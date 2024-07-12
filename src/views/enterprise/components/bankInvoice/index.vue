<template>
  <div class="bank-content">
    <div class="content-form">
      <ComForm ref="searchTabForm" :formConfig="searchFormConfig"> </ComForm>
    </div>
    <div class="content-table">
      <ComTable
        ref="tableRef"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="getQueryParams"
        :rowOperationBtnListFn="() => tableConfig.btnList"
      >
        <template v-slot:customRow="{ slotProps }">
          <!-- <template v-if="slotProps.prop === 'isDefault'">
            <el-button
              v-if="slotProps.row.isDefault == '1'"
              type="primary"
              size="mini"
              plain
              >默认</el-button
            >
          </template> -->
        </template>
      </ComTable>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { searchForm, bankTableConfig } from "./model.js";
import {getCrmList} from "@/api/common.js"
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        expansion: false,
        fold: false,
        size: "small",
        labelWidth: "80px",
        lists: searchForm,
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        tableHeight: "calc(100vh - 324px)",
        columnConfig: bankTableConfig,
        httpRequest: getCrmList,
        btnList: [
          {
            text: "修改",
            type: "edit",
            handleClick: (rows) => {
              this.$emit("showConfirmDialog", "bankAccount", rows);
            },
          },
          {
            text: "删除",
            type: "delete",
            color: "#FF6767",
            handleClick: (rows) => {
              this.$emit("handleDelete", "bankAccount", rows.id);
            },
          },
        ],
      },
      // showSearchForm: false,
      searchFromData: {},
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchList(formModel) {
      this.searchFromData={
        ...formModel
      }
      // console.log("formModel", formModel);
      this.refreshTable()
    },
    getQueryParams() {
      const { id } = this.formData;
      return {
        ...this.searchFromData,
        customerId:id,
      };
    },
    refreshTable() {
      this.$refs.tableRef?.refreshTable(true);
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
.bank-content {
  .content-form {
  }
  .content-table {
    margin-top: 15px;
  }
}
</style>
