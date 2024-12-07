<script setup>
import { ref } from "vue";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as dbRef,
} from "firebase/storage";
import axios from "axios"; 

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const eventName = ref("");
const eventDescription = ref("");
const eventImage = ref(null); 
const eventAddress = ref(""); 
const eventStartDate = ref(""); 
const eventEndDate = ref("");
const loading = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("");

// Regex to validate address format (e.g., "Maridalsveien, 0469 Oslo")
const addressRegex = /^[a-zA-ZåäøÅÄØ\s,0-9]+$/;

// Function to get coordinates from address
const getCoordinates = async (address) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${mapsApiKey}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return location; // Return lat and lng
    } else {
      throw new Error("Unable to get coordinates.");
    }
  } catch (error) {
    console.error("Error fetching coordinates: ", error);
    return null;
  }
};

// upload event to firebase storage
const uploadEvent = async () => {
  if (!addressRegex.test(eventAddress.value)) {
    alert("Please enter a valid address format, e.g., Maridalsveien, 0469 Oslo.");
    return;
  }

  loading.value = true;
  const db = getFirestore();
  const storage = getStorage();
  const eventsCollection = collection(db, "events");
  const event = {
    name: eventName.value,
    description: eventDescription.value,
    address: eventAddress.value, 
    startDate: eventStartDate.value, 
    endDate: eventEndDate.value, 
  };

  try {
    let imageUrl = null;

    let coordinates = await getCoordinates(eventAddress.value); // Get coordinates

    if (!coordinates) {
      throw new Error("Failed to get coordinates for the address.");
    }

    // Check if an image is selected
    if (eventImage.value) {
      // Define the storage reference using the path
      const storageRef = dbRef(storage, `images/event_images/${eventImage.value.name}`);

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, eventImage.value);

      // Get the download URL of the uploaded image
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create the event document with image URL
    const eventDoc = {
      ...event,
      latitude: coordinates.lat, 
      longitude: coordinates.lng, 
      imageUrl: imageUrl,  
    };

    // Add the event to Firestore
    const docRef = await addDoc(eventsCollection, eventDoc);
    console.log("Document written with ID: ", docRef.id);
    snackbarMessage.value = "Event uploaded successfully!";
    snackbarColor.value = "success";
    snackbar.value = true;
    loading.value = false;
    eventName.value = "";

    eventDescription.value = "";
    eventImage.value = null;
    eventAddress.value = "";
    eventStartDate.value = "";
    eventEndDate.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
    snackbarMessage.value = "Error uploading event.";
    snackbarColor.value = "error";
    snackbar.value = true;
    loading.value = false;
  }
};
</script>

<template>
  <v-main>
    <v-container fluid>
      <h2>Add events to the Database</h2>
      <p>Fill in the form below to add an event to the database.</p>
      <v-form @submit.prevent="uploadEvent">

        <!-- Event title-->
        <v-text-field
          v-model="eventName"
          label="Event Name"
          required
          variant="outlined"
        ></v-text-field>

        <!-- Event description -->
        <v-text-field
          v-model="eventDescription"
          label="Event Description"
          variant="outlined"
          required
        ></v-text-field>

        <!-- Address input field -->
        <v-text-field
          v-model="eventAddress"
          label="Event Address"
          variant="outlined"
          required
        ></v-text-field>

        <!-- Date and Time inputs for start and end time -->
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="eventStartDate"
              label="Start Date and Time"
              type="datetime-local"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="eventEndDate"
              label="End Date and Time"
              type="datetime-local"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>

          <!-- File input for image -->
          <v-col cols="2">
           <v-file-input 
             v-model="eventImage"
             accept="image/*"
             label="File input" 
             variant="outlined"
           ></v-file-input>
         </v-col>
        </v-row>
        <v-btn :loading="loading" type="submit" color="primary">Add Event</v-btn>
      </v-form>
      <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
        {{ snackbarMessage }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>
