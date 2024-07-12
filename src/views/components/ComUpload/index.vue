<template>
  <div :class="overseaLangObj.yu_yan_lang === 'en-us' && 'en-uploader'">
    <div
      v-if="uploadPercent && uploadPercent !== 0"
      class="base-flex-center"
      style="width: 280px"
    >
      <span>上传进度：</span>
      <div style="flex: 1">
        <el-progress :percentage="uploadPercent"></el-progress>
      </div>
    </div>
    <!-- 图片粘贴上传 -->
    <div
      class="paste-content"
      v-if="
        !uploadConfig.disabled &&
        uploadConfig.pasteUpload &&
        uploadConfig.fileList.length < uploadConfig.limit
      "
    >
      <el-input
        @paste.native="onPasteUpload($event)"
        :value="overseaLangObj.ctrl_v_upload || '按Ctrl+V 将文件粘贴至此处上传'"
      />
    </div>

    <el-upload
      ref="upload"
      :class="[
        uploadConfig.className,
        (uploadConfig.disabled || hideUpload) && 'hide',
      ]"
      :list-type="uploadConfig.type"
      :name="uploadConfig.name"
      :headers="{
        ...uploadConfig.headers,
        Authorization: `Bearer ${getToken()}`, // 多界面退出重新登录时获取新的token
      }"
      :action="uploadConfig.url"
      :data="uploadConfig.uploadData"
      :limit="uploadConfig.limit"
      :accept="uploadConfig.accept"
      :show-file-list="uploadConfig.showFileList"
      :multiple="uploadConfig.multiple"
      :file-list="uploadConfig.fileList"
      :auto-upload="uploadConfig.autoUpload"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :disabled="uploadConfig.disabled"
      :http-request="handleUpload || (() => {})"
      :drag="
        uploadConfig.drag && ['text', 'picture'].includes(uploadConfig.type)
      "
      :on-preview="handlePreview"
      :on-progress="onProgress"
    >
      <template v-if="uploadConfig.type === 'text'">
        <template v-if="uploadConfig.drag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">{{
              overseaLangObj.tz_dj_upload
            }}</template>
            <template v-else>
              将文件拖到此处，或<em>{{
                uploadConfig.text.btnText || "点击上传"
              }}</em>
            </template>
          </div>
        </template>

        <template v-else>
          <div class="upload-btn">
            <slot v-if="uploadConfig.slot" name="btnText" />
            <span v-else>{{ uploadConfig.text.btnText }}</span>
          </div>
          <div
            class="el-upload__tip"
            slot="tip"
            v-if="uploadConfig.text && uploadConfig.text.tipsText"
          >
            {{ uploadConfig.text.tipsText }}
          </div>
        </template>
      </template>
      <template v-if="uploadConfig.type === 'picture'">
        <!-- <img
          v-if="uploadConfig.imgUrl"
          :src="uploadConfig.imgUrl"
          class="pics"
        />
        <div v-else class="uploader-icon-container">
          <i class="el-icon-plus uploader-icon"></i>
        </div>
        <div
          class="el-upload__tip"
          slot="tip"
          v-if="uploadConfig.text && uploadConfig.text.tipsText"
        >
          {{ uploadConfig.text.tipsText }}
        </div> -->
        <template v-if="uploadConfig.drag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>{{
              uploadConfig.text.btnText || "点击上传"
            }}</em>
          </div>
        </template>

        <el-button v-else size="small" type="primary">{{
          uploadConfig.text.btnText || "点击上传"
        }}</el-button>
      </template>
      <template v-if="uploadConfig.type === 'picture-card'">
        <i slot="default" class="el-icon-plus"></i>
      </template>
      <slot name="otherType" />
    </el-upload>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { defaultTextParams } from "./model";
import axios from "axios";
import { download } from "@/utils/download";
import { getToken } from "@/utils/auth";
import { errorLoginExpired } from "@/utils/errorCode";
import { chunkFileUploadUrl, chunkMergeUploadUrl } from "_comp/ComUpload/model";

