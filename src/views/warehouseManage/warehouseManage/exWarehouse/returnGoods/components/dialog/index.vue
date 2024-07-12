<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:slotTable="slotProps">
          <ComTable
            ref="dialogTableRef"
            :tableHeight="diaTableConfig.tableHeight"
            :columnConfig="diaTableConfig.columnConfig"
            :httpRequest="diaTableConfig.httpRequest"
            :getQueryParams="getDiaQueryParams"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'oldLocationId'">
                <AutoComplete
                  ref="oldLocationIdRef"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.column.fieldItem,
                    handle: (row) => changeOldLocationCode(row, slotProps.row),
                  }"
                  :additionalParam="{
                    warehouseId: formConfig.formModel.warehouseId,
                    customerId: formConfig.formModel.customerId,
                    storageMode: formConfig.formModel.storageMode,
                  }"
                />
              </template>
              <template v-if="slotProps.prop === 'oldTrayId'">
                <AutoComplete
                  ref="oldTrayIdRef"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.column.fieldItem,
                    disabled: !(
                      slotProps.row.oldLocationId && !slotProps.row.oldTrayId
                    ),
                  }"
                  :additionalParam="{
                    warehouseId: formConfig.formModel.warehouseId,
                    storageMode: formConfig.formModel.storageMode,
                  }"
                />
              </template>
              <template v-if="slotProps.prop === 'actualReturnNum'">
                <el-input-number
                  v-model="slotProps.row.actualReturnNum"
                  :controls="false"
                  :min="1"
                  v-input-number-limit="{
                    value: 0, // 几位小数限制
                    maxNumber: slotProps.row.MaxActualReturnNum||99999999, // 最大值限制
                  }"
                  size="small"
                  placeholder="请输入"
                />
              </template>
            </template>
          </ComTable>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { takeOrders } from "@/api/operateManage/common.js";
import { mapState } from "vuex";
import { customDialogCols, dialogTable } from "./model.js";
import {
  getReturnGoodsDetailById,
  POSTReturnGoodsSavePlan,
} from "@/api/warehouse/manage.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComTable: () => import("_comp/ComTable"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "90px",
        lists: customDialogCols,
      },
      customDialogConfig: {
        title: "还货",
        width: "1080px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogFormRef?.submitForm();
            },
          },
        ],
      },
      diaTableConfig: {
        tableHeight: "calc(100vh - 600px)",
        columnConfig: dialogTable,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            getReturnGoodsDetailById(formModel).then((res) => {
              const { data, ...obj } = res;
              const params = {
                ...obj,
                data: data.map((e) => {
                  const { waitReurnNum, ...eObj } = e;
                  return {
                    ...eObj,
                    waitReurnNum,
                    actualReturnNum: waitReurnNum,
                    MaxActualReturnNum:waitReurnNum
                  };
                }),
              };
              resolve(params);
            });
          });
        },
      },
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const arr = this.$refs.dialogTableRef?.getNewTableData() || [];
      const params = arr.map((e) => {
        const {
          oldLocationId: locationId,
          oldTrayId: trayId,
          actualReturnNum,
          id,
        } = e;
        return {
          actualReturnNum,
          id,
          locationId,
          trayId,
        };
      });
      console.log("params", params);
      return POSTReturnGoodsSavePlan(params);
    },
    show(row = {}) {
      this.formConfig.formModel = {
        ...row,
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    getDiaQueryParams() {
      const { id } = this.formConfig.formModel;
      return { id };
    },
    changeOldLocationCode(row = {}, item) {
      const { trayId = undefined, traySn = undefined } = row;
      item.oldTrayId = trayId;
      item.oldTraySn = traySn;
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped></style>
