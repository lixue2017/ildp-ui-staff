<template>
  <ComDialog
    ref="editDialogRef"
    :customDialog="editDialogConfig"
    :confirmClose="!isSee"
    :dialogBoxCenter="true"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogFormRef"
        :formConfig="editFormConfig"
        :class="{ dialogForm: isSee, editWarehouse: mode_type == 0 }"
        v-if="$refs && $refs.editDialogRef && $refs.editDialogRef.dialogVisible"
      >
        <template v-slot:totalAcreage="slotProps">
          <el-input
            v-model="slotProps.formModel.totalAcreage"
            v-input-limit="{
              value: 2,
              FnLimt: (val) => {
                $refs &&
                  $refs.dialogFormRef.setFormModel({ totalAcreage: val });
              },
            }"
            :placeholder="slotProps.fieldItem.placeholder"
          />
        </template>

        <template v-slot:freightShelfId="slotProps">
          <el-input
            v-model="slotProps.formModel.freightShelfId"
            @change="(val) => handleChangeInp(val, 1)"
            :maxlength="slotProps.fieldItem.max"
            :placeholder="overseaLangObj.goods_shelves('排货架')"
          />
        </template>
        <template v-slot:rowNo="slotProps">
          <el-input
            v-model="slotProps.formModel.rowNo"
            @change="(val) => handleChangeInp(val, 2)"
            :placeholder="overseaLangObj.djp_floor || '几排'"
          />
          <!-- <el-input-number
						placeholder="几排"
						v-model="slotProps.formModel.rowNo"
						v-input-number-limit="0"
						:controls="false"
						@change="(val) => handleChangeInp(val, 2)"
					/> -->
        </template>
        <template v-slot:no="slotProps">
          <el-input
            v-model="slotProps.formModel.no"
            @change="(val) => handleChangeInp(val, 3)"
            :placeholder="overseaLangObj.ds_num || '多少号'"
          />
          <!--
					<el-input-number
						placeholder="多少号"
						v-model="slotProps.formModel.no"
						v-input-number-limit="0"
						:controls="false"
						@change="(val) => handleChangeInp(val, 3)"
					/> -->
        </template>

        <template
          v-for="(item, idx) in ['length', 'width', 'height']"
          v-slot:[item]="slotProps"
        >
          <div class="flex input-size" :key="idx">
            <el-input
              v-model="slotProps.formModel[item]"
              v-input-limit="{
                value: 2,
                FnLimt: (val) => {
                  $refs && $refs.dialogFormRef.setFormModel({ [item]: val });
                  handleChangeNum(val, item);
                },
              }"
              class="figure-type"
              :placeholder="slotProps.fieldItem.placeholder"
            >
              <!-- <template slot="append"> CM </template> -->
            </el-input>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>

