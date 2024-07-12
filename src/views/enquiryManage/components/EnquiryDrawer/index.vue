<template>
  <ComDrawer
    class="drawer-wrapper"
    ref="myDrawer"
    :customDrawer="{ ...drawerConfig, showClose: isOnly }"
    :confirmClose="false"
    @onClose="hide"
  >
    <template v-if="drawerShow" v-slot:content>
      <ComTabs :tabsConfig="tabsConfig" v-if="!isOnly">
        <template v-for="tab in tabsConfig.tabs">
          <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name">
            <FormEnquiry
              :ref="`formEnquiryRef${tab.name}`"
              :formModel="{ ...tab.data }"
              v-if="showForm"
              @handleSuccess="handleSuccess"
            />
          </el-tab-pane>
        </template>
      </ComTabs>
      <FormEnquiry
        ref="formEnquiryRef"
        v-else-if="showForm"
        :formModel="{ ...formModel }"
        @handleSuccess="handleSuccess"
      />
      <div class="enquiry-close" @click="hide" v-if="!isOnly">
        <i class="el-icon-arrow-right"></i>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    isOnly: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComTabs: () => import("_comp/ComTabs"),
    FormEnquiry: () => import("./FormEnquiry"),
  },
  data() {
    return {
      showForm: false,
      formModel: {
        shippingMode: 1, // 1=海运；2=空运；
        tradeType: 2, // 1=进口；2=出口；
      },
      drawerConfig: {
        title: "询价",
        width: "568px",
        size: "medium",
        showClose: false,
        footer: [
          {
            text: "询 价",
            type: "primary",
            handleClick: () => this.handleSave(1),
          },
          {
            text: "保存草稿",
            type: "primary",
            handleClick: () => this.handleSave(0),
          },
          {
            text: "取 消",
            handleClick: this.hide,
          },
        ],
      },
      tabsConfig: {
        activeName: "1",
        slotTabs: true,
        handleTabsClick: () => {},
        tabs: [
          {
            label: "海运出口",
            name: "1",
            data: {
              shippingMode: 1, // 1=海运；2=空运；
              tradeType: 2, // 1=进口；2=出口；
              packingMode: "0",
              overseasToDoor: false,
            },
          },
          {
            label: "海运进口",
            name: "2",
            data: {
              shippingMode: 1, // 1=海运；2=空运；
              tradeType: 1, // 1=进口；2=出口；
              packingMode: "0",
              overseasToDoor: false,
            },
          },
          {
            label: "空运出口",
            name: "3",
            data: {
              shippingMode: 2, // 1=海运；2=空运；
              tradeType: 2, // 1=进口；2=出口；
              overseasToDoor: false,
            },
          },
          {
            label: "空运进口",
            name: "4",
            data: {
              shippingMode: 2, // 1=海运；2=空运；
              tradeType: 1, // 1=进口；2=出口；
              overseasToDoor: false,
            },
          },
        ],
      },
      drawerShow: false,
    };
  },
  created() {
    this.formDictionary();
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    formDictionary() {
      this["dictionary/getDictionary"]("enquiryFrom").then(() => {
        this.showForm = true;
      });
    },
    show(row) {
      if (row) {
        row.tradeClause = row.tradeClause
          ? this.typeConversion(row.tradeClause)
          : "";
      }
      this.formModel = { ...(row || {}) };
      this.drawerShow = true;
      this.$refs.myDrawer.show();
    },
    hide() {
      this.drawerShow = false;
      this.$refs.myDrawer?.hide();
    },
    handleSave(state) {
      let ref = this.$refs.formEnquiryRef;
      if (!this.isOnly) {
        ref = this.$refs[`formEnquiryRef${this.tabsConfig.activeName}`][0];
      }
      if (ref) {
        ref.handleSave(state);
      }
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .el-drawer__header {
    margin-bottom: 0px;
  }
  .el-tabs__item {
    color: #5094ff;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
    &.is-active {
      opacity: 1;
    }
  }
  .el-tabs__active-bar {
    background-color: #5094ff;
  }
}
.drawer-wrapper {
  /deep/ {
    .el-drawer {
      overflow: inherit;
    }
    .drawer-content {
      padding: 20px 40px 0;
    }
  }
}

.enquiry-close {
  position: absolute;
  left: -23px;
  top: 40px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  width: 45px;
  height: 45px;
  line-height: 39px;
  color: #ffffff;
  background: linear-gradient(153deg, #b2daff 0%, #5094ff 100%);
  box-shadow: 4px 1px 12px 0px rgba(48, 106, 198, 0.27);
  border: 3px solid #ffffff;
  border-radius: 50%;
  cursor: pointer;
}
</style>
