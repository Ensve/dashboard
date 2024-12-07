import { createRouter, createWebHistory } from 'vue-router';
import Auth from './components/Auth.vue';
import AddEvents from './components/AddEvents.vue';
import Events from './components/Events.vue'; 
import EventDetails from './components/EventDetails.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

const routes = [
  {
    path: '/',
    component: Events,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    component: Auth,
  },
  {
    path: '/events',
    component: Events,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/addEvents',
    component: AddEvents,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/event/:id',
    name: 'eventDetails',
    component: () => import('./components/EventDetails.vue'),
    props: true, 
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach( async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert('You must be logged in to see this page');
      next('/auth');
    }
  } else {
    next();
  }
})

export default router;