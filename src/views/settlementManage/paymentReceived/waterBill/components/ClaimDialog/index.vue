<template>
  <div>
    <!-- 此页面弹窗目前只用于收款水单与认领水单列表查询水单详情 -->
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="audit-dialog"
    >
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          class="dialog-form"
          v-if="
            $refs.customDialog &&
            $refs.customDialog.dialogVisible &&
            formConfig.formModel.id
          "
        >
          <template v-slot:bsAccountInfo="slotProps">
            <div class="content-bsAccountInfo">
              <div class="title">BS账号信息</div>
              <div class="content">
                <div
                  v-for="(item, index) in accountInfo.bsAccountInfo"
                  :key="index"
                >
                  <span class="content-value">{{
                    slotProps.formModel[item.value] || "--"
                  }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:counterpartInfo="slotProps">
            <div class="content-bsAccountInfo">
              <div class="title">对方账号信息</div>
              <div class="content">
                <div
                  v-for="(item, index) in accountInfo.counterpartInfo"
                  :key="index"
                >
                  <span class="content-value">{{
                    slotProps.formModel[item.value] || "--"
                  }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-slot:tableData v-if="tableConfig.columnData.length > 0">
            <ComTable
              ref="tableConfig"
              :tableHeight="tableAutoHeight"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :columnData="tableConfig.columnData"
              :getQueryParams="() => getQueryParams()"
              :pagination="false"
              :rowOperationBtnListFn="() => tableConfig.statusList"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'billNo'">
                  <span
                    class="primary-text-btn"
                    @click="handleView(slotProps.row.billId)"
                  >
                    {{ slotProps.row.billNo }}
                  </span>
                </template>
              </template>
            </ComTable>
            <div class="grand-total">
              <template v-for="(tItem, i) in tableSubtotal">
                <span :key="`t_${i}`">
                  <span>{{ tItem.totalLabel }}：</span>
                  <span>{{ formatMoney(tItem.totalNum) }}</span>
                </span>
              </template>
            </div>
          </template>
          <template v-slot:slotImgList="slotProps">
            <div class="custom-preview-image">
              <template v-for="(item, index) in slotProps.formModel.picUrl">
                <el-image
                  v-if="item"
                  :src="item"
                  :key="index"
                  :preview-src-list="slotProps.formModel.picUrl"
                >
                </el-image>
              </template>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { getWaterBillDetail } from "@/api/settlementManage/paymentReceived";
import { nextTick } from "process";
import { accumulationFn } from "@/utils/instructions";
import { deepCopy } from "@/utils/index";
import { config, tableConfig } from "./model";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComTable: () => import("_comp/ComTable"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "水单认领(详情)",
        width: "1100px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "关闭",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "90px",
        formRules: config.formRules, // 表单校验规则
      },
      tableConfig: {
        columnConfig: tableConfig,
        httpRequest: (row) => {},
        columnData: [],
      },
      isClaimChange: true,
      waterData: {},
      accountInfo: {
        bsAccountInfo: [
          { label: "开户行", value: "receiptPaymentAccountBank" },
          { label: "银行账号", value: "receiptPaymentBankAccount" },
          { label: "账号名称", value: "receiptPaymentAccountName" },
          // { label: "公司地址", value: "receiptPaymentAccountAddress" },
        ],
        counterpartInfo: [
          { label: "开户行", value: "openingBank" },
          { label: "银行账号", value: "bankAccount" },
          { label: "账号名称", value: "accountName" },
          // { label: "公司地址", value: "openingAddress" },
        ],
      },
    };
  },
  created() {},
  methods: {
    show(params) {
      this.waterData = params;
      this.tableConfig.columnData = [];
      this.$refs.tableConfig?.setNewTableData([]);
      getWaterBillDetail(params.id).then((res) => {
        this.tableConfig.columnData = res.data.statementInfos;
        if (res.data.payType == 1) {
          // 付款查看: 没有认领人、认领时间
          const vListsCopy = deepCopy(config.viewLists);
          const vCopyCols = vListsCopy[0].fieldList[0].rows[0].cols;
          vListsCopy[0].fieldList[0].rows[0].cols = vCopyCols.filter(
            (e) => !["claimTime", "claimBy"].includes(e.id)
          );
          this.formConfig.lists = vListsCopy;
        } else {
          this.formConfig.lists = config.viewLists;
        }
        nextTick(() => {
          this.$refs.tableConfig?.refreshTable(true);
        });
        this.formConfig.formModel = {
          ...res.data,
        };
        this.$refs.dialogForm &&
          this.$refs.dialogForm.setFormModel({
            ...this.formConfig.formModel,
          });
        this.$refs.customDialog.show();
      });
    },
    getQueryParams() {},
    handleClick(rows) {},
    handleView(id) {
      this.$refs.customDialog?.hide();
      this.$router.push({
        path: "/settlementManagement/statementManage/editBillManage",
        query: {
          id,
          backPath: this.$route.fullPath,
          activeTab: "3", // 3-详情
        },
      });
    },
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableConfig.columnData.length;
      return tableLen > 6 ? `${7 * 39 + 54}px` : undefined;
    },
    tableSubtotal() {
      // const { money } = this.formConfig.formModel;
      return [
        {
          totalLabel: "合计（水单币别）",
          // totalNum: money || 0,
          totalNum: accumulationFn(
            this.tableConfig.columnData.map(
              (e) => e.bankReceiptVerificationMoney
            )
          ),
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .base-flex-between {
    justify-content: flex-start;
  }
}
.audit-dialog {
  .slot-serviceCharge {
    /deep/.el-input-group__append {
      width: 80px;
    }
  }
  /deep/ {
    .el-dialog__body {
      padding: 30px 40px 0 40px;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 6px;
    }
    .pics-list {
      width: 80px;
      display: block;
      margin-right: 10px;
      border-radius: 4px;
      border: 1px solid #d2d2d2;
    }
    .content-bsAccountInfo {
      width: 100%;
      background: #f8f8f8;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      padding: 10px 20px;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #3179ef;
      }
      .content {
        display: flex;
        flex-direction: column;
        // padding-left: 27px;
        font-size: 13px;
        font-weight: 400;
        .content-label {
          color: #8b8b8b;
        }
        .content-value {
          color: #515151;
        }
      }
    }
    .content-counterpartInfo {
      width: 100%;
      background: rgba(188, 188, 188, 0.1);
      border-radius: 4px;
      padding: 10px 30px;
    }
    .content-flex {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
