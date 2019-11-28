<template>
    <div class="forgetPwd-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="修改密码" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            <div class="field-group">
                <van-field
                        v-model="formData.phone"
                        left-icon="phone"
                        placeholder="手机号码"></van-field>
                <van-field
                        v-model="formData.code"
                        center
                        clearable
                        left-icon="comment"
                        placeholder="请输入短信验证码">
                    <van-button slot="button"
                                size="small"
                                :disabled="second !== 0"
                                @click="sendCode"
                                type="primary">发送验证码{{secondText}}</van-button>
                </van-field>
                <van-field
                        v-model="formData.passwordInput"
                        left-icon="lock"
                        :type="onFocus ? 'text': 'password'"
                        @focus="onFocus = true"
                        @blur="onFocus = false"
                        placeholder="设置密码"></van-field>

                <div class="van-cell"></div>
            </div>
            <div>
                <van-button round type="info"
                            color="rgb(26,216,226)"
                            size="large"
                            :loading="loading"
                            @click="onChangePwd">修 改</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import comMixin from '../../../lib/mixins/comMixin';
    import MD5 from 'md5';
    import Config from '../../../config/index';
    export default {
        name: 'vforgetPwd',
        mixins: [comMixin],
        computed: {
            secondText() {
                return this.second > 0 ? `(${this.second}s)` : '';
            }
        },
        data () {
            return {
                onFocus: false,
                loading: false,
                formData: {
                    phone: '',
                    code: '',
                    password: '',
                    passwordInput: ''
                },
                second: 0
            };
        },
        methods: {
            sendCode() {
                if (this.formData.phone.trim() === '') {
                    this.$toast('请输入手机号码!');
                    return;
                }
                this.second = 60;
                this.setTime();
                this.$http({
                    method: 'get',
                    url: '/user/sendCode',
                    params: {
                        phone: this.formData.phone.trim(),
                        sendType: 'ForgetPassword'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.$toast('发送成功!');
                    }
                    else {
                        this.second = 0;
                        this.$toast(res.msg);
                    }
                }).catch((err) => {
                    this.second = 0;
                })
            },
            // 发送验证码倒计时
            setTime() {
                setTimeout(() => {
                    if (this.second > 0) {
                        this.second--;
                        this.setTime();
                    }
                }, 1000)
            },
            validate() {
                if (this.formData.phone.trim() === '') {
                    this.$toast('请输入手机号码');
                    return false;
                }
                else if (this.formData.code.trim() === '') {
                    this.$toast('请输入验证码');
                    return false;
                }
                else if (this.formData.passwordInput.trim() === '') {
                    this.$toast('请输入密码');
                    return false;
                }
                else if (this.formData.passwordInput.trim().length < 6) {
                    this.$toast('密码长度不能小于6位');
                    return false;
                }
                return true;
            },
            onChangePwd() {
                this.loading = true;
                if (this.validate()) {
                    this.formData.password = MD5(this.formData.passwordInput + Config.passwordKey);
                    this.$http({
                        method: 'post',
                        url: '/user/forgetPassword',
                        data: this.formData
                    }).then((res) => {
                        this.loading = false;
                        if (res.code === 'SUCCESS') {
                            this.$toast('修改成功!');
                            this.$router.push({
                                name: 'login'
                            })
                        }
                    }).catch(() => {
                        this.loading = false;
                    })
                }
                else {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .forgetPwd-container {
        .page-body {
            padding: 10px;
        }
    }
</style>