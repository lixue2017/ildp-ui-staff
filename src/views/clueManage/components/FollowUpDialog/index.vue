<template>
  <div>
    <ComDialog ref="customDialog" :customDialog="customDialogConfig">
      <template v-slot:content>
        <ComForm
          ref="dialogForm"
          :formConfig="{
            ...formConfig,
            ...config({
              followTask,
              type: taskType,
              isEdit: formConfig.formModel.id,
              isAttendanceTask,
            }),
          }"
          class="dialog-form"
          v-if="$refs.customDialog && $refs.customDialog.dialogVisible"
          @handleChange="handleChange"
        >
          <template v-slot:remindUserIds="slotProps">
            <AutoComplete
              ref="autoCompleteRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                httpRequest: (params) =>
                  getRemindUserList(params, slotProps.fieldItem.httpRequest),
              }"
            />
          </template>
          <template v-slot:remark="slotProps">
            <quill-editor
              v-model="slotProps.formModel.remark"
              class="editor"
              ref="quillEditorRef"
              :options="editorOption"
              @change="onEditorChange($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            >
            </quill-editor>
          </template>
          <template v-slot:businessId="slotProps">
            <AutoComplete
              ref="autoCompleteRef"
              :formModel="slotProps.formModel"
              :fieldItem="{
                ...slotProps.fieldItem,
                disabled: !!businessType || isTask,
              }"
              :additionalParam="{ businessType }"
              defaultKey="businessId"
              @handleChange="(val) => handleChange(val, 'businessId')"
            />
          </template>
          <template v-slot:address="slotProps">
            <div class="text-theme-color address" @click="handleReload">
              <el-button
                :loading="loading"
                type="text"
                v-if="loading"
              ></el-button>
              <template v-else>
                <span v-if="slotProps.formModel.address && showAddress">{{
                  slotProps.formModel.address
                }}</span>
                <template v-else>
                  <i class="el-icon-location"></i><span>签到</span>
                </template>
              </template>
              <baidu-map
                v-if="showAddress"
                class="map"
                @ready="handlerGeolocation"
                ak="55rdq07VZjzCCZmSa5zrLVeeDBr0aSBI"
              >
              </baidu-map>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDialog>
    <el-upload
      ref="uploadRef"
      name="attachFile"
      :limit="5"
      :accept="
        isLink
          ? '.pdf,.doc,.docx,.xls,.xlsx,.rar,.zip'
          : '.jpeg,.jpg,.png,.bmp,.svg'
      "
      :headers="upload.headers"
      :action="upload.url"
      :before-upload="handleBeforeUpload"
      :on-success="handleFileSuccess"
      :auto-upload="true"
      drag
      v-show="false"
    >
      <el-button ref="uploadBtnRef" size="small" type="primary"
        >点击上传</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import { config } from "./model";
import {
  getFollowInfo,
  saveOrUpdateFollow,
} from "@/api/clueManage/followUpRecords.js";
import { followUpTask } from "@/api/clueManage/taskRecord.js";
import { quillEditor } from "vue-quill-editor";
import { getToken } from "@/utils/auth";
import { BaiduMap } from "vue-baidu-map";

