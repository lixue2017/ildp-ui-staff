<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="overseaLangObj.kc_info || `卡车信息`"
      ref="detailTopRef"
      class="title-sides-margin-none"
      :titConfig="{ columnConfig: [] }"
      :formModel="editFormConfig.formModel"
      @handleClick="handleTopClick"
    >
      <template v-slot:subTitle>
        <span class="sub-title">
          {{
            editFormConfig.formModel.code
              ? `(${editFormConfig.formModel.code})`
              : ""
          }}
        </span>
      </template>
    </ComDetailTop>

    <div v-if="isInitRes">
      <ComForm ref="editFormRef" :formConfig="editFormConfig"></ComForm>

      <div class="footer-btn">
        <span class="table-tit-txt">{{
          overseaLangObj.cargo_details || "货物信息"
        }}</span>
      </div>

      <ComTable
        :ref="`gTableRef`"
        :tableHeight="tableAutoHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="tableQueryParams"
        :pagination="false"
        :current-row="true"
        @onCurrentChange="onCurrentChangeEvt"
        @getResult="getTableResult"
        :isMountedRequest="false"
        :rowOperationBtnListFn="() => tableConfig.statusBtnList"
      />
      <div class="grand-total">
        <template v-for="(tItem, i) in tableSubtotal">
          <span :key="`t_${i}`">
            <span>{{ tItem.totalLabel }}：</span>
            <span>{{ tItem.totalNum }}</span>
          </span>
        </template>
      </div>

      <div v-if="![0, 1].includes(editFormConfig.formModel.state)">
        <div class="footer-btn">
          <span class="table-tit-txt">{{
            overseaLangObj.dd_pod || "订单POD"
          }}</span>
        </div>
        <ComFileTable ref="fileTableRef" :files-conf="filesConf">
          <!-- <template v-slot:dispatchSlot>
            {{ editFormConfig.formModel.code || "--" }}
          </template> -->
        </ComFileTable>
      </div>

      <EditTruckRecordDlg ref="editTruckRecordRef" />

      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, i) in footerBtn">
          <PreviewOrDownload
            v-if="btn.ftBtnType === 'btnPreview'"
            :key="`b_${i}`"
            class="ft-btn-preview"
            :btnTxt="btn.text"
            :btnConf="{
              btnType: 'primary',
            }"
            :previewDownloadConf="handlePreview()"
          />
          <template v-else>
            <el-button
              :type="btn.type"
              @click="btn.handleClick"
              :key="`b_${i}`"
              v-if="
                btn.statusArr
                  ? btn.statusArr.includes(editFormConfig.formModel.state)
                  : true
              "
            >
              {{ btn.text }}
            </el-button>
          </template>
        </template>
      </div>
    </div>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { accumulationFn } from "@/utils/instructions";
import { getStreamFileDownload } from "@/utils/zipdownload";
// import { msgBox } from "@/utils/confirmBox.js";
import {
  putTruckUpdateStatus,
  getTruckCargoList,
  getTruckDeliveryInfo,
} from "@/api/warehouse/manage";
import {
  delPodTruckAttach,
  getDeliveryTruckPreview,
} from "@/api/warehouse/process";
import {
  multipleTruckFormCols,
  multipleTruckSeeTableCols,
} from "@/views/warehouseManage/warehouseManage/outboundDelivery/truck/model.js";
import { formOutboundCols, podTableFileCol } from "./model";

