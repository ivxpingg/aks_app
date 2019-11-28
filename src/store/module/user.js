import axios from '../../lib/axios';
import jsCookie from 'js-cookie';
import Config from '../../config';
export default {
    state: {
        userName: '',
        userType: '',
        headPortrait: '',  // 头像地址
        phone: ''          // 手机号
    },
    mutations: {
        setUserName (state, name) {
            state.userName = name;
        },
        setUserType (state, userType) {
            state.userType = userType;
        },
        setHeadPortrait (state, headPortrait) {
            state.headPortrait = headPortrait;
        },
        setPhone (state, phone) {
            state.phone = phone;
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, {loginName, password}) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'post',
                    url: '/ajaxLogin',
                    data: {
                        loginName,
                        password
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        jsCookie.set(Config.tokenKey, res.data.token, {expires: Config.cookieExpires || 1});
                    }
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }))
        },
        // 登录
        handleTouristLogin ({ commit }, { imei }) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/visitorLogin',
                    params: {
                        imei
                    }
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        jsCookie.set(Config.tokenKey, res.data.token, {expires: Config.cookieExpires || 1});
                    }
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }))
        },
        // 退出登录
        handleLogOut ({ state, commit }) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/logout'
                }).then(res => {
                    jsCookie.set(Config.tokenKey, null);
                    commit('setUserName', '');
                    commit('setUserType', '');
                    commit('setHeadPortrait', '');
                    commit('setPhone', '');
                    commit('setStudentId', '');
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }))
        },
        // 获取用户相关信息
        getUserInfo ({ state, commit }) {
            return new Promise(((resolve, reject) => {
                axios({
                    method: 'get',
                    url: '/user/query'
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        commit('setUserName', res.data.name);
                        commit('setUserType', res.data.userType);
                        // commit('setHeadPortrait', res.data.headPortrait);
                        commit('setPhone', res.data.phone);
                        // commit('setStudentId', res.data.studentId || '');
                        resolve(res);
                    }
                    else {
                        reject(res);
                    }
                }).catch(err => {
                    reject(err);
                })
            }))
        }
    }
}
