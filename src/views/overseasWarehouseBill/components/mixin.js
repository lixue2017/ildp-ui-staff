import { mapActions, mapState } from "vuex";
import { getStorageMatchList } from "@/api/costScheme/index.js"
export const WarehouseBillMixin = {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  data() {
    return {
      showSearchForm: false
    }
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"](["chargeType", 'warehousePricingUnit', 'billType', 'warehouseRepositoryType', 'warehouseBusinessType', 'warehouseRentMatchType']).then(() => {
      this.showSearchForm = true
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    searchList(searchFrom = {}) {
      const { createTime, ...searchObj } = searchFrom;
      this.searchFromData = {
        ...searchObj,
        startCreateTimeBegin: createTime && createTime[0],
        startCreateTimeEnd: createTime && createTime[1],
      };
      this.mixinkeepTable(true);
    },
    getQueryParams() {
      const { type } = this.tabsConfig
      return {
        ...this.searchFromData,
        isMatch: type == 'warehouseFee' ? 1 : 2,
      }
    }
  },
}
