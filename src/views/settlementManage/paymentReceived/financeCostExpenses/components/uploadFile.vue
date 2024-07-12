<template>
  <div>
    <!-- 如果有需要自定义附件类型，自定义保存附件接口与传参的可以引用这个文件 -->
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
export default {
  props: {
    fileData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    fileUploadConfig: {
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
      // fileTypeArr: [
			// 	{
			// 		label: "个人报销",
			// 		fBtnParam: {
			// 			type: "120"
			// 		}
			// 	},
      // ],
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
      const { fileTypeArr = [],showTypeArr = [] } = this.fileUploadConfig || {}
			this.nFileTypeArr = fileTypeArr.filter(e => showTypeArr.includes(e.fBtnParam.type));
		},
		uploadSeeModel() {
      const {submitHttpRequest,isUploadBtn=true}=this.fileUploadConfig
			return {
				isUploadBtn,
				btnTxt: '上传附件',
				fileTypeArr: this.nFileTypeArr,
				isTableFiles: true,
				haveRulesTag: true,
				uploadModelCols: {
					before_model_cols: [],
				},
				uploadFileRequest: (params) => {
         return submitHttpRequest(params)
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
