<template>
  <ComDrawer
    ref="customDrawer"
    :customDrawer="customDrawerConfig"
    v-loading="loading"
  >
    <template v-slot:content>
      <div class="drawer-class">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :color="index === 0 ? '#00adb2' : '#bcbcbc'"
            class="timeline"
          >
            <!-- <div class="title">
              <slot name="title" :activity="activity"></slot>
            </div> -->
            <div class="operation" style="word-break: break-all">
              <!-- <slot name="operationDate" :activity="activity"></slot> -->
              <div class="drawer-title">
                <span>{{ activity.createTime || "--" }}</span>
                <span> {{ activity.createBy || "" }} </span>
                <span
                  class="tag-blue-color"
                  v-if="['80', '81', '82'].includes(activity.serviceName)"
                >
                  {{
                    ["一审备注", "二审备注", "清关备注"][
                      activity.serviceName - 80
                    ] || "--"
                  }}
                </span>
              </div>
            </div>
            <div
              class="operation"
              style="word-break: break-all; white-space: pre-wrap"
            >
              <!-- <slot name="operationContent" :activity="activity"></slot> -->
              <template>{{ activity.remark || "--" }}</template>
            </div>
          </el-timeline-item>
        </el-timeline>
        <ComForm
          class="order-from"
          :formConfig="formTableConfig"
          ref="formTableConfigRef"
          v-if="$refs.customDrawer && $refs.customDrawer.drawerVisible"
        >
        </ComForm>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { getLogList, submitLogSystemLog } from "@/api/performance/record.js";
import { customsClearanceTable, formRules } from "./model.js";
// import { formatDate } from "@/utils/index.js";
export default {
  //此详情只用于海外清关管理--待审核(电商传统),已提交(电商传统)
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDrawer: () => import("_comp/ComDrawer"),
    ComLog: () => import("_comp/ComLog"),
  },
  data() {
    return {
      formData: {},
      customDrawerConfig: {
        title: "交接备注记录",
        width: "500px",
        customerStatus: 0,
        useFooter: "footer",
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.formTableConfigRef.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      formTableConfig: {
        formModel: {},
        httpRequest: this.addCustomer, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        labelWidth: "98px",
        lists: customsClearanceTable.lists, // 表单渲染列表
        formRules, // 表单校验规则
      },
      loading: false,
      activities: [],
    };
  },
  methods: {
    addCustomer(formModel) {
      const { remark } = formModel;
      const {
        customsClearanceStatus,
        operationOrderId,
        operationOrderNum1,
        moduleName = 20,
        orderSn,
        tootId,
        serviceName = 2,
      } = this.formData;
      const { name } = this.$store.getters;
      // console.log(this.$store.getters);
      const params = {
        remark,
        customsClearanceStatus,
        serviceName,
        moduleName,
        type: 10,
        businessId: operationOrderId || tootId,
        businessNo: operationOrderNum1 || orderSn,
        createBy: name,
        updateBy: name,
      };
      this.loading = true;
      return submitLogSystemLog(params);
    },
    show(row) {
      this.formData = row;
      const { moduleName = 20, isOverseaOrders } = row;
      const params = {
        businessNo: row.operationOrderNum1 || row.orderSn,
        businessId: row.operationOrderId || row.tootId,
        moduleName,
        isOverseaOrders,
        type: 10,
      };
      getLogList(params).then((res) => {
        this.activities = res.rows;
        this.customDrawerConfig.title = `交接备注记录  ${res.total}`;
        // console.log("this.activities", this.activities);
      });
      this.$refs.customDrawer.show();
    },
    hide() {
      this.$refs.customDrawer.hide();
    },
    handleSuccess() {
      this.loading = false;
      this.$message.success("保存成功");
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .drawer-content {
    padding: 5px 26px 10px;
  }
  .drawer-class {
    height: calc(100% - 2px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .el-timeline {
      height: calc(100% - 90px);
      overflow-y: auto;
    }
    .operation {
      margin-top: 10px;
    }
  }
}
</style>
