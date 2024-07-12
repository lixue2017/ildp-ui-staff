<template>
  <div>
    <ComDialog
      ref="dialogRef"
      :customDialog="customDialogConfig"
      :confirmClose="false"
      class="email-dialog"
    >
      <template v-slot:content>
        <!-- <div class="title">邮箱</div> -->
        <ComForm
          ref="dlgFormRef"
          :formConfig="formConfig"
          v-if="$refs.dialogRef && $refs.dialogRef.dialogVisible"
        >
          <template v-slot:content="slotProps">
            <quill-editor
              v-model="slotProps.formModel.content"
              ref="editorRef"
              :options="editorOption"
            />
          </template>
        </ComForm>
        <div v-if="['operation_gj', 'bill_zd'].includes(paramObj.webMailTag)">
          <ComAttachTable
            ref="attachTableRef"
            :paramObj="paramObj"
            :showOperation="false"
          />
        </div>
        <div v-if="paramObj.webMailTag === 'goods_hw'">
          <ComAttachTable
            ref="attachGoodsRef"
            :paramObj="{
              viewSource: 'trOrder',
            }"
          />
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { emailNoCols, emailRules } from "./model";
import { quillEditor } from "vue-quill-editor";
import { getContactsInfo } from "@/api/customerManage/customerList";
import { getMailMsg, postSendMail } from "@/api/messageService";
import { duplicateRemoval } from "@/utils/index";
import { uploadSettleBill, getBillAttachListByTootId } from "@/api/common";
export default {
  components: {
    quillEditor,
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
  },
  props: {
    paramObj: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      customDialogConfig: {
        title: "发送邮箱",
        width: "860px",
        center: false,
        appendToBody: true,
        footer: [
          {
            text: "确 认",
            type: "primary",
            handleClick: () => {
              this.$refs.dlgFormRef?.$refs["myForm"].validate((valid) => {
                if (valid) {
                  this.handleCheck();
                }
              });
            },
          },
          {
            text: "取 消",
            handleClick: () => {
              this.$refs.dialogRef.handleClose();
            },
          },
        ],
      },
      formConfig: {
        formModel: {},
        isAttachFileId: true,
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleFormSuccess, // 表单提交成功回调
        errorFunction: this.handleFormError, // 表单提交失败回调
        labelWidth: "112px",
        formRules: emailRules(),
      },
      editorOption: {
        //编辑器的样式
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            ["bold", "italic", "underline"], // toggled buttons

            [{ align: [] }],

            [{ list: "ordered" }],
            [{ direction: "rtl" }], // text direction
            ["link", "image"],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme

            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          ],
        },
        placeholder: "请输入内容",
      },
      fileUrlList: [],
    };
  },
  methods: {
    async handleCheck() {
      const { webMailTag, billStrIds } = this.paramObj;
      if (!["goods_hw"].includes(webMailTag)) {
        this.fileUrlList.splice(0); // 清空
        this.fileUrlList = this.$refs.attachTableRef?.getCheckRowList() || [];
        // if (!attachDTOList.length) {
        //   return this.msgError("请选择附件资料！");
        // }
      }
      if (webMailTag === "bill_zd") {
        const { viewType } = this.$refs.dlgFormRef?.getFormParams() || {};
        if (viewType) {
          const loadMsg = this.$message({
            message: "文件准备中，请稍等。。。",
            type: "warning",
            duration: 0,
          });
          const billFileUrl = (
            await uploadSettleBill({
              billId: this.paramObj.billId,
              idStr: billStrIds,
              viewType,
              businessCompany: this.paramObj.customerId,
            })
          ).data;
          loadMsg.close();
          this.fileUrlList.push(billFileUrl);
        }
      }
      this.$refs.dlgFormRef.submitForm();
    },
    submitFormRequest(formModel) {
      const { viewType, attachId, ...nParams } = formModel || {};
      if (attachId) {
        // attachId 为后台返回的全路径附件链接
        this.fileUrlList.push(...attachId.split(","));
      }
      return postSendMail({
        ...nParams,
        attachList: this.fileUrlList.map((ele) => {
          return typeof ele === "string"
            ? {
                name: ele.split("/").reverse()[0],
                url: ele,
              }
            : {
                name: ele.name,
                url: ele.filePath,
              };
        }),
      });
    },
    handleFormSuccess() {
      this.$refs.attachTableRef?.attachResetSelected();
      this.$refs.dialogRef.hide();
      this.$emit("handleSuccess");
    },
    handleFormError() {
      if (["goods_hw"].includes(this.paramObj.webMailTag)) {
        this.$refs.attachTableRef?.attachResetSelected();
        this.$refs.dialogRef.hide();
      }
    },
    async show(row = {}) {
      const {
        customerId,
        webMailTag,
        operationOrderId,
        salesmanId,
        billId,
        kaIdList,
        billTootIds,
      } = this.paramObj || {};
      this.fileUrlList = [];
      const resRows = !customerId
        ? []
        : (
            await getContactsInfo({
              id: customerId,
            })
          ).rows || [];

      const emailOptions = resRows.filter((r) => r.email).map((e) => e.email);

      const opt = {
        operation_gj: "MSG-TEMP-230001", // 轨迹
        goods_hw: "MSG-TEMP-230002", // 核实货物
        bill_zd: "MSG-TEMP-230003", // 账单
        clearance_qg: "MSG-TEMP-240001", // 电商/传统清关交接
        clearance_hw_qg: "MSG-TEMP-240002", // 海外清关交接
      };
      // console.log("this.paramObj===", this.paramObj);
      const idArr = salesmanId
        ? [salesmanId, ...(kaIdList || [])]
        : kaIdList || []; // 业务抄送人ID集合
      const { defaultCcRecipient, ...resMsgData } =
        (
          await getMailMsg({
            tag: opt[webMailTag || "operation_gj"], // 模板标识
            id: webMailTag === "bill_zd" ? billId : operationOrderId, // 操作单ID/对账单ID
            ccRecipientFromBusinessIdList: [
              "clearance_qg",
              "clearance_hw_qg",
            ].includes(webMailTag)
              ? idArr
              : [...idArr, this.curUserInfo?.userId],
          })
        ).data || {};
      this.formConfig.lists = emailNoCols({ mTag: webMailTag });
      this.formConfig.formModel = {
        recipient: ["clearance_qg", "clearance_hw_qg"].includes(webMailTag)
          ? row.resRecipientStr
          : duplicateRemoval(emailOptions).join("|"),
        ccRecipient: defaultCcRecipient,
        ...resMsgData,
      };
      this.$refs.dialogRef.show();
      if (webMailTag === "bill_zd" && billTootIds) {
        getBillAttachListByTootId({
          tootIds: billTootIds,
          queryTypeList: ["30", "100", "4", "20", "150", "60", "90"],
        }).then((res) => {
          setTimeout(() => {
            this.$refs.attachTableRef?.setFileList(res.data || []);
          });
        });
      }
      if (webMailTag === "goods_hw" && row.goodsFilePath) {
        this.fileUrlList = [row.goodsFilePath];
        setTimeout(() => {
          this.$refs.attachGoodsRef?.setFileList([
            {
              filePath: row.goodsFilePath,
              name: "货物信息表.xlsx",
              typeName: "--",
            },
          ]);
        }, 300);
      }
    },
  },
  computed: {
    ...mapState({
      curUserInfo: (state) => state.user.userInfo,
    }),
  },
};
</script>
<style lang="scss" scoped>
.email-dialog {
  //   .title {
  //     line-height: 20px;
  //     font-size: 14px;
  //     font-weight: bold;
  //     margin-bottom: 15px;
  //   }
  /deep/ .ql-container {
    min-height: 80px;
  }
}
</style>
