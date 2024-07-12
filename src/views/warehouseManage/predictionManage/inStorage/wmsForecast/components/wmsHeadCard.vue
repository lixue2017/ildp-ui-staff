<template>
	<!-- 弃用 -->
	<div class="flex-space-between head-card-ul">
		<div v-for="(item, i) in cardList" :key="i" class="card-li"
			:style="`background-color: ${item.bgColor}; width: ${
					100 / cardList.length
				}%`"
		>
			<div :style="`color: ${item.valueColor}`">
				<div class="txt-top">
					<span :style="`color: ${item.valueColor}cc`">{{ item.labelTit }}</span>
				</div>
				<div v-if="[0, 1].includes(i)" class="tit-value">
					{{ infoData[item.topValue] || '--' }}
				</div>
				<template v-else>
					<div class="txt-top">
						<span :style="`color: ${item.valueColor}cc`">{{ item.labelTop || '--' }}</span>
						<span>{{ formatMoney(infoData[item.topValue], item.decimal) }}</span>
					</div>
					<div>
						<span :style="`color: ${item.valueColor}cc`">{{ item.labelBottom || '--' }}</span>
						<span>{{ formatMoney(infoData[item.bottomValue], item.decimal) }}</span>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>

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
				labelTit: this.overseaLangObj.wtr_customer || "委托人",
				bgColor: '#ECF3FF',
    		valueColor: '#5094FF',
				topValue: 'customerName',
			}, {
				labelTit: this.overseaLangObj.gz_dh || "工作单号",
				bgColor: '#FFF3EC',
    		valueColor: '#FF813D',
				topValue: 'orderSn',
			}, {
				labelTit: this.overseaLangObj.hj_ys_yf,
				labelTop: `${this.overseaLangObj.ys_receivable}：`,
				labelBottom: `${this.overseaLangObj.yf_meet}：`,
				bgColor: '#ECECFF',
    		valueColor: '#7676FF',
				topValue: 'totalReceiveRMB',
				bottomValue: 'totalPayRMB',
				decimal: 2,
			}, {
				labelTit: this.overseaLangObj.hj_ss_sf,
				labelTop: `${this.overseaLangObj.sh_net_receipts}：`,
				labelBottom: `${this.overseaLangObj.sh_actual_payment}：`,
				bgColor: '#D2F1FF',
    		valueColor: '#13B5FF',
				topValue: 'totalRealityReceiveRMB',
				bottomValue: 'totalRealityPayRMB',
				decimal: 2,
			}]
		}
	},
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.head-card-ul {
	margin-bottom: 12px;
	.card-li {
		display: flex;
		padding: 19px 26px 19px 12px;
		margin-right: 24px;
		overflow: hidden;
		border-radius: 4px;
		&:last-child {
			margin-right: 0;
		}
		.txt-top {
			margin-bottom: 8px;
		}
		.tit-value {
			padding-top: 6px;
			font-size: 16px;
			font-weight: 500;
		}
	}
}
</style>
