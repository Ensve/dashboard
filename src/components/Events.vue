<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";  

const events = ref([]); // Array to store fetched events

const router = useRouter();  

// Fetch events from Firestore
const fetchEvents = async () => {
  const db = getFirestore();
  const eventsCollection = collection(db, "events");

  try {
    // Get all documents in the events collection
    const snapshot = await getDocs(eventsCollection);
    events.value = [];

    // Process each document
    snapshot.forEach((doc) => {
      const eventData = doc.data();
      events.value.push({
        id: doc.id,
        ...eventData,
      });
    });
  } catch (e) {
    console.error("Error fetching events: ", e);
  }
};

// function to format the date and time
const formatDate = (date) => {
  const options = {
    // year: "numeric",
    month: "short",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
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

// Navigate to the event details page
const navigateToEvent = (eventId) => {
  // Redirect to the event details page with the event ID as a parameter
  router.push({ name: "eventDetails", params: { id: eventId } });
};

// Fetch events when the component is mounted
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <v-main>
    <v-container fluid>
      <h2>Upcoming events</h2>
      <v-spacer></v-spacer>
      <v-row>
        <v-col v-for="event in events" :key="event.id" cols="12" md="3">
          <v-card class="hover-card" @click="navigateToEvent(event.id)">
            <div style="height: 250px; width: 100%;">
              <v-img
              :src="event.imageUrl"
              alt="Event Image"
              />
            </div>
                <v-container>
                <v-card-title>{{ event.name }}</v-card-title>
                <v-card-subtitle>
                  {{ formatDate(event.startDate) }} {{ formatTime(event.startDate) }} - {{ formatTime(event.endDate) }}
                </v-card-subtitle>
                </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<style scoped></style>
