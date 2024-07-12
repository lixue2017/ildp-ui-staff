<template>
  <div class="app-container">
    <div>
      <ComDetailTop
        title="订舱代理配置"
        ref="detailTopRef"
        :config="comDetailConfig"
        class="title-sides-margin-none"
      >
      </ComDetailTop>
    </div>
    <div>
      <div v-for="(item, index) in tableConfig.title" :key="index">
        <div  :class="`table-title${index}`">
          <span>{{ item }}</span>
        </div>
        <div>
          <ComTable
            :ref="`tableRef${index}`"
            :httpRequest="tableConfig.httpRequest[index]"
            :columnConfig="tableConfig.columnConfig[index]"
            :getQueryParams="getQueryParams"
            :rowOperationBtnListFn="() => statusList(index)"
          >
            <template v-slot:customHeader="{ slotProps }">
              <template
                v-if="
                  /case1CustomerName|case2CustomerName|case3CustomerName|case4CustomerName|case5CustomerName|case6CustomerName|case7CustomerName|case8CustomerName/.test(
                    slotProps.column.prop
                  )
                "
              >
                <div>{{ slotProps.column.labelTop }}</div>
                <div>{{ slotProps.column.labelBtm }}</div>
              </template>
            </template>
          </ComTable>
        </div>
      </div>
    </div>
    <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['copy']">
      <template v-slot:copy="slotProps">
        <AutoComplete
          ref="copyRef"
          :formModel="slotProps.formModel"
          :fieldItem="{
            ...slotProps.fieldItem,
            handle: handleCopy,
          }"
        />
      </template>
    </ComCustomDialog>
  </div>
</template>

<script>
import { getTabsConfig, bookingDialogCols, routeDialogCols } from "./model.js";
import {
  GETQueryListVo,
  GETQuerySortBoxList,
  udpateTakeOrderIsolateConfig,
  updateSortBox
} from "@/api/customerManage/customerList.js";
export default {
  components: {
    ComTabs: () => import("_comp/ComTabs"),
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    const { title, tableColumns } = getTabsConfig();
    return {
      comDetailConfig: {
        rightBtn: [
          {
            // icon: "iconfont icon-fanhui",
            text: "返回",
            type: "back",
            className: "back",
          },
        ],
      },
      tableConfig: {
        title,
        columnConfig: tableColumns,
        httpRequest: [GETQueryListVo, GETQuerySortBoxList],
      },
      statusList: (tName) => {
        this.nowActive = tName;
        return [
          {
            text: "修改",
            handleClick: (row) => {
              if (tName == 1) {
                //修改拼柜路线
                this.editLCLRoute(row, tName);
              } else {
                this.editBookingAgent(row, tName);
              }
            },
          },
        ];
      },
      nowActive: "",
    };
  },
  methods: {
    getQueryParams() {
      return {};
    },
    handleSuccess(tName) {
      this.$refs[`tableRef${tName}`][0]?.refreshTable(true);
    },
    editBookingAgent(row={}, tName) {
      //订舱代理
      const {operateMain,case1CustomerIds,case3CustomerIds,case4CustomerIds,case6CustomerIds,case8CustomerIds}=row
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: bookingDialogCols(),
        formModel: {
        operateMain,
        case1CustomerIds: case1CustomerIds?case1CustomerIds.split(',').map(Number):null,
        case3CustomerIds: case3CustomerIds?case3CustomerIds.split(',').map(Number):null,
        case4CustomerIds: case4CustomerIds?case4CustomerIds.split(',').map(Number):null,
        case6CustomerIds: case6CustomerIds?case6CustomerIds.split(',').map(Number):null,
        case8CustomerIds: case8CustomerIds?case8CustomerIds.split(',').map(Number):null,
        },
        httpRequest: (formModel) => {
          console.log('formModel',formModel)
          const {operateMain}=formModel
          const params={
            operateMain,
            case1CustomerIds:formModel.case1CustomerIds?(formModel.case1CustomerIds).join(','):'',
            case3CustomerIds:formModel.case3CustomerIds?(formModel.case3CustomerIds).join(','):'',
            case4CustomerIds:formModel.case4CustomerIds?(formModel.case4CustomerIds).join(','):'',
            case6CustomerIds:formModel.case6CustomerIds?(formModel.case6CustomerIds).join(','):'',
            case8CustomerIds:formModel.case8CustomerIds?(formModel.case8CustomerIds).join(','):'',
          }
          return udpateTakeOrderIsolateConfig(params)
        },
        successFunction: ()=>{
          this.handleSuccess(tName)
        },
      });
    },
    editLCLRoute(row, tName) {
      //拼柜路线
      const {warehouseId,startPortId,endPortId,bookingSpaceProxy,operationMain,...obj}=row
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: routeDialogCols(),
        formModel: {
          newWarehouseId:warehouseId,
          oldWarehouseId:warehouseId,
          newStartPortId:startPortId,
          oldStartPortId:startPortId,
          newEndPortId:endPortId,
          oldEndPortId:endPortId,
          newBookingSpaceProxy:bookingSpaceProxy,
          oldBookingSpaceProxy:bookingSpaceProxy,
          newOperationMain:operationMain,
          oldOperationMain:operationMain
        },
        httpRequest: (formModel) => {
          return updateSortBox(formModel)
        },
        successFunction:()=>{
          this.handleSuccess(tName)
        },
      });
    },
    handleCopy(row = {}) {
      const {
        case1CustomerIds,
        case3CustomerIds,
        case4CustomerIds,
        case6CustomerIds,
        case8CustomerIds,
      } = row;
        this.$refs.customDialogRef?.setDlgFormModel({
        case1CustomerIds: case1CustomerIds?case1CustomerIds.split(',').map(Number):null,
        case3CustomerIds: case3CustomerIds?case3CustomerIds.split(',').map(Number):null,
        case4CustomerIds: case4CustomerIds?case4CustomerIds.split(',').map(Number):null,
        case6CustomerIds: case6CustomerIds?case6CustomerIds.split(',').map(Number):null,
        case8CustomerIds: case8CustomerIds?case8CustomerIds.split(',').map(Number):null,
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .com-detail-top {
    padding-top: 0px;
    margin-bottom: 0px;
  }
  .table-title0 {
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    padding: 14px 0 11px;
    color: #5094FF;
  }
  .table-title1 {
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    padding: 14px 0 11px;
    color: #515151;
  }
}
</style>
