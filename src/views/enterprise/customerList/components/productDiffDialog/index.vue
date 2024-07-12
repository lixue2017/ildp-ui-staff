<template>
  <!-- 清关交接专用 -->
  <ComDialog ref="customDialog" :customDialog="customDialogConfig">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:productTips="slotProps">
          <span class="sync-tips"
            >说明：商品差异需要双向线下沟通之后再处理(当前可通过下单、调整库存等多种方式处理)</span
          >
        </template>
        <template v-slot:tableTitle="slotProps">
          <div class="tableTitle">
            <div>
              <span>商品信息</span>
            </div>
            <div>
              <el-button
                class="rightBtn"
                v-for="(item, index) in btnArr"
                :key="index"
                type="text"
                :disabled="!(item.isBatch == isBatchType)"
                @click="item.handleClick"
                >{{ item.label }}</el-button
              >
            </div>
          </div>
        </template>
        <template v-slot:productTable="slotProps">
          <ComTable
            ref="productTableRef"
            :tableHeight="productTable.tableHeight"
            :columnConfig="productTable.columnConfig"
            :httpRequest="productTable.httpRequest"
            :getQueryParams="getProductQueryParams"
            :span-method="objectSpanMethod"
            :extraConfig="{stripe: false,}"
            :rowOperationBtnListFn="rowOperationBtnListFn"
            @onSelectionChange="onSelectionChange"
            :selectionRow="selectionRowEvt"
            :selectionTableRow="[...selectionRows]"
            rowKey="productId"
            selectionKey="productId"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'erpSku'">
                <div class="tableTitle">
                  <div>
                    <AutoComplete
                      :formModel="slotProps.row"
                      :fieldItem="{
                        ...slotProps.column.fieldItem,
                        disabled: slotProps.row.isUpdate == 1 ? false : true,
                      }"
                      :additionalParam="{
                        apiId: formConfig.formModel.id,
                      }"
                    />
                  </div>
                  <div
                    :class="
                      slotProps.row.isUpdate == 1
                        ? 'skuBtn-edit'
                        : 'skuBtn-disabled'
                    "
                  >
                    <el-button
                      type="text"
                      class="skuBtn-font"
                      @click="editConfirm(slotProps.row)"
                      >{{
                        slotProps.row.isUpdate == 1 ? "关联" : "修改"
                      }}</el-button
                    >
                  </div>
                </div>
              </template>
            </template>
          </ComTable>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { searchForm, productDiffTableColumns } from "./model.js";
