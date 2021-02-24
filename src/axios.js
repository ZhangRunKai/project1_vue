import axios from 'axios'
import Element from "element-ui";
import store from "./store";
import router from "./router";
// axios.defaults.baseURL='http://47.110.229.61:8889/project1_war/'
axios.defaults.baseURL='http://localhost:8081/project1_war/'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.interceptors.request.use(config => {
    config.headers.authentication = localStorage.getItem("authentication");
    // 可以统一设置请求头
    return config
})
axios.interceptors.response.use(response => {
        const _this = this;
        const res = response.data;
        if (res.status === 500) {
            Element.Message({
                message: response.data.message,
                type: 'error',
                duration: 2 * 1000
            })
            return Promise.reject(response.data.message)
        }else if(res.status === 401){
            Element.Message({
                message: response.data.message,
                type: 'error',
                duration: 2 * 1000
            })
            this.timer = setInterval(() => {
                window.location.href = "/dist"
            }, 1000)

            return Promise.reject(response.data.message)
        }
        return response
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