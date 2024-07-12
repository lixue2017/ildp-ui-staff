<template>
  <div>
    <div class="base-flex-between tit-btn">
      <span>{{ modeObj.mode_type === 1 ? '目的' : '提货'}}地址</span>

      <el-button v-if="isEdit" size="small" type="primary" @click="handleAdd()">新增行</el-button>
    </div>
    <template v-for="(item, idx) in listFormData">
      <div :key="item.temp_key" class="form-item-box">
        <div class="serial-no">{{ idx + 1 }}</div>
        <ComForm
          :ref="`formRef${idx}`"
          :formConfig="getFormConfig(item, idx)"
          class="dialog-form"
        >
          <template v-slot:address_obj="slotProps">
            <div v-if="slotProps.formModel" class="tag-blue-color">{{WAREHOUSE_TYPE[slotProps.formModel.shipperType]}}</div>
          </template>
          <template v-slot:contactPhone="slotProps">
            <div class="flex contacts">
              <el-input v-model="slotProps.formModel.contactPhone" placeholder="手机号" />
            </div>
          </template>
          <template v-slot:contactName="slotProps">
            <div class="flex contacts">
              <el-input v-model="slotProps.formModel.contactName" placeholder="姓名" />
            </div>
          </template>

          <template v-slot:addressDetail="slotProps">
            <div class="base-flex-align ellipsis-text">
              <div class="lable-tag">
                <span class="tag-blue-color" v-if="slotProps.formModel.address_obj">
                  {{WAREHOUSE_TYPE[slotProps.formModel.address_obj.shipperType]}}
                </span>
                地址：
              </div>
              <TooltipOver
                :content="`${slotProps.formModel.addressDetail || '--'}`"
                :style="{ width: 'calc(100% - 115px)', flex: 1 }"
              />
            </div>
          </template>

          <template v-if="isEdit" v-slot:seeSlotBtn>
            <div class="base-flex-align">
              <el-button size="small" type="primary" @click="handleEdit(item, idx, 'edit')">编 辑</el-button>
              <el-button size="small" type="primary" @click="handleEdit(item, idx, 'copy')" plain>复 制</el-button>
              <el-button size="small" @click="handleDelete(item, idx)">删 除</el-button>
            </div>
          </template>
        </ComForm>
        <div v-if="item.isColEdit" class="edit-slot-btn flex-col-end">
					<el-button size="small" type="primary" plain @click="handleDelete(item, idx)">删 除</el-button>
          <!-- <el-button size="small" type="primary" @click="handleEdit(item, idx, 'save')" plain>保 存</el-button>
          <el-button size="small" @click="handleEdit(item, idx, 'cancel')">取 消</el-button> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { deepCopy } from "@/utils/index";
