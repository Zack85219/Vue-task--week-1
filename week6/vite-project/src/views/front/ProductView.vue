<template>
  我是單一商品
  {{ product }}
  <h2>{{ product.title }}</h2>
  <img :src="product.imageUrl" alt="" class="img-fluid" />
</template>

<script>
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
export default {
  data() {
    return {
      product: {},
    };
  },
  methods: {
    getProduct() {
      //console.log(this.$route.params);
      const { id } = this.$route.params;
      this.$http(`${VITE_API_URL}/api/${VITE_API_PATH}/product/${id}`)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  mounted() {
    this.getProduct();
  },
};
</script>
