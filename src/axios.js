import axios from 'axios'
import Element from "element-ui";
import store from "./store";
import router from "./router";
axios.defaults.baseURL='http://localhost:8081/project1_war_exploded'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.interceptors.request.use(config => {
    config.headers.Authentication = localStorage.getItem("authentication");
    // 可以统一设置请求头
    return config
})
axios.interceptors.response.use(response => {
        const _this = this;
        const res = response.data;
        // 当结果的code是否为200的情况
        if (res.status === 200) {
            return response
        } else {
            // 弹窗异常信息
            Element.Message({
                message: response.data.message,
                type: 'error',
                duration: 2 * 1000
            })
            console.log(res.status)
            if(res.status === 401){
                window.location.href = "/"
            }
            console.log("error_use")
            console.log(res)
            // 直接拒绝往下面返回结果信息
            return Promise.reject(response.data.message)
        }
    },
    error => {
        console.log("error")
        console.log('err' + error)// for debug
        if(error.response.data) {
            error.message = error.response.data.msg
        }
        // 根据请求状态觉得是否登录或者提示其他
        if (error.response.status === 401) {
            store.commit('REMOVE_INFO');
            router.push({
                path: '/login'
            });
            error.message = '请重新登录';
        }
        if (error.response.status === 403) {
            error.message = '权限不足，无法访问';
        };
        if(error.response.status === 404){
            console.log(404)
        }
        if(error.re)
        Element.Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })
        return Promise.reject(error)
    })