<template>
  <div class="container">
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="deleteAllCarts"
      >
        清空購物車
      </button>
    </div>

    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="removeCartItem(item.id)"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="loadingStatus.loadingItem === item.id"
                ></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">已套用優惠券</div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <input
                    v-model.number="item.qty"
                    @blur="updateCart(item)"
                    min="1"
                    type="number"
                    class="form-control"
                  />
                  <span class="input-group-text" id="basic-addon2">{{
                    item.product.unit
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-end">
              <small v-if="cart.final_total !== cart.total" class="text-success"
                >折扣價：</small
              >
              {{ item.final_total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-if="cart.carts">
        <tr>
          <td colspan="3" class="text-end">
            {{ cart.total === 0 ? "" : "總計" }}
          </td>
          <td class="text-end">{{ cart.total === 0 ? "" : cart.total }}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="d-flex justify-content-center">
      {{ cart.total === 0 ? "目前沒有商品" : "" }}
    </div>
    <VueLoading :active="isLoading" class="page-loading"></VueLoading>
    <div class="my-5 row justify-content-center">
      <VueForm
        ref="form"
        class="col-md-6"
        v-slot="{ errors }"
        @submit="createOrder"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <VueField
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="form.user.email"
          ></VueField>
          <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <VueField
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="form.user.name"
          ></VueField>
          <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <VueField
            id="tel"
            name="電話"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            rules="required|min:8|max:10"
            v-model="form.user.tel"
          ></VueField>
          <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <VueField
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="form.user.address"
          ></VueField>
          <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            name=""
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </VueForm>
    </div>
  </div>
</template>

<script>
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
export default {
  data() {
    return {
      loadingStatus: {
        loadingItem: "",
      },
      products: [],
      product: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      cart: {},
      isLoading: false,
    };
  },
  methods: {
    getProducts() {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/products`;
      this.$http
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    getProduct(id) {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      this.$http
        .get(url)
        .then((res) => {
          this.loadingStatus.loadingItem = "";
          this.product = res.data.product;

          this.$refs.userProductModal.openModal();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    addToCart(id, qty = 1) {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/cart`;
      this.loadingStatus.loadingItem = id;
      // 照api的要求，設定cart的屬性
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      this.$http
        .post(url, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/cart/${data.id}`;
      // 照api的要求，設定cart的屬性
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };

      this.$http
        .put(url, { data: cart })
        .then((res) => {
          this.loadingStatus.loadingItem = "";
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          this.loadingStatus.loadingItem = "";
          alert(err.response.data.message);
        });
    },
    deleteAllCarts() {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/carts`;

      this.$http
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/cart`;
      this.$http
        .get(url)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    removeCartItem(id) {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      this.$http
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    createOrder() {
      const url = `${VITE_API_URL}/api/${VITE_API_PATH}/order`;
      const order = this.form;
      this.$http
        .post(url, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.isLoading = true;
    this.getProducts();
    this.getCart();
  },
};
</script>
<style scoped>
.page-loading {
  display: flex;
  justify-content: center;
}
</style>
