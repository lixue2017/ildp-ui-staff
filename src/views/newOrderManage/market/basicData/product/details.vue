<template>
  <div
    class="proInfo-details"
    v-if="Object.keys(detailFormConfig.formModel).length"
  >
    <ComDetailTop
      :title="`产品信息`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :formModel="detailFormConfig.formModel"
      :config="tabConfig"
      @handleClick="reBack"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          ({{ detailFormConfig.formModel.companyName }})
        </span>
      </template>
    </ComDetailTop>
    <div class="content">
      <ComForm
        ref="dialogForm"
        :formConfig="detailFormConfig"
        style="width: 100%"
      />
      <div class="other-info">
        <div class="pics">
          <!-- <div
            class="pics-info"
            :style="{
              background: `url(${
                detailFormConfig.formModel.img || productDefaultLogo
              }) no-repeat center`,
              backgroundSize: 'cover',
            }"
          ></div> -->
          <div class="pics-info">
            <div>
              <span>产品图片：</span>
              <el-image
                :src="detailFormConfig.formModel.img || productDefaultLogo"
                :preview-src-list="[detailFormConfig.formModel.img]"
              >
              </el-image>
            </div>
            <div>
              <span>定价截图：</span>
              <el-image
                :src="detailFormConfig.formModel.priceImg || productDefaultLogo"
                :preview-src-list="[detailFormConfig.formModel.priceImg]"
              >
              </el-image>
            </div>
          </div>
          <div class="status">
            {{
              (detailFormConfig.formModel.dataStatus &&
                dictionary.dicsData.status &&
                dictionary.dicsData.status[
                  detailFormConfig.formModel.dataStatus
                ] &&
                dictionary.dicsData.status[
                  detailFormConfig.formModel.dataStatus
                ].nameCn) ||
              "草稿"
            }}
          </div>
        </div>
        <div>
          <span>历史修订次数：</span>
          <span class="time">
            {{ detailFormConfig.formModel.revisionsNum || 0 }}
          </span>
        </div>
        <div>
          <span>产品属性：</span>
          <span>
            <el-radio
              disabled
              v-model="detailFormConfig.formModel.productAttribute"
              :label="0"
              >普货</el-radio
            >
            <el-radio
              disabled
              v-model="detailFormConfig.formModel.productAttribute"
              :label="1"
              >敏感货</el-radio
            >
          </span>
        </div>
        <div
          class="elec-type"
          v-if="detailFormConfig.formModel.productAttribute === 1"
        >
          <span>
            <el-checkbox
              v-model="detailFormConfig.formModel.electrified"
              disabled
            >
            </el-checkbox>
            带电
          </span>
          <span class="type"
            >电池类型：{{
              (detailFormConfig.formModel.electrifiedType &&
                dictionary.dicsData.batteryType &&
                dictionary.dicsData.batteryType[
                  detailFormConfig.formModel.electrifiedType
                ] &&
                dictionary.dicsData.batteryType[
                  detailFormConfig.formModel.electrifiedType
                ].nameCn) ||
              "--"
            }}
          </span>
        </div>
        <div
          class="elec-ts"
          v-if="detailFormConfig.formModel.productAttribute === 1"
        >
          <span v-for="item in typeList" :key="item.label">
            <el-checkbox
              v-model="detailFormConfig.formModel[item.label]"
              disabled
            >
            </el-checkbox>
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>
    <div class="historical-records">
      <div class="historical-records-title">历史修订记录</div>
      <div class="historical-records-sub">
        <i class="el-icon-info light-blue-text"></i>
        <span>启用之后每次修改记录相关信息</span>
      </div>
    </div>
    <ComTable
      ref="detailDialogTable"
      :tableHeight="detailTable.tableHeight"
      :columnConfig="detailTable.columnConfig"
      :httpRequest="detailTable.httpRequest"
      :getQueryParams="getDetailQueryParams"
      :paginationConfig="paginationConfig"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'invalid'">
          <el-row>{{ slotProps.row.updateBy || "--" }} </el-row>
          <el-row> {{ slotProps.row.updateTime || "--" }}</el-row>
        </template>
        <template v-if="slotProps.prop === 'productInfo'">
          <div class="product-info">
            <div class="table-preview-image">
              <el-image
                style="border: 1px solid #8b8b8b"
                :src="slotProps.row.img || productDefaultLogo"
                :preview-src-list="[slotProps.row.img]"
              />
            </div>
            <div class="right" style="width: 300px">
              <el-row class="ellipsis-text">
                <span> 类型：{{ slotProps.row.productTypeName || "--" }}</span>
              </el-row>
              <el-row class="ellipsis-text">
                <span> 品牌：{{ slotProps.row.brand || "--" }}</span>
                <el-divider direction="vertical"></el-divider>
                <span> 型号：{{ slotProps.row.productModel || "--" }}</span>
              </el-row>
            </div>
          </div>
        </template>
        <template v-if="slotProps.prop === 'declaredValue'">
          <el-row>
            {{ formatMoney(slotProps.row.declaredValue) }}
            {{
              `${slotProps.row.declaredUnit}/
               ${slotProps.dicsList.nameCn}`
            }}
          </el-row>
          <el-row> {{ formatMoney(slotProps.row.productUnitPrice) }}</el-row>
        </template>
        <template v-if="slotProps.prop === 'productWeight'">
          <el-row>{{ toFixedNum(slotProps.row.productWeight) }} </el-row>
          <el-row>
            {{ toFixedNum(slotProps.row.productNetWeight) }}
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'singleBoxWeight'">
          <el-row>{{ toFixedNum(slotProps.row.singleBoxWeight) }} </el-row>
          <el-row>
            {{ toFixedNum(slotProps.row.singleBoxNetWeight) }}
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'productValue'">
          <el-row>
            {{ toFixedNum(slotProps.row.productLength) }} *
            {{ toFixedNum(slotProps.row.productWidth) }} *
            {{ toFixedNum(slotProps.row.productHigh) }}
          </el-row>
          <el-row>
            {{ slotProps.row.singleBoxNum || "--" }}
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'customAsin'">
          <el-row>{{ slotProps.row.asin || "--" }} </el-row>
          <el-row>{{ slotProps.row.userSetCode || "--" }} </el-row>
        </template>
        <template v-if="slotProps.prop === 'businessUse'">
          <el-row>{{ slotProps.row.businessUseCn || "--" }} </el-row>
          <el-row>{{ slotProps.row.businessUseEn || "--" }} </el-row>
        </template>
        <template v-if="slotProps.prop === 'materialCn'">
          <el-row class="ellipsis-text"
            >{{ slotProps.row.materialCn || "--" }}
          </el-row>
          <el-row class="ellipsis-text">
            {{ slotProps.row.materialEn || "--" }}
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'productLink'">
          <el-row class="ellipsis-text">
            {{ slotProps.row.productLink || "--" }}
          </el-row>
          <el-row class="ellipsis-text">
            <span
              class="type-list"
              v-for="(item, index) in detailTable.typeList"
              :key="index"
            >
              <span
                v-if="
                  (slotProps.row['productAttribute'] === 1 &&
                    slotProps.row[item.label] === 1) ||
                  (slotProps.row['productAttribute'] === 0 && index === 0)
                "
                class="type-li"
              >
                <img src="@/assets/image/electric_icon.png" class="type-icon" />
                {{
                  slotProps.row["productAttribute"] === 0 ? "普货" : item.value
                }}
                <template v-if="item.label === 'electrified'"
                  >{{
                    slotProps.row.electrifiedType &&
                    dictionary.dicsData.batteryType &&
                    dictionary.dicsData.batteryType[
                      slotProps.row.electrifiedType
                    ] &&
                    `(${
                      dictionary.dicsData.batteryType[
                        slotProps.row.electrifiedType
                      ].nameCn
                    })`
                  }}
                </template>
              </span>
            </span>
          </el-row>
        </template>
        <template v-if="slotProps.prop === 'pricingScreenshot'">
          <div class="table-preview-image">
            <el-image
              :src="slotProps.row.priceImg || productDefaultLogo"
              :preview-src-list="[slotProps.row.priceImg]"
            />
          </div>
        </template>
      </template>
      <template v-slot:customHeader="{ slotProps }">
        <template
          v-if="
            /invalid|declaredValue|productWeight|singleBoxWeight|productValue|businessUse|customAsin|materialCn|productLink|pricingScreenshot/.test(
              slotProps.column.prop
            )
          "
        >
          <div>{{ slotProps.column.labelTop }}</div>
          <div>{{ slotProps.column.labelBtm }}</div>
        </template>
      </template>
    </ComTable>
    <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in getFootBtn()">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            <!-- v-hasPermi="btn.hasPermission" -->
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { detailColumns, tableTpList, addTpList } from "./model";
import { getDetails } from "@/api/basicInfo/product";
import { FullscreenLoading } from "@/utils/loading";
import commonMixin from "@/utils/mixin";
import { mapActions, mapState } from "vuex";
import { getProductList } from "@/api/common";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { printProductSku } from "@/api/warehouse/basic.js";
import { comFileDownload } from "@/utils/download.js";
export default {
  mixins: [commonMixin],
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  props: {},
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      tabConfig: {
        columnConfig: [
          // 标题右侧label，数据取值formModel
          {
            label: "创建人",
            prop: "createBy",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
        ],
        rightBtn: [
          // 右侧按钮集合
          {
            icon: "iconfont icon-fanhui",
            text: "返回上一页",
            type: "back",
            className: "back",
          },
        ],
      },
      productDefaultLogo,
      fullscreenLoading: new FullscreenLoading(),
      detailId: "",
      paginationConfig: {
        limit: 5,
        layout: "total, prev, pager, next, jumper",
      },
      detailFormConfig: {
        formModel: {},
        size: "small",
        labelWidth: "130px",
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: detailColumns.from,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      },
      detailTable: {
        tableHeight: "230px",
        httpRequest: getProductList,
        columnConfig: detailColumns.table,
        statusList: [
          {
            text: "打印SKU",
            showStatus: [1],
            handleClick: (row) => {
              this.handlePrintSku(row);
            },
          },
          {
            text: "返 回",
            handleClick: () => {
              this.reBack();
            },
          },
        ],
        typeList: tableTpList,
      },
      typeList: addTpList,
    };
  },
  created() {
    this["dictionary/getDictionary"]("productTypeEn");
    const { id } = this.$route.query;
    this.detailId = id;
    this.getData(id);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getData(id) {
      this.fullscreenLoading.show();
      getDetails(id, true)
        .then((res) => {
          // console.log("details", res.data);
          const data = res.data
            ? {
                ...res.data.cusProduct,
                ...res.data,
              }
            : {};
          const { electrified, magnetic, liquid, fragile } = data;
          this.detailFormConfig.formModel = {
            ...(data || {}),
            ...data.cusProduct,
            electrified: electrified === 1 ? true : false,
            magnetic: magnetic === 1 ? true : false,
            liquid: liquid === 1 ? true : false,
            fragile: fragile === 1 ? true : false,
          };
          this.fullscreenLoading.close();
        })
        .catch((err) => {
          this.fullscreenLoading.hide();
        });
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    getDetailQueryParams() {
      return {
        id: this.detailId,
        cusProductId: this.detailFormConfig.formModel.cusProduct.id,
      };
    },
    handlePrintSku(row) {
      const { id } = row;
      comFileDownload(this, printProductSku, id);
    },
    getFootBtn() {
      const { dataStatus } = this.detailFormConfig.formModel;
      const arr = this.detailTable.statusList.filter((e) => {
        const { showStatus } = e;
        return showStatus ? showStatus.includes(dataStatus) : true;
      });
      return arr;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./index.scss";
@import "~@/assets/styles/variables.scss";
.proInfo-details {
  padding: 0 20px 10px;
  font-size: 14px;
  color: #1f1f1f;
  background-color: #ffffff;
  margin: 10px;
  .form-class .form-column-list .form-item-txt .el-form-item__content {
    padding-top: 0;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background: $light-blue;
    border-color: $light-blue;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
  .title-col {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba($color: #bcbcbc, $alpha: 0.3);
    padding-bottom: 3px;
    .title {
      font-weight: 600;
      color: #1f1f1f;
    }
    .create-info {
      font-weight: 400;
      color: #00adb2;
    }
    .light-blue-text {
      text-decoration: underline;
      margin-left: 24px;
    }
    .create-by-time {
      text-align: right;
    }
    .create-txt {
      margin-bottom: 5px;
      font-size: 13px;
      line-height: 14px;
    }
  }
  .content {
    display: flex;
    padding: 20px 0;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .other-info {
      width: 292px;
      overflow: hidden;
      div {
        margin-bottom: 24px;
      }
      .pics {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .pics-info {
          width: 110px;
          // height: 110px;
          margin-bottom: 0;
          overflow: hidden;
          /deep/ .el-image {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            flex: 0 0 100px;
            height: 100px;
            .el-image__inner {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
        .status {
          display: inline-block;
          background: rgba($color: $light-blue, $alpha: 0.1);
          border-radius: 14px;
          color: $light-blue;
          padding: 4px 8px;
          height: 28px;
          line-height: 20px;
        }
      }
      .time {
        margin-left: 16px;
      }
      .elec-type {
        .type {
          margin-left: 16px;
        }
      }
      .elec-ts {
        span {
          margin-left: 46px;
        }
        span:nth-of-type(1) {
          margin-left: 0;
        }
      }
    }
  }
  .historical-records {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    margin-top: 19px;
    .historical-records-title {
      font-size: 16px;
      margin-right: 15px;
      color: #1f1f1f;
    }

    .historical-records-sub {
      color: #666;

      i {
        margin-right: 2px;
      }
    }
  }
  .price-img {
    max-width: 60px;
    max-height: 60px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.proInfo-details {
  /deep/ {
    .el-form-item--small {
      &.el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__label,
      .el-form-item__content {
        line-height: 20px;
      }
    }
    .el-radio {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      .el-radio__label {
        padding-left: 2px;
      }
    }
  }
  .sub-title {
    // color: #00adb2;
  }
}
</style>
