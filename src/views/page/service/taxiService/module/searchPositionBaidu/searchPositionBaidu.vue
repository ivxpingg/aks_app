<template>
    <div class="searchPositionBaidu-container">
        <van-sticky :offset-top="0" style="z-index: 99;">
            <van-search ref="search"
                        v-model="searchParams.value"
                        show-action
                        shape="round"
                        :placeholder="placeholder"
                        @input="onSearch"
                        @cancel="$emit('cancel')">
            </van-search>
        </van-sticky>

        <div ref="page_main" class="page-main" id="searchPositionBaidu_page_main" :style="{height: height + 'px'}">

            <div class="page-main-inner">
                <van-cell-group>
                    <template v-for="item in searchResultList">
                        <van-cell :title="item.title"
                                  :key="item.address"
                                  icon="location-o"
                                  :label="item.address"
                                  @click="onSelectCell(item)" ></van-cell>
                    </template>
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vSearchPositionBaidu',
        props: {
            map: {
                type: Object,
                default: ''
            },
            placeholder: {
                type: String,
                default: '请输入'
            }
        },
        data () {
            let that = this;
            return {
                height: 0,
                scroll: null,
                searchParams: {
                    value: ''
                },
                local: null,
                options: {
                    onSearchComplete (results) {
                        // 判断状态是否正确
                        if (that.local.getStatus() === BMAP_STATUS_SUCCESS) {
                            that.searchResultList = [];
                            for (let i = 0; i < results.getCurrentNumPois(); i ++){
                                that.searchResultList.push({
                                    title: results.getPoi(i).title,
                                    address: results.getPoi(i).address,
                                    result: results,
                                    idx: i
                                });

                            }
                        }
                    }
                },
                searchResultList: [

                ]
            };
        },
        watch: {
            map: {
                immediate: true,
                handler(val) {
                    let that = this;
                    if (val) {
                        if (val && !this.local) {
                            this.local = new BMap.LocalSearch(this.map, this.options);
                        }
                    }
                }
            }
        },
        mounted() {
            this.height = window.innerHeight - 54;
        },
        methods: {
            onSearch() {
                this.local.search(this.searchParams.value);
            },
            onSelectCell(item) {
                this.$emit('callback', item);
                this.searchParams.value = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .searchPositionBaidu-container {
        .page-main {
            padding: 10px;
            overflow: hidden;
            background-color: transparent;
            .page-main-inner {
                height: 100%;
                background-color: #FFF;
                box-shadow: 0 0 3px #ebedf0;
                overflow-y: auto;
            }
        }
    }
</style>