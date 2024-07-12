<template>
  <ComDialog
    class="drawer-wrapper"
    ref="myDrawer"
    :customDialog="dialogConfig"
    :confirmClose="false"
    @onClose="hide"
  >
    <template v-if="dialogShow" v-slot:content>
      <ComForm
        ref="formRef"
        :formConfig="formConfig"
        @handleChange="handleChange"
      />
      <div class="quotation-scheme-list">
        <template v-for="(item, index) in formData.schemeInfoList">
          <div class="quotation-scheme" :key="item.id">
            <div class="index">
              <span>{{ index + 1 }}</span>
            </div>
            <RouteInfo :formData="item" :isOverseasToDoor="true" />
          </div>
          <ComTable
            :ref="`tableRef${index}`"
            :columnConfig="profitColumns"
            :columnData="item.detailInfoList"
            class="cost-table"
            :key="`table${item.id}`"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'unitPrice'">
                <span> {{ toFixedNum(slotProps.row.unitPrice) }} - </span>
                <el-input-number
                  class="profit-input"
                  v-model="slotProps.row.payableProfit"
                  controls-position="right"
                  size="mini"
                  :max="99999999.99"
                  :min="0"
                  v-input-number-limit="{
                    value: 2, // 几位小数限制
                    maxNumber: 99999999.99, // 最大值限制
                  }"
                  v-if="formConfig.formModel.payableType === 1"
                />
                <template v-else>
                  <el-input-number
                    class="profit-input"
                    v-model="slotProps.row.payableProfit"
                    controls-position="right"
                    size="mini"
                    :max="100"
                    :min="0"
                    v-input-number-limit="{
                      value: 2, // 几位小数限制
                      maxNumber: 100, // 最大值限制
                    }"
                  />
                  <span style="min-width: 18px; text-align: right"> % </span>
                </template>
              </template>
            </template>
          </ComTable>
        </template>
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { formConfig, profitColumns } from "./model";
import { getPayableProfit, setPayableProfit } from "@/api/enquiryManage/index";
import { msgTipBox } from "@/utils/confirmBox.js";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    RouteInfo: () => import("../QuotationSchemeTable/RouteInfo"),
  },
  data() {
    return {
      profitColumns,
      dialogConfig: {
        title: "设置利润(应付)",
        width: "860px",
        size: "small",
        footer: [
          {
            text: "确 定",
            type: "primary",
            handleClick: this.handleSubmit,
          },
          {
            text: "取 消",
            handleClick: this.hide,
          },
        ],
      },
      dialogShow: false,
      formConfig: {
        formModel: {
          payableType: 1,
        },
        ...formConfig,
      },
      formData: {},
      isConfirm: false,
    };
  },
  methods: {
    show(params) {
      getPayableProfit(params).then((res) => {
        const { schemeInfoList, id, payableType, payableProfit, state } =
          res.data;
        this.formData = {
          schemeInfoList,
          id,
          payableType,
          payableProfit,
        };
        this.formConfig.formModel = {
          id,
          payableProfit,
          payableType: payableType || 1,
        };
        if ([2, 4].includes(state)) {
          this.isConfirm = true;
        }
        this.dialogShow = true;
        this.$refs.myDrawer.show();
      });
    },
    hide() {
      this.dialogShow = false;
      this.$refs.myDrawer?.hide();
    },
    handleSubmit() {
      const { payableType, payableProfit } = this.$refs.formRef.getFormParams();
      const { schemeInfoList, id } = this.formData;
      const detailList = schemeInfoList.map(({ id }, index) => ({
        id,
        detailInfoList: this.$refs[`tableRef${index}`][0].tableData.map(
          ({ id, payableProfit, quotationSchemeId }) => ({
            id,
            payableProfit,
            quotationSchemeId,
          })
        ),
      }));
      if (this.isConfirm) {
        msgTipBox(
          this,
          {
            msg: "是否提交报价方案?",
          },
          () => {
            setPayableProfit({
              id,
              payableType,
              payableProfit,
              confirm: true,
              schemeInfoList: detailList,
            }).then(() => {
              this.handleSuccess();
            });
          }
        );
      } else {
        setPayableProfit({
          id,
          payableType,
          payableProfit,
          schemeInfoList: detailList,
        }).then(() => {
          this.handleSuccess();
        });
      }
    },
    handleSuccess(res) {
      console.log(res);
      this.$emit("handleSuccess");
      this.hide();
    },
    handleChange(val, prop) {
      if (prop === "payableProfit") {
        this.formData.schemeInfoList.map(({ detailInfoList }, index) => {
          this.$refs[`tableRef${index}`][0].setNewTableData(
            detailInfoList.map((detail) => ({
              ...detail,
              payableProfit: val,
            }))
          );
        });
      } else if (prop === "payableType") {
        this.formConfig.formModel.payableType = val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.quotation-scheme {
  display: flex;
  align-items: center;
  min-height: 95px;
  background: #f6f6f6;

  .index {
    width: 52px;
    text-align: center;
  }
  .scheme-form {
    flex: 1;
    padding-top: 15px;
    /deep/ {
      .el-form-item--small.el-form-item {
        margin-bottom: 15px;
      }
      .el-form-item__error {
        z-index: 1;
      }
      // .el-form-item.scheme-remark {
      //   margin-top: 15px;
      // }
    }
  }
  .operation-content-btn {
    width: 288px;
    justify-content: flex-end;
    padding-right: 30px;
    .operate-icon.el-button {
      margin-left: 30px;
    }
  }
  .quotation-state {
    margin-right: 10px;
  }
}
/deep/ {
  .el-input {
    .el-input__suffix {
      right: 10px;
    }
  }
}
.profit-input {
  width: 98px;
  /deep/ {
    &.el-input-number.is-controls-right .el-input__inner {
      padding-left: 10px;
      padding-right: 32px;
    }
  }
}
</style>
