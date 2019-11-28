<template>
    <div class="form-container">

        <!--表单1-->
        <div class="form-panel">
            <van-cell-group>
                <van-field
                        v-model="formData.beginAddress"
                        left-icon="location-o"
                        readonly
                        label=" "
                        label-width="20px"
                        @focus="open_popup_selectPosition('start')"
                        placeholder="请选择起点">
                </van-field>
                <van-field
                        v-model="formData.endAddress"
                        left-icon="location-o"
                        readonly
                        label=" "
                        label-width="20px"
                        @focus="open_popup_selectPosition('end')"
                        placeholder="请选择终点">
                </van-field>
                <van-field
                        v-model="formData.beginTime"
                        placeholder="用车开始时间"
                        readonly
                        label=" "
                        label-width="20px"
                        @focus="popup_startTime_value = true"
                        left-icon="clock-o"></van-field>
                <van-field
                        v-model="formData.endTime"
                        placeholder="用车结束时间"
                        readonly
                        label=" "
                        label-width="20px"
                        @focus="popup_endTime_value = true"
                        left-icon="clock-o"></van-field>
                <van-field
                        v-model="formData.seatNum"
                        placeholder="请输入用车人数"
                        type="number"
                        label=" "
                        label-width="20px"
                        left-icon="friends-o">
                    <span slot="right-icon">
                        人
                    </span>
                </van-field>
            </van-cell-group>
        </div>
        <!--表单2-->
        <div class="form-panel">
            <van-cell-group>
                <van-field
                        v-model="formData.contactsName"
                        left-icon="contact"
                        placeholder="姓名"
                        label=" "
                        label-width="20px">

                </van-field>
                <van-field
                        v-model="formData.contactsPhone"
                        placeholder="请输入手机号"
                        left-icon="phone-o"
                        label=" "
                        label-width="20px"></van-field>
                <van-field
                        v-model="formData.description"
                        type="textarea"
                        :maxlength="1000"
                        placeholder="请输入出行需求描述"></van-field>
            </van-cell-group>
        </div>
        <!--说明-->
        <div class="other-panel">
            <div class="btn-text">
                用车说明
                <van-icon name="question-o" size="14px" color="#4881F8"/>
            </div>
            <div class="text">
                <span>*乘客姓名、手机号用于预定司机与您联系!</span>
            </div>
        </div>
        <!--提交按钮-->
        <div class="btn-panel">
            <van-button type="primary"
                        round
                        color="rgb(26,216,226)"
                        size="large"
                        :loading="loading"
                        @click="save()">提交需求</van-button>
        </div>

        <!--地点选择-->
        <van-popup v-model="popup_selectPosition_value"
                   :overlay="false"
                   position="bottom"
                   style="width: 100%; height: 100%;">
            <vSelectPositionByMap ref="selectPositionByMap"
                                  @callback="callbackPosition"
                                  @cancel="popup_selectPosition_value = false"
                                  @onBack="popup_selectPosition_value = false"></vSelectPositionByMap>
        </van-popup>
        <!--开始用车时间-->
        <van-popup v-model="popup_startTime_value" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    @cancel="popup_startTime_value = false"
                    @confirm="dateOk_begin"></van-datetime-picker>
        </van-popup>
        <!--结束用车时间-->
        <van-popup v-model="popup_endTime_value" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    @cancel="popup_endTime_value = false"
                    @confirm="dateOk_end"></van-datetime-picker>
        </van-popup>

    </div>
</template>

<script>
    import vSelectPositionByMap from '../../../../../common/selectPositionByMap/selectPositionByMap';
    export default {
        name: 'vform',  // 包车提交需求
        components: {vSelectPositionByMap},
        data () {
            return {
                popup_selectPosition_value: false,
                selectType: '',
                popup_startTime_value: false,
                popup_endTime_value: false,
                currentDate: new Date(),
                map: null,
                formData: {
                    // rentCarOrderId: '', //	包车订单id
                    beginAddress: '', //	起点名称
                    beginLng: '',
                    beginLat: '',
                    endAddress: '', //	终点名称
                    endLng: '',
                    endLat: '',
                    beginTime: '', //	用车开始时间
                    endTime: '', //	用车结束时间
                    seatNum: '', //	用车人数
                    contactsPhone: '', //	联系人电话
                    contactsName: '', //	联系人
                    description: '', //	描述
                    driverName: '', //	司机名称
                    driverPhone: '', //	司机联系电话
                    carType: '', //	车辆类型
                    licensePlate: '', //	车牌号码
                    invoiceName: '', //	发票名称
                    invoiceNo: '', //	税号
                    insTime: '' //	创建时间
                },
                loading: false
            };
        },
        methods: {
            // 确定开始时间
            dateOk_begin(value) {
                this.popup_startTime_value = false;
                this.formData.beginTime = this.$moment(value).format('YYYY-MM-DD HH:mm');
            },
            // 确定结束时间
            dateOk_end(value) {
                this.popup_endTime_value = false;
                this.formData.endTime = this.$moment(value).format('YYYY-MM-DD HH:mm');
            },
            // 弹出地点选择
            open_popup_selectPosition(type) {
                this.selectType = type;
                this.popup_selectPosition_value = true;
            },
            callbackPosition(data) {
                this.popup_selectPosition_value = false;
                if (this.selectType === 'start') {
                    this.formData.beginAddress = data.title;
                    this.formData.beginLng = data.point.lng;
                    this.formData.beginLat = data.point.lat;
                }
                else if (this.selectType === 'end') {
                    this.formData.endAddress = data.title;
                    this.formData.endLng = data.point.lng;
                    this.formData.endLat = data.point.lat;
                }
            },

            // 表单验证
            validate() {
                let relValue = true;
                if (this.formData.beginAddress.trim() === '') {
                    this.$toast('请选择起点');
                    relValue = false;
                }
                else if (this.formData.endAddress.trim() === '') {
                    this.$toast('请选择终点');
                    relValue = false;
                }
                else if (this.formData.beginTime.trim() === '') {
                    this.$toast('请选择用车开始时间');
                    relValue = false;
                }
                else if (this.formData.endTime.trim() === '') {
                    this.$toast('请选择用车结束时间');
                    relValue = false;
                }
                else if (this.formData.seatNum === '' || this.formData.seatNum === 0) {
                    this.$toast('请输入用车人数');
                    relValue = false;
                }
                else if (this.formData.contactsName.trim() === '') {
                    this.$toast('请输入联系人姓名');
                    relValue = false;
                }
                else if (this.formData.contactsPhone.trim() === '') {
                    this.$toast('请输入联系人手机号');
                    relValue = false;
                }
                return relValue;
            },
            save() {
                this.loading = true;
                if (this.validate()) {
                    this.$http({
                        method: 'post',
                        url: '/rentCar/submitOrder',
                        data: this.formData
                    }).then((res) => {
                        this.loading = false;
                        if (res.code === 'SUCCESS') {
                            this.$toast('提交成功!');
                            this.$router.push({
                                name: 'charteredBusOrderDetail',
                                params: {
                                    id: res.data.rentCarOrderId
                                }
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
    .form-container {
        padding: 0 10px;
        .form-panel {
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: #FFF;
            overflow: hidden;
        }

        .other-panel {
            .btn-text {
                font-size: 12px;
                text-align: right;
            }
            .text {
                color: #999;
                text-align: left;
            }
        }

        .btn-panel {
            margin-top: 10px;
        }
    }
</style>