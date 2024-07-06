import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'
import { createRouter, createWebHistory } from 'vue-router';
import GamesPage from './pages/Games.vue';
import SignUpPage from './pages/SignUp.vue';
import SignInPage from './pages/SignIn.vue';
import { useSession } from './stores/session';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'games',
      path: '/',
      component: GamesPage,
    },
    {
      name: 'signUp',
      path: '/sign-up',
      component: SignUpPage,
    },
    {
      name: 'signIn',
      path: '/sign-in',
      component: SignInPage,
    },
  ]
})

const session = useSession()

router.beforeEach((to) => {
  if ((session.user || session.isLoading) && (to.name === 'signUp' || to.name === 'signIn')) {
    return '/'
  }
})

const app = createApp(App)

app.use(router)

app.mount('#app')

