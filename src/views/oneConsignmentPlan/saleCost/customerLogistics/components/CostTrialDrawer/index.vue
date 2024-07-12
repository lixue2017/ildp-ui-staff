<template>
  <ComDrawer
    class="add-drawer"
    ref="myDrawer"
    :customDrawer="drawerConfig"
    :confirmClose="false"
  >
    <template v-slot:content>
      <ComForm ref="dialogForm" :formConfig="formConfig">
        <template v-slot:volume="slotProps">
          <div class="volume">
            <el-input-number
              v-model="slotProps.formModel.length"
              :controls="false"
              placeholder="长"
              v-input-number-limit="1"
              :precision="1"
              :maxlength="11"
              size="mini"
              @change="handleChange($event, 'length')"
            />
            <el-input-number
              v-model="slotProps.formModel.width"
              :controls="false"
              placeholder="宽"
              v-input-number-limit="1"
              :precision="1"
              :maxlength="11"
              size="mini"
              @change="handleChange($event, 'width')"
            />
            <el-input-number
              v-model="slotProps.formModel.height"
              :controls="false"
              placeholder="高"
              v-input-number-limit="1"
              :precision="1"
              :maxlength="11"
              size="mini"
              @change="handleChange($event, 'height')"
            />
          </div>
        </template>
        <template v-slot:product="slotProps">
          <div class="product">
            <div class="label">添加产品</div>
            <AutoComplete
              class="product-complete"
              ref="tempRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                handle: (val) => handleChange(val, 'product'),
              }"
            />
          </div>
        </template>
        <template v-slot:tableSlot>
          <div class="productTable">
            <template v-for="(item, i) in productTable">
              <div class="productOuter" :key="item.productId">
                <div class="productSku">
                  <div class="title">
                    <TooltipOver
                      :content="item.sku"
                      :style="{
                        width: '290px',
                      }"
                    />
                  </div>
                  <div class="deleteBtn" @click="() => handleDelete(i)">
                    移除
                  </div>
                </div>
                <div class="productData">
                  <span class="label">重量：</span>
                  <TooltipOver
                    :numDecimal="2"
                    :content="item.productSingleWeight"
                    :style="{
                      width: '58px',
                    }"
                    class="value"
                  />
                  <span class="label">体积：</span>
                  <TooltipOver
                    :numDecimal="2"
                    :content="item.productSingleVolume"
                    :style="{
                      width: '58px',
                    }"
                    class="value"
                  />
                  <span class="label">数量：</span>
                  <el-input-number
                    v-model="item.productNum"
                    :controls="false"
                    placeholder="数量"
                    v-input-number-limit="0"
                    :precision="0"
                    :maxlength="11"
                    size="mini"
                    @change="handleChangeNum"
                  />
                </div>
              </div>
            </template>
            <div
              class="table-empty"
              v-if="!productTable || !productTable.length"
            >
              <img :src="noDataImg" alt="" srcset="" width="150px" />
              <div>
                没有产品数据哦～ <br />
                快去添加吧！
              </div>
            </div>
          </div>
        </template>
      </ComForm>
      <div class="top">
        <div class="title">费用信息</div>
        <div class="tabs-btn">
          <el-button
            size="mini"
            class="btn"
            type="primary"
            round
            @click="handleTrial"
          >
            费用试算
          </el-button>
        </div>
      </div>
      <CostTable ref="tableRef" />
    </template>
  </ComDrawer>
</template>

