/** 下拉框新增SKU */

export const mixinSelectAddSku = {
  data() {
    return {
      isMixinSelectProduct: true,
      mSelectProductRef: null,
    };
  },
  methods: {
    handleMixinAddSkuFn(sRef, customerId) {
      this.mSelectProductRef = sRef;
      this.$refs.addProductRef?.showDialog("add", {
        dataStatus: 1,
        customerId,
      });
    },
    handleMixinAddSkuSuccess(rData) {
      this.isMixinSelectProduct = false;
      this.$nextTick(() => {
        this.isMixinSelectProduct = true;
        setTimeout(() => {
          let selectRef = this.$refs[this.mSelectProductRef];
          if (selectRef) {
            if (selectRef[0]) {
              selectRef[0]?.querySearchAsync("", {
                addSelectVal: rData?.id,
              });
            } else {
              selectRef?.querySearchAsync("", {
                addSelectVal: rData?.id,
              });
            }
          }
        }, 60);
      });
    },
  },
  components: {
    AddProductDialog: () =>
      import(
        "@/views/newOrderManage/market/basicData/product/components/dialog"
      ),
  },
};
