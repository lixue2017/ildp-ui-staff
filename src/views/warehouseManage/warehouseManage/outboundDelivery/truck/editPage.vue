<template>
  <div class="app-content-container">
    <ComDetailTop
      :title="`${overseaLangObj.kc_info || '卡车信息'} ${
        editFormConfig.formModel.code
          ? `(${editFormConfig.formModel.code})`
          : ''
      }`"
      :config="{}"
      class="title-sides-margin-none"
      ref="detailTopRef"
    />
    <template v-if="isInitRes">
      <ComForm ref="editFormRef" :formConfig="editFormConfig">
        <template v-slot:bsRef="slotProps">
          <el-input v-model="slotProps.formModel.bsRef" @change="handleChangeBsRef" :placeholder="slotProps.fieldItem.placeholder"></el-input>
        </template>
      </ComForm>

      <EditTableView
        ref="tableViewRef"
        v-if="editFormConfig.formModel.id"
        :formData="editFormConfig.formModel"
        @cancelEvt="cancelEvt"
      />
      <AddTableView
        ref="tableViewRef"
        v-else
        :formData="editFormConfig.formModel"
      />
    </template>

    <template>
      <div class="footer-seize-seat"></div>
      <div class="order-footer">
        <el-button
          type="primary"
          v-if="!isSee && isInitRes"
          @click="submitForm"
        >
          {{ overseaLangObj.bc_save("保 存") }}
        </el-button>
        <el-button type="info" @click="cancelEvt">
          {{ overseaLangObj.bc_close(isSee ? "返 回" : "取 消") }}
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getTruckDeliveryInfo,
  postTruckDeliverySave,
  putPlanTruckCargo,
  POSTDistributionTruckInfo
} from "@/api/warehouse/manage";
import { mapActions } from "vuex";
import { comSaveRepeatedRequest } from "@/api/common";
import { multipleTruckFormCols, editFormRules } from "./model";
import { mixinEditCache } from "@/views/ComMixins/editPageCache.js";
import { msgBox } from "@/utils/confirmBox.js";
export default {
  name: "TruckOutboundEdit",
  mixins: [mixinEditCache],
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("保存成功"));
          this.cancelEvt();
        }, // 表单提交成功回调
        labelWidth:
          this.overseaLangObj.yu_yan_lang === "en-us" ? "102px" : "85px",
        formRules: editFormRules,
      },
      tableList: [],
      isSee: false,
      isInitRes: false, // 是否完成初始化
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      this.tableList = this.$refs.tableViewRef.getTableData();
      if (!this.tableList) {
        // 子组件中有校验不通过
        return;
      }
      if (this.tableList.length) {
        this.$refs.editFormRef?.submitForm();
      } else {
        this.msgError("请添加货物信息");
      }
    },
    editFormSubmit() {
      let opt = this.$refs.editFormRef?.saveFormParams([
        "id",
        "amazonAppintmentId",
        "bsRef",
        "loadIn",
        "scheduledTime",
        "expressCompanyId",
        "pickupTime",
      ]);
      if (this.editFormConfig.formModel.routePageLocation === 2) {
        // 派卡车编辑
        return comSaveRepeatedRequest(putPlanTruckCargo, opt);
      } else {
        // 新增
        opt.itemList = this.tableList.map((e) => {
          return {
            // batchTag: e.batchTag,
            id: e.id,
            num: e.num,
            pltNum: e.pltNum,
            // truckId: e.truckId
          };
        });
        opt.planTrayRefIdList = (
          this.$refs.tableViewRef.selectionRows || []
        ).map((e) => e.id);
        return comSaveRepeatedRequest(postTruckDeliverySave, opt);
      }
    },
    initTruckDelivery() {
      const { id, pageLocation } = this.$route.query;
      getTruckDeliveryInfo({ id, pageLocation }).then((res) => {
        this.editFormConfig.formModel = {
          ...(res.data || {}),
          routeId: `${id}`, // 转为String类型
          routePageLocation: Number(pageLocation || 2),
          isWebSee: this.isSee,
        };
        this.isInitRes = true;
      });
    },
    mixinInitData() {
      const { isSee } = this.$route.query;
      this.isSee = isSee;
      this.editFormConfig.lists = multipleTruckFormCols(isSee);
      this["dictionary/getDictionary"]([
        "distributionType",
        "distributionBusinessType",
        "destinationType",
        "distributionPlanState",
        "customsClearanceMode",
      ]).then(() => {
        this.initTruckDelivery();
      });
    },
    cancelEvt() {
      this.$refs.detailTopRef?.comReBack();
    },
    handleChangeBsRef(row) {
      if (row) {
        const { id } = this.$route.query;
        const params = {
          id,
          bsRef: row,
        };
        POSTDistributionTruckInfo(params).then((res) => {
          const { data } = res;
          if (data > 0) {
            const title = "重复提示";
            const className = "el-icon-warning text-warning";
            const msg = "CMR No单号已存在！";
            msgBox(
              this,
              { title, className, msg },
              () => {}
            );
          }
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    AddTableView: () => import("./components/addTableView"),
    EditTableView: () => import("./components/editTableView"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-content-container {
  min-height: calc(100vh - 80px);
}
</style>
