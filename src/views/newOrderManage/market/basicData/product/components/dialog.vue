<template>
  <ComDialog ref="customDialog" :customDialog="customDialogConfig.addOrEdit">
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="updateFormConfig"
        class="dialog-form"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
        @handleChange="handleChange"
      >
        <template v-slot:img>
          <el-upload
            class="avatar-uploader product-upload"
            ref="upload"
            name="avatarfile"
            :limit="1"
            accept=".jpeg, .jpg, .png, .bmp"
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="!!imgUrl"
          >
            <div v-if="imgUrl" class="avatar-img base-flex-center">
              <i class="del-icon el-icon-close" @click.stop="delImg"></i>
              <img class="img-url" :src="imgUrl" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div
              class="el-upload__tip product-upload-tip"
              style="color: #999"
              slot="tip"
            >
              大小不超过5M，支持jpg、png、bmp格式
            </div>
          </el-upload>
        </template>
        <template v-slot:priceImg>
          <el-upload
            class="avatar-uploader product-upload"
            ref="priceUploadRef"
            name="avatarfile"
            :limit="1"
            accept=".jpeg, .jpg, .png, .bmp"
            :headers="upload.headers"
            :action="upload.url"
            :show-file-list="false"
            :on-success="handlePriceSuccess"
            :before-upload="beforeAvatarUpload"
            :disabled="!!priceImgUrl"
          >
            <!-- <img v-if="priceImgUrl" :src="priceImgUrl" class="avatar" /> -->
            <div v-if="priceImgUrl" class="avatar-img base-flex-center">
              <i class="del-icon el-icon-close" @click.stop="delPriceImg"></i>
              <img class="img-url" :src="priceImgUrl" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div
              class="el-upload__tip product-upload-tip"
              style="color: #999"
              slot="tip"
            >
              大小不超过5M，支持jpg、png、bmp格式
            </div>
          </el-upload>
        </template>
        <template v-slot:singleBoxNum="slotProps">
          <div class="flex single-box-num">
            <el-input
              v-model="slotProps.formModel.singleBoxNum"
              :maxlength="9"
              v-input-limit="{
                value: 0,
                FnLimt: (val) => {
                  $refs && $refs.dialogForm.setFormModel({ singleBoxNum: val });
                  handleChangeNum(val, 'singleBoxNum');
                },
              }"
            />
            <el-tooltip
              effect="dark"
              content="如果以套/组为单位进行售卖，这个填写套/组的装箱数量。"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-slot:declaredValue="slotProps">
          <div class="flex input-slot">
            <el-input
              v-model="slotProps.formModel.declaredValue"
              class="input-slot-left figure-type"
              v-input-limit="{
                value: 2,
                FnLimt: (val) =>
                  $refs &&
                  $refs.dialogForm.setFormModel({ declaredValue: val }),
              }"
              :placeholder="slotProps.fieldItem.placeholder"
              :maxlength="11"
              @input.native="handleChange($event, 'declaredValue')"
            />
            <el-select
              slot="append"
              v-model="slotProps.formModel.declaredUnit"
              class="input-slot-right"
            >
              <el-option
                v-for="selectItem in unitList"
                :key="selectItem.value"
                :label="selectItem.key"
                :value="selectItem.value"
              ></el-option>
            </el-select>
            <span style="margin: 0 5px">/</span>
            <el-select
              v-model="slotProps.formModel.declaredNum"
              class="input-slot-single"
            >
              <el-option
                v-for="selectItem in slotProps.dicsList"
                :key="selectItem.value"
                :label="selectItem.label"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template>
        <template v-slot:productUnitPrice="slotProps">
          <div class="flex input-slot">
            <el-input-number
              v-model="slotProps.formModel.productUnitPrice"
              :min="0"
              :max="slotProps.fieldItem.max || 99999999.99"
              :controls="false"
              v-input-number-limit="slotProps.fieldItem.decimal || 2"
              class="input-slot-left figure-type"
            ></el-input-number>
            <el-select
              slot="append"
              v-model="slotProps.formModel.productPriceUnit"
              :placeholder="slotProps.fieldItem.placeholder"
              class="input-slot-right"
            >
              <el-option
                v-for="selectItem in unitList"
                :key="selectItem.value"
                :label="selectItem.key"
                :value="selectItem.value"
              ></el-option>
            </el-select>
          </div>
        </template>
        <!-- <template v-slot:productLength="slotProps">
          <div class="flex input-size">
            <span class="unit">长</span>
            <el-input
              v-model="slotProps.formModel.productLength"
              v-input-limit="{
                value: 2,
                maxNumber: slotProps.fieldItem.max,
                FnLimt: (val) =>
                  $refs &&
                  $refs.dialogForm.setFormModel({ productLength: val }),
              }"
              :maxlength="11"
              @input.native="handleChange($event, 'productLength')"
              class="figure-type"
            >
              <template slot="append"> CM </template>
            </el-input>
          </div>
        </template>
        <template v-slot:productWidth="slotProps">
          <div class="flex input-size">
            <span class="unit">宽</span>
            <el-input
              v-model="slotProps.formModel.productWidth"
              v-input-limit="{
                value: 2,
                maxNumber: slotProps.fieldItem.max,
                FnLimt: (val) =>
                  $refs && $refs.dialogForm.setFormModel({ productWidth: val }),
              }"
              :maxlength="11"
              class="figure-type"
              @input.native="handleChange($event, 'productWidth')"
            >
              <template slot="append"> CM </template>
            </el-input>
          </div>
        </template>
        <template v-slot:productHigh="slotProps">
          <div class="flex input-size">
            <span class="unit">高</span>
            <el-input
              v-model="slotProps.formModel.productHigh"
              v-input-limit="{
                value: 2,
                maxNumber: slotProps.fieldItem.max,
                FnLimt: (val) =>
                  $refs && $refs.dialogForm.setFormModel({ productHigh: val }),
              }"
              :maxlength="11"
              @input.native="handleChange($event, 'productHigh')"
              class="figure-type"
            >
              <template slot="append"> CM </template>
            </el-input>
          </div>
        </template> -->
        <template v-slot:productBox="slotProps">
          <div class="flex input-size">
            <span class="unit">{{ slotProps.fieldItem.title }}</span>
            <el-input
              v-model="slotProps.formModel[slotProps.fieldItem.prop]"
              v-input-limit="{
                value: 2,
                maxNumber: slotProps.fieldItem.max,
                FnLimt: (val) =>
                  $refs &&
                  $refs.dialogForm.setFormModel({
                    [slotProps.fieldItem.prop]: val,
                  }),
              }"
              :maxlength="11"
              @input.native="handleChange($event, slotProps.fieldItem.prop)"
              class="figure-type"
            >
              <template slot="append"> CM </template>
            </el-input>
          </div>
        </template>
        <template v-slot:battery="slotProps">
          <el-checkbox
            v-for="selectItem in updateFormConfig.typeList"
            :key="selectItem.value"
            :label="selectItem.label"
            v-model="slotProps.formModel[selectItem.label]"
          >
            {{ selectItem.value }}
          </el-checkbox>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import {
  updateColumns,
  addTpList,
  formRules,
  linkageFormRules,
  overseasFormRules,
} from "./model";
import { mapActions, mapState } from "vuex";
import { addProductInfo, updateProductInfo } from "@/api/basicInfo/product";
import { getToken } from "@/utils/auth";
import { querySearchList } from "@/api/common";
import { multiplicationFn } from "@/utils/instructions";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      customDialogConfig: {
        addOrEdit: {
          title: "产品信息",
          type: "add",
          width: "1230px",
          dataStatus: 0,
          appendToBody: this.appendToBody,
          useFooter: "footer",
          footer: [
            {
              text: "取消",
              plain: true,
              handleClick: () => {
                // this.$emit("onSuccess", {
                //   cusProductId: 10441,
                //   id: 5010,
                // });
                this.$refs.customDialog.handleClose();
              },
            },
            {
              text: "保存并启用",
              type: "primary",
              handleClick: () => {
                const { id, dataStatus } = this.updateFormConfig.formModel;
                if (id && dataStatus === 0) {
                  // 修改时添加一个属性，后台用来区分操作状态
                  this.$refs.dialogForm?.setFormModel(
                    { enableStatus: 1 },
                    true,
                    true
                  );
                }
                if (this.checkProductSize()) {
                  this.customDialogConfig.addOrEdit.dataStatus = 1;
                  this.$refs.dialogForm.submitForm();
                }
              },
            },
            {
              text: "暂存",
              type: "primary",
              hide: this.appendToBody,
              handleClick: () => {
                if (this.checkProductSize()) {
                  this.customDialogConfig.addOrEdit.dataStatus = 0;
                  this.$refs.dialogForm.submitForm();
                }
              },
            },
          ],
        },
      },
      updateFormConfig: {
        labelWidth: "110px",
        size: "small",
        formModel: {},
        httpRequest: this.addOrEditProductInfo,
        successFunction: this.handleSuccess, // 表单提交成功回调
        lists: updateColumns,
        formRules: {},
        typeList: addTpList,
      },
      upload: {
        // 是否禁用上传
        // isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/customer/upload/avatar",
      },
      imgUrl: "",
      picsUrl: "",
      priceImgUrl: "",
      priceUrl: "",
      unitList: [],
      temp_row: {},
    };
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    async showDialog(type, row = {}) {
      // 获取电池类型(batteryType) / 单价单位(declaredUnit)
      await this["dictionary/getDictionary"](["batteryType", "declaredUnit"]);
      // console.log("rows==", row);
      // console.log(type);
      this.temp_row = row || {};
      querySearchList({
        type: "currency",
        pageNum: 1,
        pageSize: 999,
      }).then((res) => {
        this.unitList = (res.rows || []).map((item) => {
          return {
            label: item.code,
            value: item.code,
          };
        });
        this.updateFormConfig.formRules = formRules(type);
        this.customDialogConfig.addOrEdit.type = type;
        let columns = this.updateFormConfig.lists[0].fieldList[0].rows[0];
        const indexList = [0, 1, 2, 3, 4, 5, 7]; // 产品SKU,HS CODE,产品型号,申报产品品名(CN),单箱净重,申报产品品名(EN),申报单价编辑时不可编辑
        const fIndex = columns.cols.findIndex((e) => e.id === "productType");
        const { sku, electrified, magnetic, liquid, fragile, dataStatus } = row;
        if (type === "edit") {
          // this.customDialogConfig.addOrEdit.title = `产品信息(${sku})`;//测试说不要DIALOG弹出框左上角的SKU信息
          indexList.forEach((item) => (columns.cols[item].type = "txt"));
          // columns.cols[fIndex].render = (row) => row["productTypeName"];
          if (dataStatus === 1) {
            this.customDialogConfig.addOrEdit.footer[2].hide = true;
            this.customDialogConfig.addOrEdit.footer[1].text = "确定";
          } else {
            this.customDialogConfig.addOrEdit.footer[2].hide = false;
            this.customDialogConfig.addOrEdit.footer[1].text = "保存并启用";
          }
        } else {
          indexList.forEach(
            (item) =>
              (columns.cols[item].type =
                columns.cols[item].id === "declaredValue" ? "slot" : "text")
          );
          // columns.cols[fIndex].type = "autocomplete";
          this.customDialogConfig.addOrEdit.footer[2].hide = false;
          this.customDialogConfig.addOrEdit.footer[1].text = "保存并启用";
        }
        if (type === "add") {
          columns.cols[fIndex].autoPageSize = 10;
          if (dataStatus === 1) {
            this.customDialogConfig.addOrEdit.footer[2].hide = true;
            this.customDialogConfig.addOrEdit.footer[1].text = "确定";
          } else {
            this.customDialogConfig.addOrEdit.footer[2].hide = false;
            this.customDialogConfig.addOrEdit.footer[1].text = "保存并启用";
          }
          this.picsUrl = this.imgUrl = "";
          this.priceUrl = this.priceImgUrl = "";
          // row.inlandExportParam = true;
          this.updateFormConfig.formModel = {
            declaredUnit:
              this.unitList && this.unitList[0] && this.unitList[0].value,
            declaredNum: "0",
            electrified: true,
            magnetic: true,
            liquid: true,
            fragile: true,
            inlandExportParam: row.inlandExportParam || true,
            productUnitPrice: undefined,
          };
        } else {
          columns.cols[fIndex].autoPageSize = 10;
          // columns.cols[fIndex].autoPageSize = 998;
          this.picsUrl = this.imgUrl = row.img;
          this.priceUrl = this.priceImgUrl = row.priceImg;
          row.inlandExportParam = !!row.inlandExportParam;
          row.foreignExportParam = !!row.foreignExportParam;
          this.updateFormConfig.formModel = {
            ...row,
            electrified: electrified ? true : false,
            magnetic: magnetic ? true : false,
            liquid: liquid ? true : false,
            fragile: fragile ? true : false,
          };
        }
        this.updateFormConfig.afterMounted = () => {
          this._linkageVerification(
            row.inlandExportParam == undefined ? true : row.inlandExportParam,
            "inlandExportParam"
          );
          this._linkageVerification(
            row.foreignExportParam,
            "foreignExportParam"
          );
        };
        this._productAttributes(row.productAttribute);
        this.$refs.customDialog.show();
      });
    },
    addOrEditProductInfo(formModel) {
      let params = { ...formModel };
      if ([0, "0"].includes(formModel.productAttribute)) {
        // 普货
        Object.assign(params, {
          magnetic: false,
          liquid: false,
          fragile: false,
          electrified: false,
        });
      }
      if (!params.electrified) {
        // 电池类型
        params.electrifiedType = "";
      }
      params.dataStatus = this.customDialogConfig.addOrEdit.dataStatus;
      params.electrified = params.electrified ? 1 : 0;
      params.magnetic = params.magnetic ? 1 : 0;
      params.liquid = params.liquid ? 1 : 0;
      params.fragile = params.fragile ? 1 : 0;
      params.img = this.picsUrl;
      params.priceImg = this.priceUrl;
      params.inlandExportParam = params.inlandExportParam ? 1 : 0;
      params.foreignExportParam = params.foreignExportParam ? 1 : 0;
      params.id = params.cusProductMainId;

      if (this.customDialogConfig.addOrEdit.type === "edit") {
        delete params.cusProduct;
        return updateProductInfo(params);
      }
      const { customerId } = this.temp_row;
      if (!!customerId) {
        params.addSource = 2; // 员工端新增SKU
				params.dataStatus = 3; // 需要客户端维护
        params.customerId = customerId;
      }
      return addProductInfo(params);
    },
    handleSuccess(res) {
      this.$refs.customDialog.hide();
      this.$emit("onSuccess", res?.data || {});
    },
    delImg() {
      this.picsUrl = this.imgUrl = "";
      this.$refs.dialogForm?.setFormModel({ img: "" });
      this.$refs.dialogForm?.$refs.myForm?.clearValidate("img");
      this.$refs.upload?.uploadFiles.splice(-1, 1);
    },
    // 文件上传中处理
    handleAvatarSuccess(res, file) {
      if (res.imgUrl) {
        this.imgUrl = URL.createObjectURL(file.raw);
        this.picsUrl = res.imgUrl;
        this.$refs.dialogForm?.setFormModel({ img: res.imgUrl });
        this.$refs.dialogForm?.$refs.myForm?.clearValidate("img");
      } else {
        this.msgError(res.msg || "上传图片只能是 JPG、JPEG、PNG、BMP 格式!");
        this.$refs.upload?.uploadFiles.splice(-1, 1);
      }
    },
    delPriceImg() {
      this.priceUrl = this.priceImgUrl = "";
      this.$refs.priceUploadRef?.uploadFiles.splice(-1, 1);
    },
    // 定价截图文件上传中处理
    handlePriceSuccess(res, file) {
      if (res.imgUrl) {
        this.priceImgUrl = URL.createObjectURL(file.raw);
        this.priceUrl = res.imgUrl;
      } else {
        this.msgError(res.msg || "上传图片只能是 JPG、JPEG、PNG、BMP 格式!");
        this.$refs.priceUploadRef?.uploadFiles.splice(-1, 1);
      }
    },
    beforeAvatarUpload(file) {
      const types = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];
      const isImage = types.includes(file.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG、BMP 格式!");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isImage && isLt5M;
    },
    handleChangeNum(e, type) {
      // 单箱净重= 产品毛重*箱子里面的产品数量
      const productNum =
        this.$refs.dialogForm?.getFormModelVal("productWeight") || 0;
      const singleNum =
        this.$refs.dialogForm?.getFormModelVal("singleBoxNum") || 0;
      const netWeight = type === "productWeight" ? singleNum : productNum;
      this.$refs.dialogForm?.setFormModel({
        singleBoxNetWeight: multiplicationFn([e, netWeight]),
      });
    },
    handleChange(e, type) {
      if (type === "productWeight") {
        this.handleChangeNum(e, type);
      }
      if (type === "inlandExportParam" || type === "foreignExportParam") {
        this._linkageVerification(e, type);
        return;
        const isInland =
          this.$refs.dialogForm?.getFormModelVal("inlandExportParam");
        const isForeign =
          this.$refs.dialogForm?.getFormModelVal("foreignExportParam");
        if (!isInland && !isForeign) {
          this.$message({
            message: "国内出口与海外仓服务 至少选择一种类型",
            type: "warning",
          });
          this.$refs.dialogForm?.setFormModel({ [`${type}`]: true });
        } else {
          this._linkageVerification(e, type);
        }
      }
      if (
        [
          "productLength",
          "productWidth",
          "productHigh",
          "declaredValue",
        ].includes(type)
      ) {
        const val = e.target?.value || 0;
        if (val > 99999999.99) {
          this.$refs.dialogForm?.setFormModel({ [type]: 99999999.99 });
        }
        return;
      }
      if (type === "productAttribute") {
        this._productAttributes(e);
      }
      if (["materialEn", "declaredNameEn", "businessUseEn"].includes(type)) {
        const nEnVal = e?.replace(/[\u4e00-\u9fa5]/gi, "");
        this.$refs.dialogForm?.setFormModel({ [type]: nEnVal });
        // if (type === "declaredNameEn") {
        //   e.target.value = e.target?.value.replace(
        //     /[0-9~`@#$%^&*()_+-=,./?><|\\！￥……（）——“：‘；、？。，》《·【】\{\}\[\]]/gi,
        //     ""
        //   );
        // }
      }
      if (type === "electrified") {
        this.$refs.dialogForm?.setFormModel({ electrifiedType: "" });
      }
    },

    _linkageVerification(e, type) {
      // 国内出口 / 海外仓服务
      const changeRules =
        type === "inlandExportParam" ? linkageFormRules : overseasFormRules;
      if (e) {
        this.$refs.dialogForm?.setFormRules(changeRules);
      } else {
        this.$refs.dialogForm?.setFormRules({}, Object.keys(changeRules));
      }
    },
    checkProductSize() {
      const fData = this.$refs.dialogForm?.getFormParams();
      if (fData.foreignExportParam) {
        const numSize = multiplicationFn([
          fData.productLength,
          fData.productWidth,
          fData.productHigh,
        ]);
        if (!numSize) {
          this.msgError("请输入大于零的产品尺寸长、宽、高");
          return false;
        }
      }
      return true;
    },
    _productAttributes(e) {
      // 产品属性
      let columns_1 = this.updateFormConfig.lists[0].fieldList[0].rows[0];
      const index_1 = columns_1.cols.findIndex((e) => e.id === "battery");
      const index_2 = columns_1.cols.findIndex((e) => e.id === "electrified");
      const index_3 = columns_1.cols.findIndex(
        (e) => e.id === "electrifiedType"
      );
      if (!e) {
        columns_1.cols[index_1].type = "none";
        columns_1.cols[index_2].type = "none";
        columns_1.cols[index_3].type = "none";
      } else {
        columns_1.cols[index_1].type = "slot";
        columns_1.cols[index_2].type = "singleCheckbox";
        columns_1.cols[index_3].type = "select";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.custom-dialog {
  /deep/ .el-dialog__body {
    padding: 20px 20px 0;
  }
}
/deep/ {
  .form-left {
    width: calc(100% - 360px);
  }
  .form-right {
    width: 360px;
  }
  .el-form-item--small .el-form-item__content {
    height: auto !important;
  }
  .el-dialog {
    margin: 0 auto 0;
  }
  .el-checkbox {
    font-size: 14px;
    color: #353a41;
    font-weight: 700;
  }
  .electrified-check {
    .el-form-item--small.el-form-item {
      margin-bottom: 0 !important;
      margin-top: 0;
    }
    .el-form-item__content {
      min-height: auto !important;
    }
    .el-checkbox {
      position: absolute;
      left: 80px;
    }
  }
  .battery-check {
    .el-checkbox {
      margin-right: 26px;
    }
    .el-checkbox:nth-of-type(3) {
      margin-right: 0;
    }
  }
}
.dialog-form {
  padding: 10px 20px !important;
}
// /deep/ .price-img-box {
//   margin-top: 52px;
// }
/deep/ .inland-export-col {
  &.el-col {
    & > .inland-export-col {
      margin-top: 20px;
      border-bottom: #cccccc 1px dashed;
      .el-form-item__label {
        font-size: 14px;
        color: #515151;
        font-weight: 700;
      }
      .el-form-item__content {
        padding-left: 264px;
      }
      .el-checkbox {
        font-weight: 400;
      }
    }
  }
}
/deep/ .foreign-export-col {
  &.el-col {
    padding-top: 2px;
    & > .foreign-export-col {
      border-bottom: #cccccc 1px dashed;
      margin-left: 50px;
      .el-form-item__label {
        font-size: 14px;
        color: #515151;
        font-weight: 700;
        text-align: left;
      }
      .el-form-item__content {
        text-align: right;
      }
      .el-checkbox {
        font-weight: 400;
      }
    }
  }
}
.avatar-uploader {
  &.product-upload {
    position: relative;
    height: 145px;
    .product-upload-tip {
      position: absolute;
      left: -100px;
      top: 30px;
      width: 91px;
      line-height: 17px;
    }
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
  border-radius: 4px;
  border: 1px solid rgba(188, 188, 188, 0.6);
}
.avatar-img {
  position: relative;
  width: 145px;
  height: 145px;
  border-radius: 4px;
  border: 1px solid rgba(188, 188, 188, 0.6);
  .img-url {
    max-width: 100%;
    max-height: 100%;
  }
  .del-icon {
    position: absolute;
    font-size: 20px;
    right: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.5);
    color: $orange;
  }
}

.message-class {
  display: flex;
  align-items: center;

  i {
    font-size: 20px;
    margin-right: 11px;
  }
}

.single-box-num {
  align-items: center;
  /deep/ .el-icon-question {
    padding-left: 5px;
    font-size: 18px;
    cursor: pointer;
    color: #bcbcbc;
  }
}

.input-slot {
  /deep/ {
    .el-select .el-input {
      &.is-focus {
        .el-input__inner {
          // border-left: none;
        }
      }

      .el-input__inner {
        background: #f4f4f4;

        &:hover,
        &:focus {
          border-color: #bcbcbc;
        }
      }
    }
    .input-slot-left {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }
    }
    .input-slot-center {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 0;
      }
    }
    .input-slot-right {
      .el-select .el-input .el-input__inner,
      .el-input__inner {
        border-radius: 0 4px 4px 0;
        width: 70px;
      }
    }
    &.is-focus {
      .input-slot-single .el-input__inner {
        border-left-color: #bcbcbc;
        &:hover,
        &:focus,
        &:active {
          border-color: #bcbcbc;
        }
      }
    }
    .input-slot-single .el-input__inner {
      border-left-color: #bcbcbc;
      border-radius: 4px;
      width: 60px;
    }
  }
}
.unit {
  margin-right: 10px;
}
.figure-type .el-input__inner {
  padding: 0 0 0 15px;
}

/deep/.el-input.is-disabled .el-input__inner {
  background-color: #f8f8f8;
  color: #999;
  padding: 0 15px;
  border-radius: 4px 0 0 4px;
  border: 1px solid #bcbcbc;
}
</style>
