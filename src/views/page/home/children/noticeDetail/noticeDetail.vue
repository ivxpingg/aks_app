<template>
    <div class="noticeDetail-container">
        <van-sticky :offset-top="0">
            <van-nav-bar class="nav-bar-main"
                         left-arrow
                         :title="formData.title" @click-left="com_back"></van-nav-bar>
        </van-sticky>
        <div class="page-body" :style="{height: height + 'px'}">
            <iframe :src="iframeUrl" width="100%" :height="height" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
    import Config from '../../../../../config';
    import comMixin from '../../../../../lib/mixins/comMixin';
    export default {
        name: 'vnoticeDetail',
        mixins: [comMixin],
        data () {
            return {
                height: 300,
                newsId: '',
                formData: {
                    title: ''
                },
                iframeUrl: ''
            };
        },
        mounted() {
            this.height = window.innerHeight - 46;
            this.newsId = this.$route.params.id;
            this.getData();
        },
        methods: {
            getData() {
                this.$http({
                    method: 'get',
                    url: '/index/newsDetail',
                    params: {
                        newsId: this.newsId
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        Object.assign(this.formData, res.data);
                        if (res.data.newsType === 'third_url') {
                            this.iframeUrl = res.data.newsContent;
                        }
                        else if(res.data.newsType === 'image_text') {
                            this.getUrl();
                        }
                    }
                })
            },
            getUrl() {
                this.$http({
                    method: 'get',
                    url: '/file/attachList',
                    params: {
                        relationId: this.newsId,
                        fileType: 'news'
                    }
                }).then((res) => {
                    if (res.code === 'SUCCESS') {
                        this.iframeUrl = Config.filePath + res.data[0].url;
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .noticeDetail-container {
    }
</style>