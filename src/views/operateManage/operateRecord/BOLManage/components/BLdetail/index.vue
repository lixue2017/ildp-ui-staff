<template>
  <!-- 详情右下角提单信息 -->
  <div>
    <div class="tabs-bill">
      <div class="tabs-button">
        <div v-for="(item, index) in tabsBtn" :key="index">
          <el-button
            :class="[
              'tabs-btn',
              item.key === formConfig.active ? 'isActive' : '',
            ]"
            v-if="
              item.display &&
              (index === 0 ||
                (index === 1 && hblArr.length === 1) ||
                (index === 2 && taxRefundTabList.length === 1))
            "
            size="small"
            plain
            @click="changeTabs(item.key)"
          >
            {{ item.label }}
            <template v-if="index === 1 && hblArr[0]">
              {{ `(${hblArr[0].hblNo})` }}
            </template>
            <template v-if="index === 2 && taxRefundTabList[0]">
              {{ `(${taxRefundTabList[0].hblNo})` }}
            </template>
          </el-button>

          <el-dropdown
            v-if="
              item.display &&
              ((index === 1 && hblArr.length > 1) ||
                (index === 2 && taxRefundTabList.length > 1))
            "
            trigger="click"
            class="add-trailer"
          >
            <el-button
              plain
              size="small"
              :class="[
                'tabs-btn',
                item.key === formConfig.active ? 'isActive' : '',
              ]"
            >
              {{ item.label }} {{ item.labelNo && `(${item.labelNo})`
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(tabBtn, iBtn) in [hblArr, taxRefundTabList][index - 1]"
                :key="iBtn"
                @click.native="() => handleSwitchHbl(tabBtn, index)"
                >{{ tabBtn.hblNo
                }}<template v-if="index === 1 && !!tabBtn.mergeOperationId">
                  · 合并单</template
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div style="display: flex">
        <template v-for="(item, index) in showBtnArrFn()">
          <template v-if="isShowBtn(item)">
            <div
              :key="index"
              v-if="item.btnType === 'add_tax_refund'"
              style="margin: 0 10px"
            >
              <el-dropdown
                trigger="click"
                class="add-trailer"
                placement="bottom"
                @visible-change="handleAddTax"
              >
                <el-button
                  round
                  plain
                  type="primary"
                  size="small"
                  :class="['add-btn']"
                >
                  <i class="el-icon-plus"></i>
                  <span>{{ item.text }}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="add-tax-ul">
                  <el-checkbox-group v-model="taxCheckedArr">
                    <el-checkbox
                      class="li-check-no word-break-all"
                      v-for="(aItem, iBtn) in addTaxRefundList"
                      :key="iBtn"
                      :label="aItem"
                      >{{ aItem.hblNo }}</el-checkbox
                    >
                  </el-checkbox-group>

                  <el-dropdown-item v-if="!addTaxRefundList.length"
                    ><div style="color: #919191">
                      暂无数据
                    </div></el-dropdown-item
                  >
                  <div v-else class="check-tax-btn">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleAddTaxRefund"
                      >确认</el-button
                    >
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-button
              :key="index"
              :size="item.size"
              v-else-if="!item.isPreOrDown"
              plain
              round
              type="primary"
              @click="item.handleClick"
              >{{ item.text }}
            </el-button>
            <PreviewOrDownload
              class="preDownSpace"
              :key="index"
              v-else-if="
                item.isPreOrDown && formConfig.formModel.orderType == 4
              "
              :btnTxt="item.text"
              :previewDownloadConf="
                handlePreDown(formConfig.formModel, item.ctType)
              "
            />
          </template>
        </template>
      </div>
    </div>

    <template v-if="isInitRes">
      <TabDetailContent :formData="formConfig.formModel" />
    </template>

    <LadingEditDialog
      ref="editDialogRef"
      @handleSuccess="handleLadingSuccess"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getHblorMblDetail,
  getDetailHblList,
  getDetailMblList,
  getTaxRefundList,
  getTaxRefundBillById,
  insurancePreviewDownload,
  getZJBPreviewDownload,
  GETCtCheckPreviewDownload,
  deletePopBill,
} from "@/api/operateRecord/BOLManage.js";
import { comFileDownload } from "@/utils/download.js";
import { customMessageBox } from "@/utils/confirmBox.js";

export default {
  props: {
    mblModel: {
      type: Object,
      default: () => ({}),
    },
    detailType: {
      type: String,
      default: () => "", // operationOrderDetails: 操作单详情/提单信息
    },
    operateId: {
      type: [String, Number],
      default: () => "", // 操作单ID
    },
    showMblTab: {
      type: Boolean,
      default: false,
    },
    isMainBill: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tabMbl: this.showMblTab,
      formConfig: {
        formModel: {},
        active: 0,
      },
      tabsBtn: [
        { key: 0, label: "MBL单", display: false, id: "" },
        { key: 1, label: "HBL", display: false, id: "", labelNo: "" },
        { key: 2, label: "退税提单", display: false, labelNo: "" },
      ],
      rBtnArr: [
        {
          text: "MBL",
          size: "small",
          isPreOrDown: true,
          isTab: [0, "0"],
          ctType: 1,
          handleClick: (row) => {},
        },
        {
          text: "HBL",
          size: "small",
          isPreOrDown: true,
          isTab: [1, "1"],
          ctType: 2,
          handleClick: (row) => {},
        },
        {
          text: "货物信息",
          size: "small",
          isPreOrDown: true,
          isTab: [0, "0", 1, "1"],
          ctType: 3,
          handleClick: (row) => {},
        },
        {
          text: "保险模板导出",
          size: "small",
          isMainBill: 1,
          isTab: [0, "0"],
          handleClick: this.handleInsuranceExport,
        },
        {
          text: "中进宝补料导出",
          size: "small",
          isMainBill: 1,
          isTab: [0, "0"],
          handleClick: this.handleZJBExport,
        },
        {
          text: "删除退税提单",
          size: "small",
          isTab: [2, "2"],
          btnType: "del_tax_refund",
          handleClick: () => this.handleDelete(2),
        },
        {
          text: "新增退税提单",
          size: "small",
          isTab: [0, "0", 2, "2"],
          btnType: "add_tax_refund",
          handleClick: () => {},
        },
        {
          text: "删除子HBL",
          size: "small",
          isTab: [1, "1"],
          isCanHbl: [1],
          handleClick: () => this.handleDelete(1),
        },
        {
          text: "新增HBL",
          size: "small",
          isTab: [1, "1"],
          isCanHbl: [0],
          handleClick: () => {
            this.handleAdd();
          },
        },
        {
          text: "修 改",
          size: "small",
          handleClick: () => {
            this.handleEdit();
          },
        },
      ],
      hblArr: [], // hbl列表
      taxRefundTabList: [], // 退税单
      addTaxRefundList: [], // 电商新增退税单
      taxCheckedArr: [],
      handleType: "", // 操作类型
      isInitRes: false,
    };
  },
  created() {
    this["dictionary/getDictionary"]("BLinfoTypeEn");
    // console.log('created==', this.mblModel);
    if (this.detailType === "operationOrderDetails") {
      // 操作单id
      this.getHblList();
      this.getDetailTaxRefundList();
    } else if (this.mblModel?.id || this.mblModel?.popId) {
      // 提单id
      this.getInitHblorMblDetail(this.mblModel.popId, { ladingType: "mbl" });
    }
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getInitHblorMblDetail(id, obj = {}) {
      //初始化数据
      const { isOperation, ladingType } = obj;
      if (ladingType === "mbl") {
        this.tabsBtn[0].id = id;
        this.formConfig.active = 0;
        this.tabsBtn[0].display = true;
        this.tabsBtn[1].display = false;
      }
      if (ladingType === "hbl") {
        this.tabsBtn[1].id = id;
        this.tabsBtn[1].display = true;
        this.formConfig.active = 1;
      }
      if ([5, 7, 9].includes(this.isMainBill)) {
        this.tabsBtn[0].display = false;
      } else {
        this.tabsBtn[0].display = true;
      }
      const { active = 0 } = this.formConfig;
      this.isInitRes = false;
      getHblorMblDetail({ id, isMain: !active ? 1 : 0 }, isOperation).then(
        (res) => {
          const data = res.data[0] || {};
          this.getDetailRes(data);
        }
      );
    },
    getDetailRes(resObj = {}) {
      const { isMainBill, type } = resObj || {};
      this.formConfig.formModel = {
        ...(resObj || {}),
        showClearanceList: isMainBill !== 1 && type === 0,
      };
      this.isInitRes = true;
      if (this.tabMbl) {
        this.changeTabs(0);
        this.tabMbl = false;
      }
    },
    getHblList(oId, popId, isAdd) {
      const operationOrderId =
        this.detailType === "operationOrderDetails" ? this.operateId : oId;
      getDetailHblList({ operationOrderId }).then((res) => {
        this.hblArr = res.data || [];
        this.handleType = "";
        if (res.data?.length) {
          // 根据提单ID获取HBL详情
          let i = 0;
          if (isAdd) {
            i = this.hblArr.length - 1;
          }
          if (popId) {
            i = this.hblArr.findIndex((item) => item.id === popId);
          }
          this.handleSwitchHbl(res.data[i > -1 ? i : 0]);
        } else {
          if (this.detailType === "operationOrderDetails") {
            // 操作单详情-无数据时显示骨架
            this.isInitRes = true;
          }
        }
      });
    },
    getDetailTaxRefundList(taxType, delCallBack) {
      getTaxRefundList({ operationOrderId: this.operateId }).then((res) => {
        this.handleType = "";
        this.taxRefundTabList = res.data || [];
        this.tabsBtn[2].display = !!this.taxRefundTabList.length;
        if (taxType === "tax_del") {
          const taxRow = this.taxRefundTabList[0];
          if (taxRow) {
            this.handleSwitchHbl(taxRow, 2);
          } else {
            delCallBack && delCallBack();
          }
        }
        if (taxType === "tax_add") {
          const row = this.taxRefundTabList[this.taxRefundTabList.length - 1];
          this.handleSwitchHbl(row, 2);
        }
      });
    },
    handleAddTax(val) {
      if (val && !this.addTaxRefundList.length) {
        getDetailHblList({
          operationOrderId: this.operateId,
          isMerge: 0,
        }).then((res) => {
          this.addTaxRefundList = res.data || [];
        });
      }
    },
    // 切换hbl
    handleSwitchHbl(row, idx = 1) {
      this.tabsBtn[idx].labelNo = row.hblNo;
      if (idx === 1) {
        this.getInitHblorMblDetail(row.id, { ladingType: "hbl" });
      } else if (idx === 2) {
        this.formConfig.active = 2;
        this.getTaxRefundIdDetail(row);
      }
    },
    changeTabs(tIndex) {
      this.formConfig.active = tIndex;
      if (this.detailType === "operationOrderDetails" && tIndex === 0) {
        this.isInitRes = false;
        getDetailMblList({ operationOrderId: this.operateId }).then((res) => {
          this.getDetailRes(res?.data[0] || {});
        });
        return;
      }
      if (tIndex === 2) {
        this.getTaxRefundIdDetail(this.taxRefundTabList[0]);
        return;
      }
      this.getInitHblorMblDetail(this.tabsBtn[tIndex].id);
    },
    getTaxRefundIdDetail({ id }) {
      this.isInitRes = false;
      this.formConfig.formModel = {}; // 防止多页面删除后, 接口报错, ID未重置
      getTaxRefundBillById({ id }).then((res) => {
        this.getDetailRes(res.data || {});
      });
    },
    // 新增HBL
    handleAdd() {
      const params = {
        ...this.formConfig.formModel,
        queryType: 2,
      };
      this.$refs.editDialogRef.show(params, "add");
      this.handleType = "add";
    },
    handleEdit() {
      const { type } = this.formConfig.formModel;
      // const hblOrMbl = [0, "0"].includes(type) ? 0 : 1;
      if (type == 2) {
        this.handleType = "edit_tax";
      }
      this.$refs.editDialogRef.show(
        this.formConfig.formModel,
        type == 2 ? "edit_tax" : "edit"
        // hblOrMbl
      );
    },
    async handleAddTaxRefund() {
      if (!this.taxCheckedArr.length) {
        return this.msgError("请选择单号");
      }
      const oIds = this.taxCheckedArr.map((e) => e.operationOrderId);
      const taxHblRows = (
        await getHblorMblDetail({
          isMain: 0,
          isRefund: 1, // 退税提单 1-是 0-否
          billIdList: this.taxCheckedArr.map((e) => e.id).join(","),
          operationOrderIds: oIds.join(","),
        })
      ).data;
      this.$refs.editDialogRef.show(
        {
          ...(taxHblRows[0] || {}),
          taxOperationOrderIds: oIds,
        },
        "add_tax"
      );
      this.taxCheckedArr = [];
      this.handleType = "add_tax";
    },
    handleLadingSuccess() {
      if (this.handleType === "add") {
        this.getHblList(this.formConfig.formModel.operationOrderId, null, true);
        // this.addTaxRefundList = [];
      } else if (this.handleType === "add_tax") {
        this.getDetailTaxRefundList("tax_add");
      } else if (this.handleType === "edit_tax") {
        this.handleType = "";
        this.getTaxRefundIdDetail(this.formConfig.formModel);
      } else {
        this.getInitHblorMblDetail(this.formConfig.formModel.id);
        this.$emit("handleEditSuccess");
      }
    },
    handleDelete(idx) {
      const { id, operationOrderId } = this.formConfig.formModel;
      customMessageBox(
        this,
        {
          msgTxt1: "删除不可逆",
          httpMsgRequest: () =>
            deletePopBill({
              id,
              operationOrderId,
            }).catch((err) => {
              if (err.code === 1002) {
                this.msgError(err.msg);
              }
            }),
        },
        () => {
          this.msgSuccess("删除成功");
          if (idx === 1) {
            // this.addTaxRefundList = [];
            this.getHblList(operationOrderId);
            return;
          }
          if (idx === 2) {
            this.getDetailTaxRefundList("tax_del", () => {
              if (this.tabsBtn[0].display) {
                this.changeTabs(0);
              } else {
                this.getHblList(operationOrderId);
              }
            });
          }
        }
      );
    },
    handlePreDown(row = {}, ctType) {
      // console.log("row", row);
      const { operationOrderId, id } = row;
      return {
        previewParam: {
          id,
          operationOrderId,
          ctType,
        },
        previewHttp: GETCtCheckPreviewDownload,
      };
    },
    isShowBtn(btn) {
      const { fclStatus, freightType, id, isMainBill, canDeleted } =
        this.formConfig.formModel;
      if (btn.fclStatusArr && btn.freightTypeArr) {
        return (
          btn.fclStatusArr.includes(fclStatus) ||
          btn.freightTypeArr.includes(freightType)
        );
      }
      const isShowTab = btn.isTab
        ? btn.isTab.includes(this.formConfig.active)
        : true;
      if (btn.isMainBill) {
        return isShowTab && isMainBill == btn.isMainBill;
      }
      if (btn.isCanHbl) {
        return isShowTab && btn.isCanHbl.includes(canDeleted);
      }
      return isShowTab && !!id;
    },
    handleInsuranceExport() {
      const { operationOrderId } = this.formConfig.formModel;
      comFileDownload(this, insurancePreviewDownload, {
        operationOrderId,
      });
    },
    handleZJBExport() {
      const { operationOrderId, id } = this.formConfig.formModel;
      comFileDownload(this, getZJBPreviewDownload, {
        operationOrderId,
        id,
      });
    },
    showBtnArrFn() {
      if (
        this.detailType === "operationOrderDetails" &&
        this.mblModel.orderType == 2
      ) {
        // 电商操作单
        return this.rBtnArr;
      }
      return this.rBtnArr.filter(
        (e) => !["add_tax_refund", "del_tax_refund"].includes(e.btnType)
      );
    },
  },
  components: {
    TabDetailContent: () => import("./tabContent"),
    LadingEditDialog: () =>
      import(
        "@/views/operateManage/operateRecord/BOLManage/components/editDialog/index.vue"
      ),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs-bill {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 0;
  .tabs-button {
    display: flex;
    & > div:not(:first-child) {
      .el-button {
        // border-radius: 0 14px 14px 0;
        border-left: none;
        height: 28px;
      }
    }
  }
  .tabs-btn {
    color: #515151;
    &:hover,
    &:focus {
      color: #5094ff;
    }
    &.isActive {
      color: #fff;
      background-color: #5094ff;
      border-color: #5094ff;
    }
    &:nth-child(1) {
      padding-left: 10px;
    }
  }
  .preDownSpace {
    margin-right: 15px;
  }
}
.add-tax-ul {
  padding: 10px 12px;
  /deep/ {
    .el-checkbox-group {
      max-height: 60vh;
      overflow: auto;
    }
  }
  .li-check-no {
    display: flex;
    align-items: center;
    max-width: 600px;
    margin: 0 0 6px 0;
  }
  .check-tax-btn {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
