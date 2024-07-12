<template>
  <div class="app-container" v-if="isInitRes">
    <ComDetailTop
      title="仓租方案"
      ref="detailTopRef"
      :formModel="formConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            formConfig.formModel.schemeCode
              ? `(${formConfig.formModel.schemeCode})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>
    <div class="content">
      <div class="content-form">
        <ComForm ref="dialogForm" :formConfig="formConfig">
          <template v-slot:billWarehouseId="slotProps">
            <div class="table-warehouse">
              <div>{{ slotProps.formModel.billWarehouseName }}</div>
              <div>
                <el-checkbox v-model="slotProps.formModel.isGeneralRules" disabled>通用规则</el-checkbox>
              </div>
            </div>
          </template>
        </ComForm>
      </div>
      <div alt="表格">
        <div class="tags">
          <div class="tabs">
            <div>
              <el-button
              v-for="(item, index) in getTableTags(formConfig.formModel)"
              :key="index"
              size="small"
              plain
              class="tabs-change"
              :type="tableTags.active == item.key ? 'activation' : ''"
              @click="changeTabs(item.key)"
            >
              {{ item.text }}
            </el-button>
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
          <div v-if="tableTags.active == 1">
            <ComTable
            ref="tableServiceRef"
            :tableHeight="tableAutoHeight"
            :columnConfig="tableConfig.columnConfig"
            :columnData="tableConfig.columnData"
          >
          </ComTable>
          </div>
          <div v-if="tableTags.active == 2">
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
          >
          </ComTable>
        </div>
        </div>
      </div>
      <template>
        <div class="footer-seize-seat"></div>
        <div class="order-footer">
        <template v-for="(btn, index) in footerBtn">
          <el-button
            v-if="btn.showStatus.includes(formConfig.formModel.status)"
            :key="index"
            @click="btn.handleClick"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
      </template>
    </div>
    <ServiceDrawer ref="ServiceDrawerRef" @handleSuccess="handleSuccess"  />
  </div>
</template>

<script>
import { mixinWarehouseRentDetail } from "./mixin.js";
import {
  warehouseRentDetailTableConfig,
  warehouseRentDetailFormConfig,
  relatedCustomers
} from "../model.js";
import { updateStorageScheme,POSTStorageRelationExistRelations } from "@/api/costScheme/index.js";
export default {
  mixins: [mixinWarehouseRentDetail],
  data() {
    return {
      formConfig: {
        formModel: {},
        httpRequest: this.handleSubmit, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "120px",
        lists: warehouseRentDetailFormConfig(),
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        // tableHeight: "400px",
        columnData: [],
        columnConfig: warehouseRentDetailTableConfig(),
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
        // tableHeight: "400px",
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
      footerBtn: [
        {
          text: "修 改",
          showStatus: [1],
          handleClick: (formModel) => {
            const { id } = this.formConfig.formModel;
            this.handleAdd(
              { id },
              {
                path: "/costScheme/warehouseRentAddEdit",
                operationType: "edit",
              }
            );
          },
        },
        // {
        //   text: "启 用",
        //   showStatus: [1, 3],
        //   handleClick: (formModel) => {
        //     const { id } = this.formConfig.formModel;
        //     this.handleChangeStatus(
        //       { id },
        //       {
        //         status: 2,
        //         httpRequest: updateStorageScheme,
        //       }
        //     );
        //   },
        // },
        {
          text: "禁 用",
          showStatus: [2],
          color: "#FF6767",
          handleClick: (formModel) => {
            const { id } = this.formConfig.formModel;
            this.handleChangeStatus(
              { id },
              {
                status: 3,
                httpRequest: updateStorageScheme,
              }
            );
          },
        },
        {
          text: "返 回",
          showStatus: [1, 2, 3],
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
        div {
          flex: 1;
        }
        i {
          font-size: 20px;
          margin: 0px 10px;
        }
      }
      /deep/.base-flex-between {
        justify-content: flex-start;
        p {
          margin-right: 30px;
        }
      }
      .table-warehouse {
        display: flex;
        align-items: center;
        & > div:not(:first-child) {
          margin-left: 15px;
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
