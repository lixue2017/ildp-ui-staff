<template>
	<div class="flex-space-between">
		<div v-for="(item, i) in cardList" :key="i" class="card-li"
			:style="`background-color: ${item.bgColor}; width: ${
					100 / cardList.length
				}%`"
		>
			<div
				v-if="item.icon"
				:class="`iconfont ${item.icon}`"
				:style="`color: ${item.valueColor}`"
			></div>

			<div :style="`color: ${item.valueColor}`">
				<div class="txt-top">
					<span :style="`color: ${item.valueColor}cc`">{{ item.labelTop || '--' }}</span>
					<span>{{ infoData[item.topValue] || '--' }}</span>
					<span v-if="item.dictVal" class="tag-green-color">{{ getDictObj(freightType, infoData[item.dictVal]) }}</span>
				</div>
				<div>
					<span :style="`color: ${item.valueColor}cc`">{{ item.labelBottom || '--' }}</span>
					<span>{{ infoData[item.bottomValue] || '--' }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import overseaLangObj from "@/language/overseasLang.js";

export default {
	props: {
		infoData: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			cardList: [{
				bgColor: '#ECF3FF',
    		icon: 'yunshu1',
				labelTop: `${overseaLangObj.mdg_country || "目的国"}：`,
				labelColor: '#80B1FF',
    		valueColor: '#5094FF',
				topValue: 'countryName',
				bottomValue: 'xx_qy_md' // 起运港 -> 目的港
			}, {
				labelTop: `${overseaLangObj.wtr_customer || "委托人"}：`,
				labelBottom: `${overseaLangObj.yw_unit || "业务单位"}：`,
				bgColor: '#FFF3EC',
				labelColor: '#FF985C',
    		valueColor: '#FF813D',
				topValue: 'bailorPeopleName',
				bottomValue: 'businessNnitName',
				dictVal: "freightType"
			}, {
				labelTop: `${overseaLangObj.gz_dh || "工作单号"}：`,
				labelBottom: `${overseaLangObj.mbl_no || "MBL号"}：`,
				bgColor: '#ECECFF',
				labelColor: '#B1B1FF',
    		valueColor: '#7676FF',
				topValue: 'operationOrderNo',
				bottomValue: 'mblNum'
			}, {
				labelTop: "ETA：",
				labelBottom: "ETD：",
				bgColor: '#D2F1FF',
				labelColor: '#64CFFF',
    		valueColor: '#13B5FF',
				topValue: 'ETATime',
				bottomValue: 'ETDTime'
			}]
		}
	},
	computed: {
    ...mapState({
      freightType: (state) => state.dictionary.dicsData.freightType,
    }),
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card-li {
	display: flex;
	padding: 19px 26px 19px 12px;
	margin-right: 24px;
	overflow: hidden;
	border-radius: 4px;
	&:last-child {
		margin-right: 0;
	}
	.iconfont {
		font-size: 35px;
    margin-right: 10px;
	}
	.txt-top {
		margin-bottom: 8px;
	}
	.tag-green-color {
		line-height: 14px;
		height: 18px;
		color: #fff;
		background: rgba(255,129,61,0.7);
		margin-left: 8px;
	}
}
</style>
