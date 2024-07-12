<template>
  <div class="app-container" v-if="isInitRes">
    <ComDetailTop
      :title="`卡车信息`"
      ref="detailTopRef"
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

    <div class="app-container-content">
      <ComForm ref="editFormRef" :formConfig="editFormConfig">
        <template v-slot:slotPsd>
          <i class="el-icon-location-outline"></i>
          <span>{{ tableList[0] ? tableList[0].detailsAddr : "--" }}</span>
        </template>
        <template v-slot:slotPsqd>
          {{ tableList[0] ? tableList[0].tname : "--" }}
        </template>
      </ComForm>
      <div class="footer-btn">
        <span class="table-tit-txt">货物信息</span>
      </div>

      <ComTable
        :ref="`tableRef`"
        :tableHeight="tableAutoHeight"
        :columnConfig="tableConfig.columnConfig"
        :httpRequest="tableConfig.httpRequest"
        :getQueryParams="tableQueryParams"
        :pagination="false"
        :current-row="true"
        @onCurrentChange="onCurrentChangeEvt"
        @getResult="getTableResult"
        :isMountedRequest="false"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'operation'">
            <div class="operation-content-btn">
              <template v-for="(item, index) in tableConfig.statusBtnList">
                <el-button
                  :key="index"
                  size="small"
                  type="text"
                  @click="item.handleClick(slotProps.row)"
                  >{{ item.text }}</el-button
                >
              </template>
            </div>
          </template>
        </template>
      </ComTable>
			<div class="grand-total">
				<template v-for="(tItem, i) in tableSubtotal">
					<span :key="`t_${i}`">
						<span>{{ tItem.totalLabel }}：</span>
						<span>{{ tItem.totalNum }}</span>
					</span>
				</template>
			</div>

      <div v-if="editFormConfig.formModel.status === 6">
        <div class="footer-btn">
          <span class="table-tit-txt">订单POD</span>
        </div>
        <ComFileTable ref="fileTableRef" :files-conf="filesConf">
          <template v-slot:dispatchSlot>
            {{ editFormConfig.formModel.code || "--" }}
          </template>
        </ComFileTable>
      </div>

      <EditTruckRecordDlg ref="editTruckRecordRef" />

      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footerBtn">
          <el-button
            :type="btn.type"
            @click="btn.handleClick"
            v-if="btn.statusArr.includes(editFormConfig.formModel.status)"
            :key="index"
          >
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </div>

    <ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { filesPreview } from "@/utils/index";
import { accumulationFn } from "@/utils/instructions";
import { msgBox } from "@/utils/confirmBox.js";
import { putTruckUpdateStatus } from "@/api/warehouse/manage";
import {
  truckOrderFiles,
  delTruckPodFile,
  truckRecordDetails,
  truckPreviewDownload,
  getDetailTruckFreightList,
} from "@/api/warehouse/process";
import {
  editFormColumns,
  editTableColumns,
} from "@/views/warehouseManage/warehouseManage/exWarehouse/truck/model.js";
import { formOutboundCols } from "./model";

