<template>
    <div class="payType-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="支付" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body" :style="{height: height}">
            <van-cell-group>
                <van-field
                        v-model="formData.payTypeLabel"
                        label="支付类型："
                        label-width="75px"
                        readonly
                        clickable
                        @click="popup_show = true"
                        placeholder="请选择">

                </van-field>
                <van-field
                        v-model="formData.totalPrice"
                        label="支付金额："
                        label-width="75px"
                        type="number"
                        placeholder="请输入支付金额">
                    <span slot="right-icon">元</span>
                </van-field>
            </van-cell-group>

            <div class="btn-panel">
                <van-button type="primary"
                            round
                            color="rgb(26,216,226)"
                            size="large"
                            :loading="loading"
                            @click="save">确认支付</van-button>
            </div>
        </div>

        <van-popup
                v-model="popup_show"
                position="bottom">
            <van-picker
                    show-toolbar
                    title="支付类型"
                    value-key="label"
                    :columns="dict_payType"
                    @cancel="popup_show = false"
                    @confirm="onConfirm"
            ></van-picker>
        </van-popup>

        <!--<van-overlay :show="show" @click="show = false"></van-overlay>-->
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vpayType',  // 包车支付类型
        mixins: [comMixin],
        data () {
            return {
                height: 'auto',
                loading: false,
                formData: {
                    rentCarOrderId: '',
                    payType: '', // 支付方式
                    payTypeLabel: '',
                    totalPrice: '', // 支付金额
                },
                popup_show: false,
                dict_payType: []
            };
        },
        mounted() {
            this.height = (window.innerHeight - 46) + 'px';
            this.formData.rentCarOrderId = this.$route.params.id;
            this.com_getDicts(['payType']);
        },
        methods: {
            onConfirm(item) {
                this.formData.payType = item.value;
                this.formData.payTypeLabel = item.label;
                this.popup_show = false;
            },
            validate() {
                let relValue = true;
                if (this.formData.payType === '') {
                    this.$toast('请选择支付类型');
                    relValue = false;
                }

                else if (this.formData.totalPrice === '') {
                    this.$toast('请输入支付金额');
                    relValue = false;
                }
                return relValue;
            },
            save() {
                if (this.validate()) {
                    this.loading = true;
                    this.$http({
                        method: 'get',
                        url: '/rentCar/confirmPay',
                        params: this.formData
                    }).then((res) => {
                        this.loading = false;
                        if (res.code === 'SUCCESS') {
                            this.$toast('确认支付成功!');
                            setTimeout(() => {
                                this.com_back();
                            }, 3000);
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
    .payType-container {
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