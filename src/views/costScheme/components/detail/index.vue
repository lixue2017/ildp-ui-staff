<template>
  <!-- 新页面 -->
  <div class="app-container" v-if="showSearchForm">
    <div alt="头部">
      <ComDetailTop
        :title="formData.title"
        :formModel="formData"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            <template v-if="cost.type == 'servicePrice'">
              {{
                formConfig.formModel.costCode
                  ? `(${formConfig.formModel.costCode})`
                  : ""
              }}
            </template>
            <template v-else-if="cost.type == 'customerPrice'">
              {{
                formConfig.formModel.serviceName
                  ? `(${formConfig.formModel.serviceName})`
                  : ""
              }}
            </template>
          </span>
        </template>
      </ComDetailTop>
    </div>
    <div class="form" alt="表单">
      <ComForm ref="dialogForm" :formConfig="formConfig">
        <template v-slot:timeLimitCost="slotProps">
          <!-- //现时达收费： -->
          <div class="flex">
            <div class="flex-group">
              <span>{{
                `${slotProps.formModel.timeLimitCost || "--"}${
                  formConfig.formModel.billCurrencyName || "--"
                }/${formConfig.formModel.billUnitName || "--"}`
              }}</span>
            </div>
            <div>
              <el-tooltip placement="bottom" popper-class="atooltip">
                <div slot="content">
                  限时达渠道特别说明<br />
                  1.快递无法识别导致的派送异常，取消限时赔偿。<br />
                  2.因不可抗力因素导致的延误不在时效赔偿范围之内，如:
                  国内外查验、天气原因，自然灾害.塞港，疫情，战争暴乱，以及罢工，等影响;<br />
                  3.限时达只接受亚马逊仓库，非亚马逊货物单独确定。
                </div>
                <span class="sub-title">
                  <i class="iconfont tishi1 iconfontSize"></i>
                </span>
              </el-tooltip>
            </div>
          </div>
        </template>
        <template v-slot:signAging="slotProps">
          <!-- //签收时效(开船后)： -->
          <div class="flex">
            <div class="flex-group">
              <div>
                <span>{{ slotProps.formModel.startSignAging || "--" }}</span>
                <span>~</span>
                <span>{{ slotProps.formModel.endSignAging || "--" }}</span>
              </div>
            </div>
            <div>
              <span>天</span>
            </div>
          </div>
        </template>
        <template v-slot:delayedClaims="slotProps">
          <!-- //延时赔偿起算： -->
          <div class="flex">
            <div class="flex-group">
              <span>{{ slotProps.formModel.delayedClaims || "--" }}</span>
            </div>
            <div>工作日</div>
          </div>
        </template>
        <template v-slot:delayedClaimsRules="slotProps">
          <!-- //延时赔偿规则： -->
          <div class="flex">
            <div class="flex-group">
              <div>
                <span>{{
                  `${slotProps.formModel.delayedClaimsMoney || "--"}${
                    formConfig.formModel.billCurrencyName || "--"
                  }/${formConfig.formModel.billUnitName || "--"}/${
                    slotProps.formModel.delayedClaimsUnit || "--"
                  }天`
                }}</span>
              </div>
            </div>
            <div></div>
          </div>
        </template>
      </ComForm>
    </div>
    <div alt="表格">
      <div class="tags">
        <div class="tabs">
          <el-button
            v-for="(item, index) in tableTags.columns"
            :key="index"
            size="small"
            plain
            class="tabs-change"
            :type="tableTags.active == item.key ? 'activation' : ''"
            @click="changeTabs(item.key)"
          >
            {{ item.text }}</el-button
          >
          <i class="iconfont tishi"></i>
          <span>同一成本规则，对应的阶梯标准一致</span>
        </div>
        <div>
          <template v-for="(item, index) in tableTags.btnLists">
            <el-button
              v-if="
                item.status.includes(tableTags.active) &&
                item.costType.includes(cost.type)
              "
              :class="item.class"
              :type="item.type"
              :icon="item.icon"
              :key="index"
              size="small"
              @click="item.handleClick()"
            >
              {{ item.text }}
            </el-button>
          </template>
        </div>
      </div>
      <div>
        <div v-if="tableTags.active == 1">
          <ComTable
            ref="tablePriceInfoRef"
            class="tablePrIceInfo"
            :columnConfig="getColumnConfig(tableTags.active)"
            :httpRequest="getHttpRequest(tableTags.active)"
            :getQueryParams="getQueryParams"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-if="slotProps.prop === 'warehouseIds'">
                <div class="tablePrIceInfo-warehouseIds">
                  <!-- <el-tag v-if="slotProps.row.isDefault">默认</el-tag> -->
                  <i class="iconfont moren" v-if="slotProps.row.isDefault"></i>
                  <span v-else>{{ slotProps.row.warehouseName || "--" }}</span>
                </div>
              </template>
              <template v-if="slotProps.prop === 'billingRuleList'">
                <div>
                  <div
                    v-for="(item, index) in slotProps.row.billingRuleList"
                    :key="index"
                  >
                    <span v-if="item.endValue">{{
                      `${item.startValue}&lt;X&le;${item.endValue}${cost.billUnit}`
                    }}</span>
                    <span v-else>
                      {{ `${item.startValue}${cost.billUnit}` }}
                    </span>
                    <!-- <span>{{ item.costPrice }}</span> -->
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'costPrice'">
                <div>
                  <div
                    v-for="(item, index) in slotProps.row.billingRuleList"
                    :key="index"
                  >
                    <span>{{
                      `${item.costPrice} ${formConfig.formModel.billCurrencyName}`
                    }}</span>
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'customersPrice'">
                <div>
                  <div
                    v-for="(item, index) in slotProps.row.billingRuleList"
                    :key="index"
                  >
                    <span>{{
                      `${item.customersPrice} ${formConfig.formModel.billCurrencyName}`
                    }}</span>
                  </div>
                </div>
              </template>
            </template>
          </ComTable>
        </div>
        <div v-if="tableTags.active == 2">
          <ComTable
            ref="tableServiceRef"
            :columnConfig="getColumnConfig(tableTags.active)"
            :httpRequest="getHttpRequest(tableTags.active)"
            :getQueryParams="getQueryParams"
            @onSelectionChange="onSelectionChange"
            :selectionTableRow="[...selectAll]"
            :rowOperationBtnListFn="(row) => getServiceBtnLists(row, 'status')"
          >
          </ComTable>
        </div>
      </div>
    </div>
    <div class="supplement" alt="其他补充">
      <div>
        <div
          v-for="(item, index) in supplement"
          class="supplement-info"
          :key="index"
        >
          <div v-if="item.costType.includes(cost.type)">
            <div class="supplement-title">
              <span>{{ item.title }}</span>
            </div>
            <div>
              <span v-html="item.inputHtml"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          v-if="
            btn.showStatus.includes(formConfig.formModel.status) &&
            btn.showType.includes(cost.type)
          "
          :type="btn.type"
          @click="btn.handleClick"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <ComDialog ref="comDialog" />
    <!-- <TransformDialog ref="TransformDialog" @handleSuccess="handleSuccess" /> -->
    <ConfirmDialog ref="confirmDialog" />
    <ServiceDrawer ref="ServiceDrawerRef" @handleSuccess="handleSuccess"  />
  </div>
