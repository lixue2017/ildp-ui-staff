<template>
  <div>
    <div v-if="fileTitle" class="base-flex-between file-head">
      <div class="file-title">{{ fileTitle }}({{ fileArr.length }})</div>
      <div>
        <el-button
          size="small"
          @click="handleUploadFile"
          plain
          type="primary"
          round
          v-debounce
          v-if="
            (paramObj.orderId || paramObj.operationOrderId) &&
            showOperation &&
            !paramObj.hideTitBtn
          "
        >
          <!-- 订单、操作单详情 -->
          上传附件
        </el-button>
        <el-button
          size="small"
          @click="handleFileUpload"
          plain
          :round="uploadFileModel.isBtnRound"
          type="primary"
          v-debounce
          v-if="uploadFileModel.isUploadBtn"
        >
          {{ uploadFileModel.btnTxt || "上传附件" }}
        </el-button>
      </div>
    </div>
    <ComTable
      ref="fileComRef"
      :extraConfig="{
        showHeader: false,
      }"
      :columnConfig="tableTabConfig()"
      :columnData="fileArr"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'attachSlotName'">
          <div class="attach-box base-flex-align">
            <div class="attach-img base-flex-center">
              <img
                class="max-w-h-img"
                :src="handleFile(slotProps.row.filePath)"
              />
            </div>
            <div class="attach-content">
              <el-popover
                placement="top"
                width="97"
                popper-class="file-preview-popper"
                trigger="hover"
              >
                <div class="base-flex-center">
                  <i
                    class="el-icon-view"
                    @click="handlePreviewDownload(slotProps.row, 'preview')"
                  />
                  <i
                    class="el-icon-download"
                    @click="handlePreviewDownload(slotProps.row, 'download')"
                  />
                </div>
                <span class="attach-file primary-text-color" slot="reference">
                  {{
                    slotProps.row.name ||
                    (slotProps.row.filePath || "").split("/").reverse()[0]
                  }}
                </span>
              </el-popover>

              <div
                class="conts"
                v-if="!['ecOrder', 'trOrder'].includes(paramObj.viewSource)"
              >
                <!-- 订单详情不显示 -->
                {{
                  `${slotProps.row.fileSize}.${
                    slotProps.row.createBy || "--"
                  }.${slotProps.row.createTime}`
                }}
              </div>
            </div>
          </div>
        </template>

        <template v-if="slotProps.prop === 'attachSlotType'">
          <span class="tag-green-color">{{
            slotProps.row.typeName || "--"
          }}</span>
        </template>

        <template v-if="slotProps.column.customSlot">
          <slot :name="slotProps.column.prop" :slotProps="slotProps" />
        </template>

        <template v-if="slotProps.prop === 'operation'">
          <div class="operation-content-btn">
            <template
              v-for="(item, index) in fileTableRowBtnArr(slotProps.row)"
            >
              <el-button
                :key="`f_${index}`"
                size="small"
                type="text"
                v-debounce
                @click="handleClick(slotProps, item.btnOpnType)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
        </template>
      </template>
    </ComTable>
    <!-- <CustomFormDialog ref="customDialogRef"> -->
    <CustomFormDialog ref="customDialogRef" :slotDlgFormIds="['slotUpload']">
      <template v-slot:slotUpload="slotProps">
        <UploadFiles
          :fileData="{
            ...paramObj,
            ...slotProps.formModel,
          }"
          :uploadFileModel="uploadFileModel"
          @attachIdList="getAttachIdList"
        >
        </UploadFiles>
      </template>
    </CustomFormDialog>
  </div>
</template>

