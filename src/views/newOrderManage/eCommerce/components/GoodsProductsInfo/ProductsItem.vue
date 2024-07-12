<template>
  <div class="product-item">
    <el-row :gutter="15">
      <el-col :span="9" class="base-flex-align">
        <div class="label">产品{{ index + 1 }}：</div>
        <AutoComplete
          ref="selectProductRef"
          :style="{ width: '300px' }"
          :formModel="formData"
          :fieldItem="{
            id: 'productId',
            ...httpProductSkuSelect(),
            placeholder: '产品',
            currData: true,
            noClearable: true,
            searchIdKey: 'cusProductId',
            getCustomData: (item, dics) => {
              const { sku, productNameCn, productNameEn } = item;
              const label = `${sku} | ${productNameCn}(${productNameEn})`;
              return {
                label,
                value: item.cusProductId,
                key: item.cusProductId,
              };
            },
            isFocusRequest,
            handle: handleSelectProduct,
          }"
          :additionalParam="{ customerId: userCustomerId }"
        />
        <!-- showCreate: true,
					handleCreate: handleSelectAddProduct, -->
        <!-- <el-button
          type="text"
          size="small"
          class="preview"
          @click="handleView(formData)"
        >
          预览
        </el-button> -->
      </el-col>
      <el-col :span="3" class="base-flex-align">
        <div class="label">数量：</div>
        <div>
          <el-input-number
            ref="singleRef"
            v-model="formData.productCount"
            :max="999999"
            :min="1"
            :controls="false"
            placeholder="数量"
            v-input-number-limit="{
              value: 0, // 几位小数限制
              maxNumber: 999999, // 最大值限制
            }"
            :precision="0"
            :maxlength="6"
            size="mini"
            clearable
          />
        </div>
      </el-col>
      <el-col :span="8" class="base-flex-align">
        <div class="label">H S CODE：</div>
        <TooltipOver
          :content="formData.customsCode || '--'"
          :style="{
            width: '160px',
          }"
          refName="tooltipOverTit"
        />
        <span
          :class="[
            'isComplete',
            formData.inlandExportParam
              ? 'text-success-color'
              : 'text-danger-color',
          ]"
          v-if="formData.inlandExportParam || formData.inlandExportParam == 0"
        >
          <i
            :class="
              formData.inlandExportParam
                ? 'el-icon-circle-check'
                : 'el-icon-warning-outline'
            "
          ></i>
          {{ formData.inlandExportParam ? "完整" : "缺失" }}
        </span>
      </el-col>
      <el-col :span="4" class="text-right">
        <el-button size="small" type="text" @click="handleAdd">
          {{ productsLen === 1 ? "添加产品" : "添 加" }}
        </el-button>
        <el-button
          size="small"
          type="text"
          @click="handleDelete"
          class="text-danger-color"
          v-if="productsLen > 1"
        >
          删除产品
        </el-button>
      </el-col>
    </el-row>
    <!-- <AddProduct
      appendToBody
      ref="productRef"
      @onSuccess="handleProductSuccess"
    /> -->
    <!-- <ProductDetailDialog ref="productDetailRef" /> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import { httpProductSkuSelect } from "@/comModel/httpSelect";
export default {
  props: {
    index: {
      type: Number,
      default: 1,
    },
    productsLen: {
      type: Number,
      default: 1,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    // AddProduct: () => import("@/views/newOrderManage/market/basicData/product/components/dialog"),
    TooltipOver: () => import("_comp/TooltipOver"),
    // ProductDetailDialog: () =>
    //   import("@/views/basic/product/components/DetailDialog"),
  },
  data() {
    return {
      httpProductSkuSelect,
      isFocusRequest: false,
    };
  },
  computed: {
    ...mapState({
      userCustomerId: (state) => state.user.userInfo?.customerId,
    }),
  },
  methods: {
    handleView(row) {
      this.$refs.productDetailRef.show(row.id);
    },
    handleSelectProduct(row) {
      const {
        customsCode,
        sku,
        productNameCn,
        productNameEn,
        cusProduct: { id, inlandExportParam },
      } = row;
      this.$emit("handleSelectProduct", {
        customsCode,
        inlandExportParam,
        productId: id,
        sku,
        productNameCn,
        productNameEn,
      });
    },
    handleSelectAddProduct() {
      this.$refs.productRef?.showDialog("add", { dataStatus: 1 });
    },
    handleProductSuccess(rData) {
      // 默认选中新增产品
      this.$refs.selectProductRef[0]?.querySearchAsync("", {
        addSelectVal: rData?.cusProductId,
      });
    },
    handleAdd() {
      this.$emit("handleAddProduct");
    },
    handleDelete() {
      this.$emit("handleDeleteProduct");
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  white-space: nowrap;
  color: #8b8b8b;
}
.preview {
  margin-left: 10px;
}
</style>
