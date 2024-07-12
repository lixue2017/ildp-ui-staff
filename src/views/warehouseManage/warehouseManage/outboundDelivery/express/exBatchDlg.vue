<template>
  <ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['tableSlot']">
    <template v-slot:tableSlot>
      <ComTable
        :columnConfig="expressBatchColumn()"
        :columnData="tableColumnData"
      >
      </ComTable>
    </template>
  </ComCustomDialog>
</template>

<script>
import {
  postExpressDeliverySave,
  putExpressDeliverySave,
  getDeliveryDetails,
  getExpressFreightList,
} from "@/api/warehouse/manage";
import { getAvailableParams } from "@/utils/index";
import { registrationDlgFormCols, expressBatchColumn } from "./model";
export default {
  data() {
    return {
      expressBatchColumn,
      formData: {},
      tableColumnData: [],
      // batchObj: {},
    };
  },
  methods: {
    async editShow(obj, { editSuccess }) {
      if (obj.webPageLocation) {
        const opt = {
          id: obj.id,
          pageLocation: obj.webPageLocation, // 1=快递出库；2=快递信息
        };
        this.formData = (await getDeliveryDetails(opt)).data || {};
      }
      if (obj.webPageLocation == 2) {
        this.tableColumnData =
          (
            await getExpressFreightList({
              idList: [obj.id],
              pageLocation: obj.webPageLocation,
            })
          ).data || [];
      } else {
        this.tableColumnData = obj.addRows || [];
      }
      const destinationType = this.typeConversion(
        this.formData.destinationType
      );
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: registrationDlgFormCols({
          isSee: obj.isWebSee,
          destinationType,
        }),
        formModel: {
          ...this.formData,
          destinationType,
          wmsObj: {
            value: this.formData.wmsId,
            code: this.formData.wmsCode,
            name: this.formData.wmsName,
          },
        },
        httpRequest: (param) => {
          // console.log('param==', param)
          const { wmsObj = {}, attachId, ...nParam } = param;
          const getKeys = [
            "expressCompanyId",
            "logisticsProductId",
            "scheduledTime",
            "trackingSn",
            "contacts",
            "phone",
            "email",
            "destinationType",
            "nationId",
            "postCode",
            "province",
            "city",
            "area",
            "street",
            "detailAddress",
            "houseNumber",
          ];
          const params_obj_1 = getAvailableParams(getKeys, {
            webOriginalDataObj: nParam,
          });
          let sOpt = {
            attachIdList: attachId ? attachId.split(",") : [],
            ...params_obj_1,
            wmsId: wmsObj?.value || "",
            wmsCode: wmsObj?.code || "",
            wmsName: wmsObj?.name || "",
          };
          if (obj.webPageLocation == 2) {
            // 修改
            return putExpressDeliverySave({
              ...sOpt,
              id: obj.id,
            });
          }
          // 新增
          return postExpressDeliverySave({
            ...sOpt,
            itemList: this.tableColumnData.map((e) => ({
              id: e.id,
              num: e.num,
            })),
          });
        },
        customFtBtnList:
          obj.isWebSee && this.formData.state === 0
            ? [
                {
                  text: this.overseaLangObj.bj_edit("修改"),
                  type: "primary",
                  handleClick: () => {
                    this.$refs.customDialogRef.customDialogHide();
                    this.$nextTick(() => {
                      this.editShow(
                        {
                          ...this.formData,
                          isWebSee: false,
                          webPageLocation: obj.webPageLocation,
                        },
                        {
                          editSuccess,
                        }
                      );
                    });
                  },
                },
              ]
            : [],
        successFunction: () => {
          this.msgSuccess(this.overseaLangObj.cg_tip("保存成功"));
          editSuccess && editSuccess();
        },
      });
    },
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// @import "~@/assets/styles/variables.scss";
</style>
