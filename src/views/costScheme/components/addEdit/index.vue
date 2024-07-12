<template>
  <!-- 新页面 -->
  <div class="app-container">
    <div alt="头部">
      <ComDetailTop
        :title="formData.title || ''"
        :formModel="formData"
        ref="detailTopRef"
        :config="{}"
      >
      </ComDetailTop>
    </div>
    <div class="form" alt="表单">
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        v-if="showSearchForm"
        @handleChange="changeFormData"
      >
        <template v-slot:timeLimitCost="slotProps">
          <div class="flex">
            <div class="flex-group" v-if="cost.type == 'servicePrice'">
              <el-input
                type="text"
                v-model="slotProps.formModel.timeLimitCost"
                v-input-number-limit="slotProps.fieldItem.decimal"
                :maxlength="slotProps.fieldItem.maxlength"
              ></el-input>
            </div>
            <div v-else>
              <span>{{
                `${slotProps.formModel.timeLimitCost || "--"}${
                  slotProps.formModel.billCurrencyName || "--"
                }/单位`
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
          <div class="flex" v-if="cost.type == 'servicePrice'">
            <div class="flex-group" v-if="cost.type == 'servicePrice'">
              <div>
                <el-input
                  type="text"
                  v-model="slotProps.formModel.startSignAging"
                  v-input-number-limit="slotProps.fieldItem.decimal"
                  :maxlength="slotProps.fieldItem.maxlength"
                ></el-input>
                <span>~</span>
                <el-input
                  type="text"
                  v-model="slotProps.formModel.endSignAging"
                  v-input-number-limit="slotProps.fieldItem.decimal"
                  :maxlength="slotProps.fieldItem.maxlength"
                ></el-input>
              </div>
            </div>
            <div>
              <span>天</span>
            </div>
          </div>
          <div v-else>
            <span>{{ slotProps.formModel.startSignAging || "--" }}</span>
            <span>-</span>
            <span>{{ slotProps.formModel.endSignAging || "--" }}</span>
            <span>天</span>
          </div>
        </template>
        <template v-slot:delayedClaims="slotProps">
          <div class="flex" v-if="cost.type == 'servicePrice'">
            <div class="flex-group">
              <el-input
                type="text"
                v-model="slotProps.formModel.delayedClaims"
                v-input-number-limit="slotProps.fieldItem.decimal"
                :maxlength="slotProps.fieldItem.maxlength"
              ></el-input>
            </div>
            <div>工作日</div>
          </div>
          <div v-else>
            <span>{{ slotProps.formModel.delayedClaims || "--" }}</span>
            <span>工作日</span>
          </div>
        </template>
        <template v-slot:delayedClaimsRules="slotProps">
          <div class="flex" v-if="cost.type == 'servicePrice'">
            <div class="flex-group">
              <div>
                <el-input
                  type="text"
                  v-model="slotProps.formModel.delayedClaimsMoney"
                  v-input-number-limit="slotProps.fieldItem.decimal"
                  :maxlength="slotProps.fieldItem.maxlength"
                ></el-input>
                <span>/</span>
                <el-input
                  type="text"
                  v-model="slotProps.formModel.delayedClaimsUnit"
                  v-input-number-limit="slotProps.fieldItem.decimal"
                  :maxlength="slotProps.fieldItem.maxlength"
                ></el-input>
              </div>
            </div>
          </div>
          <div v-else>
            <span>{{ slotProps.formModel.delayedClaimsMoney || "--" }}</span>
            <span>{{ slotProps.formModel.billCurrencyName || "--" }}</span>
            <span>/</span>
            <span>{{ cost.billUnit || "--" }}</span>
            <span>/</span>
            <span>{{ slotProps.formModel.delayedClaimsUnit || "--" }}</span>
            <span>天</span>
          </div>
        </template>
        <template v-slot:costId="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: handleChangerules,
            }"
          />
        </template>
        <template v-slot:billCurrency="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
              handle: handleChangeBillCurrency,
            }"
          />
        </template>
      </ComForm>
    </div>
    <div alt="表格">
      <div class="tabs">
        <div class="tags">
          <el-button
            v-for="(item, index) in tableTags.columns"
            :key="index"
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
              size="small"
              :key="index"
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
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="getColumnConfig(tableTags.active)"
            :httpRequest="getHttpRequest"
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
                    <!-- <span v-if="cost.type == 'servicePrice'">{{
                      `：${item.costPrice} ${cost.billCurrencyCode}`
                    }}</span> -->
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'costPrice'">
                <div>
                  <div
                    v-for="(item, index) in slotProps.row.billingRuleList"
                    :key="index"
                  >
                    <span v-if="cost.type == 'servicePrice'">{{
                      `${item.costPrice} ${cost.billCurrencyCode}`
                    }}</span>
                    <span v-else>{{
                      `${item.costPrice} ${
                        formConfig.formModel.billCurrencyName || ""
                      }`
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
                    <el-input
                      size="mini"
                      v-model="item.customersPrice"
                      v-input-number-limit="slotProps.column.decimal"
                    >
                    </el-input>
                  </div>
                </div>
              </template>
              <template v-if="slotProps.prop === 'operation'">
                <div class="operation-content-btn">
                  <template v-for="(item, index) in tableStatusBtnList">
                    <el-button
                      :key="index"
                      v-if="item.status?item.status.includes(slotProps.row.isDefault):false"
                      size="small"
                      type="text"
                      @click="item.handleClick(slotProps.row)"
                      >{{ item.text }}</el-button
                    >
                  </template>
                </div>
              </template>
            </template>
          </ComTable>
        </div>

        <div v-if="tableTags.active == 2">
          <ComTable
            ref="tableServiceRef"
            :tableHeight="tableConfig.tableHeight"
            :columnConfig="getColumnConfig(tableTags.active)"
            :httpRequest="getHttpRequest"
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
        <div v-for="(item, index) in supplement" :key="index">
          <div v-if="item.costType.includes(cost.type)">
            <div class="supplement-title">
              <span>{{ item.title }}</span>
            </div>
            <div>
              <el-input
                :type="item.type"
                :rows="item.rows"
                :placeholder="item.placeholder"
                v-model="item.input"
                @change="getInputHtml($event, item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-footer">
      <template v-for="(btn, index) in footerBtn">
        <el-button
          v-if="btn.showType.includes(cost.type)"
          :type="btn.type"
          @click="btn.handleClick"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
    <ComDialog ref="comDialog" @handleSuccess="handleSuccess" />
    <TransformDialog ref="TransformDialog" @handleSuccess="handleSuccess" />
    <ConfirmDialog ref="confirmDialog" />
    <ServiceDrawer ref="ServiceDrawerRef" @handleSuccess="handleSuccess"  />
  </div>
</template>

<script>
import { addEditMixin } from "../addEditMixin.js";
// import { mapActions, mapState } from "vuex";
export default {
  name: "CostSchemeAddEdit",
  mixins: [addEditMixin],
  data() {
    return {
      formData: {
        createBy: "",
        createTime: "",
      },
      formConfig: {
        formModel: {},
        httpRequest: this.handleSaveData, // 表单提交接口
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
            text: "新增",
            status: [1],
            icon: "el-icon-plus",
            type: "warning",
            class: "add-color",
            costType: ["servicePrice"],
            handleClick: () => {
              const tableData = this.$refs.tablePriceInfoRef?.getNewTableData();
              const warehouseIdsLists = this.getTableWarehouseIds(); //初始化筛选关联仓库可选项，需要取列表所有已选仓库的集合
              const row = tableData.length > 0 ? tableData[0] : {}; //新增需要根据第一条仓库数据来初始化
              this.handleAddRules(row, {
                type: "add",
                id: this.cost.id,
                listsType: this.cost.type,
                warehouseIdsLists,
              });
            },
          },
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
            handleClick: () => {
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
            handleClick: () => {
              this.handleServiceDrawer('ServiceDrawerRef')
              // this.handleAddCustomer("customer");
            },
          },
        ],
      },
      tableConfig: {
        columnData: [],
        tableHeight: "423px",
      },
      tableStatusBtnList: [
        {
          text: "复制",
          status: [0, 1, null],
          handleClick: (row) => {
            const warehouseIdsLists = this.getTableWarehouseIds();
            this.handleAddRules(row, {
              type: "copy",
              id: this.cost.id,
              listsType: this.cost.type,
              warehouseIdsLists,
            });
          },
        },
        {
          text: "修改",
          status: [0, 1, null],
          handleClick: (row) => {
            const warehouseIdsLists = this.getTableWarehouseIds();
            this.handleAddRules(row, {
              type: "edit",
              id: this.cost.id,
              listsType: this.cost.type,
              warehouseIdsLists: warehouseIdsLists,
            });
          },
        },
        {
          text: "删除",
          status: [0, 1, null],
          handleClick: (row) => {
            this.handleDeleteRules(row);
          },
        },
        {
          text: "维护仓库",
          status: [0, null],
          handleClick: (row) => {
            this.handleMainTainWarehouse(row);
          },
        },
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
    .border-left {
      flex: 2.5 1 0% !important;
      padding: 0px 20px;
    }
    .border-right {
      height: 50%;
      border-radius: 0px 6px 6px 0px;
      border-left: 2px solid #5094ff;
      flex: 1 1 0% !important;
      padding: 20px 20px 0px 20px;
      margin-bottom: 10px;
      background-color: #f0f6ff;
      .flex {
        // 有点问题
        display: flex;
        &-group {
          width: 65%;
          div {
            &:nth-child(1) {
              display: flex;
            }
          }
          span {
            margin: 0px 10px;
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
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
    border-bottom: 0px;
    .add-color {
      background: #ff813d;
      font-weight: bold;
      padding: 6.5px 12px;
      border-radius: 2px;
      border: none;
      /deep/.el-icon-plus {
        font-weight: bold;
      }
    }
    .maintain-color {
      padding: 6.5px 12px;
      font-weight: bold;
      background: #5094ff;
      border-radius: 2px;
    }
    .tags {
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
    &-title {
      margin: 15px 0px;
    }
    span {
      &:nth-child(1) {
        font-weight: bold;
      }
    }
  }
}
</style>
