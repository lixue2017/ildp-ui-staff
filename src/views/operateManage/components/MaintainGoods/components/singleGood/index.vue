<template>
  <div class="goods-line">
    <div class="tag delete" v-if="formData.deleted">删</div>
    <div class="tag new" v-if="!formData.deleted && formData.isNew">新</div>
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
            v-model="slotProps.formModel.warehousingLength"
            v-input-number-limit="{
              value: slotProps.fieldItem.decimal,
              maxNumber: slotProps.fieldItem.colMax,
            }"
            :min="0"
            placeholder="核实箱长"
            :controls="false"
            @change="
              (val) =>
                handleVolume(slotProps.formModel, val, 'warehousingLength')
            "
          />
          <el-input-number
            size="mini"
            class="box-width-num"
            v-model="slotProps.formModel.warehousingWidth"
            v-input-number-limit="{
              value: slotProps.fieldItem.decimal,
              maxNumber: slotProps.fieldItem.colMax,
            }"
            :min="0"
            placeholder="核实箱宽"
            :controls="false"
            @change="
              (val) =>
                handleVolume(slotProps.formModel, val, 'warehousingWidth')
            "
          />
          <el-input-number
            size="mini"
            v-model="slotProps.formModel.warehousingHeight"
            v-input-number-limit="{
              value: slotProps.fieldItem.decimal,
              maxNumber: slotProps.fieldItem.colMax,
            }"
            :min="0"
            placeholder="核实箱高"
            :controls="false"
            @change="
              (val) =>
                handleVolume(slotProps.formModel, val, 'warehousingHeight')
            "
          />
        </template>
        <template v-slot:warehousingVolume="slotProps">
          {{
            toFixedNum(formData.warehousingVolume, slotProps.fieldItem.decimal)
          }}
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
              handle: handleWarehouseName,
            }"
            :additionalParam="{
              customerId: basicData.customerId || '',
              countryId: basicData.countryId || '',
              includTypeList: '0,1,2,3',
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
                customerId: basicData.customerId || '',
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
              >{{ formData.warehousingLength || "--" }}*{{
                formData.warehousingWidth || "--"
              }}*{{ formData.warehousingHeight || "--" }}CM</span
            >
            <span class="label">单箱体积：</span>
            <span class="value"
              >{{ formData.warehousingVolume || "--" }}m³</span
            >
            <span class="label">单箱重量：</span>
            <span class="value"
              >{{ formData.warehousingWeight || "--" }}KG</span
            >
          </template>
        </div>
        <div>
          <template
            v-for="(item, index) in statusList[
              formData.deleted ? 2 : lineStatus
            ]"
          >
            <el-button
              class="operate-icon"
              size="mini"
              :type="item.type"
              :key="index"
              plain
              v-if="!item.hide"
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
    data: {
      type: Object,
      default: () => {},
    },
    isCabinet: {
      type: Boolean,
      default: false,
    },
    basicData: {
      type: Object,
      default: () => {},
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
            // hide: !this.isCabinet,
          },
          {
            text: "删 除",
            type: "danger",
            handleClick: this.handleDelete,
            // hide: !this.isCabinet,
          },
        ],
        2: [
          {
            text: "恢 复",
            type: "primary",
            handleClick: this.handleRecovery,
          },
        ],
      },
      formData: {
        isEdit: 0,
        freightProductDtoList: [],
      },
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
        JSON.stringify(this.data.cusProducts || [])
      );
      // let warehousingData = {};
      // if (this.isCabinet) {
      //   const {
      //     boxCount,
      //     boxHeight,
      //     boxLength,
      //     boxVolume,
      //     boxWeight,
      //     boxWidth,
      //   } = this.data;
      //   warehousingData = {
      //     warehousingBoxNum: boxCount,
      //     warehousingHeight: boxHeight,
      //     warehousingLength: boxLength,
      //     warehousingTotalVolume: (
      //       Number(boxCount || 0) * Number(boxVolume || 0)
      //     ).toFixed(2),
      //     warehousingTotalWeight: (
      //       Number(boxCount || 0) * Number(boxWeight || 0)
      //     ).toFixed(2),
      //     warehousingVolume: boxVolume,
      //     warehousingWeight: boxWeight,
      //     warehousingWidth: boxWidth,
      //   };
      // }
      console.log("this.formData", this.formData);
      console.log("this.data", this.data);
      this.formData = Object.assign({
        ...this.data,
        // ...warehousingData,
        isEdit: this.data.isEdit || 0,
        consigneeWarehouseName: `${
          this.data.consigneeWarehouseCode || this.data.warehouseName
            ? `${this.data.consigneeWarehouseCode || "--"}/${
                this.data.warehouseName || "--"
              }`
            : ""
        }`,
        freightProductDtoList: cusProducts.map((item) => ({
          deleted: 0,
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
        warehousingLength: ["warehousingWidth", "warehousingHeight"],
        warehousingWidth: ["warehousingLength", "warehousingHeight"],
        warehousingHeight: ["warehousingWidth", "warehousingLength"],
      };
      let warehousingVolume = Number(val || 0);
      if (warehousingVolume) {
        keyObj[name].forEach((item) => {
          warehousingVolume *= Number(row[item] || 0);
        });
      }
      this.formData.warehousingVolume = warehousingVolume / 1000000;
      this.$refs.myComForm.setFormModel({
        warehousingVolume: warehousingVolume / 1000000,
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
                      this.handleWarehouseName,
                      this.isCabinet
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
      let verifyMsg = {
        warehousingBoxNum: "请输入箱数",
      };
      // if (this.isCabinet) {
      //   verifyMsg = {
      // 		...verifyMsg,
      //     shipmentId: "请输入ShipmentId",
      //     referenceId: "请输入ReferenceId",
      //     warehousingWeight: "请输入单箱重量",
      //     warehousingLength: "请输入箱长",
      //     warehousingWidth: "请输入箱宽",
      //     warehousingHeight: "请输入箱高",
      //     consigneeWarehouseName: "请选择目的地",
      //   };
      // }
      for (let key in data) {
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
        data.warehousingVolume = this.formData.warehousingVolume;
        // this.$refs.myComForm.getFormModel();
        // this.$refs.myComForm.setFormModel({
        //   consigneeWarehouseId,
        //   consigneeWarehouseCode,
        //   warehouseName,
        //   warehousingVolume: data.warehousingVolume,
        // });
      }
      const freightProductDtoList = [];
      for (let i = 0; i < this.formData.freightProductDtoList.length; i++) {
        const {
          detailId,
          id,
          productCount,
          customsCode,
          inlandExportParam,
          deleted = 0,
          temp_only_key,
        } = this.$refs[`myComForm${i}`][0]
          ? this.$refs[`myComForm${i}`][0].getFormParams()
          : this.formData.freightProductDtoList[i];
        const {
          sku,
          productNameCn,
          productNameEn,
          id: productId,
        } = this.formData.freightProductDtoList[i];
        if (!id && productId) {
          this.$refs[`myComForm${i}`][0].getFormModel();
          this.$refs[`myComForm${i}`][0].setFormModel({
            sku,
            productNameCn,
            productNameEn,
            id: productId,
          });
        }
        if (!id && !productId) {
          return this.$message.warning(`产品${i + 1}，请选择产品`);
        }
        if (!productCount) {
          return this.$message.warning(`产品${i + 1}，请输入数量`);
        }
        freightProductDtoList.push({
          detailId,
          id,
          productCount,
          customsCode,
          inlandExportParam,
          sku,
          productNameCn,
          productNameEn,
          deleted,
          temp_only_key,
        });
      }
      // let cabinet = {};
      // if (this.isCabinet) {
      //   cabinet = {
      //     boxCount: data.warehousingBoxNum,
      //     boxHeight: data.warehousingHeight,
      //     boxLength: data.warehousingLength,
      //     boxVolume: data.warehousingVolume,
      //     boxWeight: data.warehousingWeight,
      //     boxWidth: data.warehousingWidth,
      //   };
      // }
      const newData = {
        ...this.formData,
        ...data,
        // ...cabinet,
        isEdit: 0,
        cusProducts: freightProductDtoList,
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
        cusProducts: freightProductDtoList,
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
        id,
        sku,
        productNameCn,
        productNameEn,
      };
      this.$refs[`myComForm${i}`][0].setFormModel({
        customsCode,
        inlandExportParam,
        id,
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
      if (this.formData.freightProductDtoList[i].detailId) {
        this.formData.freightProductDtoList[i].deleted = 1;
        !this.formData.deleteIds && (this.formData.deleteIds = []);
        this.formData.deleteIds.push(
          this.formData.freightProductDtoList[i].detailId
        );
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
      this.formData.freightProductDtoList = JSON.parse(
        JSON.stringify(this.currFormData.freightProductDtoList || [])
      );
      this.formData.freightProductDtoList.forEach((item, i) => {
        if (item.deleted) {
          const deleteIndex = (this.formData.deleteIds || []).findIndex(
            (id) => id === item.detailId
          );
          if (deleteIndex > -1) {
            item.deleted = 0;
            this.formData.deleteIds.splice(deleteIndex, 1);
          }
        }
        this.$refs[`myComForm${i}`] &&
          this.$refs[`myComForm${i}`][0] &&
          this.$refs[`myComForm${i}`][0].setFormModel(item);
      });
    },
    handleDelete() {
      this.formData.deleted = 1;
      this.$emit("handleDelete");
      this.formData.freightProductDtoList.map((item) => ({
        ...item,
        deleted: 1,
      }));
    },
    handleRecovery() {
      this.formData.deleted = 0;
      this.$emit("handleRecovery");
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
  .tag {
    left: 0px !important;
  }
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
