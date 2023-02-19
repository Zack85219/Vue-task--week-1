<template>
  這是前台頁面
  <RouterLink to="/">Home</RouterLink> |
  <RouterLink to="/cart">購物車</RouterLink> |
  <RouterLink to="/products">產品列表</RouterLink> |
  <RouterLink to="/about">關於</RouterLink> |
  <RouterLink to="/login">登入</RouterLink> |
  <RouterLink to="/admin/adminProducts">後台產品列表</RouterLink> |
  <hr />
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from "vue-router";
export default {
  components: {
    RouterView,
  },
};
</script>
