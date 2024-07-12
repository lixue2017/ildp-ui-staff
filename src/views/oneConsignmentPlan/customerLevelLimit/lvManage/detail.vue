<template>
  <div class="app-container" v-if="showSearchForm">
    <ComDetailTop
      :title="`客户等级`"
      :formModel="formData"
      ref="detailTopRef"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{ formData.levelCode ? `(${formData.levelCode})` : "" }}
        </span>
      </template>
    </ComDetailTop>
    <div class="comForm-class">
      <CustomerForm
        ref="searchTabForm"
        :formData="formData"
        :activeTab="activeTab"
      />
    </div>
    <div class="tabs">
      <div>
        <el-button
          size="small"
          plain
          v-for="item in tabsConfig.columns"
          :key="item.key"
          class="tabs-change"
          :type="item.key == tabsConfig.active ? 'activation' : ''"
          @click="changeTabs(item.key)"
        >
          {{ item.label }}
        </el-button>
      </div>
      <div>
        <el-button
          size="mini"
          v-for="item in tabsConfig.btnArr"
          :key="item.key"
          :disabled="item.disabled"
          class="btn"
          type="primary"
          round
          @click="item.handleClick(item)"
          v-if="item.showTabName == tabsConfig.active"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div>
      <RelatedCustomers
        ref="relatedCustomersRef"
        :businessType="4"
        :formData="formData"
        :activeTab="activeTab"
        v-show="tabsConfig.active === 1"
        @handleSelection="handleSelection"
      />
      <OperationRecord :formData="formData" v-if="tabsConfig.active == 2" />
    </div>
    <div class="order-footer">
      <template v-for="(btn, index) in getFootBtn()">
        <el-button
          :type="btn.type"
          @click="() => btn.handleClick(btn)"
          :key="index"
        >
          {{ btn.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { GETCustomerlevelInfo } from "@/api/oneConsignmentPlan/customerLv.js";
export default {
  data() {
    let { activeTab } = this.$route.query;
    this.activeTab = activeTab;
    return {
      footerBtn: [
        {
          text: "修 改",
          showState: [0],
          handleClick: () => {
            const { id } = this.formData;
            this.$router.push({
              path: "/oneConsignmentPlan/customerLevelLimit/lvManageEdit",
              query: {
                id,
                backPath: this.$route.fullPath,
                activeTab: "edit",
              },
            });
          },
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "关联客户",
            key: 1,
          },
          {
            label: "操作记录",
            key: 2,
          },
        ],
        btnArr: [
          {
            label: "批量移除",
            showTabName: 1,
            disabled: true,
            handleClick: () => {
              this.handleDelete();
            },
          },
          {
            label: "新增客户",
            showTabName: 1,
            disabled: false,
            handleClick: () => {
              this.$refs.relatedCustomersRef.drawerShow();
            },
          },
        ],
      },
      showSearchForm: false,
      activeTab: activeTab,
      formData: {},
      selectList: [],
    };
  },
  mounted() {},
  created() {
    const { id } = this.$route.query;
    this["dictionary/getDictionary"]([
      "priceGrade",
      "extrasGrade",
      "customerLvStatus",
    ]).then(() => {
      this.isIntData({ id });
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async isIntData(row = {}) {
      const { id } = row;
      if (id) {
        await GETCustomerlevelInfo(id).then((res) => {
          this.formData = res.data || {};
        });
      }
      this.showSearchForm = true;
    },
    handleTopClick(row) {
      this.showSearchForm = false;
      const { id } = row;
      this.isIntData({ id });
    },
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getFootBtn() {
      const { state } = this.formData;
      return this.footerBtn.filter((e) => {
        const { showState } = e;
        if (showState) {
          return showState.includes(state);
        } else {
          return true;
        }
        // return e.showType.includes(this.activeTab);
      });
    },
    handleSelection(row) {
      const index = this.tabsConfig.btnArr.findIndex(
        (item) => item.showTabName == 1
      );
      if (index < 0) return;
      if (row.length) {
        this.selectList = row.map((item) => item.id || item.customerId);
        this.tabsConfig.btnArr[index].disabled = false;
      } else {
        this.tabsConfig.btnArr[index].disabled = true;
      }
    },
    handleDelete() {
      this.$refs.relatedCustomersRef.handleDelete(this.selectList);
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    getQueryParams() {},
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    OperationRecord: () => import("./components/OperationRecord"),
    RelatedCustomers: () => import("./components/RelatedCustomers"),
    CustomerForm: () => import("./components/CustomerForm"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  /deep/ {
    .com-detail-top {
      padding-top: 0px;
      margin: 0 0px 15px;
    }
  }
  .tabs {
    margin: 15px 0px;
    border-bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .comForm-class {
    border-bottom: 1px solid #e2e2e2;
  }
}
</style>
