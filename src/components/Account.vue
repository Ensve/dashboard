<script setup>
import { onMounted, ref, toRefs, watch } from "vue";
import { useRoute } from 'vue-router';

const props = defineProps(["session"]);
const { session } = toRefs(props);

const loading = ref(true);
const username = ref("");
const website = ref("");
const avatar_url = ref("");

const route = useRoute();

onMounted(() => {
  if (session.value) {
    getProfile();
  }
});

watch(session, (newSession) => {
  if (newSession) {
    getProfile();
  }
});

async function getProfile() {
  try {
    loading.value = true;
    const { user } = session.value;

    const { data, error, status } = await supabase
      .from("profiles")
      .select(`username, website, avatar_url`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      website.value = data.website;
      avatar_url.value = data.avatar_url;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container>
    <router-view></router-view>
  </v-container>
</template>

<style scoped></style>