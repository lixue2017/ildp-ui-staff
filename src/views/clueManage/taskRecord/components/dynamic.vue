<template>
  <div class="dynamic">
    <div class="dynamic-context">
      <template v-for="(item, i) in list">
        <div class="" :key="item.id">
          <div class="time-line" v-if="i !== list.length - 1"></div>
          <div
            :class="item.displayType === 1 ? 'dor-date' : 'time-line-dor'"
          ></div>
          <div
            class="display-date"
            :class="i === list.length - 1 && 'margin-0'"
            v-if="item.displayType === 1"
          >
            {{ item.displayDate }}
          </div>
          <div
            class="context base-flex"
            :class="i === list.length - 1 && 'margin-0'"
            v-else
          >
            <div class="user-logo">
              <img
                :src="userLogo"
                alt=""
                srcset=""
                width="28px"
                height="28px"
              />
            </div>
            <div class="context-center">
              <div>{{ item.auditBy }}</div>
              <div>{{ item.step }}</div>
            </div>
            <div class="flex-between-end context-right">
              <div>{{ item.auditTime }}</div>
              <div
                class="context-remark"
                v-if="item.auditRemark && !['新增', '编辑'].includes(item.step)"
              >
                {{ item.auditRemark }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="!list.length">
        <div class="list-empty">
          <img :src="noDataImg" alt="" srcset="" width="150px" />
          <div>暂无数据～</div>
        </div>
      </div>
    </div>
    <my-pagination
      v-if="total > (paginationConfig.total || paginationConfig.limit)"
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

<script>
import { getOperationRecord } from "@/api/clueManage/taskRecord.js";
import userLogo from "@/assets/image/user_logo.png";
import noDataImg from "@/assets/image/noData.png";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    MyPagination: () => import("_comp/ComTable/MyPagination"),
  },
  data() {
    return {
      userLogo,
      noDataImg,
      paginationConfig: {
        limit: 15,
        layout: "total, sizes, prev, pager, next, jumper",
        className: "",
        small: false,
        total: 15,
        pageSizes: [15, 30, 50, 100],
      },
      start: 1,
      total: 0,
      list: [],
    };
  },
  created() {
    this.getOperationRecord();
  },
  methods: {
    getOperationRecord() {
      const { id } = this.formData;
      getOperationRecord({
        id,
        isInterval: true, // 是否时间间隔
        pageNum: this.start,
        pageSize: this.paginationConfig.limit,
      }).then((res) => {
        const { rows, total } = res;
        this.total = total || 0;
        this.list = rows || [];
      });
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.getOperationRecord();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/views/clueManage/components/dynamic.scss";
.context-remark {
  text-align: right;
  width: 500px;
  word-break: break-all;
}
</style>
