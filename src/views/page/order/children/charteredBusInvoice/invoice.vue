<template>
    <div class="invoice-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="开票" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body" :style="{height: height}">
            <van-cell-group>
                <van-field
                        v-model="formData.invoiceName"
                        label="公司名称："
                        label-width="75px"
                        placeholder="请输入">

                </van-field>
                <van-field
                        v-model="formData.invoiceNo"
                        label="税号："
                        label-width="75px"
                        placeholder="请输入">
                </van-field>
            </van-cell-group>

            <div class="btn-panel">
                <van-button type="primary"
                            round
                            color="rgb(26,216,226)"
                            size="large"
                            :loading="loading"
                            @click="save">提 交</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vinvoice',  // 包车发票申请
        mixins: [comMixin],
        data () {
            return {
                height: 'auto',
                loading: false,
                formData: {
                    rentCarOrderId: '',
                    invoiceName: '', //	公司名称
                    invoiceNo: '', //	税号
                },
            };
        },
        mounted() {
            this.height = (window.innerHeight - 46) + 'px';
            this.formData.rentCarOrderId = this.$route.params.id;
        },
        methods: {
            validate() {
                let relValue = true;
                if (this.formData.invoiceName === '') {
                    this.$toast('请输入公司名称');
                    relValue = false;
                }

                else if (this.formData.invoiceNo === '') {
                    this.$toast('请输入税号');
                    relValue = false;
                }
                return true;
            },
            save() {
                if (this.validate()) {
                    this.loading = true;
                    this.$http({
                        method: 'post',
                        url: '/rentCar/askInvoice',
                        data: this.formData
                    }).then((res) => {
                        this.loading = false;
                        if (res.code === 'SUCCESS') {
                            this.$toast('提交成功!');
                            this.com_back();
                        }
                    }).catch(() => {
                        this.loading = false;
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .invoice-container {
        .page-body {
            position: relative;
            background-color: #FFF;
            padding: 10px;

            .btn-panel {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 10px;
            }
        }
    }
</style>