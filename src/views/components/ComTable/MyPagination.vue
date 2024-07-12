<template>
  <div class="my-pagination-container" :class="className">
    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :small="small"
      :pager-count="pagerCount"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";
export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number,
    },
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 20,
    },
    small: {
      type: Boolean,
      default: false,
    },
    autoScroll: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    className: {
      type: String,
      default: "",
    },
    pagerCount: {
      type: Number,
      default: 5,
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100, 200, 500];
      },
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: 1, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
  },
};
</script>

<style lang="scss">
.my-pagination-container {
  text-align: right;
  padding: 20px;
  .el-pager li,
  .el-pagination .btn-next,
  .el-pagination .btn-prev,
  .el-input__inner {
    background-color: transparent;
  }
}

.tableData-detail {
  .my-pagination-container {
    padding: 10px 0;
  }
}
</style>