import { WAREHOUSE_TYPE } from "@/utils/mixin";
import { msgBox } from "@/utils/confirmBox.js";
import { delTrailerAddress } from "@/api/performance/record";
import { addressForm, addressCols, addressFormRules } from "./model";
export default {
  props: {
    isEdit: {
      // 默认编辑，详情页为查看
      type: [String, Boolean],
      default: () => true
    },
    formModel: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      WAREHOUSE_TYPE,
      listFormData: [],
      tempList: [],
      updateFormConfig: {
        size: "small",
        labelWidth: "115px"
      },
      modeObj: {},
    }
  },
  methods: {
    handleEdit(row = {}, rIndex, type) {
      const colEdit = this.listFormData[rIndex].isColEdit
      this.listFormData = this.listFormData.map((e, i) => {
        // 赋值-防止数据被重置
        return {
          ...e,
          ...(this.$refs[`formRef${i}`][0]?.getFormParams())
        }
      })
      if (type === 'cancel') {
        this.listFormData.splice(rIndex, 1, {
          ...this.tempList[rIndex],
          isColEdit: false
        });
        this.$refs[`formRef${rIndex}`][0]?.setFormModel(this.listFormData[rIndex])
      }
      if (type === 'save') {
        this.formSaveRules(rIndex, () => {
          this.listFormData.splice(rIndex, 1, {
            ...(this.$refs[`formRef${rIndex}`][0]?.getFormParams()),
            isColEdit: colEdit === undefined ? true : !colEdit
          });
          // 检验通过后再更新表单模板
          this.changeDom()
        })
        return
      }
      if (type === 'edit') {
        this.listFormData.splice(rIndex, 1, {
          ...row,
          isColEdit: colEdit === undefined ? true : !colEdit
        });
        this.tempList[rIndex] = deepCopy(this.listFormData[rIndex])
      }

      if (type === 'copy') {
				const { id, ...copyRow } = row
        this.listFormData.push(deepCopy(copyRow))
        this.tempList.push(deepCopy(copyRow))
      } else {
        this.changeDom()
      }

    },
    handleAdd() {
      const addArr = addressCols().filter(e => !['editSlotBtn'].includes(e.id))
      const addObj = addArr.reduce((m, i) => {
        m[i.id] = ''
        return m
      }, {
        isColEdit: true,
				temp_key: Math.random() + ''
      })
      this.listFormData.push(addObj)
      this.tempList.push(deepCopy(addObj))
    },
    handleDelete(row, idx) {
      if (!row.id) {
        this.delData(idx);
        return
      }
      const msg = "删除操作不可逆！";
      const title = "删除确认";
      const className = "el-icon-warning text-warning";
      msgBox(this, { title, className, msg }, () => {
        delTrailerAddress(row.id).then(() => {
          this.msgSuccess('删除成功');
          this.delData(idx);
        });
      });
    },
    delData(idx) {
      this.listFormData.splice(idx, 1);
      this.tempList.splice(idx, 1); // 下标保持一致
      // this.changeDom()
    },
    changeDom() {
      // 用于更新表单模板，需要优化成更新具体的对象值。模板更新DOM不更新
      const tArr = deepCopy(this.listFormData)
      this.listFormData = [];
      this.$nextTick(() => {
        this.listFormData = tArr
      })
    },
    getFormConfig(row = {}, idx) {
      const { isColEdit: itemEdit = false } = row
      return {
        ...this.updateFormConfig,
        formModel: row,
        formRules: itemEdit ? addressFormRules() : {},
        lists: addressForm({
          itemEdit,
          customerId: this.formModel.customerId,
          tabType: this.formModel.type,
          operationId: this.formModel.operationOrderId,
          addressFn: (addressObj) => {
            // console.log('选择地址==', addressObj)
            this.$refs[`formRef${idx}`][0]?.setFormModel({
              company: addressObj?.company || "",
              addressDetail: addressObj?.addressDetail || "",
              contactPhone: addressObj?.contactPhone || "",
              contactName: addressObj?.contactName || ""
            });
          }
        }),
      };
    },
    setTableData(obj = {}) {
      // 0-货物 1-集装箱
      const { addressList: arr = [] } = obj
      this.modeObj = obj;
      if (arr.length) {
        arr.forEach(e => {
					e.temp_key = Math.random() + ''; // 唯一key用于删除列表时更新DOM
          e.isColEdit = this.isEdit // 默认编辑，查看状态不可编辑
        })
        this.listFormData = arr;
        this.tempList = deepCopy(arr);
      } else {
        this.handleAdd()
      }
    },
    formSaveRules(i = 0, callBack) {
      this.$refs[`formRef${i}`][0]?.$refs["myForm"]?.validate((valid) => {
        if (valid) {
          // 保存成功
          callBack && callBack()
        }
      })
    },
    formSubmitRules() {
      // 父组件调用 - 保存校验所有表单
      const txt = `${ this.modeObj.mode_type === 1 ? '目的' : '提货'}地址`
      if (!this.listFormData.length) {
        this.msgError(`请添加${txt}`)
        return false
      }
      let isValid = true
      let errs = []
      let editRows = []
      this.listFormData.forEach((ele, i) => {
        if (ele.isColEdit) {
          this.$refs[`formRef${i}`][0]?.$refs["myForm"]?.validate((valid) => {
            if (valid) {
              // if (!editRows.includes((i + 1))) {
              //   editRows.push(i + 1)
              // }
            } else {
							isValid = false
						}
          })
          // 编辑状态需要保存，列表才能获取最新的表单数据
          // isValid = false
        } else {
          // 判断保存或取消状态的必填值
          const checkArr = addressFormRules()
          for (const c in checkArr) {
            if (!ele[c] && !errs.includes((i + 1))) {
              errs.push(i + 1)
              isValid = false
            }
          }
        }
      })
      // let errTxt = ''
      // if (!isValid && editRows.length) {
      //   errTxt = `<p>请保存${txt}序号${editRows.join(',')}</p>`
      // }
      if (!isValid && errs.length) {
        errTxt += `<p style='padding: 3px 0;'>请补充完整并保存${txt}序号${errs.join(',')}</p>`
      }
      // if (errTxt) {
      //   this.$message({
      //     showClose: true, type: "error",
      //     dangerouslyUseHTMLString: true,
      //     message: errTxt
      //   });
      // }
			if (isValid) {
				this.listFormData = this.listFormData.map((e, i) => {
					// 校验通过后赋值
					return {
						...e,
						...(this.$refs[`formRef${i}`][0]?.getFormParams())
					}
				})
			}
      return isValid
    },
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
    TooltipOver: () => import("_comp/TooltipOver"),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tit-btn {
  margin-bottom: 10px;
}
.form-item-box {
  display: flex;
  border-top: 1px solid $divisionBorder;
  padding-top: 10px;
  &:last-child {
    border-bottom: 1px solid $divisionBorder;
  }
  .serial-no {
    // padding-top: 20px;
    flex: 0 0 20px;
  }
  .lable-tag {
    min-width: 115px;
    text-align: right;
    color: $putshelf_textColor_1;
  }
  .edit-slot-btn {
    margin-bottom: 20px;
    margin-left: 10px;
    .el-button+.el-button {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}
</style>
