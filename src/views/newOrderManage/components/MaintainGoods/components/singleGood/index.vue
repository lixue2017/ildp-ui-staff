<template>
  <div class="goods-line">
    <div class="index">{{ index + 1 }}</div>
    <div :class="`from-right ${formData.isEdit && 'is-edit'}`">
      <ComForm
        :formConfig="{
          ...formConfig,
          lists: handleConfig(formData.isEdit),
          formModel: formData,
        }"
        ref="myComForm"
        v-if="Object.keys(formData || {}).length"
      >
        <template v-slot:boxSize="slotProps">
          <el-input-number
            size="mini"
            v-model="slotProps.formModel.boxLength"
            v-input-number-limit="slotProps.fieldItem.decimal"
            :min="0"
            placeholder="箱长"
            :controls="false"
            @change="
              (val) => handleVolume(slotProps.formModel, val, 'boxLength')
            "
          />
          <el-input-number
            size="mini"
            class="box-width-num"
            v-model="slotProps.formModel.boxWidth"
            v-input-number-limit="slotProps.fieldItem.decimal"
            :min="0"
            placeholder="箱宽"
            :controls="false"
            @change="
              (val) => handleVolume(slotProps.formModel, val, 'boxWidth')
            "
          />
          <el-input-number
            size="mini"
            v-model="slotProps.formModel.boxHeight"
            v-input-number-limit="slotProps.fieldItem.decimal"
            :min="0"
            placeholder="箱高"
            :controls="false"
            @change="
              (val) => handleVolume(slotProps.formModel, val, 'boxHeight')
            "
          />
        </template>
        <template v-slot:boxVolume="slotProps">
          {{ toFixedNum(formData.boxVolume, slotProps.fieldItem.decimal) }}
        </template>
        <template v-slot:addProduct>
          <i
            class="el-icon-circle-plus primary-text-color"
            @click="handleAddProduct()"
          ></i>
        </template>
        <template v-slot:consigneeWarehouseName="slotProps">
          <AutoComplete
            ref="consigneeWarehouseName"
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
            }"
            :additionalParam="{
              customerId: customerId || '',
              includTypeList: '0,1,2,3',
              countryId: countryId || '',
            }"
          />
        </template>
      </ComForm>
      <template v-for="(item, index) in formData.freightProductDtoList">
        <!-- 需改为唯一key，防止每次删除的都是最后一条数据  :key="`${item.temp_only_key || item.id}`" -->
        <ComForm
          :key="item.temp_only_key"
          :formConfig="{
            ...productConfig,
            lists: handleProductConfig(index, formData.isEdit),
            formModel: item,
          }"
          :ref="`myComForm${index}`"
          v-if="!item.deleted"
        >
          <template v-slot:inlandExportParam="slotProps">
            <span
              :class="[
                'isComplete',
                slotProps.formModel.inlandExportParam
                  ? 'text-success-color'
                  : 'text-danger-color',
              ]"
              v-if="slotProps.formModel.inlandExportParam !== ''"
            >
              <i
                :class="
                  slotProps.formModel.inlandExportParam
                    ? 'el-icon-circle-check'
                    : 'el-icon-warning-outline'
                "
              ></i>
              {{ slotProps.dicsData && slotProps.dicsData.nameCn }}
            </span>
          </template>
          <template v-slot:addProduct>
            <i
              class="el-icon-remove primary-text-color"
              @click="handleRemoveProduct(index)"
              v-if="handleShowRemove(formData.freightProductDtoList)"
            ></i>
          </template>
          <template v-slot:product="slotProps">
            <AutoComplete
              ref="product"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
              }"
              :additionalParam="{
                customerId: customerId || '',
              }"
            />
          </template>
        </ComForm>
      </template>
      <div class="operate">
        <div :class="!formData.isEdit && 'total'">
          <template v-if="!formData.isEdit">
            <span class="label">外箱尺寸：</span>
            <span class="value"
              >{{ formData.boxLength || "--" }}*{{
                formData.boxWidth || "--"
              }}*{{ formData.boxHeight || "--" }}CM</span
            >
            <span class="label">单箱体积：</span>
            <span class="value"
              >{{
                formData.boxVolume
                  ? Number(formData.boxVolume).toFixed(2)
                  : "--"
              }}m³</span
            >
            <span class="label">单箱重量：</span>
            <span class="value">{{ formData.boxWeight || "--" }}KG</span>
          </template>
        </div>
        <div>
          <template v-for="(item, index) in statusList[lineStatus]">
            <el-button
              class="operate-icon"
              size="mini"
              :type="item.type"
              :key="index"
              plain
              @click="item.handleClick()"
              >{{ item.text }}</el-button
            >
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "./model.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  props: {
    index: {
      type: Number,
      default: 1,
    },
    customerId: {
      type: Number,
      default: 1,
    },
    countryId: {
      type: Number,
      default: null,
    },
    data: {
      type: Object,
      default: () => {},
    },
    isCabinet: {
      type: Boolean,
      default: false,
    },
    productsKey: {
      type: String,
      default: "cusProducts",
    },
  },
  data() {
    return {
      lineStatus: 1,
      formConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
      },
      productConfig: {
        formModel: {},
        httpRequest: () => {}, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        labelWidth: "90px",
        formRules: {}, // 表单校验规则
      },
      statusList: {
        0: [
          {
            text: "保 存",
            type: "primary",
            handleClick: this.handleSubmit,
          },
          {
            text: "取 消",
            handleClick: this.handleReduction,
          },
        ],
        1: [
          {
            text: "编 辑",
            type: "primary",
            handleClick: () => this.handleUpdate(1),
          },
          {
            text: "复 制",
            type: "primary",
            handleClick: this.handleCopy,
          },
          {
            text: "删 除",
            type: "danger",
            handleClick: this.handleDelete,
          },
        ],
      },
      formData: {
        isEdit: 0,
        freightProductDtoList: [],
      },
      deleteIds: [],
    };
  },
  watch: {
    "formData.isEdit"(val) {
      console.log("------------------copyId");
      console.log(this.formData);
      this.handleModelChange();
    },
    "data.id"(val) {
      console.log("11111111111111111111111");
      console.log(val);
    },
  },
  mounted() {
    this.handleData();
    if (this.formData.isEdit) {
      this.handleUpdate(1);
      // this.handleConfig(1);
    }
    this.handleModelChange();
  },
  methods: {
    handleModelChange() {
      setTimeout(() => {
        this.$refs.myComForm.formModel = this.$refs.myComForm.getFormModel();
        this.$refs.myComForm.setFormModel(this.formData);
      });
    },
    handleData() {
      const cusProducts = JSON.parse(
        JSON.stringify(this.data[this.productsKey] || [])
      );
      this.formData = Object.assign({
        ...this.data,
        // ...warehousingData,
        isEdit: this.data.isEdit || 0,
        consigneeWarehouseName: this.data.consigneeWarehouseCode,
        freightProductDtoList: cusProducts.map((item) => ({
          ...item,
          product: `${item.sku} | ${item.productNameCn}(${item.productNameEn})`,
          temp_only_key: Math.random() + "",
        })),
      });
      delete this.formData.cusProducts;
      console.log(this.formData);
    },
    handleVolume(row, val, name) {
      const keyObj = {
        boxLength: ["boxWidth", "boxHeight"],
        boxWidth: ["boxLength", "boxHeight"],
        boxHeight: ["boxWidth", "boxLength"],
      };
      let boxVolume = Number(val || 0);
      if (boxVolume) {
        keyObj[name].forEach((item) => {
          boxVolume *= Number(row[item] || 0);
        });
      }
      this.formData.boxVolume = boxVolume / 1000000;
      this.$refs.myComForm.setFormModel({
        boxVolume: boxVolume / 1000000,
      });
    },
    handleConfig(isEdit) {
      let list = [];
      if (isEdit) {
        list = [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.goods(
                      this.isCabinet,
                      this.handleWarehouseName
                    ),
                  },
                ],
              },
            ],
          },
        ];
      } else {
        list = [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.previewGoods,
                  },
                ],
              },
            ],
          },
        ];
      }
      return list;
    },
    handleProductConfig(i, isEdit) {
      let list = [];
      if (isEdit) {
        list = [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.product(i, this.handleSelectProduct),
                  },
                ],
              },
            ],
          },
        ];
      } else {
        list = [
          {
            fieldList: [
              {
                rows: [
                  {
                    cols: config.previewProduct,
                  },
                ],
              },
            ],
          },
        ];
      }
      return list;
    },
    handleSubmit() {
      const data = this.$refs.myComForm.getFormParams();
      const verifyMsg = {
        shipmentId: "请输入ShipmentId",
        boxCount: "请输入箱数",
        boxWeight: "请输入单箱重量",
        boxLength: "请输入箱长",
        boxWidth: "请输入箱宽",
        boxHeight: "请输入箱高",
      };
      if (this.isCabinet) {
        verifyMsg.consigneeWarehouseName = "请选择目的地";
      }
      for (let key in verifyMsg) {
        if (!data[key] && verifyMsg[key]) {
          return this.$message.warning(verifyMsg[key]);
        }
      }
      if (!this.formData.freightProductDtoList.length) {
        return this.$message.warning("请添加产品");
      }
      if (
        typeof data.consigneeWarehouseName === "object" &&
        !data.consigneeWarehouseId
      ) {
        const {
          id: consigneeWarehouseId,
          code: consigneeWarehouseCode,
          name: warehouseName,
        } = data.consigneeWarehouseName;
        data.consigneeWarehouseId = consigneeWarehouseId;
        data.consigneeWarehouseCode = consigneeWarehouseCode;
        data.warehouseName = warehouseName;
        data.boxVolume = this.formData.boxVolume;
        // this.$refs.myComForm.getFormModel();
        // this.$refs.myComForm.setFormModel({
        //   consigneeWarehouseId,
        //   consigneeWarehouseCode,
        //   warehouseName,
        //   boxVolume: data.boxVolume,
        // });
      }
      const freightProductDtoList = [];
      for (let i = 0; i < this.formData.freightProductDtoList.length; i++) {
        const {
          id,
          productCount,
          customsCode,
          inlandExportParam,
          temp_only_key,
          deleted,
        } = this.$refs[`myComForm${i}`][0]
          ? this.$refs[`myComForm${i}`][0].getFormParams()
          : this.formData.freightProductDtoList[i];
        const { sku, productNameCn, productNameEn, productId } =
          this.formData.freightProductDtoList[i];
        if (deleted) {
          continue;
        }
        if (!id && productId) {
          // this.$refs[`myComForm${i}`][0].getFormModel();
          this.$refs[`myComForm${i}`][0].setFormModel({
            sku,
            productNameCn,
            productNameEn,
            productId,
          });
        }
        if (!productId) {
          return this.$message.warning(`产品${i + 1}，请选择产品`);
        }
        if (!productCount) {
          return this.$message.warning(`产品${i + 1}，请输入数量`);
        }
        freightProductDtoList.push({
          productId,
          id,
          productCount,
          customsCode,
          inlandExportParam,
          sku,
          productNameCn,
          productNameEn,
          temp_only_key,
        });
      }
      // let cabinet = {};
      // if (this.isCabinet) {
      //   cabinet = {
      //     boxCount: data.boxCount,
      //     boxHeight: data.boxHeight,
      //     boxLength: data.boxLength,
      //     boxVolume: data.boxVolume,
      //     boxWeight: data.boxWeight,
      //     boxWidth: data.boxWidth,
      //   };
      // }
      const newData = {
        ...this.formData,
        ...data,
        // ...cabinet,
        isEdit: 0,
        [this.productsKey]: freightProductDtoList,
        freightProductDtoList,
        newAdd: false,
      };
      this.$emit("handleSave", { ...newData });
      this.formData = {
        ...newData,
      };
      this.handleUpdate(0);
      console.log({
        ...data,
        [this.productsKey]: freightProductDtoList,
        freightProductDtoList,
      });
    },
    handleWarehouseName(row) {
      const {
        id: consigneeWarehouseId,
        code: consigneeWarehouseCode,
        name: warehouseName,
      } = row;
      this.formData.consigneeWarehouseId = consigneeWarehouseId;
      this.formData.consigneeWarehouseCode = consigneeWarehouseCode;
      this.formData.warehouseName = warehouseName;
      this.$refs.myComForm.setFormModel({
        consigneeWarehouseId,
        consigneeWarehouseCode,
        warehouseName,
      });
    },
    handleSelectProduct(row, i) {
      const {
        customsCode,
        sku,
        productNameCn,
        productNameEn,
        cusProduct: { id, inlandExportParam },
      } = row;
      this.formData.freightProductDtoList[i] = {
        ...this.formData.freightProductDtoList[i],
        customsCode,
        inlandExportParam,
        productId: id,
        sku,
        productNameCn,
        productNameEn,
      };
      this.$refs[`myComForm${i}`][0].setFormModel({
        customsCode,
        inlandExportParam,
        productId: id,
        sku,
        productNameCn,
        productNameEn,
      });
    },
    handleUpdate(type) {
      this.formData.isEdit = type;
      // this.handleConfig(type);
      this.lineStatus = type ? 0 : 1;
      if (type) {
        const freightProductDtoList = JSON.parse(
          JSON.stringify(this.formData.freightProductDtoList || [])
        );
        this.currFormData = Object.assign({
          ...this.formData,
          freightProductDtoList,
        });
        setTimeout(() => {
          this.formData.freightProductDtoList.forEach((_, i) => {
            this.$refs[`myComForm${i}`][0].getFormModel();
          });
        });
      }
    },
    handleAddProduct() {
      this.formData.freightProductDtoList.push({
        productId: "",
        product: "",
        productCount: undefined,
        customsCode: "",
        inlandExportParam: "",
        id: "",
        sku: "",
        productNameCn: "",
        productNameEn: "",
        isEdit: 1,
        temp_only_key: Math.random() + "",
      });
    },
    handleRemoveProduct(i) {
      if (this.formData.freightProductDtoList[i].id) {
        this.formData.freightProductDtoList[i].deleted = 1;
        this.deleteIds.push(this.formData.freightProductDtoList[i].id);
      } else {
        this.formData.freightProductDtoList.splice(i, 1);
      }
    },
    handleShowRemove(list) {
      const arr = (list || []).filter((item) => !item.deleted);
      return arr.length > 1;
    },
    handleReduction() {
      if (this.formData.newAdd) {
        return this.$emit("handleReduction");
      }
      this.handleUpdate(0);
      this.$refs.myComForm.setFormModel(this.currFormData);
      this.formData.freightProductDtoList.forEach((item, i) => {
        if (item.deleted) {
          const deleteIndex = this.deleteIds.findIndex((id) => id === item.id);
          if (deleteIndex > -1) {
            item.deleted = 0;
            this.deleteIds.splice(deleteIndex, 1);
          }
        }
        this.$refs[`myComForm${i}`] &&
          this.$refs[`myComForm${i}`][0] &&
          this.$refs[`myComForm${i}`][0].setFormModel(item);
      });
    },
    handleDelete() {
      this.$emit("handleDelete");
    },
    handleCopy() {
      this.$emit("handleCopy");
    },
    getNewData() {
      return this.formData;
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-line {
  display: flex;
  padding-top: 12px;
  border-bottom: 1px solid #e2e2e2;
  position: relative;
  .index {
    width: 37px;
    line-height: 32px;
    text-align: center;
  }
  .box-width-num {
    margin: 0 3px;
  }
  .from-right {
    flex: 1;
    &.is-edit {
      /deep/ {
        .el-row {
          margin-top: 10px;
        }
        .el-form-item {
          margin-bottom: 10px !important;
        }
      }
    }
    /deep/ {
      .icon-btn {
        text-align: right;
        i {
          cursor: pointer;
          font-size: 18px;
        }
      }
      .box-size .el-form-item__content {
        display: flex;
        .el-input:not(:last-child) {
          margin-right: 5px;
        }
      }
    }
  }

  /deep/ .el-row {
    margin-top: 0px;
  }
}
.operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  .total {
    height: 26px;
    font-size: 13px;
    padding: 0 20px;
    line-height: 26px;
    background: rgba(80, 148, 255, 0.08);
    border-radius: 13px;
    text-align: center;

    .label {
      color: rgba(102, 165, 255, 0.8);
      &:not(:first-child) {
        margin-left: 29px;
      }
    }
    .value {
      color: #66a5ff;
      font-weight: bold;
    }
  }
}
</style>
