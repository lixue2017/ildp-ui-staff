<template>
  <!-- 清关交接专用 -->
  <ComDialog
    ref="customDialog"
    class="dialog"
    :customDialog="customDialogConfig"
  >
    <template v-slot:content>
      <ComForm
        ref="dialogForm"
        :formConfig="formConfig"
        class="dialog-form content-padding-20"
        v-if="$refs && $refs.customDialog && $refs.customDialog.dialogVisible"
      >
        <template v-slot:minBill="slotProps">
          <div class="dialog-flex">
            <div v-if="!isHaveRules" class="dialog-flex-input">
              <el-input
                v-model="slotProps.formModel.minBill"
                v-input-number-limit="slotProps.fieldItem.decimal"
                @change="changeMinPrice"
              >
              </el-input>
            </div>
            <div v-else>
              <span>{{ slotProps.formModel.minBill }}</span>
            </div>
            <div class="dialog-flex-span-iconTips">
              <i class="iconfont tishi"></i>
              <span>首重不足按照最小单位计算</span>
            </div>
          </div>
        </template>
        <template v-slot:table="slotProps">
          <div class="dialog-table">
            <div class="dialog-table-rulesTips">
              <span>{{ billingRules.des }}</span>
              <i class="iconfont tishi"></i>
              <span> {{ billingRules.limit }}</span>
            </div>
            <div>
              <ComTable
                ref="tableRef"
                :columnData="tableConfig.columnData"
                :columnConfig="tableConfig.columnConfig"
              >
                <template v-slot:customRow="{ slotProps }">
                  <template v-if="slotProps.prop === 'endValue'">
                    <div>
                      <div v-if="slotProps.row.isEnd">
                        <span>--</span>
                      </div>
                      <div v-else>
                        <div v-if="!isHaveRules">
                          <el-input
                            v-model="slotProps.row.endValue"
                            v-input-number-limit="slotProps.column.decimal"
                            :min="minMaxNumber(slotProps.row.startValue)"
                            @change="changeEndValue(slotProps.row)"
                          />
                        </div>
                        <div v-else>
                          <span>{{ slotProps.row.endValue }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-if="slotProps.prop === 'costPrice'">
                    <el-input
                      v-model="slotProps.row.costPrice"
                      v-input-number-limit="slotProps.column.decimal"
                    ></el-input>
                  </template>
                  <template v-if="slotProps.prop === 'operation'">
                    <div class="operate-btn-list">
                      <template v-for="(item, index) in tableStatusBtnList">
                        <div class="btn" :key="index" v-if="!isHaveRules">
                          <el-button
                            :class="`operate-icon ${
                              item.info ? 'operate-icon-info' : ''
                            }`"
                            :style="{ color: item.color }"
                            size="small"
                            type="text"
                            @click="item.handleClick(slotProps.row)"
                          >
                            {{ item.text }}
                          </el-button>
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
              </ComTable>
            </div>
          </div>
        </template>
        <template v-slot:relationWarehouse="slotProps">
          <div>
            <div class="dialog-warehouse">
              <div class="dialog-warehouse-isDefault">
                <span>关联仓库</span>
                <el-checkbox v-model="slotProps.formModel.isDefault"
                  >默认</el-checkbox
                >
              </div>
              <div v-if="!slotProps.formModel.isDefault">
                <AutoComplete
                  v-if="relationWarehouse.isChangeProxy"
                  :formModel="slotProps.formModel"
                  :fieldItem="{
                    ...slotProps.fieldItem,
                    handle: changeWarehouse,
                    isBackAll: true,
                  }"
                  :additionalParam="{
                    costId: exParams.id,
                    warehouseIdList: relationWarehouse.warehouseIdList,
                  }"
                />
              </div>
            </div>
            <div
              :class="[warehouseLists.length > 0 && 'dialog-warehouse-tags']"
              v-if="!slotProps.formModel.isDefault"
            >
              <el-tag
                v-for="tag in warehouseLists"
                :key="tag.id"
                closable
                @close="closeTag(tag)"
              >
                {{ tag.label }}
              </el-tag>
            </div>
          </div>
        </template>
        <template v-slot:remark="slotProps">
          <div class="dialog-remark">
            <span>规则备注</span>
            <el-input
              v-model="slotProps.formModel.remark"
              type="textarea"
              :rows="3"
              resize="none"
            ></el-input>
          </div>
        </template>
      </ComForm>
    </template>
  </ComDialog>
</template>


<script>
import { mapState } from "vuex";
import { setRules } from "./model.js";
import { isNumberStr } from "@/utils/index";
import { addConfig, updateConfig } from "@/api/costScheme/index.js";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDialog: () => import("_comp/ComDialog"),
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      customDialogConfig: {
        title: "规则设置",
        width: "830px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "保 存",
            type: "primary",
            handleClick: (formModel) => {
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
      formConfig: {
        formModel: {},
        httpRequest: this.submitFormRequest, // 表单提交接口
        successFunction: this.handleSuccess, // 表单提交成功回调
        size: "small",
        formRules: {}, // 表单校验规则
      },
      tableConfig: {
        columnData: [],
      },
      tableStatusBtnList: [
        {
          text: "新增",
          color: "#5094FF",
          handleClick: (row) => {
            this.addBillRules(row);
          },
        },
        {
          text: "删除",
          color: "#F26079",
          handleClick: (row) => {
            this.deleteBillRules(row);
          },
        },
      ],
      warehouseLists: [],
      isHaveRules: false,
      billingRules: {
        des: "计费规则(开始值<X≤结束值) ",
        limit: "最多新增5行数据",
      },
      exParams: {},
      relationWarehouse: {
        warehouseIdList: [],
        isChangeProxy: true,
      },
      deleteIdList: [],
    };
  },
  methods: {
    submitFormRequest(formModel) {
      const { minBill, isDefault, remark } = formModel;
      const warehouseIds = this.warehouseLists.map((e) => e.id)?.join(",");
      if (this.tableConfig.columnData.length > 1) {
        let lastData;
        let submitStatus = false;
        const tableLength = this.tableConfig.columnData.length;
        this.tableConfig.columnData.map((e, index) => {
          const { startValue, endValue, costPrice } = e;
          if (index) {
            lastData = this.tableConfig.columnData[index - 1];
            const lastEndValue = lastData?.endValue;
            if (startValue !== lastEndValue) {
              submitStatus = true;
              setTimeout(() => {
                this.$message.error(
                  `提交失败,第${index}行的开始值与第${
                    index - 1
                  }行数据结束值不一致，请检查数据后再进行提交`
                );
              }, 500);
            }
          }
          if (startValue == endValue) {
            //当前航的开始值等于结束值
            submitStatus = true;
            setTimeout(() => {
              this.$message.error(
                `提交失败,第${index + 1}行开始值不能与结束值相同`
              );
            }, 500);
          }
          if (!endValue && index + 1 != tableLength) {
            //最后一行的结束值不用填
            submitStatus = true;
            setTimeout(() => {
              this.$message.error(`提交失败,第${index + 1}行结束值没有填写`);
            }, 500);
          }
          if (!costPrice) {
            submitStatus = true;
            setTimeout(() => {
              this.$message.error(`提交失败,第${index + 1}行单价没有填写`);
            }, 500);
          }
        });
        if (!isDefault && !warehouseIds) {
          submitStatus = true;
          this.$message.error(`保存失败,至少需要选择一个关联仓库`);
        }
        if (submitStatus) {
          return new Promise((resolve, reject) => {
            reject();
          });
        }
      }
      const { id, type, listsType } = this.exParams;
      const httpRequest = {
        add: addConfig,
        edit: addConfig,
        copy: addConfig,
      };
      // this.$emit('handleSuccess',saveData)
      const params = {
        id: type == "edit" ? formModel.id : undefined,
        costId: id,
        minBill,
        deleteIdList: this.deleteIdList,
        isDefault: isDefault ? 1 : 0,
        configType: listsType == "servicePrice" ? 1 : 2,
        remark,
        warehouseIds: isDefault ? "" : warehouseIds,
        billingRuleList: this.tableConfig.columnData,
      };
      return this.comRepeatedRequest(this, httpRequest[type], params);
    },
    show(row = {}, exParams) {
      const { billingRuleList, minBill, isDefault, remark, configType } = row; //规则单价,仓库默认，备注信息
      const { type, id, listsType, warehouseIdsLists } = exParams;
      this.exParams = {
        type, //新增或删除
        id, //id
        listsType,
      };
      let warehouseIds, warehouseName;
      let warehouseLists = []; //修改带出的数据
      if (row.warehouseIds || row.warehouseName) {
        warehouseIds = row.warehouseIds?.split(",");
        warehouseName = row.warehouseName?.split(",");
        warehouseLists = warehouseIds.map((e, index) => {
          return {
            id: e,
            label: warehouseName[index],
          };
        });
      }
      if (billingRuleList) {
        //判断列表有没有一条数据,有且为新增则需要继承
        if (type == "add") {
          this.isHaveRules = true;
          this.formConfig.formModel = {
            minBill: minBill,
            remark: "",
            isDefault: false,
            configType,
          };
          this.warehouseLists = [];
          this.relationWarehouse.warehouseIdList = warehouseIdsLists || [];
        } else if (type == "edit") {
          this.isHaveRules = false;
          this.formConfig.formModel = {
            id: row.id,
            minBill: minBill,
            isDefault: isDefault ? true : false,
            remark: remark,
            configType,
          };
          this.warehouseLists = warehouseLists;
          this.relationWarehouse.warehouseIdList = warehouseIdsLists || [];
        } else if (type == "copy") {
          this.isHaveRules = true;
          this.formConfig.formModel = {
            id: row.id,
            minBill: minBill,
            remark: remark,
            isDefault: isDefault ? true : false,
            configType,
          };
          this.warehouseLists = [];
          this.relationWarehouse.warehouseIdList = warehouseIdsLists || [];
        }
        const length = billingRuleList.length;
        this.tableConfig.columnData = billingRuleList.map((e, index) => {
          let isEnd = index + 1 == length ? true : false;
          return {
            id: type == "edit" ? e.id : undefined,
            startValue: e.startValue,
            endValue: isEnd ? undefined : e.endValue, //需要传字符串
            costPrice: e.costPrice,
            isEnd: isEnd ? true : false,
            ruleType: listsType == "servicePrice" ? 1 : 2,
          };
        });
      } else {
        this.isHaveRules = false;
        this.formConfig.formModel = {
          minBill: 0,
          remark: "",
          isDefault: false,
          configType: listsType == "servicePrice" ? 1 : 2,
        };
        this.tableConfig.columnData = [
          {
            startValue: 0,
            endValue: 0,
            costPrice: 0,
            isEnd: false,
            ruleType: listsType == "servicePrice" ? 1 : 2,
          },
          {
            startValue: 0,
            endValue: undefined,
            costPrice: 0,
            isEnd: true,
            ruleType: listsType == "servicePrice" ? 1 : 2,
          },
        ];
        this.warehouseLists = [];
        this.relationWarehouse.warehouseIdList = warehouseIdsLists || [];
      }
      const { lists, formRules, columnConfig, title, width, labelWidth } =
        setRules;
      this.formConfig = {
        ...this.formConfig,
        lists,
        formRules,
        labelWidth,
      };
      this.tableConfig = {
        ...this.tableConfig,
        columnConfig,
      };
      this.customDialogConfig.title = title;
      this.customDialogConfig.width = width;
      this.$refs.customDialog.show();
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSuccess() {
      this.$emit("handleSuccess");
      this.hide();
    },
    changeWarehouse(row, type) {
      //选择仓库后生成标签
      if (!row) {
        return;
      }
      const { id, label } = row;
      const isRepeat = this.warehouseLists.find((e) => id == e.id);
      if (!isRepeat) {
        this.relationWarehouse.warehouseIdList.push(id);
        this.renovateRequest("relationWarehouse");
        this.warehouseLists.push({
          id,
          label,
        });
      }
    },
    closeTag(row) {
      //关闭标签
      const { id } = row;
      this.warehouseLists = this.warehouseLists.filter((e) => e.id != id);
      this.relationWarehouse.warehouseIdList =
        this.relationWarehouse.warehouseIdList.filter((e) => {
          return e != id;
        });
      this.renovateRequest("relationWarehouse");
    },
    renovateRequest(row) {
      //选择一条数据后需要在下次调用接口的时候排除这条数据
      this[row].isChangeProxy = false;
      this.$nextTick(() => {
        this[row].isChangeProxy = true;
      });
    },

    changeEndValue(row) {
      //当前航结束值改变之后，自动修改下一行的开始值
      const { endValue, temp_secondId } = row; //结束值
      this.tableConfig.columnData.map((e, index) => {
        if (e.temp_secondId == temp_secondId) {
          if (this.tableConfig.columnData[index + 1]) {
            this.tableConfig.columnData[index + 1].startValue = endValue;
          }
        }
      });
    },
    minMaxNumber(val, type) {
      //计费规则结束值最小可输入范围
      if (isNumberStr(val)) {
        return Number(val);
      }
      return 0;
    },
    addBillRules(row) {
      //点击新增的时候，在点击数据的下一行增加一行新的计费规则数据
      if (this.tableConfig.columnData.length >= 5) {
        this.$message.error("新增失败,计算规则最多不超过5条");
        return;
      }
      const { temp_secondId } = row;
      this.tableConfig.columnData.map((e, index) => {
        if (e.temp_secondId == temp_secondId) {
          this.tableConfig.columnData.splice(index + 1, 0, {
            startValue: e.endValue,
            endValue: 0,
            costPrice: 0,
          });
        }
      });
      this.changeBillRulesStatus();
    },
    deleteBillRules(row) {
      //删除计费规则
      this.deleteIdList = [];
      const { temp_secondId } = row;
      console.log("this.tableConfig.columnData", this.tableConfig.columnData);
      this.tableConfig.columnData.map((e, index) => {
        if (e.temp_secondId == temp_secondId) {
          if (this.tableConfig.columnData.length == 2) {
            this.$message.error("删除失败,计算规则不能少于2条");
          } else {
            this.deleteIdList.push(e?.id);
            this.tableConfig.columnData.splice(index, 1);
            if (index == 0) {
              //如果删除的是第一条数据，同步最小计费值与第二条数据的开始值
              const { minBill } = this.formConfig.formModel;
              this.changeMinPrice(minBill);
            }
          }
        }
      });
      this.changeBillRulesStatus();
    },
    changeBillRulesStatus() {
      //新增删除之后需要重新确认最后一个数组是谁
      const length = this.tableConfig.columnData.length;
      this.tableConfig.columnData.map((e, index) => {
        if (index + 1 == length) {
          e.isEnd = true;
          e.endValue = 0;
        } else {
          e.isEnd = false;
        }
      });
    },
    changeMinPrice(newVal) {
      console.log("newVal", newVal);
      //修改最小计费值的时候改变第一行计费规则的开始值
      if (this.tableConfig.columnData.length) {
        this.tableConfig.columnData[0].startValue = newVal;
        this.formConfig.formModel = {
          ...this.formConfig.formModel,
          minBill: newVal,
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  &-flex {
    display: flex;
    &-input {
      width: 20%;
    }
    &-span {
      &-iconTips {
        i {
          color: #ff813d !important;
          font-size: 14px;
          margin-left: 10px;
        }
        span {
          margin-left: 5px;
          color: #bcbcbc;
        }
      }
    }
  }
  &-warehouse {
    display: flex;
    justify-content: space-between;
    &-isDefault {
      span {
        &:nth-child(1) {
          font-weight: bold;
          color: #515151;
        }
      }
      label {
        padding: 0px 20px;
      }
    }
    &-tags {
      border: 1px solid rgba(215, 215, 215, 1);
      min-height: 0px;
      max-height: 120px;
      overflow: auto;
      margin-top: 5px;
      span {
        margin: 10px 10px;
      }
    }
  }
  &-remark {
    span {
      &:nth-child(1) {
        font-weight: bold;
        color: #515151;
      }
    }
  }
  .dialog-table {
    &-rulesTips {
      i {
        color: #ff813d !important;
        font-size: 14px;
        margin-left: 10px;
      }
      span {
        &:nth-child(1) {
          font-weight: bold;
          color: #515151;
        }
        &:nth-child(3) {
          margin-left: 5px;
          color: #bcbcbc;
        }
      }
    }
  }
}
</style>
