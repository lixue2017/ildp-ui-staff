<template>
  <div class="dynamic">
    <div class="title">联系人动态</div>
    <div class="operation">
      <el-button type="primary" size="small" @click="handleFollowUp">
        <i class="el-icon-chat-dot-round"></i><span>写跟进</span>
      </el-button>
      <el-checkbox v-model="onlyFollow" @change="handleChange"
        >只看跟进</el-checkbox
      >
    </div>
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
              <div>{{ item.createUserName }}</div>
              <div>{{ item.context }}</div>
              <div>来自客户：{{ item.businessName }}</div>
            </div>
            <div class="flex-between-end context-right">
              <div>{{ item.createTime }}</div>
              <div>
                <el-button
                  type="info"
                  size="small"
                  plain
                  @click="handleDelete(item)"
                >
                  <i class="el-icon-delete"></i
                  ><span class="text-danger-color">删除</span>
                </el-button>
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
import { getContactDynamicPage } from "@/api/clueManage/contacts.js";
import userLogo from "@/assets/image/user_logo.png";
import noDataImg from "@/assets/image/noData.png";
import { customMessageBox } from "@/utils/confirmBox.js";
import { delTask } from "@/api/clueManage/taskRecord.js";
import { delFollow } from "@/api/clueManage/followUpRecords.js";
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
      onlyFollow: false,
      list: [],
    };
  },
  created() {
    this.getContactDynamicPage();
  },
  methods: {
    getContactDynamicPage() {
      const { id } = this.formData;
      getContactDynamicPage({
        id,
        isInterval: true, // 是否时间间隔
        onlyFollow: this.onlyFollow,
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
      this.getContactDynamicPage();
    },
    handleChange() {
      this.getContactDynamicPage();
    },
    handleFollowUp() {
      this.$emit("handleFollowUp");
    },
    handleDelete(row) {
      const req = {
        2: delTask,
        3: delFollow,
      }[row.type];
      if (!req) return;
      customMessageBox(
        this,
        {
          msgTitle: "确认提示",
          msgTxt1: "是否确定删除对应的记录？",
          msgTxt2: "",
          httpMsgRequest: () => req(row),
        },
        () => {
          this.msgSuccess("删除成功");
          this.getContactDynamicPage();
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/views/clueManage/components/dynamic.scss";
.operation {
  margin-bottom: 19px;
  .el-button {
    margin-right: 10px;
  }
}
</style>
