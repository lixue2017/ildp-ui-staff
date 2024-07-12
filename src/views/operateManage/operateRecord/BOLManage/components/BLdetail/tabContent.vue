<template>
  <div>
    <div class="BLDetail">
      <ComForm class="order-from" :formConfig="formConfig">
        <template v-slot:BLinfo="slotProps">
          <div>
            <span class="BLinfo-label">装货类型：</span>
            <el-radio
              disabled
              class="order-radio"
              v-for="(item, index) in dictLoadGoodsType"
              :key="index"
              :label="item.value"
              v-model="slotProps.formModel.type"
              >{{ item.nameCn }}</el-radio
            >
          </div>
          <div>
            <span class="BLinfo-label" style="word-wrap: break-word"
              >运单号：</span
            >
            <span>{{
              (slotProps.formModel.type == 1
                ? slotProps.formModel.mblNo
                : slotProps.formModel.hblNo) || "--"
            }}</span>
          </div>
        </template>
        <template v-slot:export="slotProps">
          <div class="export-class" v-if="slotProps.formModel.orderType">
            <template v-for="(item, index) in previewBtn">
              <div
                v-if="
                  !item.hide ||
                  !item.hide.includes(+slotProps.formModel.orderType)
                "
                :key="index"
                class="preview-btn"
              >
                <PreviewOrDownload
                  :btnTxt="item.label"
                  :previewDownloadConf="
                    previewDownloadConfig(slotProps.formModel, item)
                  "
                />
              </div>
            </template>
            <div class="preview-btn" v-if="slotProps.formModel.orderType != 2">
              <el-button
                size="small"
                type="text"
                class="operate-icon"
                @click="viewOriginal(slotProps.formModel)"
                >正本</el-button
              >
            </div>
          </div>
        </template>

        <template
          v-for="(item, sIdx) in slotValArr"
          v-slot:[item.name]="slotProps"
        >
          <div class="contacts" :key="sIdx">
            <template v-if="!isNoData(slotProps.formModel, item)">
              <div class="word-break-all" style="display: flex">
                <i class="iconfont qiye1"></i>
                {{ slotProps.formModel[item.value4] || "--" }}
              </div>
              <div class="word-break-all" style="display: flex">
                <i class="iconfont dingwei1"></i>
                <span>{{ slotProps.formModel[item.value1] || "--" }}</span>
              </div>
              <div class="contacts-row">
                <div class="word-break-all" style="display: flex">
                  <i class="iconfont lianxifangshi1"></i>
                  <span>{{ slotProps.formModel[item.value2] || "--" }}</span>
                </div>
                <div class="word-break-all" style="display: flex">
                  <i class="iconfont chuanzhen"></i>
                  <span>{{ slotProps.formModel[item.value3] || "--" }}</span>
                </div>
              </div>
              <template
                v-if="
                  item.name === 'consigneeName' && formData.showClearanceList
                "
              >
                <div class="contacts-row">
                  <span>VAT：</span>
                  <TooltipOver
                    :content="
                      handleClearanceList(slotProps.formModel.vatClearanceList)
                    "
                    :style="{ width: '100%' }"
                    refName="tooltipOverTit"
                  />
                </div>
                <div class="contacts-row">
                  <span>EORI：</span>
                  <TooltipOver
                    :content="
                      handleClearanceList(slotProps.formModel.eoriClearanceList)
                    "
                    :style="{ width: '100%' }"
                    refName="tooltipOverTit"
                  />
                </div>
              </template>
              <div class="word-break-all" style="display: flex">
                <i class="iconfont qita"></i>
                <span>{{ slotProps.formModel[item.value5] || "--" }}</span>
              </div>
            </template>
            <div v-else-if="item.name === 'notifierName'">
              SAME AS CONSIGNEE
            </div>
            <div v-else>--</div>
          </div>
        </template>

        <template v-slot:goodsTable>
          <editDlgTable ref="goodsTableRef" :disable="true" :showTotal="true">
            <template v-slot:total>
              <div class="grand-total">
                <template v-for="(tItem, i) in getResult()">
                  <span :key="`t_${i}`">
                    <span>{{ tItem.totalLabel }}：</span>
                    <span>{{ tItem.totalNum }}</span>
                  </span>
                </template>
              </div>
            </template>
          </editDlgTable>
        </template>
      </ComForm>
    </div>
  </div>
</template>

<script>
import { configLists } from "./model.js";
import { mapActions, mapState } from "vuex";
import {
  getBillDetailPreview,
  getBackLetterDetailPreview,
} from "@/api/operateRecord/BOLManage.js";
import { accumulationFn } from "@/utils/instructions";

