import { postClientNodeShow, postNodeTime, deleteLogistics,POSTAddExpectOrActualDeliveryNode } from "@/api/operateManage/common";
import { formDispatchCols } from "./model";

/** 清关详情与对接头程物流轨迹 */
export const trackClearanceMixin = {
  data() {
    return {
			dispatchData: {
				selectVal: '箱'
			},
			dispatchOptions: [{
				value: '箱',
				label: '箱'
			}, {
				value: '个',
				label: '个'
			}]
    }
  },
  methods: {
		dispatchDialog(modelType, dlgObj) {
			const { successFunction = () => {} } = dlgObj || {}
			this.$refs.customDlgRef?.showCustomDialog({
				confirmCheckFunction: (callBack) => {
					const { shipmentId, dispatchNum } = this.dispatchData;
					if (shipmentId && dispatchNum) {
						callBack && callBack();
					} else {
						this.msgError('请输入Shipment ID、数量')
					}
				},
				httpRequest: (obj) => {
          // pageType 1（海外清关）
          const {pageType=undefined,orderType,jobNo,operationOrderNum}=this.activities
					const { shipmentId, dispatchNum, selectVal } = this.dispatchData;
					const title = modelType === 'estimate' ? "预约" : "实际"
					const opt = {
						operationOrderId: this.activities.id,
						nodeId: 74, // 派送
						trajectoryTime: obj.estimatedTime,
						name: `${title}派送`,
						msg: `${pageType==1?jobNo:operationOrderNum || '工作单号'}的${shipmentId} ${dispatchNum}${selectVal}，${title}派送时间：${obj.estimatedTime}`,
            orderType:pageType==1?orderType:undefined
					}
          const httpRequest=pageType==1?POSTAddExpectOrActualDeliveryNode:postNodeTime
          return httpRequest(opt)
					// return postNodeTime(opt);
				},
				// successFunction: this.getLogisticsNodes,
				successFunction,
				customFormConfig: formDispatchCols({modelType}),
			});
		}
  },
	components: {
		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog"), // 自定义弹窗
  },
}



/** 操作单详情设置客户端显示 */
export const showClientMixin = {
  data() {
    return {
			showClient: false,
			cityOptions: [],
			checkObj: {},
			isCheckAll: false,
			isIndeterminate: false,
    }
  },
	computed: {
		selectAll() {
			// 物流节点全选联动
			const isEvery = this.cityOptions.every(e => e.id === this.checkObj[e.id]);
			if (isEvery) {
				this.isIndeterminate = false;
				return true;
			}
			this.isIndeterminate = this.cityOptions.some(e => e.id === this.checkObj[e.id]);
			return false;
		}
  },
  methods: {
		setClient(btn = '') {
			// 调接口获取保存后需要在客户端显示的节点
			this.cityOptions.splice(0); // 清除已有的数据
			this.getLogisticsNodes(() => {
				this.setBtnType = btn;
				this.list.forEach(e => {
					const { infoList = [], ...nEle } = e;
					if (btn === 'del') {
						// 2-可删除节点信息
						const delNodes = (infoList || []).filter(e => e.nodeType === 2);
						this.cityOptions = [
							...this.cityOptions,
							...(delNodes || [])
						]
					} else {
						this.cityOptions = [
							...this.cityOptions,
							nEle,
							...(infoList || [])
						]
					}
				})

				this.checkObj = this.cityOptions.reduce((opt, item) => {
					opt[item.id] = item.isCusView === 1 && btn !== 'del' ? item.id : -1;
					return opt
				}, {});

				this.isCheckAll = this.selectAll;
				this.showClient = true;
			})
		},
		handleCheckAllChange(val) {
			this.checkObj = this.checkNodeAll(val);
			this.isCheckAll = this.selectAll;
		},
		checkNodeAll(isCheck = true) {
			// 全选
			return this.cityOptions.reduce((opt, item) => {
				opt[item.id] = isCheck ? item.id : -1;
				return opt
			}, {});
		},
		handleCheckedCitiesChange() {
			this.isCheckAll = this.selectAll;
		},
		saveClient() {
			if (this.setBtnType === 'del') {
				let delIdArr = [];
				this.cityOptions.forEach(ele => {
					if (this.checkObj[ele.id] == ele.id) {
						delIdArr.push(ele.id)
					}
				})
				if (!delIdArr.length) {
					this.msgError('请选择删除信息')
					return
				}
				this.comRepeatedRequest(this, deleteLogistics, {ids: delIdArr.join(',')}).then(() => {
					this.showClient = false;
					this.getLogisticsNodes();
				})
				return
			}
			const opt = {
				operationOrderId: this.activities.id,
				nodeShowList: this.cityOptions.map(e => {
					return {
						id: e.id,
						show: this.checkObj[e.id] == e.id ? 1 : 0
					}
				})
			}
			this.comRepeatedRequest(this, postClientNodeShow, opt).then(() => {
				this.showClient = false;
			})
		},
  },
}