<script>
import { updateWarehouse } from "@/api/basicInfo/warehouse";
import {
  partitionPost,
  partitionPut,
  locationPost,
  locationPut,
  locationTypePost,
  locationTypePut,
} from "@/api/warehouse/basic";
import { multiplicationFn } from "@/utils/instructions";
import { typeConversion } from "@/utils/index";
import {
  editFormCols,
  partitionFormCols,
  locationFormCols,
  locationTypeFormCols,
} from "./model";
export default {
  data() {
    return {
      editDialogConfig: {
        useFooter: "footer",
      },
      footerEditArr: [
        {
          text: this.overseaLangObj.qr_confirm(),
          type: "primary",
          handleClick: () => {
            this.$refs.dialogFormRef.submitForm();
          },
        },
      ],
      footerSeeArr: [
        {
          text: this.overseaLangObj.qx_cancel(),
          plain: true,
          handleClick: () => {
            this.$refs.editDialogRef.handleClose();
          },
        },
      ],
      editFormConfig: {
        formModel: {},
        httpRequest: this.editRequest, // 表单提交接口
      },
      mode_type: null,
      isSee: false, // 是否为查看状态
      warehouseId: "", //列表当前所在仓
    };
  },
  methods: {
    editShow(row, { mode_type, editSuccess, isSee }) {
      this.isSee = isSee;
      this.mode_type = mode_type;
      this.warehouseId = row.warehouseId;
      const titTxt =
        this.overseaLangObj.yu_yan_lang === "en-us"
          ? ""
          : isSee
          ? "查看"
          : "编辑";
      const titArr = [
        `${titTxt}仓库`,
        `${titTxt}${this.overseaLangObj.fq_gl("分区")}`,
        `${this.overseaLangObj.kw_gl("库位信息")}${titTxt}`,
        `${this.overseaLangObj.kw_lx("库位类型")}${titTxt}`,
      ];
      const dlgWidth = ["727px", "727px", "727px", "727px"];
      this.editDialogConfig = {
        ...this.editDialogConfig,
        title: titArr[mode_type],
        width: dlgWidth[mode_type],
        footer: isSee
          ? this.footerSeeArr
          : [...this.footerEditArr, ...this.footerSeeArr],
      };
      const locationCols = locationFormCols(
        (val) => {
          this.$refs.dialogFormRef?.setFormModel({
            warehouseName: val.warehouseName,
            warehouseId: val.warehouseId,
          });
        },
        isSee,
        this.warehouseId
      );
      const dlgFormConfig = [
        editFormCols(),
        partitionFormCols(isSee, row.id, this.warehouseId),
        locationCols,
        locationTypeFormCols(isSee, this.warehouseId),
      ][mode_type];
      let rowEdit = {};
      switch (mode_type) {
        case 0: // 仓库列表
          rowEdit = {
            ...(row.cusWarehouse || {}),
            id: row.id,
            apiId: row.apiId,
            apiName: row.apiName,
            dataStatus: row.dataStatus,
            warehouseId: row.warehouseId,
            nationName: row.nationName,
            nationTwoCode: row.nationTwoCode,
            warehouseCode: row.warehouseCode,
            platformType: row.platformType,
            type: typeConversion(row.cusWarehouse?.type),
          };
          break;
        case 1: // 分区管理
          rowEdit = {
            ...row,
            type: typeConversion(row.type),
          };
          break;
        case 2: // 库位管理
          rowEdit = {
            warehouseId: null, // 新增时默认值
            ...row,
            warehousePartitionId: {
              value: row.warehousePartitionId,
            },
            pickingFreightType: typeConversion(row.pickingFreightType),
          };
          break;
        default:
          rowEdit = row;
      }
      this.editFormConfig = {
        ...this.editFormConfig,
        labelWidth: [
          "95px",
          this.overseaLangObj.yu_yan_lang === "en-us" ? "132px" : "115px",
          this.overseaLangObj.yu_yan_lang === "en-us" ? "220px" : "95px",
          this.overseaLangObj.yu_yan_lang === "en-us" ? "162px" : "115px",
        ][mode_type],
        formModel: {
          // id: row.id,
          ...rowEdit,
        },
        successFunction: () => {
          editSuccess && editSuccess();
          this.$refs.editDialogRef.hide();
        },
        lists: [
          {
            className: `edit-dlg-form_${mode_type}`,
            fieldList: [
              {
                rows: [
                  {
                    cols: dlgFormConfig.columns,
                  },
                ],
              },
            ],
          },
        ],
        formRules: dlgFormConfig.formRules || {},
      };
      this.$refs.editDialogRef.show();
    },
    editRequest(formOpt) {
      let opt = {};
      switch (this.mode_type) {
        case 0:
          const {
            id,
            dataStatus,
            warehouseId,
            createBy,
            createTime,
            updateBy,
            updateTime,
            warehouseMainId,
            apiId,
            ...obj
          } = formOpt;
          opt = {
            id,
            apiId,
            dataStatus,
            warehouseId,
            cusWarehouse: {
              ...obj,
            },
          };
          return updateWarehouse(opt);
        case 1:
          opt = {
            ...formOpt,
          };
          if (formOpt.id) {
            return partitionPut(opt);
          }
          return partitionPost(opt);
        case 2:
          opt = {
            ...formOpt,
            warehousePartitionId: formOpt.warehousePartitionId?.value,
          };
          if (formOpt.id) {
            return locationPut(opt);
          }
          return locationPost(opt);
        default:
          opt = {
            ...formOpt,
          };
          if (formOpt.id) {
            return locationTypePut(opt);
          }
          return locationTypePost(opt);
      }
    },
    handleChangeInp(e, type) {
      const SHELF =
        this.$refs.dialogFormRef?.getFormModelVal("freightShelfId") || "";
      const ROW_NO = this.$refs.dialogFormRef?.getFormModelVal("rowNo") || "";
      const NO = this.$refs.dialogFormRef?.getFormModelVal("no") || "";
      let code = "";
      if (type === 1) {
        code = `${e || ""}.${ROW_NO}.${NO}`;
      }
      if (type === 2) {
        code = `${SHELF}.${e || ""}.${NO}`;
      }
      if (type === 3) {
        code = `${SHELF}.${ROW_NO}.${e || ""}`;
      }
      this.$refs.dialogFormRef?.setFormModel({
        code,
      });
    },
    handleChangeNum(e, type) {
      const CD_NUM = this.$refs.dialogFormRef?.getFormModelVal("length") || 0;
      const KD_NUM = this.$refs.dialogFormRef?.getFormModelVal("width") || 0;
      const GD_NUM = this.$refs.dialogFormRef?.getFormModelVal("height") || 0;
      const val = e || 0;
      let TJ_NUM = 0;
      if (type === "length") {
        TJ_NUM = multiplicationFn([val, KD_NUM, GD_NUM]);
      }
      if (type === "width") {
        TJ_NUM = multiplicationFn([val, CD_NUM, GD_NUM]);
      }
      if (type === "height") {
        TJ_NUM = multiplicationFn([val, CD_NUM, KD_NUM]);
      }
      // console.log('TJ_NUM==', TJ_NUM)
      // 这个有问题，cm到m³换算差距太大，保留4位小数显示不了
      this.$refs.dialogFormRef?.setFormModel({
        volume: this.toFixedNum(TJ_NUM / 1000000, 4),
      });
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .edit-dlg-form_1 {
    .el-radio {
      margin-right: 20px;
    }
  }
  .dialogForm .el-form-item {
    margin-bottom: 0;
  }
  .editWarehouse .form-item-txt {
    margin-bottom: 0;
  }
  .detail-address {
    margin-bottom: 10px;
  }
}
</style>
