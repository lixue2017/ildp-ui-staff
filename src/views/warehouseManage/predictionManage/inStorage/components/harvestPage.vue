<template>
  <ComForm
    :formConfig="searchTabForm()"
    v-if="showSearchForm"
    ref="searchFormRef"
  >
    <template v-slot:slotNum="slotProps">
      <template v-for="item in ['0', '1', '2']">
        <AutoComplete
          :key="item"
          v-if="slotProps.formModel.receivingSource === item"
          class="form-class put-shelf-form"
          :ref="`autoCompleteRef${item}`"
          :formModel="layerFormModel"
          :fieldItem="fieldItemConf(item)"
        />
      </template>
    </template>
  </ComForm>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  httpEcommerceSelect,
  httpWmsForecastSelect,
} from "@/comModel/warehouse";
import { paramUrl } from "@/utils/index";
import { searchColumns } from "./tDmodel";
export default {
  data() {
    return {
      showSearchForm: false,
      searchFormConfig: {
        labelWidth: "86px",
        formModel: {
          receivingSource: "0",
        },
        noSearchReset: true, // 不能重置
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getSearchForm(formModel);
            resolve();
          });
        },
        searchForm: true,
        size: "small",
        formRules: {},
      },
      layerFormModel: {},
      layerFieldItem: {
        id: "id",
        placeholder: "工作单号",
        noClearable: true,
        isBackAll: true,
        isAutoInitRequest: true,
        getSearchOptions: (arr) => {
          // console.log('调取接口后获取的下拉列表值---', arr)
          if (this.initChange) {
            this.layerFormModel = {
              id: arr[0],
            };
            this.initChange = false;
          }
        },
        handle: (val) => {
          // console.log('val==', val)
          // this.handleChangeLayer(val)
        },
      },
      initChange: true,
    };
  },
  methods: {
    getSearchForm(formModel) {
      const { id: row } = this.layerFormModel;
      const type = ["fba", "wms", "eCommerce"][formModel.receivingSource];
      localStorage.setItem(`${type}Cols`, JSON.stringify(row));
      const { query, path } = this.$route;
      const newUrl =
        path +
        `?${paramUrl({
          ...query,
          type,
        })}`;
      window.history.replaceState("", "", newUrl);
      setTimeout(() => {
        this.$emit("handleHarvest", type);
      });
    },
    searchTabForm() {
      return {
        ...this.searchFormConfig,
        lists: searchColumns((val) => {
          this.initChange = true;
          this.$nextTick(() => {
            this.$refs[`autoCompleteRef${val}`][0]?.querySearchAsync();
          });
        }),
      };
    },
    fieldItemConf(item) {
      const httpSelect = [
        httpWmsForecastSelect(0),
        httpWmsForecastSelect(1),
        httpEcommerceSelect(),
      ][item];
      return {
        ...this.layerFieldItem,
        ...httpSelect,
      };
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("exWarehouseManage").then(() => {
      this.showSearchForm = true;
    });
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>