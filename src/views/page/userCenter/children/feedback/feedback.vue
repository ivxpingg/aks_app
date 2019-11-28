<template>
    <div class="feedback-container" :style="{height: height + 'px'}">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         title="建议与反馈" @click-left="com_back"></van-nav-bar>
        </van-sticky>

        <div class="page-body">
            <div class="form-panel">
                <van-cell-group :border="false">
                    <van-field
                            v-model="formData.feedbackTypeLabel"
                            label="反馈类型："
                            readonly
                            clickable
                            @click="popup_show = true"
                            placeholder="请选择">

                    </van-field>
                    <!--<van-field-->
                            <!--v-model="password"-->
                            <!--placeholder="请输入手机号"-->
                            <!--left-icon="phone-o"></van-field>-->
                    <van-field
                            v-model="formData.feedbackContent"
                            type="textarea"
                            :border="false"
                            :maxlength="1000"
                            placeholder="请输入"></van-field>
                </van-cell-group>
            </div>
            <!--提交按钮-->
            <div class="btn-panel">
                <van-button type="primary" round color="rgb(26,216,226)" size="large" @click="save">提 交</van-button>
            </div>
        </div>

        <van-popup
                v-model="popup_show"
                position="bottom">
            <van-picker
                    show-toolbar
                    title="建议类型"
                    value-key="label"
                    :columns="dict_feedbackType"
                    @cancel="popup_show = false"
                    @confirm="onConfirm"
            ></van-picker>
        </van-popup>
    </div>
</template>

<script>
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vfeedback',
        mixins: [comMixin],
        data () {
            return {
                height: 'auto',
                popup_show: false,
                formData: {
                    feedbackType: '',
                    feedbackTypeLabel: '',
                    feedbackContent: ''
                },
                dict_feedbackType: []
            };
        },
        mounted() {
            this.height = window.innerHeight;
            this.com_getDicts(['feedbackType']);
        },
        methods: {
            onConfirm(item) {
                this.formData.feedbackType = item.value;
                this.formData.feedbackTypeLabel = item.label;
                this.popup_show = false;
            },
            validate() {
                let relValue = true;
                if (this.formData.feedbackType === '') {
                    this.$toast('请选择反馈类型！');
                    relValue = false;
                }

                else if (this.formData.feedbackContent === '') {
                    this.$toast('请输入反馈内容！');
                    relValue = false;
                }
                return relValue;
            },
            save() {
                if (this.validate()) {
                    this.loading = true;
                    this.$http({
                        method: 'post',
                        url: '/user/addFeedback',
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
    .feedback-container {
        background-color: #FFF;
        min-height: 500px;
        .page-body {
            padding: 10px;
        }
    }
</style>