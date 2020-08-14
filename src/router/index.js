import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth'

import Auth from '@/views/Auth'
import Dashboard from '@/views/Dashboard'
import Profile from '@/views/Profile'

Vue.use(Router)

var routes = [
  { path: '/auth', name: 'auth', component: Auth, meta: { title: 'Blogal - auth', guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'Blogal - dashboard', requireAuth: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { title: 'Blogal - profile', requireAuth: true } },
  { path: '*', redirect: '/auth' }
]

export const router = new Router({
  base: '/blogal',
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  let currentUser = auth.user()
  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requireAuth && !currentUser) next('auth')
  else if (guestOnly && currentUser) next('dashboard')
  else next()
})