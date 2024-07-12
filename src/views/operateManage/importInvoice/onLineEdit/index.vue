<template>
  <div class="app-container">
    <ComDetailTop
      title="电商头程运输 (线上箱单发票)"
      :formModel="{}"
      :config="{}"
      ref="detailTopRef"
    />
    <div class="top">
      <div class="top-left">
        <template v-for="item in btnList">
          <div
            :key="item.type"
            :class="[
              'set-btn',
              (item.type === 'revoke' && historyIndex > 0) ||
              (item.type === 'redo' && historyIndex < historyData.length - 1)
                ? ''
                : 'isDisabled',
            ]"
            :style="{ backgroundColor: item.backgroundColor }"
            @click="item.handleClick(item.type)"
          >
            <i :class="`iconfont ${item.icon}`"></i><span>{{ item.text }}</span>
          </div>
        </template>
      </div>
      <div class="top-right">
        <span>描述：</span>
        <span
          >按住shift+鼠标点击选择要合并的内容，右键菜单栏点击合并进行合并，合并以“箱数”列为标准；</span
        >
      </div>
    </div>
    <template v-if="!operationOrderId || (operationOrderId && invoiceData)">
      <FormCustom
        ref="formCustomRef"
        :invoiceData="invoiceData"
        @handleEncasementWay="handleEncasementWay"
        @handleChangeForm="handleChangeForm"
        @addRecord="addFormRecord"
      />
      <TableXlsx
        ref="tableXlsxRef"
        :encasementWay="encasementWay"
        :newsData="newsData"
        :isOperationOrder="isOperationOrder"
        :invoiceEcDtoList="invoiceData ? invoiceData.invoiceEcDtoList : null"
        @addRecord="addTableRecord"
      />
    </template>
    <div class="order-footer">
      <template v-for="(item, index) in footer">
        <el-button
          :type="item.type"
          @click="item.handleClick"
          :key="index"
          :plain="item.plain"
          v-if="!item.hide"
        >
          {{ item.text }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { msgBox } from "@/utils/confirmBox.js";
import {
  addClearanceProductInvoiceInPage,
  selectClearanceInvoice,
} from "@/api/operateRecord/clearanceGoods.js";
import qs from "qs";
export default {
  name: "OnLineImport",
  components: {
    ComDetailTop: () => import("_comp/ComDetailTop"),
    FormCustom: () => import("./components/FormCustom"),
    TableXlsx: () => import("./components/TableXlsx"),
  },
  data() {
    const { operationOrderId, isOperationOrder } = this.$route.query;
    return {
      operationOrderId,
      isOperationOrder: !!isOperationOrder,
      invoiceData: null,
      encasementWay: 0,
      btnList: [
        {
          icon: "iconfont chexiao",
          text: "撤销",
          backgroundColor: "#909090",
          type: "revoke",
          handleClick: this.handleHistory,
        },
        {
          icon: "iconfont zhongzuo-copy",
          text: "重做",
          backgroundColor: "#5094ff",
          type: "redo",
          handleClick: this.handleHistory,
        },
      ],
      footer: [
        // {
        //   text: "保存草稿",
        //   type: "primary",
        //   hide: isDetail,
        //   handleClick: () => this.handleSubmit(100),
        // },
        {
          text: "确 认",
          type: "primary",
          handleClick: () => this.handleSubmit(0),
        },
        {
          text: "取 消",
          plain: true,
          handleClick: () => this.reBack(),
        },
      ],
      historyData: [],
      historyIndex: 0,
      newsData: {},
    };
  },
  computed: {
    ...mapGetters(["eCommerceImport"]),
  },
  created() {
    this["dictionary/getDictionary"]("orderTypeEn");
    const { operationOrderId, importType, isImport } = this.$route.query;
    if (isImport) {
      selectClearanceInvoice({
        operationOrderId,
        importType,
      }).then((res) => {
        const {
          encasementWay,
          clearanceType,
          reportCustomsWayId,
          outWarehouseWay,
        } = res.data;
        this.invoiceData = res.data;
        this.encasementWay = encasementWay || 0;
        this.$set(this.newsData, "clearanceType", clearanceType);
        this.$set(this.newsData, "reportCustomsWayId", reportCustomsWayId);
        this.$set(this.newsData, "outWarehouseWay", outWarehouseWay);
      });
    } else if (Object.keys(this.eCommerceImport).length) {
      const { invoiceEcVo } = this.eCommerceImport;
      const {
        encasementWay,
        clearanceType,
        reportCustomsWayId,
        outWarehouseWay,
      } = invoiceEcVo;
      this.invoiceData = { ...invoiceEcVo };
      this.encasementWay = encasementWay;
      this.$set(this.newsData, "clearanceType", clearanceType);
      this.$set(this.newsData, "reportCustomsWayId", reportCustomsWayId);
      this.$set(this.newsData, "outWarehouseWay", outWarehouseWay);
      this["dataImport/setECommerceImport"]({});
    } else {
      this.reBack();
    }
  },
  mounted() {},
  methods: {
    ...mapActions([
      "dictionary/getDictionary",
      "tagsView/delView",
      "dataImport/setECommerceImport",
    ]),
    handleEncasementWay(val) {
      this.encasementWay = val;
    },
    handleChangeForm({ prop, val }) {
      if (
        ["clearanceType", "reportCustomsWayId", "outWarehouseWay"].includes(
          prop
        )
      ) {
        this.$set(this.newsData, prop, val);
      }
    },
    handleMerge() {
      this.$refs.tableXlsxRef.handleMerge();
    },
    handleSubmit(status) {
      this.$refs.formCustomRef.handleSubmit().then((data) => {
        const { headTransportModeName, encasementWayName, ...params } = data;
        const res = this.$refs.tableXlsxRef.getTableList();
        if (res) {
          const { list, goodsNum } = res;
          if (!list.length) {
            this.$message.error("货物列表不能为空");
            return;
          }
          const {
            originOperationOrderId,
            operationOrderId,
            importType,
            isImport,
            isCopy,
          } = this.$route.query;
          if (operationOrderId) {
            params.operationOrderId = operationOrderId;
          }
          if (isCopy) {
            delete params.operationOrderId;
          }
          if (originOperationOrderId) {
            params.originOperationOrderId = originOperationOrderId;
          }
          params.importType = importType;
          params.invoiceEcDtoList = list;
          if (isImport) {
            this.addInvoice(params);
            return;
          }
          const html = `<div class="base-flex-align">
          <i class="el-icon-warning"></i>
          共导入${goodsNum}条货物信息，${list.length}个产品信息，确认是否导入
        </div>`;
          msgBox(
            this,
            {
              customClass: "confirm-class import-msg-box",
              html,
              confirmButtonText: "确 定",
              showClose: false,
              showCancelButton: true,
            },
            () => {
              this.addInvoice(params);
            }
          );
        }
      });
    },
    addInvoice(params) {
      params.type = 2; // type 1: 客户端；2: 员工端
      addClearanceProductInvoiceInPage(params).then((res) => {
        const { isImport } = this.$route.query;
        isImport && this.$message.success("保存成功");
        this.reBack();
      });
    },
    reBack() {
      const { data = {}, backPath, importType, tabsActive } = this.$route.query;
      const query = qs.parse(decodeURI(data));
      if (tabsActive) {
        query.tabsActive = tabsActive;
      } else if (importType == 5) {
        query.tabsActive = 2;
      }
      this["tagsView/delView"](this.$route).then(() => {
        // 返回时关闭当前页面，防止反复保存
        this.$router.replace({
          path: backPath || "/domesticBusiness/customsClearanceDetail",
          query,
        });
      });
    },
    handleHistory(type) {
      switch (type) {
        case "revoke":
          if (this.historyIndex) {
            this.historyIndex -= 1;
            const { formData, tableData, mergeObj } =
              this.historyData[this.historyIndex];
            if (formData) {
              this.$refs.formCustomRef.setHistoryRecord({ ...formData });
            }
            if (tableData || mergeObj) {
              this.$refs.tableXlsxRef.setHistoryRecord(tableData, mergeObj);
            }
          }
          break;
        case "redo":
          if (this.historyData.length - 1 > this.historyIndex) {
            this.historyIndex += 1;
            const { formData, tableData, mergeObj } =
              this.historyData[this.historyIndex];
            if (formData) {
              this.$refs.formCustomRef.setHistoryRecord({ ...formData });
            }
            if (tableData || mergeObj) {
              this.$refs.tableXlsxRef.setHistoryRecord(tableData, mergeObj);
            }
          }
          break;

        default:
          break;
      }
    },
    // 添加表单记录
    addFormRecord(data, isFirst) {
      if (isFirst) {
        this.historyData[0] = {
          ...(this.historyData[0] || {}),
          formData: { ...data },
        };
      } else {
        this.historyData.push({
          formData: { ...data },
        });
      }
      this.historyIndex = this.historyData.length - 1;
      console.log("historyData:", this.historyData);
    },
    // 添加表格记录
    addTableRecord(data, isFirst) {
      if (isFirst) {
        this.historyData[0] = {
          ...(this.historyData[0] || {}),
          ...JSON.parse(JSON.stringify(data)),
        };
      } else {
        this.historyData.push({
          ...JSON.parse(JSON.stringify(data)),
        });
      }
      this.historyIndex = this.historyData.length - 1;
      console.log("historyData:", this.historyData);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  margin-bottom: 90px;
  /deep/ {
    .com-detail-top {
      padding-left: 0;
      padding-top: 0;
      margin: 0 0 15px;
    }
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 20px 8px;
    margin: 10px 0 20px;
    border-radius: 4px;
    background: #e8f0ff;

    .top-left {
      display: flex;
      .set-btn {
        line-height: 16px;
        font-size: 14px;
        padding: 6px 9px;
        border-radius: 2px;
        margin-right: 20px;
        color: #fff;
        cursor: pointer;

        &.isDisabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        i {
          margin-right: 5px;
        }
      }
    }
    .top-right {
      span {
        &:nth-child(1) {
          color: #5094ff;
        }
        &:nth-child(2) {
          color: #8b8b8b;
        }
      }
    }
  }
  .order-footer-box {
    left: 0;
  }
}
</style>
