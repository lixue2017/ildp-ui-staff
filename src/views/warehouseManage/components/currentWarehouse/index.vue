<template>
  <div class="base-flex-align current-warehouse">
    <span>{{ overseaLangObj.ck_lb("当前所在仓") }}：</span>
    <AutoComplete
      class="form-class"
      :formModel="curFormModel"
      :fieldItem="curFieldItem"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { httpCurrentWarehouseSelect } from "@/comModel/warehouse";
import overseaLangObj from "@/language/overseasLang.js";

export default {
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      overseaLangObj,
      isInitRequest: true,
      curFormModel: {},
      curFieldItem: {
        id: "value",
        size: "mini",
        placeholder: "请选择",
        ...httpCurrentWarehouseSelect(),
        noClearable: true,
        isBackAll: true,
        isAutoInitRequest: true,
        getSearchOptions: (arr) => {
          if (this.isInitRequest) {
            this.isInitRequest = false;
            if (this.curWarehouseObj.value) {
              this.emitCurWarehouse(this.curWarehouseObj);
            } else {
              this.emitCurWarehouse(arr[0]);
            }
          }
        },
        handle: (obj) => this.emitCurWarehouse(obj,'WEB_HANDLESET'),
      },
    };
  },
  methods: {
    emitCurWarehouse(obj,oType) {
      this.curFormModel = {
        value: obj,
      };
      if (obj) {
        this["customer/setStoreCurWarehouse"](obj); // 同步更改当前所在仓
        this.$emit("setCurWarehouse", obj,oType);
      }
    },
    ...mapActions(["customer/setStoreCurWarehouse"]),
  },
  computed: {
    ...mapState({
      curWarehouseObj: (state) => state.customer.curWarehouseObj,
    }),
  },
  activated() {
    const { value: cValue } = this.curFormModel.value || {};
    if (cValue && this.curWarehouseObj?.value !== cValue) {
      this.emitCurWarehouse(this.curWarehouseObj);
    }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.current-warehouse {
  margin-right: 10px;
}
</style>
