import { createRouter, createWebHistory } from 'vue-router'
import SearchPage from '../views/SearchPage.vue'
import ResultPage from '../views/ResultPage.vue'

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
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router