import {
  POSTApiProductDifferenceGetPage,
  POSTSaveOrUpdate,
  delApiProductDel,
  POSTSyncSku,
  POSTSyncInventory,
} from "@/api/customerManage/customerList.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  data() {
    return {
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "90px",
      },
      productTable: {
        tableHeight: "calc(100vh-60px)",
        columnConfig: productDiffTableColumns,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            POSTApiProductDifferenceGetPage(formModel).then((res) => {
              const { rows,data } = res;
              this.tableMergeList={
                startRow:data.map((e)=>e.startRow),
                endRow:data.map((e)=>e.endRow)
              }
              const params = {
                ...res,
                rows: rows.map((e) => {
                  return {
                    ...e,
                    isUpdate: 0,
                  };
                }),
              };
              resolve(params);
            }).catch((error) => {
                const { code, msg } = error;
                if (code == 1002) {
                  const params = {
                    ...error,
                    rows: [],
                  };
                  this.msgError(msg);
                  resolve(params);
                }
              });
          });
        },
      },
      customDialogConfig: {
        title: "商品管理",
        width: "1000px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      btnArr: [
        {
          label: "批量同步库存",
          isBatch: 1,
          handleClick: () => {
            const cusProductIds = this.selectionRows.map((e) => e.productId);
            const params = {
              cusProductIds,
              httpRequest: POSTSyncInventory,
            };
            this.synchronizthis(params);
          },
        },
        {
          label: "批量同步SKU",
          isBatch: 0,
          handleClick: () => {
            const cusProductIds = this.selectionRows.map((e) => e.productId);
            const params = {
              cusProductIds,
              httpRequest: POSTSyncSku,
            };
            this.synchronizthis(params);
          },
        },
      ],
      tableBtnArr: [
        {
          text: "同步到马帮ERP",
          showState: [0, "0"],
          isProduct:true,
          color: "#ff813d",
          handleClick: (row) => {
            this.confirmTips().then((res) => {
              const { productId } = row;
              const params = {
                cusProductId: productId,
                httpRequest: POSTSyncSku,
              };
              this.synchronizthis(params);
            });
          },
        },
        {
          text: "取消关联",
          showState: [1, "1"],
          color: "#ff813d",
          handleClick: (row) => {
            this.confirmTips().then((res) => {
              const { id } = row;
              delApiProductDel(id).then((res) => {
                this.refreshTable();
              });
            });
          },
        },
      ],
      selectionRows: [],
      isBatchType: 99,
      tableMergeList:[]
    };
  },
  methods: {
    confirmTips() {
      return new Promise((resolve) => {
        const title = "确认提示";
        const className = "el-icon-warning text-warning";
        const msg = "此操作不可逆！";
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          resolve();
        });
      });
    },
    show(row = {}) {
      this.formConfig = {
        ...this.formConfig,
        lists: searchForm(),
        formModel: {
          ...row,
        },
      };
      this.$refs.customDialog.show();
    },
    hide() {
      this.isBatchType=99
      this.onSelectionChange([])
      this.$refs.customDialog.hide();
    },
    getProductQueryParams() {
      const { id: apiId, customerId } = this.formConfig.formModel;
      return {
        apiId,
        customerId,
      };
    },
    rowOperationBtnListFn(row) {
      const { erpApiProductState, productId } = row;
      const btnArr = this.tableBtnArr.filter((e) => {
        return (e.showState ? e.showState.includes(erpApiProductState) : true)&&
        (e.isProduct?productId:true)
      });
      return btnArr;
    },
    editConfirm(row = {}) {
      const { isUpdate, productName } = row;
      if (isUpdate == 1) {
        //编辑
        const { id, erpSku, productId: cusProductId, apiId } = row;
        const params = {
          apiId,
          cusProductId,
          erpSku,
          id,
        };
        POSTSaveOrUpdate(params).then((res) => {
          this.refreshTable();
        });
      } else if (isUpdate == 0 && productName) {
        row.isUpdate = 1;
      } else {
        this.msgWarning("当前数据缺少产品信息");
      }
    },
    synchronizthis(row = {}) {
      const { id: apiId } = this.formConfig.formModel;
      const {
        cusProductId = undefined,
        cusProductIds = undefined,
        httpRequest,
        } = row;
      const params = {
        apiId,
        cusProductId,
        cusProductIds,
      };
      httpRequest(params).then((res) => {
        this.onSelectionChange([]);
        this.refreshTable();
      });
    },
    refreshTable() {
      this.$refs.productTableRef?.refreshTable();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    onSelectionChange(rows = []) {
      const {erpApiProductState}=rows[0]||{}
      this.selectionRows = rows.filter(
        (e) => e.productId&&erpApiProductState==e.erpApiProductState //收付类型
      );
      console.log("this.selectionRows", this.selectionRows);
      this.$refs.productTableRef?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    selectionRowEvt(row) {
      if (this.selectionRows.length > 0) {
        const { erpApiProductState } = this.selectionRows[0]; //0未关联  1已关联
        this.isBatchType = erpApiProductState;
        return (row.erpApiProductState == erpApiProductState)&&row.productId;
      } else {
        this.isBatchType = 99;
        return row.productId;
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //row当前行  column当前列  rowIndex当前行号   columnIndex当前列号
      const { startRow, endRow } = this.tableMergeList;
      if ([5, 6, 7,8].includes(columnIndex)) {
        if (startRow.includes(rowIndex)) {
          const rowspan = this.getRowspan(rowIndex);
          return {
            rowspan: rowspan, //合并几行
            colspan: 1, //合并几列
          };
        } else if (endRow.includes(rowIndex)) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getRowspan(val) {
      const {startRow,endRow}=this.tableMergeList
      const index=(startRow||[]).findIndex((e)=>e==val)
      const rowspan=endRow[index]-startRow[index]+1
      return rowspan;
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.sync-tips {
  color: #aaaaaa;
  &::before {
    content: "*";
    color: #aaaaaa;
  }
}
.tableTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .rightBtn {
    color: $orange;
  }
  .skuBtn-edit {
    background-color: #ff813d;
    border-radius: 0px 4px 4px 0px;
    border-top:0.5px solid rgba(215, 215, 215, 1);
    border-right:0.5px solid rgba(215, 215, 215, 1);
    border-bottom:0.5px solid rgba(215, 215, 215, 1);
    padding: 0px 2px;
    .skuBtn-font {
      color: #ffffff;
    }
  }
  .skuBtn-disabled {
    background-color: #ffffff;
    // border-width: 1px;
    // border-style: solid;
    // border-color: rgba(215, 215, 215, 1);
    border-top:0.5px solid rgba(215, 215, 215, 1);
    border-right:0.5px solid rgba(215, 215, 215, 1);
    border-bottom:0.5px solid rgba(215, 215, 215, 1);
    border-radius: 0px 4px 4px 0px;
    padding: 0px 2px;
    .skuBtn-font {
      color: #ff813d;
    }
  }
}
/deep/ {
  .el-input__inner {
    border-radius: 4px 0px 0px 4px;
  }
}
</style>