<script>
import { costTrialCalculate } from "@/api/oneConsignmentPlan/saleCost";
import { formConfig } from "./model";
import noDataImg from "@/assets/image/noData.png";
import { multiplicationFn, accumulationFn } from "@/utils/instructions";
export default {
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    CostTable: () => import("../CostTable"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
  data() {
    return {
      noDataImg,
      productTable: [],
      drawerConfig: {
        title: "费用试算",
        width: "1154px",
        size: "small",
        showClose: false,
        wrapperClosable: true,
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
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "80px",
        ...formConfig,
      },
    };
  },
  methods: {
    show() {
      this.$refs.myDrawer.show();
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    handleTrial() {
      this.$refs.dialogForm.submitForm();
    },
    onSelectionChange(rows, total) {
      this.selectAll = rows;
      this.drawerConfig.footer[0].num = this.selectAll.length;
    },
    submitFormRequest(formData) {
      const { multiSelect, product, volume, ...data } = formData;
      const index = this.productTable.findIndex((item) => !item.productNum);
      return new Promise((resolve, reject) => {
        if (index > -1) {
          this.$message.error(`产品第${index + 1}行，数量未填`);
          return reject();
        } else {
          const params = {
            ...data,
            signatureService:
              multiSelect && multiSelect.includes(1) ? true : false,
            insuranceService:
              multiSelect && multiSelect.includes(2) ? true : false,
            productList: this.productTable,
          };
          costTrialCalculate(params)
            .then((res) => {
              resolve(res);
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    handleSuccess(res) {
      if (res.data) {
        this.$refs.tableRef.setColumnData(res.data);
      }
    },
    handleChange(val, prop) {
      if (prop === "product") {
        const {
          id: productId,
          title: sku,
          cusProduct: {
            singleBoxWeight: productSingleWeight,
            productWidth,
            productLength,
            productHigh,
          },
        } = val;
        this.productTable.push({
          productId,
          productNum: undefined,
          sku,
          productSingleVolume:
            (Number(productWidth || 0) *
              Number(productLength || 0) *
              Number(productHigh || 0)) /
            1000000,
          productSingleWeight,
        });
      }
    },
    handleChangeNum(rows){
      let totalWeight=0
      this.productTable.forEach((e)=>{
        const {productNum,productSingleWeight}=e
        totalWeight=accumulationFn([totalWeight,multiplicationFn([productNum,productSingleWeight],2)])
      })
      this.$refs.dialogForm?.setFormModel({
        weight:totalWeight
      })
    },
    handleDelete(i) {
      this.productTable.splice(i, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 13px 0 0;
    margin-bottom: 5px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #e2e2e2;

    .title {
      padding: 15px 0;
      font-size: 14px;
      font-weight: bold;
    }
  }

  /deep/ {
    .form-left{
      .product {
        display: flex;
        .label {
          font-weight: bold;
          margin-right: 13px;
        }
        .product-complete {
          // width: 220px;
          flex:1
        }
      }
    }
    .form-right {
      margin-left: 50px;
      // .product {
      //   display: flex;
      //   .label {
      //     font-weight: bold;
      //     margin-right: 20px;
      //   }
      //   .product-complete {
      //     width: 220px;
      //   }
      // }
      .productTable {
        height: 297px;
        background: #f0f6ff;
        border-radius: 2px 6px 6px 2px;
        border-left: 3px solid #5094ff;
        padding: 0 20px 0 17px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none;
        }

        .productOuter {
          padding: 12px 0;
          // &:not(:last-child) {
          border-bottom: 1px solid #e2e2e2;
          // }
        }
        .productSku {
          display: flex;
          justify-content: space-between;

          .title {
            width: 290px;
            font-weight: bold;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .deleteBtn {
            color: #ff6767;
            cursor: pointer;
          }
        }
        .productData {
          display: flex;
          align-items: center;
          .text-tooltip {
            padding-right: 6px;
          }
          .el-input-number {
            width: 60px;
            .el-input__inner {
              height: 24px;
              line-height: 24px;
              padding-left: 10px;
              padding-right: 10px;
            }
          }
        }
        .table-empty {
          text-align: center;
          line-height: 20px;
          padding-top: 20px;
          img {
            width: 100px;
            padding: 30px 0 14px;
          }
          div {
            padding-bottom: 30px;
          }
        }
      }
    }
  }
  .volume {
    display: flex;
    justify-content: space-between;

    .el-input-number {
      width: 82px;
    }
  }
}
</style>