</template>

<script>
import { detailsMixin } from "../detailsMixin.js";
export default {
  mixins: [detailsMixin],
  data() {
    return {
      formData: {
        title: "",
        createBy: "",
        createTime: "",
      },
      formConfig: {
        formModel: {
          supplyRemark: "", //其他补充，编辑器输入字段
        },
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        formRules: {}, // 表单校验规则
      },
      tableTags: {
        active: 1,
        columns: [],
        btnLists: [
        {
            text: "批量移除",
            status: [2],
            type: "primary",
            class: "maintain-color",
            costType: ["servicePrice","customerPrice"],
            handleClick: () => {
              this.handleRemove(this.selectAll)
            },
          },
          {
            text: "维护服务商",
            status: [2],
            type: "primary",
            class: "maintain-color",
            costType: ["servicePrice"],
            handleClick: (row) => {
              // this.handleAddCustomer("supplier");
              this.handleServiceDrawer('ServiceDrawerRef')
            },
          },
          {
            text: "维护客户",
            status: [2],
            type: "primary",
            class: "maintain-color",
            costType: ["customerPrice"],
            handleClick: (row) => {
              this.handleServiceDrawer('ServiceDrawerRef')
              // this.handleAddCustomer("customer");
            },
          },
        ],
      },
      tableStatusBtnList: [
        {
          text: "移除",
          showtabs:[2],
          handleClick: (row) => {
            this.handleRemove(row)
          },
        },
      ],
      selectAll:[]
    };
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  margin-bottom: 80px;
  .com-detail-top {
    padding: 10px 0px 0px 0px;
    margin: 0px 0px 15px 0px;
  }
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
    .border-left {
      flex: 2.5 1 0% !important;
      padding: 0px 20px;
    }
    .border-right {
      height: 50%;
      border-radius: 0px 6px 6px 0px;
      border-left: 2px solid #3179ef;
      flex: 1 1 0% !important;
      padding: 20px 20px 0px 20px;
      margin-bottom: 10px;
      background-color: #ebf2fd;
      .flex {
        // 有点问题
        display: flex;
        &-group {
          div {
            &:nth-child(1) {
              display: flex;
            }
          }
        }
        div {
          &:nth-child(2) {
            padding: 0px 20px;
          }
        }
      }
    }
    .iconfontSize {
      color: #5094ff;
    }
  }
  .form {
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }
  .tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding:10px 0px;
    // margin: 10px 0px;
    .maintain-color {
      padding: 6.5px 12px;
      font-weight: bold;
      background: #5094ff;
      border-radius: 2px;
    }
    .tabs {
      padding: 10px 0px;
      i {
        color: #ff813d !important;
        opacity: 0.8;
        margin-left: 10px;
      }
      span {
        margin-left: 5px;
        color: #a5a5a5;
      }
    }
    span {
      margin-left: 5px;
      color: #a5a5a5;
    }
  }
  .tablePrIceInfo {
    &-warehouseIds {
      i {
        font-size: 18px;
      }
    }
  }
  .supplement {
    padding-bottom: 15px;
    &-info {
      padding-bottom: 10px;
    }
    &-title {
      margin: 15px 0px;
    }
    div {
      &:nth-child(1) {
        font-weight: bold;
      }
      &:nth-child(2) {
        font-weight: 400;
      }
    }
  }
}
</style>
