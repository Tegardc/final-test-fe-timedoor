import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProductPage from '../pages/ProductPage.vue'
import AllProductsPage from '../pages/AllProductsPage.vue'
import UserPage from '../pages/UserPage.vue'
import EditProduct from '../components/user/EditProduct.vue'
import AddProduct from '../components/user/AddProduct.vue'
import CartPage from '../pages/CartPage.vue'
import OrderPage from '../pages/OrderPage.vue'

import Cookies from 'js-cookie'
import { store } from '../store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductPage,
    },
    {
      path: '/products',
      name: 'products',
      component: AllProductsPage,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
      beforeEnter: (to, from, next) => {
        checkAuth() ? next() : next({ name: 'login' })
      },
    },
    {
      path: '/order',
      name: 'order',
      component: OrderPage,
      beforeEnter: (to, from, next) => {
        checkAuth() ? next() : next({ name: 'login' })
      },
    },
    {
      path: '/user/:component',
      name: 'userPage',
      component: UserPage,
      beforeEnter: (to, from, next) => {
        checkAuth() ? next() : next({ name: 'login' })
      },
    },
    {
      path: '/user/my-products/add',
      name: 'addProduct',
      component: AddProduct,
      beforeEnter: (to, from, next) => {
        checkAuth() ? next() : next({ name: 'login' })
      },
    },
    {
      path: '/user/my-products/:id',
      name: 'editMyProduct',
      component: EditProduct,
      beforeEnter: (to, from, next) => {
        checkAuth() ? next() : next({ name: 'login' })
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

const checkAuth = () => {
  const jwtCookie = Cookies.get('jwt')
  const expirationDate = Cookies.get('tokenExpirationDate')
  const userId = Cookies.get('UID')

  if (jwtCookie) {
    if (new Date().getTime() < +expirationDate) {
      store.commit('auth/setToken', {
        idToken: jwtCookie,
        expiresIn: expirationDate,
      })
      store.dispatch('auth/getUser', userId)
      return true
    } else {
      store.commit('auth/setUserLogout')
      return false
    }
  } else {
    return false
  }
}

export default router
