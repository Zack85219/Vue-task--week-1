<template>
  這是後台頁面
  <RouterLink to="/admin/adminOrders">後台訂單列表</RouterLink> |
  <RouterLink to="/admin/adminProducts">後台產品列表</RouterLink> |
  <a href="#" @click.prevent="logout">登出</a> |
  <hr />
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from "vue-router";
const { VITE_API_URL } = import.meta.env;
export default {
  components: {
    RouterView,
  },
  methods: {
    logout() {
      document.cookie = `hexToken=;expires=${new Date()}`;
      this.$router.push("/login");
    },
    checkLogin() {
      // 取出Token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      this.$http.defaults.headers.common.Authorization = token;

      this.$http
        .post(`${VITE_API_URL}/api/user/check`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          this.$router.push("/login");
        });
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>
