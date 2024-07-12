<template>
  <div class="app-container">
    <ComDetailTop title="仓租方案" ref="detailTopRef" :config="{}">
    </ComDetailTop>
    <div class="content">
      <div class="content-form">
        <ComForm
          ref="dialogForm"
          :formConfig="formConfig"
          @handleChange="handleChange"
          v-if="showSearchForm"
        >
          <template v-slot:billWarehouseId="slotProps">
            <div class="table-warehouse">
              <div>
                <AutoComplete
                ref="billWarehouseId"
                :formModel="slotProps.formModel"
                :fieldItem="{
                  ...slotProps.fieldItem,
                  handle:()=>changeBillCompanyId(slotProps.formModel)
                  }"
                :additionalParam="{
                  billCompanyId: slotProps.formModel.billCompanyId,
                }"
              />
              </div>
              <div>
                <el-checkbox v-model="slotProps.formModel.isGeneralRules" :disabled="formConfig.formModel.webGeneralDisabled > 0">通用规则</el-checkbox>
                <!-- <el-tooltip placement="bottom" popper-class="atooltip">
                <div slot="content">计费仓根据选择的计费企业而来</div>
                <span>
                  <i class="iconfont bangzhu2"></i>
                </span>
              </el-tooltip> -->
              </div>
            </div>
          </template>
          <template v-slot:rentFreeDay="slotProps">
            <div v-if="slotProps.formModel.rentFreeType == 1">
              <el-input-number
                size="mini"
                v-model="slotProps.formModel.rentFreeDay"
                :placeholder="slotProps.fieldItem.placeholder"
                v-input-number-limit="0"
                :controls="false"
              />
            </div>
          </template>
        </ComForm>
      </div>
      <div alt="表格">
        <div class="tags">
          <div class="tabs">
            <div>
              <template
                v-for="(item, index) in getTableTags(formConfig.formModel)"
              >
                <el-button
                  :key="index"
                  size="small"
                  plain
                  class="tabs-change"
                  :type="tableTags.active == item.key ? 'activation' : ''"
                  @click="changeTabs(item.key)"
                >
                  {{ item.text }}
                </el-button>
              </template>
            </div>
            <div class="title-tips" v-if="tableTags.active==1">
            <i class="iconfont tishi"></i>
            <span>*库龄阶梯：开始天数 = 库龄天数 - 免租天数</span>
          </div>
          </div>
          <div>
            <template v-for="(item, index) in tableTags.btnLists">
              <el-button
                v-if="
                  item.showActive.includes(tableTags.active)
                "
                :class="item.class"
                :type="item.type"
                :icon="item.icon"
                :key="index"
                size="small"
                :disabled="item.disabled?item.disabled:false"
                @click="item.handleClick()"
              >
                {{ item.text }}
              </el-button>
            </template>
          </div>
        </div>
        <div>
          <div v-show="tableTags.active == 1">
            <ComTable
          ref="tableServiceRef"
          :tableHeight="tableAutoHeight"
          :columnConfig="tableConfig.columnConfig"
          :columnData="tableConfig.columnData"
          :rowOperationBtnListFn="() => getBtnLists()"
        >
          <template v-slot:customRow="{ slotProps }">
            <template v-if="slotProps.prop === 'endValue'">
              <div>
                <div v-if="slotProps.row.isLast">--</div>
                <div v-else>
                  <el-input-number
                    size="small"
                    v-model="slotProps.row.endValue"
                    v-input-number-limit="slotProps.column.decimal"
                    :min="slotProps.row.startValue"
                    :placeholder="slotProps.column.placeholder"
                    @change="changeEndValue(slotProps.row)"
                    :controls="false"
                  />
                </div>
              </div>
            </template>
            <template
              v-for="(item, index) in ['unitPrice', 'minPrice', 'maxPrice']"
            >
              <template v-if="slotProps.prop == item">
                <div :key="index">
                  <el-input-number
                    size="small"
                    :min="0"
                    v-model="slotProps.row[item]"
                    v-input-number-limit="slotProps.column.decimal"
                    :placeholder="slotProps.column.placeholder"
                    :controls="false"
                  />
                </div>
              </template>
            </template>
            <template v-if="slotProps.prop === 'remark'">
              <div>
                <el-input
                  size="small"
                  :placeholder="slotProps.column.placeholder"
                  v-model="slotProps.row.remark"
                ></el-input>
              </div>
            </template>
          </template>
          <template v-slot:customHeader="{ slotProps }">
            <template
              v-if="/endValue|unitPrice|minPrice/.test(slotProps.column.prop)"
            >
              <div class="required">
                <span>*</span>
                <span>{{ slotProps.column.label }}</span>
              </div>
            </template>
          </template>
        </ComTable>
          </div>
          <div v-show="tableTags.active == 2">
            <ComTable
            ref="customerTableServiceRef"
            :tableHeight="tableAutoHeight"
            :columnConfig="customerTableConfig.columnConfig"
            :httpRequest="customerTableConfig.httpRequest"
            :getQueryParams="getQueryParams"
            @onSelectionChange="onSelectionChange"
            :selectionTableRow="[...selectAll]"
            :rowOperationBtnListFn="() => customerTableConfig.statusBtnList"
            rowKey="customerId"
            selectionKey="customerId"
            @getResult="getTableResult"
            v-if="['copy','edit'].includes(operationType)"
          >
          </ComTable>
        </div>
        </div>
      </div>
      <template>
        <div class="footer-seize-seat"></div>
        <div class="order-footer">
          <template v-for="(btn, index) in footerBtn">
            <el-button :key="index" @click="btn.handleClick">
              {{ btn.text }}
            </el-button>
          </template>
        </div>
      </template>
    </div>
    <ServiceDrawer ref="ServiceDrawerRef" @handleSuccess="getcustomerInfo"  />
  </div>