<script>
import { filesPreview } from "@/utils/index";
import { deleteOrAddArr } from "@/utils/instructions";
import { download } from "@/utils/download.js";
import productDefaultLogo from "@/assets/image/product_default.svg";
import {
  newGetAttachListByOrderId,
  getAttachListByOrderId,
  updateAttachListByOrderId,
  getOrderAttachList,
  updateAttachListByOrderIdNew,
} from "@/api/common";
import { getAttachList } from "@/api/overseas/fbaOrder";
import overseaLangObj from "@/language/overseasLang.js";
import { attachTableCols, fileConfirmForm, singleFileCols } from "./model";
export default {
  props: {
    paramObj: {
      type: Object,
      default: () => ({}),
    },
    fileTitle: {
      type: String,
      default: () => overseaLangObj.fj_zl || "附件资料",
    },
    fileTableBtnArr: {
      type: Array,
      default: () => [
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
    },
    showOperation: {
      type: Boolean,
      default: true,
    },
    uploadFileModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      newFileIds: [],
      fileArr: [],
    };
  },
  methods: {
    async handleFileUpload() {
      const {
        successUploadFn,
        uploadFileRequest,
        uploadModelData = {},
        uploadModelCols = {},
        isTableFiles,
        haveRulesTag, // 是否必填
      } = this.uploadFileModel;
      const { attachFilesFn, ...nFileData } = uploadModelData || {};
      if (attachFilesFn) {
        // 接口获取已上传的附件列表
        const fRes = await attachFilesFn();
        nFileData.attachList = fRes.data || [];
        // nFileData.initAttachIds = (fRes.data || []).map(e => e.id);
      }
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: isTableFiles
          ? fileConfirmForm(uploadModelCols)
          : singleFileCols(uploadModelCols),
        formModel: {
          ...nFileData,
        },
        confirmCheckFunction: (callBack) => {
          if (!haveRulesTag || this.newFileIds.length) {
            callBack && callBack();
          } else {
            this.msgError(`请上传附件`);
          }
        },
        httpRequest: (obj) => {
          let opt = obj;
          if (isTableFiles) {
            opt = {
              ...obj,
              attachIds: this.newFileIds || [],
            };
          }
          return uploadFileRequest(opt);
        },
        successFunction: () => {
          successUploadFn && successUploadFn();
        },
      });
    },

    /** 订单、操作单详情上传附件 */
    handleUploadFile() {
      const { operationOrderNum, orderNumType, orderNumId } = this.paramObj;
      const params = {
        orderId: orderNumId,
        orderType: orderNumType,
        queryTypeList: this.uploadFileModel.queryTypeList || ["30", "100"],
      };
      newGetAttachListByOrderId(params).then((res) => {
        const attachList = res.data;
        const attachIds = res.data.map((e) => e.id);
        this.$refs.customDialogRef?.showCustomDialog({
          customFormConfig: fileConfirmForm(),
          httpRequest: (fData) => {
            const { orderId, orderType } = fData;
            const params = [
              {
                attachIds: this.newFileIds.join(","),
                attachDeleteIds: deleteOrAddArr(this.newFileIds, attachIds),
                orderId,
                orderType,
                queryType: !!this.paramObj.orderId ? 2 : 3,
              },
            ];
            return updateAttachListByOrderIdNew(params);
          },
          formModel: {
            attachType: 30, // 默认通过
            operationOrderNum,
            orderType: orderNumType,
            orderId: orderNumId,
            attachList,
            attachIds,
          },
          successFunction: () => {
            this.initOrderAttachList();
          },
        });
      });
    },
    getAttachIdList(ids) {
      this.newFileIds = ids;
    },
    // handleUploadFile() {
    //   const { operationOrderNum, orderNumType, orderNumId } = this.paramObj;
    //   let attachId_3_list = [];
    //   let attachId_4_list = [];
    //   const param = {
    //     orderId: orderNumId,
    //     orderType: orderNumType,
    //   };
    //   Promise.all([
    //     getAttachListByOrderId({
    //       ...param,
    //       attachType: 30,
    //     }),
    //     getAttachListByOrderId({
    //       ...param,
    //       attachType: 100,
    //     }),
    //   ]).then(([attachId_3, attachId_4]) => {
    //     attachId_3_list = attachId_3.data;
    //     attachId_4_list = attachId_4.data;
    //     this.$refs.customDialogRef?.showCustomDialog({
    //       customFormConfig: fileConfirmForm(),
    //       isRetainModelVal: true,
    //       httpRequest: (fData) => {
    //         const {
    //           attachId_3 = "",
    //           attachId_4 = "",
    //           attachId_3_del,
    //           attachId_4_del,
    //         } = fData;
    //         const params = [
    //           {
    //             ...param,
    //             attachType: 30,
    //             attachIds: attachId_3,
    //             attachDeleteIds: attachId_3_del,
    //           },
    //           {
    //             ...param,
    //             attachType: 100,
    //             attachIds: attachId_4,
    //             attachDeleteIds: attachId_4_del,
    //           },
    //         ];
    //         return updateAttachListByOrderId(params);
    //       },
    //       formModel: {
    //         attachType: 30, // 默认通过
    //         operationOrderNum,
    //         attachId_3_list,
    //         attachId_4_list,
    //         // expenseBillId: row.id
    //       },
    //       successFunction: () => {
    //         this.initOrderAttachList();
    //       },
    //     });
    //   });
    // },

    handleClick(fSlotProps, btnType) {
      switch (btnType) {
        case "download":
          this.handlePreviewDownload(fSlotProps.row, btnType);
          break;
        case "delete": // 删除
          this.fileArr.splice(fSlotProps.rowIndex, 1);
          this.setFileList(this.fileArr);
          this.$emit("deleteFile", this.fileArr);
          break;
        case "delRequest": // 调接口删除
          this.$emit("delRequestFile", this.fileArr[fSlotProps.rowIndex]);
          break;
        default:
          break;
      }
    },
    /** 预览与下载 */
    handlePreviewDownload(row, btnType) {
      if (!row.filePath) return;
      if (btnType === "download") {
        download(row.filePath, row.name);
      } else {
        filesPreview(row.filePath);
      }
    },
    handleFile(url) {
      if (
        url &&
        (url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg"))
      ) {
        return url;
      }
      return productDefaultLogo;
    },
    initOrderAttachList() {
      // 查询类型 1:客户端订单 2:员工端订单 3:员工端操作单
      const { orderId } = this.paramObj || {};
      const opt = {
        ...this.paramObj,
        queryType: !!orderId ? 2 : 3,
      };
      getOrderAttachList(opt).then((res) => {
        this.setFileList(res.data);
      });
    },
    tableTabConfig() {
      return attachTableCols(this.showOperation);
    },
    setFileList(list = []) {
      this.fileArr = list;
      this.$refs.fileComRef?.setNewTableData(this.fileArr);
    },
    /** 附件ID查询附件 */
    attachRequestTable(fileParams = {}) {
      const { attachId } = fileParams;
      if (attachId) {
        getAttachList({ attachId }).then((res) => {
          this.fileArr = res.data || [];
          this.$refs.fileComRef?.setNewTableData(this.fileArr);
        });
      }
    },
    getCheckRowList() {
      return this.$refs.fileComRef.checkRowList || [];
    },
    attachResetSelected(cRows) {
      // 重置选中项
      this.$refs.fileComRef?._toggleRowSelectionMixin({
        newCheckRows: cRows || [],
      });
    },
    fileTableRowBtnArr(r) {
      return this.fileTableBtnArr.filter((e) =>
        e.showTypeList ? e.showTypeList.includes(r.type) : true
      );
    },
  },
  mounted() {
    if (this.paramObj.orderId || this.paramObj.operationOrderId) {
      this.initOrderAttachList();
    }
  },
  created() {
    if (this.paramObj.initFileList) {
      this.fileArr = this.paramObj.initFileList;
    }
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    CustomFormDialog: () => import("_comp/ConfirmDialog/customFormDialog"),
    UploadFiles: () =>
      import("@/views/operateManage/components/uploadFiles/index.vue"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.file-head {
  padding: 15px 0 15px;
  .file-title {
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
  }
}
.attach-img {
  width: 36px;
  flex: 0 0 36px;
  height: 36px;
  overflow: hidden;
  margin: 0 20px;
  .max-w-h-img {
    max-width: 100%;
    max-height: 100%;
  }
}
.attach-file {
  cursor: pointer;
}
</style>
