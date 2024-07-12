<template>
  <!-- 清关交接专用 -->
  <ComDialog
    ref="customDialog"
    :customDialog="customDialogConfig"
    :dialogBoxCenter="true"
    :confirmClose="false"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:tableSlots="slotProps">
          <div>
            <div>计费规则</div>
            <div>
              <ComTable
                :tableHeight="tableConfig.tableHeight"
                :columnConfig="tableConfig.columnConfig"
                :columnData="tableConfig.columnData"
              >
                <template v-slot:customRow="{ slotProps }"> </template>
              </ComTable>
            </div>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { takeOrders } from "@/api/operateManage/common.js";
import { mapState } from "vuex";
import { rulesConfig } from "./model.js";
import { getStorageScheme } from "@/api/costScheme/index.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: rulesConfig.labelWidth,
        lists: rulesConfig.lists,
      },
      tableConfig: {
        tableHeight: "calc(100vh-60px)",
        columnConfig: rulesConfig.tableLists,
        columnData: [],
        httpRequest: "",
      },
      customDialogConfig: {
        title: rulesConfig.title,
        width: rulesConfig.width,
        center: false,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.hide();
            },
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    getQueryParams() {
      return {};
    },
    show(row) {
      const { id } = row;
      getStorageScheme(id).then((res) => {
        const {
          name,
          billCompanyName,
          billWarehouseName,
          billCurrencyName,
          closingType,
          closingTypeName,
          billUnit,
          storageCostList,
        } = res.data;
        this.formConfig.formModel = {
          name,
          billCompanyName,
          billCurrencyName,
          billWarehouseName,
          closingType,
          closingTypeName,
          billUnit,
        };
        this.tableConfig.columnData = storageCostList || [];
        this.$refs.customDialog.show();
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    // handleSuccess() {
    //   this.$emit("handleSuccess");
    //   this.hide();
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