export default {
  props: {
    uploadConfig: {
      type: Object,
      default: () => {
        return defaultTextParams;
      },
    },
  },
  components: {},
  data() {
    return {
      getToken,
      dialogVisible: false,
      dialogImageUrl: "",
      hideUpload: false,
      uploadPercent: 0,
    };
  },
  methods: {
    //上传成功
    handleSuccess(res, file) {
      this.uploadPercent = 0;
      if (this.uploadConfig.separateCallBackName) {
        // 特殊情况单独处理
        this.$emit(this.uploadConfig.separateCallBackName, res);
      } else if (res.code === 200 || res.data) {
        this.uploadConfig.imgUrl = URL.createObjectURL(file.raw);
        this.$message.success(`上传成功`);
        this.$emit("handleSuccess", res, file);
      } else {
        // 上传失败时自动删除最后一个文件
        this.$refs.upload?.uploadFiles.splice(-1, 1);
        if (res.code === 401) {
          errorLoginExpired();
          return;
        } else {
          this.$emit("handleError", res);
        }
        this.msgError(`${res.msg || "上传失败"}`);
      }
    },
    //上传前
    beforeUpload(file) {
      // console.log("beforeUpload", file, this.uploadConfig.accept);
      if (this.uploadConfig.beforeCheckCallBack) {
        // 单独的校验
        return this.uploadConfig.beforeCheckCallBack(file);
      }
      const types = this.uploadConfig.accept.split(",");
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const isCorrectFormat = types.includes(fileType?.toLocaleLowerCase());
      if (!isCorrectFormat)
        this.$message.error(`上传文件只能是${this.uploadConfig.accept}格式!`);
      const size = this.uploadConfig.size;
      const isLtNM = file.size / 1024 / 1024 < size;
      if (!isLtNM) {
        this.$message.error(`上传文件大小不能超过${size}MB!`);
      }
      if (isCorrectFormat && isLtNM) this.$emit("handleUploading");
      return isCorrectFormat && isLtNM;
    },
    //文件数超限制
    handleExceed(files, fileList) {
      // console.log("handleExceed", files);
      this.$message.warning(
        `当前限制上传 ${this.uploadConfig.limit}个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //文件状态改变时
    handleChange(file, fileList) {
      this.uploadFile = file;
      const { uploadCheckCallBack } = this.uploadConfig;
      if (file.name) {
        const suffix = file.name.split(".").pop();
        if (!["jpg", "jpeg", "png"].includes(suffix.toLocaleLowerCase())) {
          file.url = require("@/assets/image/transparent.png");
        }
      }
      // console.log("handleChange", file, fileList);
      this.hideUpload = fileList.length >= this.uploadConfig.limit;
      // const existFile = fileList
      //   .slice(0, fileList.length - 1)
      //   .find((f) => f.name === file.name);
      // if (existFile) {
      //   this.$message.error("当前文件已经存在!");
      //   fileList.pop();
      // }
      this.uploadConfig.fileList = fileList;

      if (file.status == "ready" && uploadCheckCallBack) {
        //需要在选取完文件之后再弹出交互框输入数据后和附件一起提交，全部暴露在父组件自定义
        uploadCheckCallBack && uploadCheckCallBack();
      }
    },
    //删除
    handleRemove(file, fileList) {
      console.log("handleRemove", file, fileList);
      this.hideUpload = fileList.length >= this.uploadConfig.limit;
      this.uploadConfig.fileList = fileList;
    },
    //文件列表预览下载
    handlePreview(file) {
      console.log("file=/", file);
      if (this.uploadConfig.type === "picture-card") {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        return;
      }
      if (!file.filePath) return;
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const isOpen = /.jpg|.jpeg|.png|.pdf/.test(fileType?.toLocaleLowerCase());
      if (isOpen) {
        window.open(file.filePath);
      } else {
        download(file.filePath, file.name);
      }
    },
    onProgress(e, file, fileList) {
      if (e.total > 0) {
        this.uploadPercent = parseInt((e.loaded / e.total) * 98);
      }
    },
    // 文件上传
    async handleUpload() {
      if (!this.uploadFile) {
        return;
      }
      try {
        // fragmentationUpload是否分片上传
        const { fragmentationUpload, fragmentationSize } = this.uploadConfig;
        this.uploading = true;
        const mergeArr = [];
        if (fragmentationUpload && this.uploadFile.size > fragmentationSize) {
          const data = await this.upload(this.uploadFile);
          mergeArr.push(data);
          const res = await axios({
            url: chunkMergeUploadUrl,
            method: "post",
            headers: {
              ...defaultTextParams.headers,
              Authorization: `Bearer ${getToken()}`,
            },
            data: mergeArr,
          });
          if (res.status === 200) {
            console.log("上传成功");
            console.log(res.data);
            // this.$message.success("上传成功")
            return res.data;
          } else {
            throw new Error(res.data.msg);
          }
        } else {
          return await this.handleSmallFilesUpload(this.uploadFile);
        }
      } catch (err) {
        this.uploading = false;
        console.log("上传失败");
        // this.$message.error("上传失败")
      } finally {
        this.uploading = false;
      }
    },
    // 非切片上传
    handleSmallFilesUpload(file) {
      const { name, uploadData, url, headers } = this.uploadConfig;
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append(name, file.raw);
        Object.keys(uploadData).forEach((k) => {
          formData.append(k, uploadData[k]);
        });
        axios({
          url,
          method: "post",
          headers: { ...headers, Authorization: `Bearer ${getToken()}` }, // 多界面退出重新登录时获取新的token
          data: formData,
        }).then((res) => {
          resolve(res.data);
          if (res.data && res.data.code === 200) {
            console.log("文件上传成功");
          } else {
            console.log("文件上传失败");
          }
        });
      });
    },
    //手动提交
    submitUpload() {
      this.$refs.upload.submit();
    },
    onPasteUpload(event) {
      // 粘贴上传
      let items = event.clipboardData && event.clipboardData.items;
      let file = null;
      let pasteFiles = [];
      if (items && items.length) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].kind == "file") {
            file = items[i].getAsFile();
            if (!file) {
              break;
            }
            pasteFiles.push(file);
          } else {
            return this.msgError("粘贴内容不是文件，请重新复制后粘贴");
          }
        }
      }
      if (!pasteFiles.length) {
        return;
      }
      const uploadRef = this.$refs.upload;
      uploadRef?.$refs["upload-inner"].uploadFiles(pasteFiles);
    },
    /** 点击其他按钮唤起上传事件 */
    handleUploadClick() {
      this.$refs["upload"].$refs["upload-inner"].handleClick();
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    // 切片上传
    async upload(file) {
      const { uploadData, headers } = this.uploadConfig;
      const chunkSize = 1024 * 1024; // 每个块的大小为 1MB
      const fileSize = file.size; // 文件大小
      const chunks = Math.ceil(fileSize / chunkSize); // 总块数
      const tasks = []; // 上传任务数组
      let uploaded = 0; // 己上传块数
      const uuid = this.uuid();
      // 文件切制
      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        tasks.push(
          new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("chunkNumber", i + 1); // 块编号
            formData.append("totalChunks", chunks); // 总块数
            formData.append("totalSize", fileSize); // 总大小
            // formData.append("chunkSize", chunkSize); // 	分块大小
            // formData.append("currentChunkSize", end - start); // 当前分块大小
            formData.append("id", file.uid); // 文件ID
            formData.append("identifier", uuid); // 文件ID
            formData.append("file", file.raw.slice(start, end)); // 块数据
            formData.append("filename", file.name); // 块数据
            axios({
              url: chunkFileUploadUrl,
              method: "post",
              headers,
              data: formData,
            })
              .then((res) => {
                uploaded++;
                this.uploadPercent = Math.floor((uploaded / chunks) * 100);
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
        );
      }
      // 待所有块上传完成后，发送合并请求
      await Promise.all(tasks);
      return {
        identifier: uuid,
        filename: file.name,
        ...uploadData,
      };
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
/deep/.hide .el-upload {
  display: none;
}
.en-uploader {
  .paste-content {
    .el-input {
      font-size: 12px;
    }
  }
  .el-upload__text {
    font-size: 12px;
  }
}
.uploader {
  /deep/.el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    border-radius: 4px;
    border: 1px solid rgba($color: #5094ff, $alpha: 0.6);
    display: flex;
    justify-content: center;
  }
  /deep/.el-upload:hover {
    border-color: $orange;
  }
  .pics {
    width: 178px;
    height: 178px;
    display: block;
  }
  .uploader-icon-container {
    align-self: center;
    .uploader-icon {
      font-size: 28px;
      color: #8b8b8b;
    }
  }
}
.card-uploader /deep/ {
  .el-upload--picture-card,
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
    line-height: 85px;
    margin-right: 18px;
  }
}
.paste-content {
  background-color: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  // height: 50px;
  display: inline-block;
  margin-bottom: 10px;
  // padding: 0 8px;
  line-height: 30px;
  cursor: pointer;
  .el-input {
    width: 280px;
    /deep/ .el-input__inner {
      border: 1px dashed #d9d9d9;
      text-align: center;
      &:hover,
      &:focus {
        border-color: #409eff;
      }
    }
  }
}
.upload-btn {
  width: 120px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  border: 1px solid #5094ff;
  font-size: 14px;
  color: #5094ff;
}

//type为text样式
/deep/.text-uploader {
  .el-upload-list {
    .el-upload-list__item {
      line-height: 20px;
      display: flex;
      .el-upload-list__item-status-label {
        display: none;
      }
      .el-icon-close {
        top: 0;
        right: 0;
        position: inherit;
        display: flex;
        align-self: center;
        color: #ff9d9d;
      }
      .el-upload-list__item-name {
        margin-right: 5px;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
    .el-upload-list__item:hover {
      background-color: #fff;
    }
  }
  .el-icon-document,
  .el-icon-close {
    font-family: "iconfont" !important;
    font-size: 14px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-icon-document:before {
    content: "\e629";
  }
  .el-icon-close:before {
    content: "\e628";
  }
  .el-icon-document {
    margin-right: 5px;
  }
  .el-upload-list__item-name:hover {
    color: #5094ff;
    .el-icon-document {
      color: #5094ff;
    }
  }
  .el-upload-dragger {
    width: 280px;
    height: 106px;
    .el-icon-upload {
      margin: 8px 0 12px;
    }
  }
}
</style>
