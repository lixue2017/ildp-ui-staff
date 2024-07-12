<template>
  <div class="app-content-container">
    <ComDetailTop
      title="退仓编辑"
      class="title-sides-margin-none"
      :config="{}"
      ref="detailTopRef"
    />

    <ComForm v-if="isInitRes" ref="editFormRef" :formConfig="editFormConfig">
      <template v-for="sItem in ['trayId', 'kwId']" v-slot:[sItem]="slotProps">
        <AutoComplete
          :key="sItem"
          :formModel="slotProps.formModel"
          :fieldItem="slotProps.fieldItem"
          :additionalParam="{
            warehouseId: editBaseData.warehouseId,
          }"
        />
      </template>

      <template v-slot:tableData>
        <!-- <WmsGoodsTable ref="goodsTableRef" :formModel="formConfig.formModel" /> -->
        <div>
          <div class="base-flex-between table-title-btn">
            <div class="title-txt">货物信息</div>
            <el-button type="primary" size="small" @click="addContainerEvt">
              {{ overseaLangObj.xz_add("新 增") }}
            </el-button>
          </div>
          <ComTable
            :ref="`oTableRef`"
            :columnConfig="tableTabConfig()"
            :pagination="false"
            :columnData="[]"
            :rowOperationBtnListFn="(r) => tableStatusList(r)"
            @handleRowUpload="(r) => handleRowUpload(r)"
          >
            <template v-slot:customRow="{ slotProps }">
              <template v-for="(nItem, nIdx) in ['sku', 'num', 'remark']">
                <div
                  v-if="slotProps.prop === nItem"
                  :key="`n_${nIdx}`"
                  class="show-overflow-tooltip"
                >
                  <template v-if="!slotProps.row.rBtnUpdate">
                    {{ slotProps.row[nItem] || "--" }}
                  </template>
                  <template v-else>
                    <AutoComplete
                      v-if="nItem === 'sku'"
                      :formModel="slotProps.row"
                      :fieldItem="{
                        ...slotProps.column.fieldItem,
                        handle: (v, sObj) =>
                          handleSelectSku(slotProps.row, sObj),
                      }"
                    />

                    <el-input-number
                      v-if="nItem === 'num'"
                      v-model="slotProps.row[nItem]"
                      :placeholder="slotProps.column.label"
                      size="mini"
                      v-input-number-limit="{
                        value: 0,
                        maxNumber: 999999,
                      }"
                      :controls="false"
                      :min="1"
                    />

                    <el-input
                      v-if="nItem === 'remark'"
                      type="text"
                      size="mini"
                      v-model="slotProps.row[nItem]"
                      :placeholder="slotProps.column.label"
                      maxlength="200"
                    />
                  </template>
                </div>
              </template>
            </template>
          </ComTable>
        </div>
      </template>
    </ComForm>

    <ComUpload
      style="display: none"
      ref="uploadSchemeRef"
      :uploadConfig="uploadSchemeConfig"
      @handleSuccess="uploadSuccess"
    />

    <template v-if="isInitRes">
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <template v-for="(btn, index) in footBtnList">
          <el-button :type="btn.type" @click="btn.handleClick" :key="index">
            {{ btn.text }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { unKnownReturnPost, unKnownReturnDetail } from "@/api/warehouse/manage";
import { getAttachList } from "@/api/overseas/fbaOrder";
import { editPageTableColumns, unEditPageFormCols } from "./model";
import { mixinTableOperationRow } from "_comp/ComTable/tableOperation/rowOperationMixin.js";
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";

export default {
  mixins: [mixinTableOperationRow],
  data() {
    return {
      editFormConfig: {
        formModel: {
          packageType: "1", // 默认包裹
        },
        httpRequest: this.editPageRequest, // 表单提交接口
        successFunction: () => {
          this.msgSuccess("操作成功");
          this.reBack();
        }, // 表单提交成功回调
        labelWidth: "90px",
        lists: unEditPageFormCols().columns,
        formRules: unEditPageFormCols().formRules,
      },
      uploadSchemeConfig: {
        ...defaultTextParams,
        url: fileTypeUploadUrl,
        showFileList: false,
        accept: ".jpeg,.jpg,.png,.bmp",
        uploadData: {
          type: 250, // 附件类型
        },
      },
      footBtnList: [
        {
          text: "保 存",
          handleClick: () => this.handleEditSave(false),
        },
        {
          text: "保存并提交",
          handleClick: () => this.handleEditSave(true),
        },
        {
          text: "取 消",
          handleClick: this.reBack,
        },
      ],
      mixinOperationObj: {
        handleMixinCheckSaveFn: (row, saveFn) => {
          this.handleRowSave(row).then((sRes) => {
            saveFn && saveFn();
          });
        },
        saveCallBack: (row) => {
          delete row.isNewAdd;
          // console.log("==row", row);
        },
        delCallBack: (row) => {
          this.handleMixinDirectlyDel(row);
        },
      },
      editBaseData: {},
      isInitRes: false,
      isSubmit: false,
    };
  },
  methods: {
    addContainerEvt() {
      this.mixinAddTableOpnData([
        {
          isNewAdd: true,
          rBtnUpdate: true,
          attachList: [],
        },
      ]);
    },
    handleSelectSku(row, skuObj) {
      row.singleLength = skuObj.cusProduct?.productLength;
      row.singleWidth = skuObj.cusProduct?.productWidth;
      row.singleHeight = skuObj.cusProduct?.productHigh;
      this.$set(row, "customsCode", skuObj.customsCode);
      this.$set(row, "productNameCn", skuObj.productNameCn); // 更新视图层
    },
    handleRowUpload(r) {
      this.editBaseData.uploadRow = r; // 对象类型暂存, 保证上传后赋值到同一数据源
      // this.uploadSuccess({ data: [7938] });
      this.$refs.uploadSchemeRef?.handleUploadClick();
    },
    uploadSuccess(res) {
      // 上传后更新表格数据
      console.log("===2", res);
      if (res.data?.length) {
        getAttachList({ attachId: res.data.join(",") }).then((res) => {
          this.editBaseData.uploadRow.attachList.push(...(res.data || []));
        });
      }
    },
    handleRowSave(row) {
      const ruleObj = {
        ruleMsg: {
          num: "收货数量",
        },
        ruleCallBack: (r) => {
          if (r.attachList?.length) {
            return true;
          }
          this.msgError(`请上传图片`);
          return false;
        },
      };
      return this.handleMixinRowSave(row, null, ruleObj);
    },
    handleEditSave(isSubmit) {
      const goodsList = this.mixinTableDataArr || [];
      if (goodsList.length) {
        const isEditIndex = goodsList.findIndex((e) => e.rBtnUpdate);
        if (isEditIndex > -1) {
          return this.msgError("请先保存货物信息");
        }
        this.isSubmit = isSubmit;
        this.$refs.editFormRef?.submitForm();
      } else {
        this.msgError("请添加货物信息");
      }
    },
    editPageRequest() {
      let saveKeys = [
        "id",
        "trackSn",
        "kwId",
        "trayId",
        "warehousingTime",
        "remark",
        "packageType",
      ];
      const formObj = this.$refs.editFormRef?.saveFormParams(saveKeys);
      let opt = {
        ...formObj,
        submit: this.isSubmit, // 是否提交
        wmsId: this.editBaseData.warehouseId,
        items: (this.mixinTableDataArr || []).map((ele) => {
          return {
            id: ele.id,
            cpmId: ele.cpmId,
            num: ele.num,
            remark: ele.remark,
            attachId: (ele.attachList || []).map((f) => f.id).join(","),
          };
        }),
      };
      return unKnownReturnPost(opt);
    },
    getDetails() {
      const { id, warehouseId, trackSn } = this.$route.query;
      if (id) {
        this.isInitRes = false;
        unKnownReturnDetail(id).then((res) => {
          const { wmsId, items, customerClaimItems, ...resData } =
            res.data || {};
          this.editBaseData = { warehouseId: wmsId };
          this.editFormConfig.formModel = {
            ...resData,
            packageType: this.typeConversion(resData.packageType),
            kqKw: resData.kw ? `${resData.kq || "--"}${resData.kw || ""}` : "",
          };
          this.editFormConfig.afterMounted = () => {
            setTimeout(() => {
              this.setTableMixinData(items || []);
            }, 20);
          };
          this.isInitRes = true;
        });
      } else {
        if (warehouseId) {
          this.editBaseData = { warehouseId };
          if (trackSn) {
            this.editFormConfig.formModel = {
              packageType: "1",
              trackSn,
            };
            this.editFormConfig.lists = unEditPageFormCols(true).columns;
          }
          this.isInitRes = true;
        } else {
          this.msgError("请返回列表页选择当前仓库");
        }
      }
    },
    reBack() {
      this.$refs.detailTopRef?.comReBack();
    },
    tableStatusList(row) {
      return [
        ...this.mixinTableRowBtnArr().filter(
          (btn) => (btn.btnUpdate || false) === (row.rBtnUpdate || false)
        ),
      ];
    },
    tableTabConfig() {
      return editPageTableColumns();
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  // computed: {
  //   ...mapState(["dictionary"]),
  // },
  created() {
    this["dictionary/getDictionary"]([
      "warehousePartitionType",
      "packageType",
    ]).then(() => {
      this.getDetails();
    });
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    ComUpload: () => import("_comp/ComUpload"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
  .table-title-btn {
    padding: 10px 0;
    .title-txt {
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
