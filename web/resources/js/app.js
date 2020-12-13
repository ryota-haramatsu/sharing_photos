
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import './bootstrap'


const createApp = async () => {
    // ログインチェックしてからアプリを生成する
    await store.dispatch('auth/currentUser');
    // console.log('チェック済み');

    new Vue({
        el: '#app',
        router,
        store,
        components: { App },
        template: '<App />'
    
    })
}

createApp()