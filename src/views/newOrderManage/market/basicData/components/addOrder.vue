<template>
  <el-drawer
    title="销售订单 (新增)"
    :visible.sync="drawerVisible"
    :direction="direction"
    size="70%"
    :before-close="handleClose">
    <ComForm ref="myForm" :formConfig="formConfig">
      <template v-slot:transshipmentPort="slotProps">
        <div class="flex">
          <el-select v-model="slotProps.formModel.transshipmentPort" style="width:100%">
            <el-option v-for="selectItem in [{label: '转运港1', value: '转运港1'}]" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
          </el-select>
          <el-input v-model="slotProps.formModel.transshipmentPort" placeholder="请填写" :disabled="slotProps.disableAll.transshipmentPort" maxlength="50"/>
        </div>
      </template>
      <template v-slot:destinationPort="slotProps">
        <div class="flex">
          <el-select v-model="slotProps.formModel.destinationPort" style="width:100%">
            <el-option v-for="selectItem in [{label: '目的港1', value: '目的港1'}]" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
          </el-select>
          <el-input v-model="slotProps.formModel.destinationPort" placeholder="请填写" :disabled="slotProps.disableAll.destinationPort" maxlength="50"/>
        </div>
      </template>
      <template v-slot:form-submit>
        <div class="drawer-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="$refs.myForm.submitForm()">确定</el-button>
          <el-button type="primary" @click="$refs.myForm.submitForm()">确定并补充</el-button>
        </div>
      </template>
    </ComForm>
  </el-drawer>
</template>

<script>
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    },
    handleClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      direction: 'rtl',
      disableAll: [],
      formConfig: {
        formModel: {},
        httpRequest: formData => {
          console.log(formData)
        },
        successFunction: this.handleClose,
        lists: [{
          fieldList: [{
            className: 'border-bottom-dashed',
            rows: [{
              cols: [{
                span: 12,
                id: 'client',
                label: '主委托人',
                placeholder: '请选择主委托人',
                type: 'select',
                options: [{
                  value: '1',
                  label: '坚朗'
                }],
              }, {
                span: 12,
                id: 'orderTime',
                label: '订单日期',
                placeholder: '年 /月 /日',
                type: 'date'
              }]
            }]
          }, {
            className: 'border-bottom-dashed',
            rows: [{
              cols: [{
                span: 12,
                id: 'businessType',
                label: '业务类型',
                placeholder: '-请选择-',
                type: 'select',
                options: [{
                  value: '海运出口',
                  label: '海运出口'
                }],
              }, {
                span: 12,
                id: 'customsDeclarationMode',
                label: '报关方式',
                placeholder: '-请选择-',
                type: 'select',
                options: [{
                  value: '海运出口',
                  label: '海运出口'
                }],
              }, {
                span: 12,
                id: 'packingMode',
                label: '装箱方式',
                type: 'radio',
                options: [{
                  value: 'FCL',
                  label: 'FCL'
                }, {
                  value: 'LCL',
                  label: 'LCL'
                }],
              }, {
                span: 12,
                id: 'trailerMode',
                label: '拖车方式',
                type: 'radio',
                options: [{
                  value: '我司拖车/提货',
                  label: '我司拖车/提货'
                }, {
                  value: '客户自拖/自送',
                  label: '客户自拖/自送'
                }],
              }, {
                span: 12,
                id: 'tradeTerms',
                label: '贸易条款',
                placeholder: '-请选择-',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 12,
                id: 'warehousingMode',
                label: '进仓方式',
                type: 'radio',
                options: [{
                  value: '我司进仓',
                  label: '我司进仓'
                }, {
                  value: '客户自理',
                  label: '客户自理'
                }, {
                  value: '未确定',
                  label: '未确定'
                }],
              }, {
                span: 12,
                id: 'solicitationType',
                label: '揽货类型',
                placeholder: '-请选择-',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 12,
                id: 'overseasServices',
                label: '海外服务',
                type: 'radio',
                options: [{
                  value: '我司服务',
                  label: '我司服务'
                }, {
                  value: '客户自理',
                  label: '客户自理'
                }, {
                  value: '未确定',
                  label: '未确定'
                }],
              }]
            }]
          }, {
            title: '海运基本信息',
            rows: [{
              cols: [{
                span: 12,
                id: 'transshipmentPort',
                label: '装运港',
                type: 'slot'
              }, {
                span: 12,
                id: 'TransportationTerms',
                label: '运输条款',
                placeholder: '请选择运输条款',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 12,
                id: 'destinationPort',
                label: '目的港',
                type: 'slot'
              }, {
                span: 12,
                id: 'etd',
                label: 'ETD',
                placeholder: '年 /月 /日',
                type: 'date'
              }, {
                span: 12,
                id: 'bookingAgent',
                label: '订舱代理',
                placeholder: '请选择订舱代理',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 12,
                id: 'productNameType',
                label: '品名类型',
                placeholder: '请选择品名类型',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'chineseName',
                label: '中文品名',
                placeholder: '请填写中文品名',
                type: 'text'
              }, {
                span: 24,
                id: 'englishName',
                label: '英文品名',
                placeholder: '请填写英文品名',
                type: 'text'
              }]
            }]
          }]
        }, {
          width: 200,
          className: 'border-left-solid',
          fieldList: [{
            title: '相关人员',
            rows: [{
              cols: [{
                span: 24,
                id: 'salesperson',
                label: '销售',
                placeholder: '请选择销售人员',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'salesperson',
                label: '销售助理',
                placeholder: '请选择销售助理',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'customerService',
                label: '客服',
                placeholder: '请选择客服',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'preliminaryPerson',
                label: '预审人',
                placeholder: '请选择预审人',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'Reviewer',
                label: '审核人',
                placeholder: '请选择审核人',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'operator',
                label: '操作',
                placeholder: '请选择操作人',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'documentPerson',
                label: '文件',
                placeholder: '请选择文件人员',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }, {
                span: 24,
                id: 'bookingPerson',
                label: '订舱人',
                placeholder: '请选择订舱人',
                type: 'select',
                options: [{
                  value: '无',
                  label: '无'
                }],
              }]
            }]
          }]
        }],
        formRules: {
          client:  [{ required: true, message: '请选择主委托人' }], 
          customsDeclarationMode:  [{ required: true, message: '请选择报关方式' }],
          trailerMode:  [{ required: true, message: '请选择拖车方式' }],
          solicitationType:  [{ required: true, message: '请选择揽货类型' }],
          transshipmentPort: [{ required: true, message: '请选择装运港' }],
          TransportationTerms: [{ required: true, message: '请选择运输条款' }],
          destinationPort: [{ required: true, message: '请选择目的港' }],
          etd: [{ required: true, message: '请选择etd日期' }],
          bookingAgent: [{ required: true, message: '请选择订舱代理' }],
          productNameType: [{ required: true, message: '请选择品名类型' }],
          englishName: [{ required: true, message: '英文品名不能为空' }],
          operator: [{ required: true, message: '请选择操作人' }],
          documentPerson: [{ required: true, message: '请选择文件人员' }]
        }
      }
    }
  },
  created() {

  },
  methods: {
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.el-drawer__body {
  overflow: auto;
}
</style>
