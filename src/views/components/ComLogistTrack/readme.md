```
<ComLogistTrack ref="myLogistTrack" :activities="activities">
  <template v-slot:title="slotProps">
    <span class="orange-bg" v-if="slotProps.activity.status">
      {{ slotProps.activity.timeConsume }}</span
    >
  </template>
  <template v-slot:operationDate="slotProps">
    <span> {{ slotProps.activity.updateTime }}</span>
  </template>
  <template v-slot:operationContent="slotProps">
    <span> {{ slotProps.activity.content }}</span>
  </template>
</ComLogistTrack>


activities: {
  showBasic: true,
  basicInfo: {
    no: "BSNL21090036",
    status: 2,
    depart: "深圳",
    arrive: "DE[德国]",
    vehicle: "sea",
    totalTime: "2天14时16分",
  },
  list: [
    {
      timeConsume: "耗时：1天15时25分",
      status: 1,
    },
    {
      updateTime: "2021/12/28 14:46:08",
      content: "FD-BST-211201-0002",
    },
    {
      updateTime: "2021/12/28 18:46:08",
      content: "【WRO5】货物25CTNS(FBA15FJ82NHQ)POD已上传",
    },
    {
      timeConsume: "耗时：1天15时25分",
      status: 2,
    },
    {
      updateTime: "2021/12/27 18:46:08",
      content: "【WRO5】货物25CTNS(FBA15FJ82NHQ)POD已上传",
    },
    {
      timeConsume: "发",
      status: 3,
    },
    {
      updateTime: "2021/12/27 18:46:08",
      content: "【WRO5】货物25CTNS(FBA15FJ82NHQ)POD已上传",
    },
  ],
}
```