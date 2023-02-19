<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
      <div class="col-8">
        <form class="form-signin" @submit.prevent="userLogin">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              v-model="user.username"
              id="floatingInput"
              placeholder="name@example.com"
              required
              autofocus
            />
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              v-model="user.password"
              id="floatingPassword"
              placeholder="Password"
              required
            />
            <label for="floatingPassword">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        // 必須是username和password才會符合api文件定義的規格，不然會得到Bad Request
        username: "",
        password: "",
      },
    };
  },
  methods: {
    userLogin() {
      const url = "https://vue3-course-api.hexschool.io/v2/admin/signin";
      this.$http
        .post(url, this.user)
        .then((res) => {
          // 寫入cookie token
          // expires 設置有效時間
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token};expires=${new Date(
            expired
          )}; path=/`;
          this.$router.push("/admin/adminProducts");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
