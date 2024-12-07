<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const route = useRoute();
const eventId = route.params.id; 
const event = ref(null);

// Fetch event details from Firestore
const fetchEventDetails = async () => {
    const db = getFirestore();
    const eventDoc = doc(db, "events", eventId);

    try {
        const docSnap = await getDoc(eventDoc);
        if (docSnap.exists()) {
            event.value = docSnap.data();
        } else {
            console.error("No such document!");
        }
    } catch (e) {
        console.error("Error fetching event details: ", e);
    }
};

// function to format the date and time
const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("nb-NO", options);
};

const formatTime = (date) => {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleTimeString("nb-NO", options);
};

// Fetch event details when the component is mounted
onMounted(() => {
    fetchEventDetails();
});
</script>

<template>
    <v-main>
        <v-container fluid>
            <div v-if="event">
                <h1>{{ event.name }}</h1>
                <v-text>{{ event.description }}</v-text>
                <h2>Event details</h2>
                <p>Event starts: {{ formatDate(event.startDate) }}</p>
                <p>Event ends:  {{ formatDate(event.endDate) }}</p>
                <h2>Image:</h2>
                <v-img :src="event.imageUrl" alt="Event Image" class="mb-4" max-width="400"></v-img>
            </div>
            <div v-else>
                <p>Loading...</p>
            </div>
        </v-container>
    </v-main>
</template>