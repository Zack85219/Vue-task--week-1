<template>
  <table>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.title }}</td>
        <td><img :src="item.imageUrl" alt="" width="200" /></td>
        <td>{{ item.content }}</td>
        <td>
          <!-- to後面要有雙引號再包樣板字面字 -->
          <RouterLink
            :to="`/product/${item.id}`"
            class="btn btn-outline-secondary"
            >連結單一產品</RouterLink
          >
          <button class="btn btn-outline-primary" @click="addToCart(item.id)">
            加入購物車
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { RouterLink } from "vue-router";
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

export default {
  data() {
    return {
      products: [],
    };
  },
  components: {
    RouterLink,
  },
  methods: {
    getProducts() {
      this.$http
        .get(`${VITE_API_URL}/api/${VITE_API_PATH}/products/all`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    addToCart(id) {
      const data = {
        product_id: id,
        qty: 1,
      };
      // data要再包一層物件
      this.$http
        .post(`${VITE_API_URL}/api/${VITE_API_PATH}/cart`, { data })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
