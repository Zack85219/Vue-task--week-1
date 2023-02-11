export default {
    template: '#userProductModal',
    props: {
        // 沒看過的寫法
        product:{
            type: Object,
            default(){
            return {
                }
            }
        }
    },
    data(){
        return {
            status: {},
            modal: '',
            qty: 1
        };
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal,{
            keyboard: false,
            backdrop: 'static'
        });
        
    },
    methods: {
        openModal(){
            this.modal.show();
            //console.log(this.modal);
        },
        hideModal(){
            this.modal.hide();
        }
    }
}