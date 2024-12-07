<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const router = useRouter();
const showPassword = ref(false);
const errorMsg = ref();

// sign in user to firebase
const handleLogin =  () => {
  loading.value = true;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      loading.value = false;
      console.log("Successfully logged in");
      console.log(auth.currentUser);
      router.push("/");
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          errorMsg.value = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMsg.value = "User not found";
          break;
        case "auth/wrong-password":
          errorMsg.value = "Invalid password";
          break;
        default:
          errorMsg.value = "An error occurred";
          break;
      }
    });      
};
</script>

<template>
  <div class="d-flex flex-col justify-content-center align-items-center h-screen">
    <div style="width: 300px;">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <v-text-field v-model="email" label="Email" variant="outlined" clearable></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />
          <p v-if="errorMsg">{{ errorMsg }}</p>
          <div class="d-flex justify-content-start">
              <v-btn block size="large" 
              elevation="8"
              :disabled="loading" type="submit">
                {{ loading ? "Logging in..." : "Login" }}
              </v-btn>
          </div>
        </form>
    </div>
  </div>
</template>
