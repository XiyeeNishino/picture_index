import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from '../views/SearchPage.vue';
import ResultPage from '../views/ResultPage.vue';
import store from '../store';  // 确保正确导入了Vuex store

const routes = [
    {
        path: '/',
        name: 'home',
        component: SearchPage
    },
    {
        path: '/resultpage',
        name: 'ResultPage',
        component: ResultPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    // 检查是否从结果页面返回到搜索页面
    if (from.name === 'ResultPage' && to.name === 'home') {
        store.commit('setFromResultPage', true);
    } else {
        store.commit('setFromResultPage', false);
    }
    next();
});

export default router;
