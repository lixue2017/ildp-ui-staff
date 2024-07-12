<template>
  <div class="app-container">
    <ComTabs :tabsConfig="tabsConfig">
      <template v-for="tab in tabsConfig.tabs">
        <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
          <keep-alive>
            <ComForm
              :formConfig="searchFormConfig"
              v-if="showSearchForm && tabsConfig.activeName === tab.name"
            />
          </keep-alive>
          <keep-alive v-if="mixinShowTable">
            <ComTable
              :ref="`tableRef${tab.name}`"
              v-if="tabsConfig.activeName === tab.name"
              :tableHeight="proInfoTable.tableHeight"
              :columnConfig="tableMixinConfig(tab.name)"
              :httpRequest="proInfoTable.httpRequest"
              :getQueryParams="proInfoTable.getQueryParams"
              @onSelectionChange="onTableSelectionChange"
              :selectionTableRow="[...selectionRows]"
              :rowOperationBtnListFn="getOperationBtns"
            >
              <template v-slot:customRow="{ slotProps }">
                <template v-if="slotProps.prop === 'sku'">
                  <el-row class="ellipsis-text">
                    <span
                      class="primary-text-btn"
                      @click="handleUpdate(slotProps.row)"
                    >
                      {{ slotProps.row.sku }}
                    </span>
                  </el-row>
                  <el-row class="ellipsis-text">
                    <span>{{ slotProps.row.productNameCn }}</span>
                    <span>({{ slotProps.row.productNameEn }})</span>
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'productInfo'">
                  <div class="product-info">
                    <div class="table-preview-image">
                      <el-image
                        style="border: 1px solid #8b8b8b"
                        lazy
                        :src="
                          slotProps.row.cusProduct.img || productDefaultLogo
                        "
                        :preview-src-list="[slotProps.row.cusProduct.img]"
                      />
                    </div>
                    <div class="right" style="width: 500px">
                      <el-row class="ellipsis-text">
                        <span
                          class="ellipsis-text customs-hs-code"
                          :title="slotProps.row.customsCode || ''"
                          >HS CODE：{{
                            slotProps.row.customsCode || "--"
                          }}</span
                        >
                        <span
                          class="type-list"
                          v-for="(item, index) in proInfoTable.typeList"
                          :key="index"
                        >
                          <span
                            v-if="
                              (slotProps.row.cusProduct['productAttribute'] ===
                                1 &&
                                slotProps.row.cusProduct[item.label] === 1) ||
                              (slotProps.row.cusProduct['productAttribute'] ===
                                0 &&
                                index === 0)
                            "
                            class="type-li"
                          >
                            <img
                              src="@/assets/image/electric_icon.png"
                              class="type-icon"
                            />
                            {{
                              slotProps.row.cusProduct["productAttribute"] === 0
                                ? "普货"
                                : item.value
                            }}
                            <template v-if="item.label === 'electrified'"
                              >{{
                                slotProps.row.cusProduct.electrifiedType &&
                                dictionary.dicsData.batteryType &&
                                dictionary.dicsData.batteryType[
                                  slotProps.row.cusProduct.electrifiedType
                                ] &&
                                `(${
                                  dictionary.dicsData.batteryType[
                                    slotProps.row.cusProduct.electrifiedType
                                  ].nameCn
                                })`
                              }}
                            </template>
                          </span>
                        </span>
                      </el-row>
                      <el-row class="ellipsis-text">
                        <span>
                          类型：{{
                            slotProps.row.cusProduct.productTypeName || "--"
                          }}</span
                        >
                        <el-divider direction="vertical"></el-divider>
                        <span>
                          品牌：{{
                            slotProps.row.cusProduct.brand || "--"
                          }}</span
                        >
                        <el-divider direction="vertical"></el-divider>
                        <span>
                          型号：{{
                            slotProps.row.cusProduct.productModel || "--"
                          }}</span
                        >
                      </el-row>
                    </div>
                  </div>
                </template>
                <template v-if="slotProps.prop === 'singleBoxValue'">
                  <el-row>
                    {{ toFixedNum(slotProps.row.cusProduct.productWeight) }}
                  </el-row>
                  <el-row>
                    {{
                      toFixedNum(slotProps.row.cusProduct.productNetWeight)
                    }}
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'productValue'">
                  <el-row>
                    {{ toFixedNum(slotProps.row.cusProduct.productLength) }} *
                    {{ toFixedNum(slotProps.row.cusProduct.productWidth) }} *
                    {{ toFixedNum(slotProps.row.cusProduct.productHigh) }}
                  </el-row>
                  <el-row>
                    {{ slotProps.row.cusProduct.singleBoxNum || "--" }}
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'declaredValue'">
                  <el-row>
                    {{ formatMoney(slotProps.row.cusProduct.declaredValue) }}
                    {{
                      `${slotProps.row.cusProduct.declaredUnit}/
                    ${slotProps.dicsList.nameCn}`
                    }}
                  </el-row>
                  <el-row>
                    {{ formatMoney(slotProps.row.cusProduct.productUnitPrice) }}
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'dataStatus'">
                  <el-row>
                    <div class="operate-status">
                      <span>
                        <i
                          class="status-dot"
                          :style="{
                            backgroundColor: slotProps.dicsList.color,
                          }"
                        ></i>
                        {{ slotProps.dicsList.nameCn }}
                      </span>
                    </div>
                  </el-row>
                  <el-row>
                    {{ slotProps.row.revisionsNum }}
                  </el-row>
                </template>
                <template v-if="slotProps.prop === 'createBy'">
                  <el-row class="ellipsis-text">
                    {{ slotProps.row.companyName }}
                  </el-row>
                  <el-row class="ellipsis-text">
                    {{
                      `${slotProps.row.createBy} 创建于${slotProps.row.createTime}`
                    }}
                  </el-row>
                </template>
              </template>
              <template v-slot:customHeader="{ slotProps }">
                <template
                  v-if="
                    /sku|productValue|declaredValue|dataStatus|singleBoxValue/.test(
                      slotProps.column.prop
                    )
                  "
                >
                  <div>{{ slotProps.column.labelTop }}</div>
                  <div>{{ slotProps.column.labelBtm }}</div>
                </template>
              </template>
            </ComTable>
          </keep-alive>
        </el-tab-pane>
      </template>
    </ComTabs>
  </div>
