<script setup>
  import Shepherd from 'shepherd.js';
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  const tourSkipped = ref(false); // Track if the user skips the tour

  const startTour = () => {
    if (localStorage.getItem('skipTour') === 'true') {
      return; // Don't show the tour if the user already skipped
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'custom-tour', // Custom class for styling
        scrollTo: true,
      },
    });

    tour.addStep({
      id: 'welcome',
      title: '🎉 ថ្ងៃពិធីមង្គល',
      text: 'នេះជាថ្ងៃទីពីរនៃពិធីមង្គលការរបស់យើងខ្ញុំ (ថ្ងៃស៊ី)។',
      attachTo: { 
        element: '.wedding-date', 
        on: 'top' 
      },
      buttons: [
        { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
        { text: 'Next', action: tour.next }],
    });

    tour.addStep({
      id: 'Add-to-Google-Caledar',
      title: '📅 កត់ទុកក្នុងប្រតិទិន',
      text: 'សូមធ្វើការកត់ចំណាំការអញ្ចើញរបស់យើងខ្ញុំទៅក្នុង Google Caledar! ✍️',
      attachTo: {
        element: '.google-calendar-btn',
        on: 'right'
      },
      buttons: [
        { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
        { text: 'Back', action: tour.back },
        { text: 'Next', action: tour.next }
      ]
    });

    tour.addStep({
      id: 'countdown',
      title: '⏳ រាប់ថយក្រោយ',
      text: 'នេះបង្ហាញពីពេលវេលានៅសល់រហូតដល់ថ្ងៃរៀបការ!',
      attachTo: { 
        element: '.timer', 
        on: 'bottom' 
      },
      buttons: [
        { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
        { text: 'Back', action: tour.back },
        { text: 'Next', action: tour.next }
      ],
    });

    tour.addStep({
      id: 'rsvp',
      title: '💌 អ្នកត្រូវបានអញ្ចើញ',
      text: 'សូមធ្វើការបើកសំបុត្ររបស់អ្នកនៅទីនេះ!',
      attachTo: { 
        element: '.open-box', 
        on: 'top' 
      },
      buttons: [
        { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
        { text: 'Back', action: tour.back },
        { text: 'Ok', action: tour.complete },
      ],
    });

    tour.start();
  };

  const skipTour = (tour) => {
    localStorage.setItem('skipTour', 'true'); // Save that the user skipped
    tour.complete(); // Close the tour
  };

  // Set the wedding date (YYYY, MM (0-based), DD, HH, MM, SS)
  const weddingDate = new Date(2025, 2, 15, 6, 30, 0); // March 15, 2025, at 06:30 AM
  const weddingEndDate = new Date(2025, 2, 15, 23, 0, 0); // Event END

  const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
  const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];

  const formattedWeddingDate = computed(() => {
    const day = khmerDays[weddingDate.getDay()];
    const date = weddingDate.getDate();
    const month = khmerMonths[weddingDate.getMonth()];
    const year = weddingDate.getFullYear();
    return `ថ្ងៃ${day} ទី${date} ខែ${month} ឆ្នាំ${year}`;
  });
  // For testing style wedding date
  // const weddingDate = new Date(new Date().getTime() + 20000); // 30 seconds from now


  // Reactive countdown object
  const countdown = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Track if the event has started
  const eventStarted = ref(false);
  const eventEnded = ref(false);

  let timerInterval = null;

  // Function to update the countdown
  const updateCountdown = () => {
    const now = new Date().getTime();
    const timeToStart = weddingDate - now;
    const timeToEnd = weddingEndDate - now;

    if (timeToStart > 0) {
      // Countdown to event
      countdown.value.days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
      countdown.value.hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      countdown.value.minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
      countdown.value.seconds = Math.floor((timeToStart % (1000 * 60)) / 1000);
      eventStarted.value = false;
      eventEnded.value = false;
    } else if (timeToEnd > 0) {
      // Event is currently happening
      eventStarted.value = true;
      eventEnded.value = false;
      clearInterval(timerInterval);
    } else {
      // Event is over
      eventStarted.value = false;
      eventEnded.value = true;
      clearInterval(timerInterval);
    }
  };

  // Function to add event to Google Calendar
  const addToGoogleCalendar = () => {
    const eventTitle = "កម្មវិធីមង្គលការរបស់ វណ្ណៈ & ស្រីណយ!";
    const eventDetails = "ប្រព្រឹត្តទៅនៅ ថ្ងៃសៅរ៍ ទី១៥ ខែមីនា ឆ្នាំ២០២៥ ត្រូវនឹង ថ្ងៃ២រោច ខែផល្គុន ឆ្នាំរោង ឆស័ក ពុទ្ធសករាជ ២៥៦៨ វេលាម៉ោង ៥:០០នាទីល្ងាច នៅ គេហដ្ឋានខាងស្រី ស្ថិតនៅ ភូមិកសិករ ឃុំសំឡាញ ស្រុកអង្គជ័យ ខេត្តកំពត!";
    const location = "https://maps.google.com/maps?q=10.865470,104.590876&ll=10.865470,104.590876&z=16"; // Actual wedding location

    // Format date for Google Calendar
    const startDate = "20250314T140000"; // YYYYMMDDTHHMMSS
    const endDate = "20250315T233000"; // End time (adjust as needed) 2025/03/15 11:30 PM

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Start countdown when component is mounted
  onMounted(() => {
    setTimeout(startTour, 1000); // Start the tour after 1seconds
    updateCountdown(); // Initial call
    timerInterval = setInterval(updateCountdown, 1000); // Update every second
  });

  // Clear the interval when the component is unmounted
  onUnmounted(() => {
    clearInterval(timerInterval);
  });
</script>
<template>
    <div class="container-fluid" id="home-box">
      <div class="row" id="mobile-screen">
        <div class="col-lg-7 col-md-7 col-sm-7 side-img"></div> 
        <div class="col-lg-5 col-md-5 col-sm-5 side-content">
          <div class="row m-0 text-center overflow-hidden">
            <!-- Countdown Timer -->
            <div class="col-12 countdown">
              <!-- <button @click="skipTour(tour)" v-if="!tourSkipped" class="btn btn-danger">Skip Tour</button> -->
              <div class="row mb-4 p-4">
                <div class="col-12 home-container p-0">
                  <h1 class="gradient-text">សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>
                </div>
              </div>
              <div class="row mb-4" :class="{ 'justify-content-center': eventEnded }">
                <div :class="eventEnded ? 'col-12 text-center' : 'col-lg-7 col-md-7 col-sm-7'">
                  <p class="text-danger fw-bold fs-4 pb-3 wedding-date">{{ formattedWeddingDate }}</p>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5" v-if="!eventEnded">
                  <button @click="addToGoogleCalendar" class="btn btn-success btn-sm google-calendar-btn p-0">
                    <p><i class="fa-solid fa-calendar fa-beat-fade fa-xs"></i> ចំណាំក្នុងប្រតិទិន</p>
                  </button>
                </div>
              </div>
              <div v-if="!eventStarted && !eventEnded" class="d-flex justify-content-center gap-2 timer">
                <span>{{ countdown.days }} ថ្ងៃ</span>
                <span>{{ countdown.hours }} ម៉ោង</span>
                <span>{{ countdown.minutes }} នាទី</span>
                <span>{{ countdown.seconds }} វិនាទី</span>
              </div>

              <div v-else-if="eventStarted" class="event-message">
                <p>កម្មវិធីសិរីសួស្ដីអាពាហ៍ពិពាហ៍កំពុងចាប់ផ្ដើម! 🎊</p>
              </div>

              <div v-else-if="eventEnded" class="event-message">
                <p>កម្មវិធីសិរីសួស្ដីអាពាហ៍ពិពាហ៍បានបញ្ចប់! 🎉</p>
              </div>
            </div>
            <div class="col-12 mb-3 mt-5 p-0">
              <i class="fa-solid fa-chevron-down fa-bounce fa-lg text-danger"></i>
            </div>
            <div class="col-12 p-0">
              <!-- Button to go to Content Page -->
              <router-link to="/invitation">
                <button class="btn btn-outline-warning btn-lg open-box" @click="goToContent">
                  បើកសំបុត្រ <i class="fa-solid fa-envelope fa-shake fa-lg"></i>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
  .side-img{
    height: 100vh;
    background-image: url("/background.jpg");
    background-repeat: no-repeat;
    background-position: center 0;
    background-size: cover;
  }
  .side-content{
    height: 100vh;
    animation: backgroundColorChange 5s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
    padding: 20px !important;
    
  }
  
  .side-content .countdown{
    padding: 20px !important;
  }

  .side-content .countdown .row .home-container .gradient-text{
    animation: colorChange 3s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
  }

  .side-content .timer span {
    animation: backgroundColorChange 5s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
    padding: 20px;
    border-radius: 25px;
    font-size: 50px;
    border: 3px solid white;
  }
  #home-box{
    width: 100% !important;
    height: 100vh;
    background-color:rgba(0, 0, 0, 0.3) !important;
    overflow: hidden;
    position: relative;
  }
  .gradient-text{
    animation: colorChange 3s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
  }
  /* Home page styling */
  .home-container {
    text-align: center;
  }
  /* Countdown Timer */
  .countdown {
    background:#ffffff60;
    padding: 20px;
    border-radius: 10px;
  }

  .timer {
    font-size: 20px;
    font-weight: bold;
    font-family: "Kantumruy Pro";
  }

  .timer span {
    animation: backgroundColorChange 5s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
    padding: 20px;
    border-radius: 15px;
  }

  /* Event Message with Beating Effect */
  .event-message {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    animation: beat 1s infinite alternate ease-in-out;
  }

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }

  /* Google Calendar Button */
  .google-calendar-btn {
    width: 130px;
    font-size: 16px;
    padding: 5px 5px !important;
    cursor: pointer;
    transition: 0.3s;
  }

  .google-calendar-btn:hover {
    background: #2c8c41;
  }

  #home-box .box-btn{
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -90%);
    text-align: center;
    margin: auto;
  }
  .open-box{
    animation: backgroundColorChange 5s infinite;
    animation-timing-function: linear;
    animation-direction: alternate;
    /* width: 20%; */
  }
</style>