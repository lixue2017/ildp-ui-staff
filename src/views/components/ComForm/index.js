/** @format */

import ComForm from "./ComForm.vue";
export default ComForm;

/**
 * this.$refs.detailTopRef?.comReBack({ isBackRefresh: true });
		详情页跳转页面操作后刷新返回的缓存页面，如：操作详情页是缓存的，切换页面不会调接口。点击排柜节点，跳转到排柜页面提交返回操作详情页需要刷新节点数据

 * 组件配置说明：
 * import { msgTipBox } from "@/utils/confirmBox.js";
 * import { comSaveRepeatedRequest, comRepeatedRequest } from "@/api/common";
 * import { toFixedNum } from '@/utils/instructions'
 * import { typeConversion, getDictObj, formatMoney } from '@/utils/index'
 * decimal: 2, // 小数位限制
 * maxlength: 256, // 输入长度限制
 * max: 99999
 * min: 0
 * colFormat: "thousandthMark", // 金额显示千分符  this.formatMoney
 * colFormat: "fixedNum" // 显示数值  this.toFixedNum
 * multiple: true, // 多选
 * 
 * showTabName: "1", // 只在第一个页签显示
 * 
 * residueCol: 2, // 查询表格合并列显示 0-合并4列 1-合并3列 2-合并两列
 * residueCols: [2], // 与residueCol值相同
 * 
 * residueCol: 0, // 合并一整行
 * residueCols: [0],
 * 
 * {
 * 	span: 12,
		id: "xxxx",
		label: "xxxx：",
		type: "select", // "inputNumber"
		placeholder: "请选择",
		basicType: "xxxx",
		multiple: true, // 多选

 * 	decimal: 2, // numDecimal: 2
 * 	maxlength: 256,
 * 	max: 99999,
 * 	min: 0,
 * 	colFormat: "thousandthMark", // 金额显示千分符  this.formatMoney
 * 	colFormat: "fixedNum", // 千分符配置中显示数值  this.toFixedNum
 * 	noValueShow: true, // 无值不显示
 * 	colItemHide: true, // 根据条件判断是否隐藏
 * 	
 * 	noSlotLabel: true, // 英文label不强制一行显示
 * 	oneLineTipLabel: true, // label一行显示
 * 
 * textLineClamp: 5, // 备注信息显示5行
 * }
 * 
 * 
 * 表单提交前先获取数据校验
 * this.$refs.formRef?.getFormParams()
 * setFormModel()
 * 
 * 
 * // fold: tName === '2', 查询显示展开
 * 
 * 1、字典词字体颜色与标签
 * 
 * 	fontColor: true, // 字体是否有颜色
 * 	fontTxtColor: "#5094ff", // 配置字体颜色
 * 	txtStyleObj: { // 自定义样式
			fontWeight: 600
		},
		txtClassName: 'base-flex-align',
		txtTagArr: [{
			// fontTagColor: true, // 字典词tag字体色
			// bgTagColor: true, // 字典词tag背景色
			tagColor: 'green', // 默认blue色
			basicType: 'do',
			basicTypeVal: 'pdo'
		}]

	2、下拉框
		selectLabelKey

	3、数字框
		type: "inputNumber",
		numDecimal: 2,
		unitKey: 'xx_unit_1'
		maxNumKey: 'xx_max_1'

		selectKey: 'xx'
		formConfig.selectList: []

		v-input-number-limit="{
			value: 2, // 几位小数限制
			maxNumber: slotProps.column.colMax // 最大值限制
		}"

	4、附件
		formConfig.isAttachFileId: true

		id: "attach_Id",
		attachIdKeyName: "attach_Id" // 为attachId时，可不传
		labelWidth: "0",
		type: "customUploadFile",
		pasteUpload: true, - 开启粘贴上传 - 默认开启

		fileParamsType: -1 //新的上传接口，需要传类型



	5、提交按钮loading
		:loading="isBtnLoading"
		import { mapActions, mapState } from "vuex";
		computed: {
			...mapState({
				isBtnLoading: (state) => state.settings.isRepeatedClick,
				// transportMode: (state) => state.dictionary.dicsData.transportMode,
			}),
		},


	6、初始默认值与新增显示当前创建的数据
		isDefaultSelectVal, // 初始化是否默认选中项
		if (!this.isDefaultSelection) {
			this.isDefaultSelection = true; // 只有初始选中默认值后调接口查询表格
			this.getTableList(this.$refs.searchFormRef[0]?.getFormParams());
		}

		handleTabsClick: () => { // 多个tab页签切换时防止重复调接口
			if (this.initDefaultTabs.includes(this.tabsConfig.activeName)) {
				this.$nextTick(() => {
					this.mixinkeepTable();
				});
			}
		},

		this.$refs.ClearanceAutoComplete?.querySearchAsync("", {
			addSelectVal: 180
		});

	7、下拉选择框
		AutoComplete: () => import("_comp/ComForm/AutoComplete"),
		<AutoComplete
			ref="autoSelectRef"
			:formModel="slotProps.formModel"
			:fieldItem="slotProps.fieldItem"
			:additionalParam="{
				typeList: [0, 3][slotProps.formModel.proxyType || 1],
			}"
		/>

		8、文字前显示icon，如：操作单详情收、发、通知人
			{
				span: 24,
				// label: "发货人",
				// labelClassName: "item-label-title", // 标题加粗
				id: "receivingWarehouse_address",
				type: "txt",
				// iconColClass: "el-icon-office-building", // 直接传icon时，不需要传txtObjKey与txtLineCols
				txtObjKey: "receivingWarehouse", // 为对象时，需要传对象的属性名
				txtLineCols: [{
					txtColSpan: 12,
					iconColClass: "el-icon-office-building", // 建筑物
					txtColKey: "code" // txtObjKey对象中的txtColKey值
				}, {
					txtColSpan: 12,
					iconColClass: "el-icon-phone-outline", // 电话
					txtColKey: "name"
				}, {
					iconColClass: "el-icon-location-outline", // 地址
					txtColKey: "address"
				}]
			}

	9、底部按钮
		<template v-if="getFootBtn().length > 1">
			<div class="footer-seize-seat"></div>
			<div class="order-footer">
				<template v-for="(btn, index) in getFootBtn()"> // footBtnList
					<PreviewOrDownload
						v-if="btn.ftBtnType === 'btnPreview'"
						:key="`b_${index}`"
						class="ft-btn-preview"
						:btnTxt="btn.text"
						:btnConf="{
							btnType: 'primary',
						}"
						:previewDownloadConf="
							handlePreview()
						"
					/>

					<el-button :type="btn.type" @click="btn.handleClick" :key="index">
						{{ btn.text }}
					</el-button>
				</template>
			</div>
		</template>

		footBtnList: [{
			text: "派卡车预览",
			type: "primary",
			ftBtnType: 'btnPreview',
			// statusBtnArr: [0, 1, 2],
		},{
			statusBtnArr: [5],
			text: "状态按钮",
			handleClick: this.handleDistribution,
		}, {
			text: "关闭",
			isBtnAll: true,
			handleClick: this.reBack,
		},]

		handlePreview() {
			const { id } = this.editFormConfig.formModel;
			return {
				previewParam: {
					id,
				},
				previewHttp: xxxxx,
			};
		},

		PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),

	10、tabs按钮
			<div class="custom-tabs-btn">
				<template v-for="tItem in btnTabsList">
					<el-button
						size="small"
						plain
						:key="tItem.key"
						@click="changeTabs(tItem.key)"
						:type="tItem.key === tabs.active ? 'activation' : ''"
					>{{ tItem.label }}</el-button>
				</template>
			</div>

			btnTabsList: [{
				label: "操作记录",
				key: "1",
			}],


		11、备注配置
				{
					span: 24,
					id: "remark",
					label: "订单备注",
					type: "txt",
					className: "label-top-title",
					textLineClamp: 5,
					showMoreTextBtn: true

					// type: "textarea",
				}



	20、自定义弹窗
		export const customDialogCols = () => {
			return {
				title: '调库存',
				width: '500px',
				labelWidth: '105px',
				// isAttachFileId: true, // 附件
				// dictionaryWords: ['customsClearanceMode'], // 需要字典词时，传字典词的key
				simpleCustomCols: [{
					span: 24,
					id: "xx_502",
					label: "库存调整为：",
					placeholder: "请输入",
					type: "text",
				}],
				formRules: {
					xx_502: [
						{ required: true, message: `请输入库存`, trigger: "blur" }
					]
				}
			}
		}

		<ComCustomDialog ref="customDialogRef" />

		// 有slot时
		<ComCustomDialog ref="customDialogRef" :slotDlgFormIds="['msgSlot']">
			<template v-slot:msgSlot="slotProps">
				<span>{{ slotProps.fieldItem.placeholder }}</span>
			</template>
		</ComCustomDialog>

		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"),

		handleCustomDialog(row) {
			this.$refs.customDialogRef.showCustomDialog({
				customFormConfig: customDialogCols(),
				formModel: {
					id: row.id
				},
				confirmCheckFunction: (callBack) => {
					if (true) {
						callBack && callBack();
					} else {
						this.msgError(`确认前校验不通过`)
					}
				},
				httpRequest: postRowCabinetRemark,
				successFunction: this.handleWarehousingSuccess,
			})
		},


		21、日期选择限制
			pickerOptions: {
				disabledDate(time) {
					// 只能选择本月与下月
					const curData = new Date();
					const y = curData.getFullYear();
					const m = curData.getMonth();
					if (m < 11) {
						return y !== time.getFullYear() || time.getMonth() < m || time.getMonth() > m + 1;
					}
					// 上下月跨年时;
					return (y !== time.getFullYear() && y + 1 !== time.getFullYear()) ||
						(y + 1 !== time.getFullYear() && time.getMonth() < 11) ||
						(y !== time.getFullYear() && time.getMonth() > 0);
				},
			}

			pickerOptions: {
				disabledDate(time) {
					// 只能选择到当前日期的前一天
					return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
				},
			}

 * 
 */
