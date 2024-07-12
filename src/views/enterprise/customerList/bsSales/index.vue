<template>
  <div class="app-container">
    <!-- 堡森业务员 -->
    <div>
      <ComDetailTop
        :title="/*客户列表堡森业务员修改*/ `堡森业务员`"
        :formModel="formData"
        ref="detailTopRef"
        :config="comDetailConfig"
        class="margin-right-32"
      >
      </ComDetailTop>
    </div>
    <div>
      <ComTable
        ref="comTableRef"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="() => getQueryParams()"
        :extraConfig="{ multiline: true }"
        :rowOperationBtnListFn="() => tableConfig.statusList"
      >
        <template v-slot:customRow="{ slotProps }"> </template>
      </ComTable>
    </div>
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="ergodicList">
      <template v-for="(sItem, sIdx) in ergodicList" v-slot:[sItem]="slotProps">
        <div
          class="custom-autoData"
          :class="`custom-autoData ${sIdx > 0 ? 'custom-autoCopy' : ''}`"
          :key="sIdx"
        >
          <div>
            <AutoComplete
              :ref="`${sItem}Refs`"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                searchParamName: undefined,
                searchIdKey: undefined,
              }"
            />
          </div>
          <div v-if="sIdx > 0">
            <el-button type="text" @click="handleCopy(sItem, sIdx, slotProps)"
              >同上</el-button
            >
          </div>
        </div>
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import { tableColumns, customDialogCols } from "./model.js";
import {
  getCustomerSalesmanList,
  updateCustomerSalesman,
} from "@/api/customerManage/customerList.js";
export default {
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  data() {
    return {
      formData: {},
      comDetailConfig: {
        rightBtn: [
          {
            icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      tableConfig: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: getCustomerSalesmanList,
        columnConfig: tableColumns,
        statusList: [
          // {
          //   text: "修改",
          //   handleClick: this.handleDialog,
          // },
        ],
      },
      ergodicList: [
        "marktUserNameUserId",
        "customsClearanceUserId",
        "thirdPartyUserId",
        "fbaOrderUserId",
        "overseasPlatformUserId",
        "wmswithdrawalUserId",
        "overseaOrderUserId",
        "warehouseRentUserId",
      ],
    };
  },
  // created() {
  //   this["dictionary/getDictionary"]("custTypeEn").then(() => {
  //     // this.showSearchForm = true;
  //   });
  // },
  methods: {
    // ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {},
    handleDialog(row) {
      const {
        marktUserNameUserId,
        customsClearanceUserId,
        thirdPartyUserId,
        fbaOrderUserId,
        overseasPlatformUserId,
        wmswithdrawalUserId,
        overseaOrderUserId,
        warehouseRentUserId,
        customerName,
        customerId,
      } = row;
      const formModel = {
        marktUserNameUserId,
        customsClearanceUserId,
        thirdPartyUserId,
        fbaOrderUserId,
        overseasPlatformUserId,
        wmswithdrawalUserId,
        overseaOrderUserId,
        warehouseRentUserId,
        customerName,
        customerId,
      };
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: customDialogCols(),
        formModel,
        httpRequest: this.submitUpdate,
        successFunction: this.handleSuccess,
      });
    },
    handleSuccess(row) {
      console.log("row", row);
      this.$refs.comTableRef?.refreshTable(true);
    },
    submitUpdate(row) {
      //修改堡森业务员
      const {
        customerId,
        marktUserNameUserId,
        customsClearanceUserId,
        thirdPartyUserId,
        fbaOrderUserId,
        overseasPlatformUserId,
        wmswithdrawalUserId,
        overseaOrderUserId,
        warehouseRentUserId,
      } = row;
      const params = [
        {
          customerId,
          settleBusinessType: 1,
          userId: marktUserNameUserId,
        },
        {
          customerId,
          settleBusinessType: 3,
          userId: customsClearanceUserId,
        },
        {
          customerId,
          settleBusinessType: 7,
          userId: thirdPartyUserId,
        },
        {
          customerId,
          settleBusinessType: 5,
          userId: fbaOrderUserId,
        },
        {
          customerId,
          settleBusinessType: 4,
          userId: overseasPlatformUserId,
        },
        {
          customerId,
          settleBusinessType: 8,
          userId: wmswithdrawalUserId,
        },
        {
          customerId,
          settleBusinessType: 6,
          userId: overseaOrderUserId,
        },
        {
          customerId,
          settleBusinessType: 11,
          userId: warehouseRentUserId,
        },
      ];
      return updateCustomerSalesman(params);
    },
    handleCopy(item, index, row) {
      const { formModel } = row;
      const field = this.ergodicList[index - 1];
      // this.$refs[`${item}Refs`][0]?.querySearchAsync();
      // this.$nextTick(() => {
      this.$refs.customDialogRef?.setDlgFormModel({
        [item]: formModel[field] || "",
      });
      // });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .com-detail-top {
    margin-left: 0px;
    margin-right: 0px;
    padding-top: 0px;
  }
}
.custom-autoData {
}
.custom-autoCopy {
  display: flex;
  div {
    &:nth-child(1) {
      flex: 1;
    }
    &:nth-child(2) {
      cursor: pointer;
      margin-left: 20px;
    }
  }
}
</style>
