<template>
  <div>
		<ComUploadTable :uploadTableConfig="{
       haveRulesTag: true,
			webEditUpload: !fileData.isSee,
			webFileType: ['F101', 'F202'][fileData.type],
			webFileTypeArr: nFileTypeArr,
			tUploadConfig: {
				uploadData: nFileTypeArr[0] ? nFileTypeArr[0].fBtnParam : undefined
			},
			uploadSuccess: uploadSuccess
		}">
			<template>
				<ComAttachTable
					:fileTitle="fileData.isSee ? '附件资料' : null"
					ref="attachTableRef"
					@deleteFile="handleDelete"
					:uploadFileModel="uploadSeeModel()"
					:fileTableBtnArr="fileData.isSee ? undefined : fileBtnArr"
				/>
			</template>
		</ComUploadTable>
  </div>
</template>

<script>
import { detailUploadPaymentInvoice } from "@/api/settlementManage/statementManage";

export default {
  props: {
    fileData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    ComAttachTable: () => import("_comp/ComFileTable/attachmentTable.vue"),
		ComUploadTable: () => import("_comp/ComFileTable/uploadFileTable.vue"),
  },
  data() {
    return {
      fileTypeArr: [
				{
					label: "应收账单合同",
					fBtnParam: {
						type: "131"
					}
				},
        {
          label: "应付账单合同",
					fBtnParam: {
						type: "124"
					}
        },
        {
          label: "应付账单发票",
					fBtnParam: {
						type: "125"
					}
        },
        {
          label: "应付账单其他",
					fBtnParam: {
						type: "130"
					}
        },
      ],
      fileBtnArr: [
        {
          text: "删除",
          btnOpnType: "delete",
        },
        {
          text: "资料下载",
          btnOpnType: "download",
        },
      ],
			nFileTypeArr: [],
      attachArr: [], //新增时的附件ID
    };
  },
  methods: {
    uploadSuccess(res) {
      this.attachArr.push(...res.data);
      this.$emit("attachIdList", this.attachArr);
      this.$refs.attachTableRef?.attachRequestTable({
        attachId: this.attachArr.join(","),
      });
    },
    handleDelete(arr = []) {
      this.attachArr = arr.map((e) => e.id);
      this.$emit("attachIdList", this.attachArr);
    },
    _setFileTable() {
      const { attachList = [] } = this.fileData;
      this.handleDelete(attachList);
      setTimeout(() => {
        this.$refs.attachTableRef?.setFileList(attachList);
      }, 20);
    },
		fileBtnList() {
			let arr = ["124", "125", "130"];
			if (this.fileData.type == 1 ) {
				arr = ["131"];
			}
			this.nFileTypeArr = this.fileTypeArr.filter(e => arr.includes(e.fBtnParam.type));
		},
		uploadSeeModel() {
			return {
				isUploadBtn: true,
				btnTxt: '上传附件',
				fileTypeArr: this.nFileTypeArr,
				isTableFiles: true,
				haveRulesTag: true,
				uploadModelCols: {
					before_model_cols: [],
				},
				uploadFileRequest: (param) => {
					return detailUploadPaymentInvoice({
						id: this.fileData.id,
						attachId: param.attachIds.join(",")
					})
				},
				successUploadFn: () => {
					this.$emit("seeUploadFn");
				}
			}
		}
  },
  mounted() {
    this._setFileTable();
  },
	created() {
		// if (!this.fileData.isSee) {
			this.fileBtnList();
		// }
	},
  watch: {
    "fileData.id"() {
      // 上下页更新附件
      this._setFileTable();
    },
  },
};
</script>

 <style lang="scss" scoped>

</style>