</template>

<script>
import { mixinWarehouseRent } from "./mixin.js";
import {
  warehouseRentFormConfig,
  warehouseRentTableConfig,
  warehouseRentFormRulesConfig,
  relatedCustomers
} from "../model.js";
import { POSTStorageRelationExistRelations } from "@/api/costScheme/index.js";
export default {
  mixins: [mixinWarehouseRent],
  data() {
    return {
      formConfig: {
        formModel: {
        },
        httpRequest: this.handleSubmit, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: warehouseRentFormConfig({
          changeType: 0,
          warehouseChange: () => {
            this.$refs.billWarehouseId?.changeFocusRequest();
          },
        }),
        formRules: warehouseRentFormRulesConfig(), // 表单校验规则
      },
      tableTags: {
        active: 1,
        columns: [
          {
            text: "价格信息",
            key: 1,
          },
          {
            text: "关联客户",
            showIsGeneralRules:[false],
            showOperationType:['edit','copy'],
            key: 2,
          },
        ],
        btnLists: [
          {
            text: "批量移除",
            showActive:[2],
            type: "primary",
            disabled: true,
            class: "maintain-color",
            handleClick: () => {
              this.deleteCustomer(this.selectAll)
            },
          },
          {
            text: "维护客户",
            showActive:[2],
            type: "primary",
            class: "maintain-color",
            handleClick: () => {
              this.handleServiceDrawer()
            },
          },
        ],
      },
      tableConfig: {
        tableHeight: "400px",
        columnData: [
          {
            temp_secondId: 1,
            startValue: 0,
            isLast: true,
          },
        ],
        columnConfig: warehouseRentTableConfig,
        statusBtnList: [
          {
            text: "新增",
            handleClick: this.handleAdd,
          },
          {
            text: "删除",
            color: "#FF6767",
            handleClick: this.handleDelete,
          },
        ],
      },
      customerTableConfig: {
        columnData: [],
        columnConfig: relatedCustomers(),
        httpRequest:POSTStorageRelationExistRelations,
        statusBtnList: [
          {
            text: "移除",
            disabled:false,
            handleClick:(row)=>{
              this.deleteCustomer([row])
            },
          },
        ],
      },
      footerBtn: [
        // {
        //   text: "保存并启用",
        //   type: "primary",
        //   handleClick: () => {
        //     this.saveStatus = 2;
        //     this.btnSubmit();
        //   },
        // },
        {
          text: "保 存",
          type: "primary",
          handleClick: () => {
            this.saveStatus = 1;
            this.btnSubmit();
          },
        },
        {
          text: "取 消",
          handleClick: () => {
            this.handleBack();
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
  padding: 15px 20px;
  .com-detail-top {
    padding: 10px 0px 0px 0px;
    margin: 0px 0px 15px 0px;
  }
  .content {
    .content-form {
      border-bottom: 1px solid #e2e2e2;
      .table-warehouse {
        display: flex;
        align-items: center;
        & > div:not(:first-child) {
          margin-left: 15px;
        }
        // div {
        //   flex: 1;
        // }
        // i {
        //   font-size: 20px;
        //   margin: 0px 10px;
        // }
      }
      // .form-billCompanyId {
      //   display: flex;
      //   align-items: center;
      //   // justify-content: space-between;
      //   & > div:not(:first-child) {
      //     margin-left: 15px;
      //   }
      // }
    }
    // .content-table {
    //   .title {
    //     display: flex;
    //     padding: 15px 0px;
    //     align-items: center;
    //     span {
    //       &:nth-child(1) {
    //         font-weight: bold;
    //       }
    //     }
    //     .title-tips {
    //       color: #a5a5a5;
    //       i {
    //         color: #ff813d !important;
    //         opacity: 0.8;
    //         margin-left: 10px;
    //       }
    //       span {
    //         margin-left: 5px;
    //       }
    //     }
    //   }
    //   .required {
    //     span {
    //       &:nth-child(1) {
    //         color: red;
    //       }
    //       &:nth-child(2) {
    //         margin-left: 5px;
    //       }
    //     }
    //   }
    // }
    .required {
        span {
          &:nth-child(1) {
            color: red;
          }
          &:nth-child(2) {
            margin-left: 5px;
          }
        }
      }
    .tags {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .maintain-color {
        padding: 6.5px 12px;
        font-weight: bold;
        background: #5094ff;
        border-radius: 2px;
      }
      .tabs {
        padding: 10px 0px;
        border-bottom: none;
        display: flex;
        align-items: center;
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
  }
}
</style>