export default {
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: () => {
          this.msgSuccess("保存成功");
          this.reBack();
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        className: "detail-see-form",
        formRules: {},
      },
      tableConfig: {
        httpRequest: getDetailTruckFreightList,
        statusBtnList: [
          {
            text: "上传POD",
            handleClick: this.handleUpload,
          },
        ],
      },
      filesConf: {
        httpFileTable: truckOrderFiles,
        filesRefresh: () => {
          this.addressObj.isChangeAddress = true; // 删除附件后更新
          this.$refs[`tableRef`]?.refreshTable();
        },
        delCustomFileRequest: delTruckPodFile,
        delFileIdKey: "podId",
      },
      footerBtn: [
        {
          text: "派卡车预览",
          type: "primary",
          statusArr: [5, 6],
          handleClick: () => this.handlePreview(),
        },
        {
          text: "修改",
          type: "primary",
          statusArr: [5],
          handleClick: () => this.handleEditPage(),
        },
        {
          text: "出库完成",
          type: "primary",
          statusArr: [5],
          handleClick: () => this.handleEnd(),
        },
        {
          text: "上传POD",
          type: "primary",
          statusArr: [6],
          handleClick: () => this.handleUpload(),
        },
        {
          text: "关闭",
          statusArr: [5, 6],
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
      const { id } = this.$route.query;
      truckPreviewDownload({ id }).then((res) => {
        if (res.data) {
          filesPreview(res.data);
        }
      });
    },
    handleEnd() {
      const { id } = this.editFormConfig.formModel;
      this.$refs.customDialogRef.showCustomDialog({
        httpRequest: (obj) => {
          return putTruckUpdateStatus({
            id,
            status: 6,
            ...obj,
          });
        },
        successFunction: () => {
          this.msgSuccess("更新成功");
          this.initRequest();
        },
        errorFunction: (err) => {
          const title = err.msg;
          const className = "el-icon-warning text-warning";
          const msg = "全部货物入库之后才能进行最后出库";
          const html = `<div class='display-flex'><i class='${className}'></i><span>${title}</span></div><div class='subtitle'>${msg}</div>`;
          msgBox(
            this,
            {
              title: "",
              html,
              showClose: false,
              confirmButtonText: "知道了",
              customClass: "delivery-box",
            },
            () => {}
          );
        },
        customFormConfig: formOutboundCols(),
      });
    },
    getTableResult({ tableData }) {
			this.calcNumTotal(tableData);
      this.tableList = tableData;
      if (tableData.length && !this.addressObj.goodsId) {
        // 初始化选中第一行
        this.$refs.tableRef?.setComCurrentRow(tableData[0]);
      }
      if (this.addressObj.isChangeAddress) {
        // 编辑当前行时更新附件信息
        this.addressObj.isChangeAddress = undefined;
        const fIndex = tableData.findIndex(
          (e) => e.goodsId === this.addressObj.goodsId
        );
        this.onCurrentChangeEvt(tableData[fIndex]);
      }
    },
    onCurrentChangeEvt(row = {}) {
      // 根据货物获取附件
      this.addressObj = row;
      this.$refs.fileTableRef?.fileRequestTable({
        truckId: this.editFormConfig.formModel.id,
        goodsId: row.goodsId,
        orderSn: row.number,
      });
      // const attachArr = [row.attachId, row.attachFile].filter((e) => e);
      // this.$refs.fileTableRef?.attachRequestTable({
      //   attachId: attachArr.join(","),
      // });
    },
    handleEditPage() {
      const { id } = this.editFormConfig.formModel;
      this.$router.push({
        path: "/warehouseManage/exWarehouse/truckEdit",
        query: {
          id,
          backPath: this.$route.fullPath,
        },
      });
    },
    handleUpload(row = {}, mode_type = 0) {
      let opt = {
        code: this.editFormConfig.formModel.code,
        truckId: this.editFormConfig.formModel.id,
      };
      if (row.goodsId) {
        opt = {
          ...opt,
          attachId: row.attachId, // || "99",
          type: 20, // 10-整箱POD 20-订单POD
          serviceName: "订单POD",
          goodsId: row.goodsId,
          orderType: row.orderType,
          orderSn: row.number,
        };
      } else {
        opt = {
          ...opt,
          type: 10, // 10-整箱POD 20-订单POD
          serviceName: "整箱POD",
          attachId: this.editFormConfig.formModel.attachId,
        };
      }
      this.$refs.editTruckRecordRef.editShow(opt, {
        mode_type,
        editSuccess: () => {
          this.addressObj.isChangeAddress = true; // 编辑后更新
          if (opt.type === 10) {
            this.initRequest();
          } else {
            this.$refs[`tableRef`]?.refreshTable();
          }
        },
      });
    },
    initRequest() {
      const { id } = this.$route.query;
      this.isInitRes = false;
			this.addressObj = {};
      truckRecordDetails(id).then((res) => {
        this.tableConfig = {
          ...this.tableConfig,
          columnConfig: editTableColumns().filter(
            (e) => !["operation"].includes(e.prop) || res.data.status === 6
          ),
        };
        // console.log("res", res);
        this.editFormConfig = {
          ...this.editFormConfig,
          formModel: res.data || {},
          afterMounted: () => {
            setTimeout(() => {
              this.$refs[`tableRef`]?.refreshTable();
            }, 20);
          },
        };
        this.isInitRes = true;
      });
    },
    tableQueryParams() {
      const {
        orderIds = [],
        addrList = [],
        id,
      } = this.editFormConfig.formModel;
      return {
        truckId: id,
        // justIds: orderIds.join(","),
        // addrList: addrList.join(","),
      };
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.initRequest();
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
		calcNumTotal(arr = []) {
			this.tableSubtotal = [{
				totalLabel: "总箱数",
				totalNum: accumulationFn(arr.map(e => e.productTotal))
			}, {
				totalLabel: "总重量(KG)",
				totalNum: accumulationFn(arr.map(e => e.weight), 2)
			}, {
				totalLabel: "总体积(m³)",
				totalNum: accumulationFn(arr.map(e => e.volume), 2)
			}, {
				totalLabel: "总产品数",
				totalNum: accumulationFn(arr.map(e => e.productType))
			}]
		},
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    ComFileTable: () => import("_comp/ComFileTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
    EditTruckRecordDlg: () => import("./editDlg"),
  },
  created() {
    this.editFormConfig = {
      ...this.editFormConfig,
      lists: editFormColumns(true),
    };
    this.initRequest();
    // this["dictionary/getDictionary"]("exWarehouseDict").then(() => {})
  },
	computed: {
    tableAutoHeight() {
			const tableLen = this.tableList.length;
			return tableLen > 4 ? "270px" : undefined
		},
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 0px;
  &-content {
    padding: 14px 20px;
  }
}
.com-detail-top {
  margin-bottom: 20px;
}
.footer-btn {
  padding: 15px 0 18px;
}
.table-tit-txt {
  font-size: 14px;
  margin-right: 30px;
}
</style>
