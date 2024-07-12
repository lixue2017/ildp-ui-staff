<template>
  <div>
    <div class="table-top">
      <div class="title">任务记录</div>
      <div class="operation base-flex-align">
        <ComForm
          class="search-form"
          ref="comFormRef"
          :formConfig="formConfig"
          @handleChange="handleChange"
        />
        <template v-for="(btn, i) in handleBtn(btnList)">
          <template v-if="!btn.hide">
            <el-dropdown
              v-if="btn.btnType === 'dropdown'"
              :key="`dropdown-${i}`"
              trigger="click"
              placement="bottom"
            >
              <el-button
                type="primary"
                size="small"
                :class="btn.className"
                :icon="btn.icon"
                >{{ btn.label
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="dItem in btn.dropdownArr"
                  :key="dItem.value"
                  @click.native="btn.handleClick && btn.handleClick(btn, dItem)"
                  >{{ dItem.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
              :key="i"
              :type="btn.type"
              size="small"
              :icon="btn.icon"
              :class="btn.className"
              @click="btn.handleClick()"
              >{{ btn.label }}</el-button
            >
          </template>
        </template>
      </div>
    </div>
    <div>
      <template v-for="item in list">
        <TaskItem
          :formData="item"
          :key="item.id"
          @handleInfo="handleInfo(item)"
        />
      </template>
      <div v-if="!list.length">
        <div class="list-empty">
          <img :src="noDataImg" alt="" srcset="" width="150px" />
          <div>暂无数据～</div>
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
    <TaskDetailDialog ref="taskDetailRef" @handleSuccess="refreshTable" />
  </div>
</template>
<script>
import { comFileDownload } from "@/utils/download.js";
import { exportTask, getTaskPage } from "@/api/clueManage/taskRecord.js";
import { searchColumns } from "./model";
import noDataImg from "@/assets/image/noData.png";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    isCommunal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TaskItem: () => import("./TaskItem"),
    MyPagination: () => import("_comp/ComTable/MyPagination"),
    TaskDetailDialog: () =>
      import("@/views/clueManage/components/detailDialog/taskInfo"),
  },
  data() {
    return {
      noDataImg,
      searchFromData: {},
      formConfig: {
        labelWidth: "70px",
        lists: [
          {
            className: "search-form-width",
            fieldList: [
              {
                rows: [
                  {
                    cols: searchColumns,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {}, // 表单校验规则
      },
      btnList: [
        {
          label: "导出",
          type: "primary",
          icon: "el-icon-upload2",
          handleClick: this.handleExport,
        },
        {
          hide: this.isCommunal,
          label: "新增",
          type: "primary",
          className: "btn-type-add",
          icon: "el-icon-plus",
          btnType: "dropdown",
          hasPermission: ["clueManage:salesClue:addTask"],
          dropdownArr: [
            {
              name: "跟进任务",
              value: "followUpTask",
            },
            {
              name: "普通任务",
              value: "ordinaryTask",
            },
          ],
          handleClick: (_, dItem) => this.handleAddTask(dItem),
        },
      ],
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
    this.getList();
  },
  methods: {
    handleBtn(btnList) {
      return btnList.filter(
        (btn) => !btn.hasPermission || hasBtnPermits(btn.hasPermission)
      );
    },
    getList() {
      getTaskPage(this.getQueryParams()).then((res) => {
        const { rows, total } = res;
        this.total = total || 0;
        this.list = rows || [];
      });
    },
    getQueryParams() {
      const { createTime, ...obj } = this.searchFromData || {};
      const [startTimeGe, startTimeLe] = createTime || [];
      return {
        ...obj,
        startTimeGe,
        startTimeLe,
        businessId: this.formData.id,
        businessType: 1,
        pageNum: this.start,
        pageSize: this.paginationConfig.limit,
      };
    },
    handleExport() {
      comFileDownload(this, exportTask, this.getQueryParams());
    },
    handleAddTask({ value }) {
      this.$emit("handleAddTask", value);
    },
    handleChange(val, prop) {
      this.searchFromData[prop] = val;
      this.refreshTable();
    },
    handlePagination({ page, limit }) {
      this.start = page;
      this.paginationConfig.limit = limit;
      this.getList();
    },
    refreshTable() {
      this.start = 1;
      this.getList();
    },
    handleInfo(row) {
      this.$refs.taskDetailRef.show(row);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ {
  .task-item:nth-child(2n) {
    background: #f8f8f8;
    border-color: #e2e2e2;
  }
}
.search-form {
  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
  }
}
.table-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 5px;
  .title {
    font-weight: bold;
    font-size: 13px;
    color: #1f1f1f;
    line-height: 50px;
  }
  .operation {
    flex: 1;
    justify-content: flex-end;
    .el-button {
      margin-left: 10px;
    }
  }
}
.list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;
  line-height: 20px;
  margin-top: 30px;
  img {
    width: 100px;
    padding: 30px 0 14px;
  }
  div {
    padding-bottom: 30px;
  }
}
</style>