export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    showMblTab: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  data() {
    return {
      // tabMbl: this.showMblTab,
      slotValArr: [
        {
          name: "shipperName", //发货人
          value1: "shipperValue1", //地址
          value2: "shipperValue2", //手机号码
          value3: "shipperValue3", //邮箱
          value4: "shipperValue4", //公司名
          value5: "shipperValue5", //留言
        },
        {
          name: "consigneeName", //收货人
          value1: "consigneeValue1",
          value2: "consigneeValue2",
          value3: "consigneeValue3",
          value4: "consigneeValue4",
          value5: "consigneeValue5",
        },
        {
          name: "notifierName", //通知人
          value1: "notifierValue1",
          value2: "notifierValue2",
          value3: "notifierValue3",
          value4: "notifierValue4",
          value5: "notifierValue5",
        },
        {
          name: "fsaName",
          value1: "fsaValue1",
          value2: "fsaValue2",
          value3: "fsaValue3",
          value4: "fsaValue4",
          value5: "fsaValue5",
        },
      ],
      formConfig: {},

      previewBtn: [
        {
          label: "电放保函",
          fileType: 2,
          type: "backLetter",
        },
        {
          label: "草件",
          fileType: 2,
        },
        {
          label: "电放",
          fileType: 0,
        },
        // {
        //   label: "正本",
        //   handleClick: (rows) => this.viewOriginal(rows),
        //   hide: [2],
        // },
      ],
    };
  },
  created() {
    const { type, tdisType, payType, fsaId, orderType } = this.formData;
    this.formConfig = {
      formModel: {
        ...this.formData,
        type: this.typeConversion(type),
        tdisType: this.typeConversion(tdisType),
        payType: this.typeConversion(payType),
        fsaId: this.typeConversion(fsaId),
      },
      labelWidth: "98px",
      lists: configLists(orderType), // 表单渲染列表 2-电商 其他都为传统
      afterMounted: () => {
        setTimeout(() => {
          // 子组件加载后再调用
          this.$refs.goodsTableRef?.setTableData(this.formData);
        }, 20);
      },
    };
  },
  methods: {
    // 预览、下载参数与接口
    previewDownloadConfig(row, item) {
      const { operationOrderId, type, id } = row;
      return {
        previewParam: {
          id,
          operationOrderId,
          type,
          tdisType: item.fileType,
        },
        previewHttp:
          item.type === "backLetter"
            ? getBackLetterDetailPreview
            : getBillDetailPreview,
      };
    },
    viewOriginal(row) {
      if (row.id) {
        window.open(`/print?id=${row.id}`);
      }
    },
    getResult() {
      const { isMainBill, freightType, orderType } = this.formConfig.formModel;
      const arr = this.formData.commodityInfoList || [];
      return [
        {
          totalLabel: "总数量",
          totalNum: accumulationFn(arr.map((e) => e.warehousingQuantity)),
        },
        {
          totalLabel: "总毛重(KG)",
          totalNum: accumulationFn(
            arr.map((e) => e.warehousingTotalWeight),
            2
          ),
        },
        {
          totalLabel: "总体积(CBM)",
          totalNum: accumulationFn(
            arr.map((e) => e.warehousingTotalVolume),
            3
          ),
        },
      ];
    },
    isNoData(data, item) {
      const { value1, value2, value3, value4, value5 } = item;
      if (
        !data[value1] &&
        !data[value2] &&
        !data[value3] &&
        !data[value4] &&
        !data[value5]
      ) {
        return true;
      }
      return false;
    },
    handleClearanceList(list) {
      if (list && list.length) {
        return list.map((item) => item.code).join(",");
      }
      return "--";
    },
  },
  computed: {
    ...mapState({
      dictLoadGoodsType: (state) =>
        state.dictionary.dicsData.loadGoodsType || [],
    }),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    editDlgTable: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/FormTable"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.order-from {
  /deep/ {
    .el-form-item {
      margin-bottom: 0;
    }
    .BLinfo-label {
      display: inline-block;
      width: 80px;
      text-align: right;
    }
  }
  .export-class {
    display: flex;
    justify-content: flex-end;
    .preview-btn {
      margin: 0 8px;
    }
  }
  .order-radio {
    //操作但详情提单信息的货物类型比较窄，需要缩小间距
    margin-right: 8px;
    /deep/ {
      .el-radio__label {
        padding-left: 6px;
      }
    }
  }
}
/deep/ {
  .border-top-solid {
    &::before {
      content: "";
      width: calc(100% - 20px);
      height: 1px;
      transform: translateX(10px);
      background-color: #e2e2e2;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .border-bottom-solid {
    &::before {
      content: "";
      width: calc(100% - 20px);
      height: 1px;
      transform: translateX(10px);
      background-color: #e2e2e2;
      margin-bottom: 10px;
    }
    &::after {
      content: "";
      width: calc(100% - 20px);
      height: 1px;
      transform: translateX(10px);
      background-color: #e2e2e2;
      margin-top: 10px;
    }
  }

  .form-class .border-bottom-solid.form-cols-2 {
    margin-bottom: 0px;
  }
  .endInfo {
    display: block;
    padding: 10px 0px;
    .el-form-item__content {
      min-height: 50px;
    }
  }
}

.contacts {
  .contacts-row {
    display: flex;
    div {
      flex: 1;
    }
  }
  .iconfont {
    margin-right: 2px;
    &.chuanzhen {
      margin-left: 8px;
    }
  }
}
</style>
