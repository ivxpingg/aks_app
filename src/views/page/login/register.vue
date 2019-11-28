<template>
    <div class="register-container">
        <div class="field-group">
            <van-field
                    v-model="formData.name"
                    left-icon="manager"
                    placeholder="用户名">
                <!--<van-icon slot="left-icon" class-prefix="icon iconfont iconyonghu" name="extra" />-->
            </van-field>
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
                            type="primary"
                            :disabled="second !== 0"
                            @click="sendCode">发送验证码{{secondText}}</van-button>
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
        <div style="padding-top: 20px;">
            <van-button round type="info"
                        color="rgb(26,216,226)"
                        size="large"
                        :loading="loading" @click="onRegister">注 册</van-button>
        </div>
    </div>
</template>

<script>
    import MD5 from 'md5';
    import Config from '../../../config/index';
    export default {
        name: 'vregister',
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
                    name: '',
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
                        sendType: 'Register'
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
                if (this.formData.name.trim() === '') {
                    this.$toast('请输入用户名');
                    return false;
                }
                else if (this.formData.phone.trim() === '') {
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
                return true;
            },
            onRegister() {
                this.loading = true;
                if (this.validate()) {
                    this.formData.password = MD5(this.formData.passwordInput + Config.passwordKey);
                    this.$http({
                        method: 'post',
                        url: '/user/register',
                        data: this.formData
                    }).then((res) => {
                        this.loading = false;
                        if (res.code === 'SUCCESS') {
                            this.$toast('注册成功!');
                            this.formData.name = '';
                            this.formData.phone = '';
                            this.formData.code = '';
                            this.formData.password = '';
                            this.formData.passwordInput = '';
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
    .register-container {
    }
</style>
<style lang="scss">
    .register-container {
        .van-field__left-icon {
            margin-right: 15px;
        }
    }
</style>