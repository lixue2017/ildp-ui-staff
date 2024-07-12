<template>
  <ComDialog
    class="drawer-wrapper"
    ref="myDialog"
    :customDialog="dialogConfig"
    :confirmClose="false"
    @onClose="hide"
  >
    <template v-if="dialogShow" v-slot:content>
      <ComForm :formConfig="searchFormConfig">
        <template v-slot:numberLike="slotProps">
          <AutoComplete
            :formModel="slotProps.formModel"
            :fieldItem="{
              ...slotProps.fieldItem,
            }"
            :additionalParam="{
              inquirySheetIdNe: searchFromData.inquirySheetIdNe,
              shippingModeEq: searchFromData.shippingModeEq,
              packingModeEq: searchFromData.packingModeEq,
              tradeTypeEq: searchFromData.tradeTypeEq,
              queryPage,
            }"
          />
        </template>
      </ComForm>
      <div class="quotation-scheme-list">
        <div class="loading" v-if="loading">
          <div class="el-loading-spinner">
            <svg viewBox="25 25 50 50" class="circular">
              <circle cx="50" cy="50" r="20" fill="none" class="path" />
            </svg>
          </div>
        </div>
        <template v-else>
          <template v-for="(item, index) in quotationSchemeList">
            <CopySingleScheme
              :key="`${item.id}-${item.routeNoManageId || 0}`"
              :index="index"
              :quotationSchemeInfo="item"
              :isOverseasToDoor="isOverseasToDoor"
              :checked="!!selectQuotation[item.id]"
              @handleSelect="handleSelect"
            />
          </template>
          <template v-if="!quotationSchemeList.length">
            <div class="data-empty">
              <img :src="noDataImg" alt="" srcset="" width="150px" />
              <div>没有方案数据哦～</div>
            </div>
          </template>
        </template>
      </div>
      <div class="bottom-pagination">
        <my-pagination
          :page="start"
          :limit="paginationConfig.limit"
          :total="total"
          :small="paginationConfig.small"
          :className="paginationConfig.className"
          :layout="paginationConfig.layout"
          :pageSizes="paginationConfig.pageSizes"
          @pagination="handlePagination"
        />
      </div>
    </template>
  </ComDialog>
</template>

<script>
import { searchColumns } from "./model";
import { getCopyPage, copyQuotationScheme } from "@/api/enquiryManage";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    isOverseasToDoor: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    CopySingleScheme: () => import("../CopySingleScheme"),
    MyPagination: () => import("_comp/ComTable/MyPagination"),
  },
  data() {
    const queryPage = this.isOverseasToDoor ? 3 : 2; // 1=我的；2=头程；3=海外
    return {
      noDataImg,
      queryPage,
      dialogConfig: {
        title: "复制方案",
        width: "889px",
        footer: [
          {
            text: "确认",
            type: "primary",
            handleClick: this.handleSave,
            disabled: true,
          },
          {
            text: "取 消",
            handleClick: this.hide,
          },
        ],
      },
      searchFromData: {},
      searchFormConfig: {
        formModel: {}, // 表单数据
        httpRequest: this.getList, // 表单提交接口
        searchForm: true,
        size: "small",
        labelWidth: "72px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns(this.isOverseasToDoor),
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      quotationSchemeList: [],
      dialogShow: false,
      paginationConfig: {
        limit: 5,
        layout: "total, sizes, prev, pager, next, jumper",
        className: "",
        small: false,
        pageSizes: [5, 15, 30, 50, 100],
      },
      start: 1,
      total: 0,
      loading: false,
      selectQuotationIds: [],
      selectQuotation: {},
    };
  },
  methods: {
    show(formData) {
      const {
        shippingMode: shippingModeEq,
        packingMode: packingModeEq,
        tradeType: tradeTypeEq,
        endPortId: endPortIdEq,
        endPortName,
        startPortId: startPortIdEq,
        startPortName,
        id: inquirySheetIdNe,
      } = formData;
      this.searchFromData = {
        inquirySheetIdNe,
        shippingModeEq,
        packingModeEq,
        tradeTypeEq,
        queryPage: this.queryPage,
        ...(!this.isOverseasToDoor
          ? { endPortIdEq, endPortName, startPortIdEq, startPortName }
          : {}),
      };
      this.searchFormConfig.formModel = {
        ...this.searchFromData,
      };
      this.getCopyPage();
      this.selectQuotationIds = [];
      this.selectQuotation = {};
      this.start = 1;
      this.total = 0;
      this.dialogShow = true;
      this.$refs.myDialog.show();
    },
    getList(formData) {
      this.searchFromData = {
        ...formData,
      };
      this.getCopyPage();
      return Promise.resolve();
    },
    getCopyPage() {
      this.loading = true;
      getCopyPage({
        ...this.searchFromData,
        pageNum: this.start,
        pageSize: this.paginationConfig.limit,
      })
        .then((result) => {
          this.loading = false;
          this.total = parseInt(result.total) || 0;
          this.quotationSchemeList = result.rows;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    hide() {
      this.dialogShow = false;
      this.$refs.myDialog?.hide();
    },
    handleSave() {
      const params = {
        queryPage: this.queryPage,
        id: this.selectQuotationIds.join(","),
      };
      return copyQuotationScheme(params).then((res) => {
        this.hide();
        this.$emit("handleSuccess", res.data);
      });
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.getCopyPage();
    },
    handleSelect(obj) {
      const selectQuotationIds = [];
      this.selectQuotation[obj.id] = obj.bol;
      for (let key in this.selectQuotation) {
        if (this.selectQuotation[key]) selectQuotationIds.push(key);
      }
      this.selectQuotationIds = selectQuotationIds;
      if (selectQuotationIds.length) {
        this.dialogConfig.footer[0].disabled = false;
      } else {
        this.dialogConfig.footer[0].disabled = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog__body {
    padding: 20px 0 0;

    .form-class {
      padding: 0 20px;
    }
  }
}
.loading {
  position: relative;
  height: 179px;
  text-align: center;
}
.quotation-scheme-list {
  padding: 0 20px;
  max-height: calc(100vh - 412px);
  overflow-y: auto;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
}
.data-empty {
  line-height: 20px;
  text-align: center;
  height: 179px;
  img {
    width: 100px;
    padding: 30px 0 14px;
  }
  div {
    padding-bottom: 30px;
  }
}
</style>