</template>

<script>
import { searchColumns, tableColumns, tableTpList } from "./model";
import { getProductInfo } from "@/api/basicInfo/product";
import { querySearch } from "@/api/common";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { mapActions, mapState } from "vuex";
import { mixinColsConf } from "_comp/ComColumnConf/mixinConfCols.js";
import {printProductSku} from "@/api/warehouse/basic.js"
import { comFileDownload } from "@/utils/download.js";
export default {
  name: "Product",
  mixins: [mixinColsConf],
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      productDefaultLogo,
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "产品信息",
            name: "1",
          },
        ],
        btnArr: [
          {
            table: "批量打印",
            disabled: true,
            showTabName: "1",
            handleClick: () => {
              const id=(this.selectionRows.map((e)=>e.id)).join(',')
              this.handlePrintSku({id})
            },
          },
        ],
      },
      searchFormConfig: {
        labelWidth: "85px",
        formModel: {}, // 表单数据
        fold: true,
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getProductInfoList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        lists: [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
      },
      searchFromData: {},
      proInfoTable: {
        tableHeight: "calc(100vh - 264px)",
        httpRequest: (query) => getProductInfo(query, true),
        getQueryParams: this.getQueryParams,
        typeList: tableTpList,
      },
      statusBtnList: [
          {
            text: "打印SKU",
            showStatus: [1],
            handleClick: (row) => {
              this.handlePrintSku(row)
            },
          },
        ],
      mixinTableColArr: [tableColumns],
      unitList: [],
      selectionRows: [],
    };
  },
  watch: {
    "selectionRows.length"(sLen) {
      this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
    },
  },
  created() {
    this["dictionary/getDictionary"]("productTypeEn").then(() => {
      this.showSearchForm = true;
    });
    this.getInitInfo();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitInfo() {
      querySearch({ category: "currency" }).then((res) => {
        this.unitList = res.rows;
      });
    },
    getProductInfoList(searchFrom = {}) {
      this.searchFromData = { ...searchFrom };
      this.searchFromData.createTime &&
        (this.searchFromData.createTime =
          this.searchFromData.createTime.join("@"));
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      return this.searchFromData;
    },
    handleUpdate(row = {}) {
      this.$router.push({
        path: "/newOrderManage/market/productDetails",
        query: {
          id: row.id,
          backPath: this.$route.path,
        },
      });
    },
    getOperationBtns(row){
      const {dataStatus}=row
      const arr=this.statusBtnList.filter((e)=>{
        const {showStatus}=e
        return showStatus?showStatus.includes(dataStatus):true
      })
      return arr
    },
    onTableSelectionChange(rows = []) {
      this.selectionRows = rows;
      this.$refs[
        `tableRef${this.tabsConfig.activeName}`
      ][0]?._toggleRowSelectionMixin({
        newCheckRows: this.selectionRows,
      });
    },
    handlePrintSku(row){
      const {id}=row
      comFileDownload(this,printProductSku,id);
      this.mixinTimeResetSelection();
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "./index.scss";
/deep/ .table-row {
  .customs-hs-code {
    width: 150px;
    display: inline-block;
    padding-right: 0;
  }
}
</style>