export default {
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        lists: multipleTruckFormCols(true),
        successFunction: () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("保存成功"));
          this.reBack();
        }, // 表单提交成功回调
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "102px" : "85px",
        className: "detail-see-form",
      },
      tableConfig: {
        httpRequest: getTruckCargoList,
        statusBtnList: [
          {
            text: this.overseaLangObj.sc_pod || "上传POD",
            handleClick: this.handleUpload,
          },
        ],
      },
      filesConf: {
        delFileIdKey: "bindId",
        customFileTableCols: podTableFileCol(),
        filesRefresh: (row) => {
          const { type } = row;
          this.addressObj.isChangeAddress = true; // 删除附件后更新
          if (type == 1) {
            this.initTruckDelivery();
          } else {
            this.$refs[`gTableRef`]?.refreshTable();
          }
        },
        delCustomFileRequest: delPodTruckAttach,
      },
      footerBtn: [
        {
          text: this.overseaLangObj.pkc_yl || "派卡车预览",
          type: "primary",
          ftBtnType: "btnPreview",
          // statusArr: [0, 1, 2],
        },
        {
          text: "卡车拣货单",
          type: "primary",
          handleClick: () => {
            getStreamFileDownload(
              `/distributionTruckInfo/exportTruckPickingList/${this.editFormConfig.formModel.id}`
            );
          },
        },
        {
          text: this.overseaLangObj.bj_edit("修改"),
          type: "primary",
          statusArr: [0],
          handleClick: () => this.handleEditPage(),
        },
        // {
        //   text: "出库完成",
        //   type: "primary",
        //   statusArr: [0],
        //   handleClick: () => this.handleEnd(),
        // },
        {
          text: this.overseaLangObj.sc_pod || "上传POD",
          type: "primary",
          statusArr: [2, 3],
          handleClick: () => this.handleUpload(),
        },
        {
          text: this.overseaLangObj.gb_close,
          handleClick: this.reBack,
        },
      ],
      tableList: [],
      tableSubtotal: [],
      addressObj: {}, // 用于选中货物，带出附件信息
      isInitRes: false, // 是否完成初始化
    };
  },
  methods: {
    handlePreview() {
      const { id } = this.editFormConfig.formModel;
      return {
        previewParam: {
          id,
        },
        previewHttp: getDeliveryTruckPreview,
      };
    },
    // handleEnd() {
    //   const { id } = this.editFormConfig.formModel;
    //   this.$refs.customDialogRef.showCustomDialog({
    //     httpRequest: (obj) => {
    //       return putTruckUpdateStatus({
    //         id,
    //         status: 6,
    //         ...obj,
    //       });
    //     },
    //     successFunction: () => {
    //       this.msgSuccess("更新成功");
    //       this.initTruckDelivery();
    //     },
    //     errorFunction: (err) => {
    //       const title = err.msg;
    //       const className = "el-icon-warning text-warning";
    //       const msg = "全部货物入库之后才能进行最后出库";
    //       const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
    //       msgBox(
    //         this,
    //         {
    //           title: "",
    //           html,
    //           showClose: false,
    //           confirmButtonText: "知道了",
    //           customClass: "delivery-box",
    //         },
    //         () => {}
    //       );
    //     },
    //     customFormConfig: formOutboundCols(),
    //   });
    // },
    getTableResult({ tableData }) {
      this.calcNumTotal(tableData);
      this.tableList = tableData;
      if (tableData.length && !this.addressObj.id) {
        // 初始化选中第一行
        this.$refs.gTableRef?.setComCurrentRow(tableData[0]);
      }
      if (this.addressObj.isChangeAddress) {
        // 编辑当前行时更新附件信息
        this.addressObj.isChangeAddress = undefined;
        const fIndex = tableData.findIndex((e) => e.id === this.addressObj.id);
        this.onCurrentChangeEvt(tableData[fIndex]);
      }
    },
    onCurrentChangeEvt(row = {}) {
      // 根据货物获取附件
      this.addressObj = row;
      const rowFiles = (row.attachList || []).map((r) => ({
        ...r,
        businessSn: row.businessSn,
      }));
      this.$refs.fileTableRef?.fileTableList({
        attachList: (this.editFormConfig.formModel.attachList || []).concat(
          rowFiles
        ),
      });
    },
    handleEditPage() {
      const { id } = this.editFormConfig.formModel;
      this.$router.push({
        path: "/warehouseManage/deliveryPlan/truckOutboundEdit",
        query: {
          id,
          pageLocation: 2, // 1=卡车出库；2=派卡车信息
          backPath: this.$route.fullPath,
        },
      });
    },
    handleUpload(row = {}, mode_type = 0) {
      let opt = {
        code: this.editFormConfig.formModel.code,
        distributionInfoId: this.editFormConfig.formModel.id,
      };
      if (row.id) {
        Object.assign(opt, {
          type: "2", // 1-整箱POD 2-订单POD
          attachList: row.attachList,
          // attachId: row.attachId || "96", // || "99",
          distributionPlanId: row.id,
          businessSn: row.businessSn,
        });
      } else {
        Object.assign(opt, {
          type: "1",
          attachList: this.editFormConfig.formModel.attachList,
        });
      }
      this.$refs.editTruckRecordRef.editShow(opt, {
        mode_type,
        editSuccess: () => {
          this.addressObj.isChangeAddress = true; // 编辑后更新
          if (opt.type === "1") {
            this.initTruckDelivery();
          } else {
            this.$refs[`gTableRef`]?.refreshTable();
          }
        },
      });
    },
    initTruckDelivery() {
      const { id, pageLocation } = this.$route.query;
      this.isInitRes = false;
      this.addressObj = {};
      getTruckDeliveryInfo({ id, pageLocation }).then((res) => {
        (this.tableConfig.columnConfig = multipleTruckSeeTableCols(true).filter(
          (e) => !["operation"].includes(e.prop) || res.data.state > 1
        )),
          (this.editFormConfig = {
            ...this.editFormConfig,
            formModel: {
              ...(res.data || {}),
              routePageLocation: Number(pageLocation || 2),
            },
            afterMounted: () => {
              setTimeout(() => {
                this.$refs[`gTableRef`]?.refreshTable();
              }, 20);
            },
          });
        this.isInitRes = true;
      });
    },
    tableQueryParams() {
      const { id, routePageLocation } = this.editFormConfig.formModel;
      return { id, pageLocation: routePageLocation };
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.initTruckDelivery();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    calcNumTotal(arr = []) {
      this.tableSubtotal = [
        {
          totalLabel: this.overseaLangObj.zxs_total("总箱数"),
          totalNum: accumulationFn(arr.map((e) => e.num)),
        },
        {
          totalLabel: "总PLT",
          totalNum: this.editFormConfig.formModel.totalPltNum || 0,
        },
        {
          totalLabel: this.overseaLangObj.total_weight("总重量(KG)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalWeight),
            2
          ),
        },
        {
          totalLabel: this.overseaLangObj.total_volume("总体积(m³)"),
          totalNum: accumulationFn(
            arr.map((e) => e.totalVolume),
            2
          ),
        },
      ];
    },
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComFileTable: () => import("_comp/ComFileTable"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    EditTruckRecordDlg: () => import("./editDlg"),
  },
  created() {
    this["dictionary/getDictionary"]([
      "distributionType",
      "distributionBusinessType",
      "destinationType",
      "distributionPlanState",
      "customsClearanceMode",
      "distributionAttachRefType",
    ]).then(() => {
      this.initTruckDelivery();
    });
  },
  computed: {
    tableAutoHeight() {
      const tableLen = this.tableList.length;
      return tableLen > 4 ? "270px" : undefined;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
}
.footer-btn {
  padding: 15px 0 18px;
}
.table-tit-txt {
  font-size: 14px;
  margin-right: 30px;
}
</style>
