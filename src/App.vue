<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import router from "./router";

const db = getFirestore();

const isLoggedIn = ref(false);
const userEmail = ref("");
const userName = ref("");
const avatarUrl = ref("");

let auth;

const handleSignout = () => {
  auth.signOut().then(() => {
    isLoggedIn.value = false;
    userEmail.value = "";
    userName.value = "";
    avatarUrl.value = "";
    router.push("/auth");
  });
};

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      userEmail.value = user.email;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userName.value = userData.userName || "User";
        avatarUrl.value =
          userData.userAvatar ||
          "https://randomuser.me/api/portraits/women/85.jpg";
      } else {
        console.log("No such document!");
      }
    } else {
      isLoggedIn.value = false;
    }
  });
});
</script>

<template>
  <v-app>
    <nav v-if="isLoggedIn">
      <v-app-bar app flat>
        <v-list>
          <v-list-item
            :prepend-avatar="avatarUrl"
            :subtitle="userEmail"
            :title="userName"
          ></v-list-item>
        </v-list>
        <template v-slot:append>
          <v-btn
            @click="handleSignout"
            v-if="isLoggedIn"
            variant="text"
            icon="mdi-logout"
          ></v-btn>
        </template>
      </v-app-bar>

      <v-navigation-drawer expand-on-hover rail permanent fixed left>
        <v-list density="compact" nav>
          <router-link to="/" style="color: inherit; text-decoration: none">
            <v-list-item
              prepend-icon="mdi-folder"
              title="Events"
              value="myfiles"
            ></v-list-item>
          </router-link>
          <router-link
            to="/addEvents"
            style="color: inherit; text-decoration: none"
          >
            <v-list-item
              prepend-icon="mdi-plus"
              title="Add event"
              value="shared"
            ></v-list-item>
          </router-link>
        </v-list>
      </v-navigation-drawer>
    </nav>
    <!-- <v-app-bar
        color=""
        prominent
      >
        <v-toolbar-title>Spot admin</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text">
          <router-link to="/">Events</router-link>  
        </v-btn>
        <v-btn variant="text">
          <router-link to="/addEvents">Add events</router-link>  
        </v-btn>
        <v-btn variant="text">
          <router-link to="/auth">Sign in</router-link>  
        </v-btn>
        <v-btn @click="handleSignout" v-if="isLoggedIn" variant="text">Sign out</v-btn>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
        
      </v-app-bar> -->

    <router-view />
  </v-app>
</template>
