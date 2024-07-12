<template>
  <div class="mixin-table">
    <div class="top">
      <span class="title">货物信息</span>
      <span class="explain-txt text-info-color">
        *说明:当前版本“FBA仓库地址海外仓地址”对应只能存在一个，默认取表格第一个
      </span>
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumns"
      :columnData="[]"
      :pagination="false"
      :spanMethod="objectSpanMethod"
      tableHeight="calc(100vh - 320px)"
      :currLoading="loading"
      loadingText="数据正在加载中,请稍后"
      @setTableSuccess="setTableSuccess"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'img'">
          <el-image
            style="width: 40px; height: 40px"
            :src="slotProps.row.img"
            fit="contain"
            class="product-img"
            title="导入"
            @click="handleImgImport(slotProps.row)"
            v-if="slotProps.row.img"
          >
            <el-image
              slot="error"
              :src="productDefaultLogo"
              alt=""
              srcset=""
              @click="handleImgImport(slotProps.row)"
            />
          </el-image>
          <el-button
            size="small"
            type="text"
            v-debounce
            @click="handleImgImport(slotProps.row)"
            v-else
            >导入</el-button
          >
        </template>
        <template v-for="(item, idx) in slotInputProp">
          <template v-if="slotProps.prop === item">
            <div :key="idx">
              <el-input
                v-if="slotProps.config.type === 'text'"
                v-model.trim="slotProps.row[item]"
                :placeholder="slotProps.config.placeholder || '请输入'"
                :size="slotProps.config.size || 'mini'"
                :maxlength="slotProps.config.maxlength || 100"
                clearable
              ></el-input>
              <el-input-number
                v-if="slotProps.config.type == 'inputNumber'"
                v-model="slotProps.row[item]"
                :max="slotProps.config.max || 99999999999"
                v-input-number-limit="slotProps.config.decimal || 0"
                :controls="false"
                :controls-position="'right'"
                :placeholder="slotProps.config.placeholder"
                :size="slotProps.config.size || 'mini'"
                class="input-number"
                @change="(val) => handleChange(val, item, slotProps.row)"
                clearable
              />
              <template v-if="item === 'sku'">
                <AutoComplete
                  :ref="`skuRef${slotProps.rowIndex}`"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.config,
                    handle: (val) =>
                      handleSelectSku(val, slotProps.row, slotProps.rowIndex),
                  }"
                  :additionalParam="{ customerId: userCustomerId }"
                  size="mini"
                />
              </template>
              <template v-if="item === 'consigneeWarehouseId'">
                <AutoComplete
                  v-if="
                    slotProps.rowIndex === 0 ||
                    (encasementWay == 0 && outWarehouseWay != 50)
                  "
                  :ref="`warehouseAutoComplete${slotProps.rowIndex}`"
                  :formModel="slotProps.row"
                  :fieldItem="{
                    ...slotProps.config,
                    ...httpWarehousePublicSelect({
                      typeList: '0,1,2,3,4',
                      keyId: 'id',
                    }),
                    focusLoad: true,
                    handle: (val) =>
                      handleSelectWarehouse(val, slotProps.rowIndex),
                    noClearable: false,
                  }"
                  :additionalParam="{
                    customerId: userCustomerId,
                    countryId,
                    includTypeList: '0,1,2,3',
                  }"
                  size="mini"
                />
                <el-row v-else class="show-overflow-tooltip"
                  >{{ slotProps.row.consigneeWarehouseCode || "--" }}
                </el-row>
              </template>
            </div>
          </template>
        </template>
      </template>
      <template v-slot:customHeader="{ slotProps }">
        <template
          v-if="
            ['customsCode', 'businessUseEn'].includes(slotProps.column.prop)
          "
        >
          <div>{{ slotProps.column.labelTop }}</div>
          <div class="red-tip">{{ slotProps.column.labelBtm }}</div>
        </template>
        <template v-if="customHeaderColor.includes(slotProps.column.prop)">
          <span
            :class="`header-theme-color ${
              slotProps.column.request && 'row-request'
            }`"
            >{{ slotProps.column.label }}</span
          >
        </template>
      </template>
    </ComTable>
    <!-- <AddDialog ref="addDialog" /> -->
    <ComUpload
      style="display: none"
      ref="productUploadRef"
      :uploadConfig="{
        ...productUploadConfig,
        uploadData: {
          productId,
        },
      }"
      @handleSuccess="(res) => uploadSuccess(res)"
      @handleError="handleImportErr"
      @handleUploading="handleUploading"
    />
  </div>
</template>

<script>
import {
  tableColumns,
  slotInputProp,
  customHeaderColor,
  mergeColumn,
  mergeColumnName,
  handleRule,
} from "./model";
import { mapState } from "vuex";
import { multiplicationFn } from "@/utils/instructions";
import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { defaultParams } from "_comp/ComUpload/model";
import productDefaultLogo from "@/assets/image/load-error.svg";
export default {
  props: {
    tableColumnData: {
      type: Array,
      default: () => [],
    },
    countryId: {
      type: Number,
      default: null,
    },
    encasementWay: {
      type: [Number, String],
      default: "0",
    },
    outWarehouseWay: {
      type: [Number, String],
      default: "0",
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    // AddDialog: () =>
    //   import("@/views/basic/privateWarehouse/components/AddDialog/index.vue"),
    ComUpload: () => import("_comp/ComUpload"),
  },
  data() {
    return {
      productDefaultLogo,
      httpWarehousePublicSelect,
      tableColumns,
      identName: "mergeColumn", // 合并单元格标识
      slotInputProp: slotInputProp || [],
      customHeaderColor: customHeaderColor || [],
      mergeObj: {},
      goodsNum: 0,
      loading: true,
      oTime: "",
      parProductId: 0,
      productId: 0,
      productUploadConfig: {
        ...defaultParams,
        url:
          process.env.VUE_APP_BASE_API + "/customer/product/productImg/upload",
        type: "text",
        className: "text-uploader",
        name: "file",
        showFileList: false,
        fileList: [],
        accept: ".jpeg,.jpg,.png,.bmp",
        uploadData: {},
        successTip: false,
        limit: undefined,
        isPrediction: false,
      },
    };
  },
  computed: {
    ...mapState({
      userCustomerId: (state) => state.user.userInfo?.customerId,
    }),
  },
  watch: {
    encasementWay(val) {
      if (val == 1) {
        const row = this.tableColumnData ? this.tableColumnData[0] : {};
        this.tableColumnData.forEach((item) => {
          item.consigneeWarehouseId = row.consigneeWarehouseId;
          item.consigneeWarehouseCode = row.consigneeWarehouseCode;
        });
      }
    },
    outWarehouseWay(val) {
      if (val == 50) {
        const row = this.tableColumnData ? this.tableColumnData[0] : {};
        this.tableColumnData.forEach((item) => {
          item.consigneeWarehouseId = row.consigneeWarehouseId;
          item.consigneeWarehouseCode = row.consigneeWarehouseCode;
        });
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.setNewTableData(this.tableColumnData);
      } else {
        this.loading = false;
      }
    }, 500);
    this.tableColumnData.forEach((item, index) => {
      if (!this.mergeObj[item[this.identName]]) {
        this.goodsNum += 1;
        this.mergeObj[item[this.identName]] = {
          index,
          num: 1,
        };
      } else {
        this.mergeObj[item[this.identName]].num += 1;
      }
    });
  },
  methods: {
    setTableSuccess() {
      this.loading = false;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (mergeColumn.includes(columnIndex)) {
        const { index, num } = this.mergeObj[row[this.identName]];
        if (rowIndex === index) {
          return {
            rowspan: num,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getTableData() {
      let specialId = 0;
      const obj = {};
      const list = this.$refs.tableRef.getNewTableData().map((item) => {
        if (item[this.identName] !== specialId) {
          specialId = item[this.identName];
          mergeColumnName.forEach((k) => {
            obj[k] = item[k];
          });
          return { ...item };
        }
        return {
          ...item,
          ...obj,
        };
      });
      const errI = list.findIndex((item) => handleRule(item));
      if (errI > -1) {
        const msg = handleRule(list[errI]);
        this.$message.error(`第${errI + 1}行，${msg}`);
        return false;
      }
      return list;
    },
    handleChange(val, prop, row) {
      if (["boxWeight"].includes(prop)) {
        const { boxCount = 0, boxWeight = 0 } = row;
        row.boxTotalWeight = multiplicationFn([boxCount, boxWeight], 4);
      }
      if (["boxLength", "boxWidth", "boxHeight", "boxCount"].includes(prop)) {
        const {
          boxLength = 0,
          boxWidth = 0,
          boxHeight = 0,
          boxCount = 0,
          boxWeight = 0,
        } = row;
        row.boxVolume = multiplicationFn(
          [(boxLength * boxWidth * boxHeight) / 1000000, boxCount],
          4
        );
        if (prop === "boxCount") {
          row.boxTotalWeight = multiplicationFn([boxCount, boxWeight], 4);
          const { index, num } = this.mergeObj[row[this.identName]];
          for (let i = index; i < index + num; i++) {
            const list = this.$refs.tableRef.getNewTableData();
            const totalProductNetWeight = multiplicationFn(
              [boxCount, list[i].productNetWeight],
              2
            ); // 总净重
            this.$set(
              this.$refs.tableRef.tableData[i],
              "totalProductNetWeight",
              totalProductNetWeight
            );
          }
        }
      }
      if (prop === "quantityNum") {
        const { declaredValue, productNetWeight } = row;
        row.totalDeclaredValue = multiplicationFn([val, declaredValue], 2); // 申报总价
        row.totalProductNetWeight = multiplicationFn(
          [val, productNetWeight],
          2
        ); // 总净重
      }
    },
    addAddress(index) {
      this.currCreateIndex = index;
      this.$refs.addDialog.show();
    },
    handleSelectSku(val, row, rowIndex) {
      console.log("---", val, row);
      const index = this.mergeObj[row[this.identName]].index;
      let boxCount = 0;
      if (rowIndex === index) {
        boxCount = row.boxCount;
      } else {
        const list = this.$refs.tableRef.getNewTableData();
        boxCount = list[index].boxCount;
      }
      const {
        id: parProductId, // 产品子表id
        sku,
        shippingMark, // 唛头
        declaredNameCn, // 货物中文名称
        declaredNameEn, // 货物英文名称
        customsCode, // 海关编码
        cusProductId: productId,
        cusProduct: {
          declaredValue, // 申报单价
          singleBoxNetWeight: productNetWeight, // 每箱净重
          materialCn, // 产品材质(中文)
          materialEn, // 产品材质(英文)
          businessUseCn, // 用途(中文)
          businessUseEn, // 用途(英文)
          brand, // 品牌
          img, // 产品图片
          productUnitPrice, // 销售价
          asin, // ASIN
          productModel: boxNumber, // 产品型号
          productLink, // 对应清关店铺的平台销售链接
          priceImg, // 后台定价截图
        },
      } = val;
      const totalDeclaredValue = multiplicationFn(
        [row.quantityNum, declaredValue],
        2
      ); // 申报总价
      const totalProductNetWeight = multiplicationFn(
        [boxCount, productNetWeight],
        2
      ); // 总净重
      const declaredValues = multiplicationFn(
        [declaredValue / productUnitPrice, 100],
        2
      ); // 申报单价/网页售价*100%
      console.log("===", this.mergeObj[row[this.identName]]);
      const params = {
        sku,
        shippingMark, // 唛头
        declaredNameCn, // 货物中文名称
        declaredNameEn, // 货物英文名称
        customsCode, // 海关编码
        declaredValue, // 申报单价
        totalDeclaredValue, // 申报总价
        productNetWeight, // 每箱净重
        totalProductNetWeight, // 总净重
        boxNumber, // 型号
        materialCn, // 产品材质(中文)
        materialEn, // 产品材质(英文)
        businessUseEn:
          businessUseCn || businessUseEn
            ? `${businessUseCn}/${businessUseEn}`
            : "", // 用途
        brand, // 品牌
        img, // 产品图片
        productUnitPrice, // 销售价
        declaredValues, // 申报单价/网页售价*100%
        asin, // ASIN
        productLink, // 对应清关店铺的平台销售链接
        priceImg, // 后台定价截图
        parProductId,
        productId,
      };
      Object.keys(params).forEach((k) => {
        this.$set(row, k, params[k]);
      });
    },
    handleSelectWarehouse(row, index) {
      console.log(row);
      if (this.encasementWay != 0 || this.outWarehouseWay == 50) {
        this.tableColumnData.forEach((item) => {
          item.consigneeWarehouseId = row.id;
          item.consigneeWarehouseCode = row.code;
        });
      } else {
        this.tableColumnData[index].consigneeWarehouseId = row.id;
        this.tableColumnData[index].consigneeWarehouseCode = row.code;
      }
    },
    handleImgImport(row) {
      console.log(row);
      this.productId = row.productId;
      this.parProductId = row.parProductId;
      console.log(row);
      this.$refs.productUploadRef?.handleUploadClick();
    },
    uploadSuccess(res) {
      console.log(res);
      const [...list] = this.tableColumnData;
      list.forEach((item) => {
        if (
          item.productId === this.productId ||
          (this.parProductId && item.parProductId === this.parProductId)
        ) {
          item.img = res.imgUrl;
        }
      });
      this.$refs.tableRef.setNewTableData(list);
    },
    handleImportErr() {},
    handleUploading() {},
  },
};
</script>

<style lang="scss" scoped>
.mixin-table {
  width: 1380px;
  /deep/ {
    .el-table td.el-table__cell div {
      width: 100%;
    }
    .tableData .table-header-cell .cell {
      height: 56px;
      line-height: 18px;
      & > div:not(:first-child) {
        margin-top: 0px;
      }
    }
    .border-left {
      border-left: 1px solid #ebeef5;
    }
    .border-right {
      border-right: 1px solid #ebeef5;
    }
    .el-table td.el-table__cell .cell {
      line-height: 32px;
    }
  }
  .red-tip {
    color: #f26079;
  }
  .product-img {
    border: 1px solid #8b8b8b;
    border-radius: 2px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
