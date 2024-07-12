<template>
  <div class="order-edit">
    <div class="order-content" v-if="isInitRes">
      <ComDetailTop
        :title="/*海外清关一审二审交接详情*/ `清关信息`"
        :formModel="formConfig.formModel"
        ref="detailTopRef"
        class="margin-right-32"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title">
            {{
              formConfig.formModel.operateShortName
                ? `(${formConfig.formModel.operateShortName})`
                : ""
            }}
          </span>
        </template>
      </ComDetailTop>
      <div class="flex">
        <div class="customsClearance-form">
          <ComForm class="detail-see-form" :formConfig="formConfig" />
        </div>
        <div class="customsClearance-table">
          <div class="custom-tabs-btn">
            <template v-for="tItem in tabsConfig.columns">
              <el-button
                size="small"
                plain
                :key="tItem.key"
                @click="changeTabs(tItem.key)"
                :type="tItem.key === tabsConfig.active ? 'activation' : ''"
                >{{ tItem.label }}</el-button
              >
            </template>
          </div>
          <div v-show="tabsConfig.active === 1">
            <ComTable
              ref="tableRef"
              :columnConfig="tableConfig.columnConfig"
              :httpRequest="tableConfig.httpRequest"
              :getQueryParams="getQueryParams"
            />
            <FileUploadTable
              :uploadTableConfig="{
                isGetUploadFileTypes: true,
                ...handleFileRequestCollection(),
              }"
              :uploadFileTableConfig="{
                noLengthHide: false,
              }"
            />
          </div>
          <template v-if="tabsConfig.active === 2">
            <OperationRecords
              :params="{
                operationOrderId: formConfig.formModel.id,
                type: 1,
              }"
            />
          </template>
        </div>
      </div>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in getFootBtns(formConfig.formModel)">
          <el-button
            :type="btn.type"
            @click="btn.handleClick(formConfig.formModel)"
            :key="index"
          >
            {{
              btn.textRender ? btn.textRender(formConfig.formModel) : btn.text
            }}
          </el-button>
        </template>
      </div>
    </div>
    <RemarkDrawer ref="drawerRef" />
    <OverseasHandoverDialog
      ref="oHandoverDlgRef"
      @handleSuccess="() => getDetails()"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { detailFormCols, tableColumns } from "./model.js";
import {
  getDirectClearanceInfoQg,
  GETGoodsFromOrderDimension,
} from "@/api/order/overSeaOther";
import { delClearanceAccessory } from "@/api/performance/record.js";
import { uploadAttach } from "@/api/operateRecord/customsClearance";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    RemarkDrawer: () =>
      import(
        "@/views/operateManage/operateRecord/components/recordDrawer/remark.vue"
      ),
    FileUploadTable: () => import("_comp/ComFileTable/fileUploadTable.vue"),
    OverseasHandoverDialog: () =>
      import(
        "@/views/operateManage/operateRecord/components/connectDialog/overseas.vue"
      ),
    OperationRecords: () =>
      import(
        "@/views/operateManage/operateRecord/components/ClearanceDetial/OperationRecords"
      ),
  },
  data() {
    return {
      tabsConfig: {
        active: 1,
        columns: [
          {
            label: "货物信息",
            key: 1,
          },
          {
            label: "操作记录",
            key: 2,
          },
        ],
      },
      formConfig: {
        formModel: {},
        labelWidth: "98px",
        lists: detailFormCols(),
      },
      tableConfig: {
        columnData: [],
        httpRequest: GETGoodsFromOrderDimension,
        columnConfig: tableColumns(),
      },
      isInitRes: false,
      statusList: [
        {
          textRender: (r) =>
            `${["一", "二"][r.overallStatus === 17 ? 1 : 0]}审交接`,
          statusArr: [14, 17],
          showPageListTab: "1", // 从列表进入详情
          handleClick: (r) => {
            this.$refs.oHandoverDlgRef?.show({
              id: r.id,
            });
          },
        },
        {
          text: "交接备注记录",
          statusArr: [17, 20, 21, 22, 100],
          handleClick: (row) => {
            this.handleRecord(row);
          },
        },
        {
          text: "关闭",
          handleClick: () => {
            this.reBack();
          },
        },
      ],
    };
  },
  created() {
    this["dictionary/getDictionary"]("customsClearance").then(() => {
      this.getDetails();
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    changeTabs(key) {
      this.tabsConfig.active = key;
    },
    getDetails() {
      const { id } = this.$route.query;
      this.isInitRes = false;
      getDirectClearanceInfoQg({ id }).then((res = {}) => {
        this.formConfig.formModel = {
          ...res.data,
        };
        this.isInitRes = true;
      });
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.getDetails();
      }
    },
    handleFileRequestCollection() {
      const { id, attachId } = this.formConfig.formModel;
      return {
        onGetFileType: "HWQGJJYS",
        attachId,
        httpSaveFileRequest: ({ attachAllList }) => {
          return uploadAttach({
            attachIds: attachAllList,
            id,
            updateSource: 1,
          });
        },
        isDelGetAttachList: true,
        httpDelFileRequest: ({ deleteAttachIdList }) => {
          return delClearanceAccessory(deleteAttachIdList.join(","));
        },
      };
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    getQueryParams() {
      const { id } = this.$route.query;
      return {
        id,
      };
    },
    getFootBtns(row) {
      const { viewSource } = this.$route.query;
      return this.statusList.filter((e) => {
        return (
          (e.showPageListTab ? e.showPageListTab === viewSource : true) &&
          (e.statusArr ? e.statusArr.includes(row.overallStatus) : true)
        );
      });
    },
    handleRecord(row) {
      // const { id, jobNo } = row;
      const { viewPage } = this.$route.query;
      const params = {
        // ...row,
        // moduleName: 120,
        // operationOrderNum1: jobNo,
        pageRemarkNameKey: viewPage === "hw_two" ? "HWQGESBZ" : "HWQGYSBZ",
        operationOrderId: row.id,
      };
      this.$refs.drawerRef?.show(params);
    },
  },
};
</script>

<style lang="scss" scoped>
.order-edit {
  /deep/ {
    .border-right {
      border-right: 1px solid #f2f2f2;
    }
  }

  .order-content {
    background-color: #ffffff;
    margin: 10px;
    min-height: calc(100vh - 108px);
    .customsClearance-table {
      margin: 0 20px 10px;
      /deep/ {
        .custom-tabs-btn {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
