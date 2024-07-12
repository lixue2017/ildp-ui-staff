/** @format */

import ComTable from "./ComTable.vue";
export default ComTable;

/**
 * 文字列--左对齐
 * 所有数据长度小于等于2且字符长度相同的列--居中对齐，（例如，是与否）
 * 数字列--右标题对齐
 * customRow: true,
 * 
 * 列表的 删除、打回 按钮配置为红色 color: "#FF6767",
 * import { customMessageBox } from "@/utils/confirmBox.js";
 * customMessageBox(this, {
		msgTitle: "删除提示",
		msgTxtColor: "#FF6767",
		httpMsgRequest: () => httpDelRequest(row.id),
	}, () => {
		this.msgSuccess("删除成功");
		this.mixinkeepTable();
	})
 * 
	<template v-slot:customRow="{ slotProps }">
		<template v-if="slotProps.prop === 'type'">
			{{ slotProps.row }} - {{ slotProps.dicsList.nameCn }}
		</template>
	</template>
 * 
 * 	{
			prop: "xx_key",
			label: "名称",
			minWidth: 120,
			// sortable: true, // 是否排序
			showOverflowTooltip: true,
			// fixed: "left" / "right",
			// decimal: 2, // 数字显示几位小数点
			// align: "right", // 数字右对齐
			// request: true, // 必填表格列

			// editCellKeyName: "rBtnUpdate", // 非单独处理时显示文本: 如非编辑状态
			// noEditCellKey: 'see'
			v-if="
				(column.editCellKeyName &&
					!scope.row[column.editCellKeyName || 'rBtnUpdate']) ||
				(column.noEditCellKey && scope.row[column.noEditCellKey])
			"


			labelTop: "xxxx", // 表头上下行显示
			labelBottom: "xxxx",
			headerTopBottom: true,
			prop: "atdtime",


			表格内容上下结构
			columnTopBottom: true,
			bottomProp: "xxx",
			bottomDecimal: 2,
			renderBottom: (r) => {}
			
			prop: "createTime", // 客户端上下结构操作列
			label: "创建时间",
			width: 152,
			align: "left",
			fixed: "right",
			columnTopBottom: true,
			showOverflowTooltip: true,
			columnBottom: {
				columnOperation: true,
				columnMoreOperation: true,
			},

			columnBottom: { // 字典词
				prop: "freightType",
				basicType: "freightType",
			},
			// 多个字典词
			renderBottom: (r) => getDictObj("returnDictType", r.returnType).join(", ") || "--",
		}
		<ComTable
			:isMountedRequest="false" // 初始化时是否调用表格接口, 不传时默认true
		/>
		
		this.$refs.tableRef.setNewTableData([])
 * 
 * 1、操作按钮配置
* 	:rowOperationBtnListFn="(row) => tableBtnList"
		// :rowOperationBtnListFn="(r) => tableStatusList(r)"
* 	// 操作按钮列表，考虑到无按钮显示 -- ，需要传函数返回值
* 
		:colShowBtnFn="(btnItem, row, column) => operationBtnFn"
		// 单个按钮判断，默认显示为true

		@handleRowBtnClick="(row, btnItem) => "
		// 返回按钮类型，根据类型调不同接口

		columnOperation: true
		columnMoreOperation: true // 超过三个显示更多按钮

	2、列表链接配置
		columnLink: true
		this.$emit('handleTableView', row, column)
	
	3、列表字体颜色配置
		basicType
		fontColor: true, // 字体颜色
		colBgColor: true // 字体背景色
		dotColor: true // 状态小点

	4、计算table高度

		:tableHeight="tableAutoHeight"

		computed: {
			tableAutoHeight() {
				const tableLen = this.tableConfig.columnData.length;
				return tableLen > 5 ? `${6 * 39 + 54}px` : undefined
				// 小于等于5行时不出现滚动条 表格行数 * 单行高度 + 表头高度
			},
		},


		列表页高度
			<ComForm @searchHeight="searchHeight" /> // 计算查询表单高度

			:tableHeight="`calc(100vh - ${extraHeight + formHeight}px)`"
			

	5、表格合计
		import { accumulationFn } from "@/utils/instructions";
		<template v-slot:bottomTotal></template>
		
		<div class="grand-total">
			<template v-for="(tItem, i) in tableSubtotal">
				<span :key="`t_${i}`">
					<span>{{ tItem.totalLabel }}：</span>
					<span>{{ tItem.totalNum }}</span>
				</span>
			</template>
		</div>

		@getResult="getTableResult"

		getTableResult({ tableData }) {
			this.calcNumTotal(tableData);
		},

		calcNumTotal(arr = []) {
			this.tableSubtotal = [{
				totalLabel: "总箱数",
				totalNum: accumulationFn(arr.map(e => e.productTotal))
			}, {
				totalLabel: "总重量(KG)",
				totalNum: accumulationFn(arr.map(e => e.weight), 2)
			}]
		},


		6、表格编辑行数据处理
		
			<el-input-number
				size="mini"
				v-model="slotPropsRow(slotProps.row, slotProps.prop)[item.keyName]"
				v-input-number-limit="4"
				:placeholder="slotProps.column.placeholder"
				:controls="false"
			/>

			slotPropsRow(row, key) {
				// 无值时改为undefined，否则会显示数字 0
				row[key] = row[key] === null ? undefined : row[key];
				return row;
			},
		

		7、表格行多选
			:selectionRow="selectionRowEvt"
			@onSelectionChange="onTableSelectionChange"
			:selectionTableRow="[...selectionRows]"

			watch: {
				'selectionRows.length'(sLen) {
					this.$set(this.tabsConfig.btnArr[0], "disabled", !sLen);
				}

				// selectionRows: {
				// 	deep: true,
				// 	handler: function (newVal) {
				// 		const { activeName } = this.tabsConfig;
				// 		this.$set(this.tabsConfig.btnArr[activeName - 1], "disabled", !newVal[activeName].length);
				// 	},
				// },
			}


			selectionRows: { // 多个tab页签同时有多选
        1: [],
        2: [],
      },


		8、表格行单选
			:current-row="true" // 单选时高亮当前行
			@onCurrentChange="(r) => onCurRowChange(r)"

			onCurRowChange(row) {
				this.radioRow = row;
			},

			// 选中第一行
			this.$refs.tableRef?.setComCurrentRow(tableData[0]);

			{
				prop: "radioSlot",
				label: "",
				minWidth: 36,
				customRow: true,
			}
			<template  v-if="slotProps.prop === 'rowRadio'">
				<el-radio
					style="margin: 0"
					class="el-table-radio"
					v-model="radioRow.id"
					:label="slotProps.row.id"
					>.</el-radio
				>
			</template>

 */