export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    quillEditor,
    BaiduMap,
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      taskType: false,
      customDialogConfig: {
        title: "新建跟进",
        width: "750px",
        center: true,
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "提 交",
            type: "primary",
            handleClick: () => {
              this.$refs.dialogForm.submitForm();
            },
          },
          {
            text: "取 消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
            },
          },
        ],
      },
      config,
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        labelWidth: "100px",
      },
      followTask: false,
      editorOption: {
        placeholder: "勤跟进，多签单",
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              ["image", "link"], // 链接、图片，需要视频的可以加上video
            ],
            handlers: {
              //此处是图片上传时候需要使用到的
              image: (value) => {
                if (value) {
                  // 点击图片
                  this.isLink = false;
                  this.$nextTick(() => {
                    const ref = this.$refs.uploadBtnRef;
                    ref.$el.click();
                  });
                }
              },
              //此处是图片上传时候需要使用到的
              link: (value) => {
                if (value) {
                  // 点击图片
                  this.isLink = true;
                  this.$nextTick(() => {
                    const ref = this.$refs.uploadBtnRef;
                    ref.$el.click();
                  });
                }
              },
            },
          },
          // imageDrop: true, // 图片拖拽
          // imageResize: {
          //   // 图片放大缩小
          //   displayStyles: {
          //     backgroundColor: "black",
          //     border: "none",
          //     color: "white",
          //   },
          //   modules: ["Resize", "DisplaySize", "Toolbar"],
          // },
        },
      },
      isLink: false,
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/crm/attach/upload",
      },
      businessType: undefined,
      showAddress: true,
      loading: true,
      isAttendanceTask: false, // 是否签到跟进
      isTask: false, // 是否任务跟进
    };
  },
  methods: {
    handlerGeolocation({ BMap, map }) {
      let geolocation = new BMap.Geolocation();
      const that = this;
      geolocation.getCurrentPosition(
        function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            let mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);

            // 获取当前位置的详细地址
            let geocoder = new BMap.Geocoder();
            geocoder.getLocation(r.point, function (rs) {
              let addComp = rs.addressComponents;
              let { lat, lng } = rs.point;
              let address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
              that.$refs.dialogForm.setFormModel({
                address,
                latitude: lat,
                longitude: lng,
              });
              that.loading = false;
            });
          } else {
            alert("failed" + this.getStatus());
            that.loading = false;
          }
        },
        { enableHighAccuracy: true }
      );
    },
    submitFormRequest(formModel) {
      if (this.isTask) return followUpTask(formModel);
      return saveOrUpdateFollow(formModel);
    },
    async show(row = {}, isTask) {
      let data = row || {};
      this.isTask = !!isTask;
      if (!isTask && row.id) {
        data = (await getFollowInfo(row.id))?.data || {};
      }
      if (isTask && row.attendance) {
        this.isAttendanceTask = true;
      }
      const {
        type,
        businessType,
        followTask,
        salesLeadsState,
        taskReminder,
        taskRemindWays,
        businessName,
        customerName,
        remindUsers,
        latitude,
        longitude,
        address,
        ...obj
      } = data;
      this.taskType = [1, "1"].includes(type); // 1：上门拜访显示签到
      this.businessType = businessType;
      this.formConfig.formModel = {
        ...obj,
        address,
        latitude,
        longitude,
        remindUserIds: (remindUsers || []).map((item) => item.userId),
        remindUsers,
        businessType,
        businessName: businessName || customerName,
        type: this.typeConversion(type),
        followTask: !!followTask,
        salesLeadsState: this.typeConversion(salesLeadsState),
        taskReminder: this.typeConversion(taskReminder || 1),
        taskRemindWays: (taskRemindWays || [1]).map((i) =>
          this.typeConversion(i)
        ),
      };
      this.customDialogConfig.title = isTask
        ? "任务跟进"
        : row.id
        ? "编辑跟进"
        : "新建跟进";
      this.$refs.customDialog.show();
    },
    getRemindUserList(params, httpRequest) {
      if (params.userId) {
        return Promise.resolve({
          rows: this.formConfig.formModel.remindUsers || [],
          total: (this.formConfig.formModel.remindUsers || []).length,
        });
      }
      return httpRequest(params);
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    handleChange(val, type) {
      if (type === "followTask") {
        this.followTask = val;
        this.$nextTick(() => {
          this.$refs.dialogForm.renewForm();
        });
      } else if (type === "type") {
        const bool = [1, "1"].includes(val);
        if (this.taskType !== bool) {
          this.taskType = [1, "1"].includes(val); // 1：上门拜访显示签到
          this.$nextTick(() => {
            this.$refs.dialogForm.renewForm();
          });
        }
      } else if (type === "businessId") {
        const { businessType } = val || {};
        this.$refs.dialogForm.setFormModel({
          businessType,
        });
      }
    },
    handleFileSuccess(response, file, fileList) {
      const quill = this.$refs.quillEditorRef.quill;
      const length = quill.getSelection().index;
      const { msg } = response; // msg:地址
      let lastSelection = 1;
      if (this.isLink) {
        const arr = msg.split("/");
        const filename = arr[arr.length - 1];
        // 插入链接
        quill.insertText(length, filename, "link", msg);
        lastSelection = filename.length;
      } else {
        // 插入图片
        quill.insertEmbed(length, "image", msg);
      }
      // 调整光标到最后
      quill.setSelection(length + lastSelection);
    },
    handleBeforeUpload(file) {
      if (file.size > 20 * 1024 * 1024) {
        this.$alert(
          `上传${this.isLink ? "文件" : "图片"}大小不超过20M`,
          "提示"
        );
        return false;
      }
    },
    onEditorReady(data) {
      //编辑器初始化,也可以选择在这编辑样式
    },
    onEditorFocus(e) {
      //编辑器聚焦
      // e.enable(false);
    },
    onEditorChange(data) {
      //编辑器内容改变
      this.$nextTick(() => {
        // 限制输入1000
        data.quill.deleteText(1000, 4);
      });
    },
    handleReload() {
      this.loading = true;
      this.showAddress = false;
      this.$nextTick(() => {
        this.showAddress = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.editor {
  height: 140px;
  /deep/ {
    .ql-container {
      height: 90px;
    }
  }
}
.address {
  cursor: pointer;
  i {
    font-size: 16px;
  }
}
</style>
