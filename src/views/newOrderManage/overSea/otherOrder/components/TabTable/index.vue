<template>
  <div>
    <div class="tabs">
      <el-button
        size="small"
        plain
        v-for="item in tabsConfig(handleTab(formData.overallStatus)).columns"
        :key="item.key"
        class="tabs-change"
        :type="item.key === active ? 'activation' : ''"
        @click="changeTabs(item.key)"
      >
        {{ item.label }}
      </el-button>
    </div>
    <template v-if="active === 1">
      <GoodInfo
        ref="goodRef"
        :formData="formData"
        :onlyDirect="onlyDirect"
        :orderType="pageType"
      />
    </template>
    <template v-if="active === 2">
      <CostInfo
        ref="chargeTableRef"
        :formModel="{
          ...formData,
          customerId: formData.bailorPeopleId,
          customerName:formData.bailorPeopleName,
          billingMain: formData.operationMain,
          orderType: formData.settlementBusinessType,
          businessType: formData.settlementBusinessType,
          webViewSource: 'order',
          isBussiness,
        }"
        :businessType="formData.settlementBusinessType"
        :showBtnArr="[10, 20, 30, 70, 40, 50, 63]"
        @changeBillEvent="changeCostRequest"
      />
      <!-- @handleSaveSuccess="handleChange" -->
    </template>
    <template v-if="active == 3&&uploadTableConfig.show">
      <FileUploadTable
        ref="uploadTypeRef"
        :uploadTableConfig="uploadTableConfig"
        :uploadFileTableConfig="uploadFileTableConfig"
      />
    </template>
    <template v-if="active === 4">
      <ComLogistTrack
        ref="myLogistTrack"
        :activities="activities"
        isNoDrawer
        :orderType = "pageType == 1 ? 50 : 45"
      >
        <template v-slot:title="slotProps">
          <span class="orange-bg"> {{ slotProps.activity.name }}</span>
        </template>
        <template v-slot:operationDate="slotProps">
          <span> {{ slotProps.activity.trajectoryTime }}</span>
        </template>
        <template v-slot:operationContent="slotProps">
          <span> {{ slotProps.activity.msg }}</span>
        </template>
      </ComLogistTrack>
    </template>
    <template v-if="active === 5">
      <OperationRecords :id="formData.id || 0" :type="5" />
    </template>
    <template v-if="active === 6">
      <baseInfo
        ref="baseRef"
        :formData="{
          ...formData,
          menuType,
        }"
      />
    </template>
  </div>
</template>

<script>
import { tabsConfig } from "./model";
import { uploadAttach } from "@/api/operateRecord/customsClearance";
import {getAttachList} from "@/api/overseas/fbaOrder.js"
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    pageType: {
      type: Number,
      default: 1,
    },
    active: {
      type: Number,
      default: 1,
    },
    onlyDirect: {
      type: Boolean,
      default: false,
    },
    menuType: {
      type: String,
      default: "value",
    },
  },
  components: {
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable"),
    GoodInfo: () => import("./components/GoodInfo"),
    baseInfo: () => import("./components/baseInfo"),
    UploadFile: () => import("./components/UploadFile"),
    CostInfo: () => import("_comp/CostInfo/billings/otherOverSeaOrder.vue"),
    ComLogistTrack: () => import("_comp/ComLogistTrack"),
    OperationRecords: () =>
      import("@/views/newOrderManage/components/OperationRecords/index.vue"),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
  },
  data() {
    const isBussiness = {
      operation: 0, //操作单0
      order: 1, //订单1
    }[this.menuType];
    const isWebEdit = {
      operation: false,
      order: true,
    };
    return {
      isBussiness,
      isWebEdit,
      tabsConfig,
      attIds: [],
      activities: {
        title: "物流轨迹",
        id: this.formData.id,
      },
      uploadTableConfig:{
        show:false,
      },
      uploadFileTableConfig:{},
      queryTypeList:""
    };
  },
  computed: {
    ...mapState({
      attachType: (state) => state.dictionary.dicsData.attachType,
      attachConfig: (state) => state.dictionary.dicsData.attachConfig,
    }),
  },
  created() {
    this.attIds = this.formData.attachId;
    if(this.active==3){
      this.initGetUploadInfo()
    }
  },
  methods: {
    handleTab(overallStatus) {
      //overallStatus  2已预报    字典取值:nlOverAllStatus
      let tabs = [6, 1, 2, 3, 4, 5];
      if ([1, 2, 11].includes(overallStatus)) {
        tabs = [6, 1, 3, 4, 5];
        if (this.active === 2) {
          this.$emit("handleActive", 1);
        }
      }
      return tabs;
    },
    changeTabs(key) {
      this.$emit("handleActive", key);
      if(key==3){
        this.initGetUploadInfo()
      }
    },
    // seeUploadFn() {},
    // uploadAttach(attachIds = []) {
    //   this.attIds = attachIds.join(",");
    //   uploadAttach({
    //     attachIds,
    //     id: this.formData.id,
    //     updateSource: this.pageType,
    //   });
    // },
    handleChange() {
      this.$emit("handleChange");
    },
    changeCostRequest() {
      this.$emit("changeCostRequest");
    },
    initGetUploadInfo() {
      const {menuType}=this.$route.query
      const onGetFileType={
        'order':'HWQGDD',
        'operation':"HWQGCZD"
      }[menuType]
      console.log('onGetFileType',onGetFileType)
      this.uploadFileTableConfig = {
        noLengthHide: true, //没有附件时隐藏table
      };
      this.uploadTableConfig = {
        ...this.uploadTableConfig,
        isAttachIdGetList: false,
        isGetUploadFileTypes: true,
        onGetFileType,
        show: true, //等接口数据都获取后再调用这个接口展示页面内容
        httpGetFileRequest: (result = {}) => {
          //初始化附件
          const { explains } = result;
          return getAttachList({
            attachId: this.attIds,
            queryTypeList: explains,
          });
        },
        onFileChange: (arr) => {
          this.attIds = arr.join(",");
          const params = {
            attachIds: arr,
            id: this.formData.id,
            updateSource: this.pageType,
          };
          uploadAttach(params).then((res) => {
            this.$refs.uploadTypeRef?.getAttachRequestFiles();
          });
        },
      };
    },
		getBaseRefFormParams() {
			return this.$refs.baseRef?.getRefFormParams() || {};
		}
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 6px 0 14px 0;
}
/deep/ {
  .top {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .subtitle {
      font-size: 12px;
      margin-left: 5px;
      color: #5094ff;
    }
  }
}
</style>
