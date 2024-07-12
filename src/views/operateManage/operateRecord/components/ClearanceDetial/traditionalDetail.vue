<template>
  <TraditionalCustomsDetail pageSource="tradition_customs" />
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {
    TraditionalCustomsDetail: () => import("./detailPage"),
  },
};
</script>
