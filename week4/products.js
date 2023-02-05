import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import pagination from "./pagination.js";

let productModal = null;
let delModal = null;
const app = createApp({
  data() {
    return {
      apiEP: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "59487@@",
      isNew: false,
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      page: {},
    };
  },
  components: {
    pagination,
  },
  methods: {
    checkAdmin() {
      const apiUrl = `${this.apiEP}/api/user/check`;
      axios
        .post(apiUrl)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          console.log(err.data);
          window.location = "login.html";
        });
    },
    getData(page = 1) {
      const apiUrl = `${this.apiEP}/api/${this.apiPath}/admin/products?page=${page}`;
      // 避免重複點擊所發出的get請求
      if (this.page.current_page !== page) {
        axios
          .get(apiUrl)
          .then((res) => {
            this.products = res.data.products;
            this.page = res.data.pagination;
          })
          .catch((err) => {
            console.log(err.data);
          });
      }
    },
    showEditModal(item) {
      this.isNew = false;
      this.tempProduct = { ...item };

      // 打開Modal
      productModal.show();
    },
    showBlankModal() {
      // 打開Modal
      this.isNew = true;
      this.tempProduct = {};
      productModal.show();
    },
    showDelModal(item) {
      this.tempProduct = { ...item };
      // 打開Modal
      delModal.show();
    },

    updateData(id) {
      let api = "";
      let method = "";
      if (!this.isNew) {
        api = `${this.apiEP}/api/${this.apiPath}/admin/product/${id}`;
        method = "put";
      }
      if (this.isNew) {
        api = `${this.apiEP}/api/${this.apiPath}/admin/product`;
        method = "post";
      }
      axios[method](api, { data: this.tempProduct })
        .then((res) => {
          this.getData();
          alert(res.data.message);
          productModal.hide();
        })
        .catch((err) => {
          console.log(err.data);
          alert("編輯/新增失敗!");
        });
    },
    deleteData() {
      const delApi = `${this.apiEP}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(delApi, { data: this.tempProduct })
        .then((res) => {
          this.getData();
          alert(res.data.message);
          delModal.hide();
        })
        .catch((err) => {
          console.log(err.data);
        });
    },
    createImage(imgUrl) {
      if (!this.tempProduct.imageUrl) {
        this.tempProduct.imageUrl = imgUrl;
      } else if (!this.tempProduct.imagesUrl && this.tempProduct.imageUrl) {
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push(imgUrl);
      } else if (this.tempProduct.imagesUrl && this.tempProduct.imageUrl) {
        this.tempProduct.imagesUrl.push(imgUrl);
      }
    },
    delImage(id) {
      if (this.tempProduct.imagesUrl) {
        this.tempProduct.imagesUrl.splice(id, 1);
      } else {
        this.tempProduct.imageUrl = null;
      }

      alert("已刪除圖片");
    },
  },

  mounted() {
    // 取出Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    // 建立Modal實體
    productModal = new bootstrap.Modal(document.getElementById("productModal"));
    delModal = new bootstrap.Modal(document.getElementById("delProductModal"));

    this.checkAdmin();
  },
});

app.component("delModal", {
  template: "#del-modal-template",
  props: ["tempProduct", "delData"],
});

app.component("productModal", {
  data() {
    return {
      newImage: "",
    };
  },
  template: "#product-modal-template",
  // 內部元件裡無法直接用v-modal與外部元件互動
  props: ["isNew", "tempProduct", "updateData", "delImage"],
  methods: {
    // emit的使用方法
    // 1.先定義外層接收的方法 2. 定義內層$emit的觸發方法 3. 使用v-on的方式觸發外層方法
    createImage() {
      console.log("img");
      this.$emit("emit-create-img", this.newImage);
      this.newImage = "";
    },
  },
});

app.mount("#app");
