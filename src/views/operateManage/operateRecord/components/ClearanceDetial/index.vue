<template>
  <TraditionalCustomsDetail />
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
