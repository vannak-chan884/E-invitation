<script setup>
    import Shepherd from 'shepherd.js';
    import { galleries, socialLinks } from '../router/store.js';
    import { ref,onMounted,nextTick, onUnmounted } from 'vue';
    import Rsvp from '@/components/rsvp.vue';

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

        // Disable scrolling when the tour starts
        tour.on('start', () => {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            document.body.style.height = '100vh'; // Ensure full viewport height
        });

        // Re-enable scrolling when the tour ends
        tour.on('complete', () => {
            document.body.style.overflow = 'auto'; // Restore scrolling
            document.body.style.height = 'auto'; 
        });

        tour.on('cancel', () => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        });

        tour.addStep({
            id: 'audio-control',
            title: '🎵 ចម្រៀង',
            text: '⏯️ Play or Pause បទចម្រៀង។',
            attachTo: { 
                element: '.audio-control', 
                on: 'left' 
            },
            buttons: [
                { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
                { text: 'Next', action: tour.next }],
        });

        tour.addStep({
            id: 'location',
            title: '📍 ទីតាំងផ្ទះការ',
            text: 'សូមធ្វើការចុចបើកមើលទីតាំងផ្ទះការតាម Google Maps! 🗺️',
            attachTo: { 
                element: '#maps-icon', 
                on: 'left' 
            },
            buttons: [
                { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
                { text: 'Back', action: tour.back },
                { text: 'Next', action: tour.next }
            ],
        });

        tour.addStep({
            id: 'Add-to-Google-Caledar',
            title: '📅 កត់ទុកក្នុងប្រតិទិន',
            text: 'សូមធ្វើការកត់ចំណាំការអញ្ចើញរបស់យើងខ្ញុំទៅក្នុង Google Caledar! ✍️',
            attachTo: {
                element: '.google-calendar-btn',
                on: 'left'
            },
            buttons: [
                { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
                { text: 'Back', action: tour.back },
                { text: 'Next', action: tour.next }
            ]
        });
        
        tour.addStep({
            id: 'RSVP',
            title: '🔁 ការឆ្លើយតប',
            text: 'សូមធ្វើការឆ្លើយតបមកយើងខ្ញុំដោយបំំពេញ Form ខាងក្រោម រួចចុចបញ្ចូន!',
            attachTo: {
                element: '#rsvp-title',
                on: 'bottom'
            },
            buttons: [
                { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
                { text: 'Back', action: tour.back },
                { text: 'Next', action: tour.next }
            ]
        });
        
        tour.addStep({
            id: 'Telegram',
            title: '📩 Telegram',
            text: `<a href="https://t.me/vannak40">@vannak40</a>`,
            attachTo: {
                element: '.fa-telegram',
                on: 'left'
            },
            buttons: [
                { text: 'Skip', action: () => skipTour(tour) }, // Skip Tour
                { text: 'Back', action: tour.back },
                { text: 'Ok', action: tour.complete }
            ]
        });

        tour.start();
    };

    const skipTour = (tour) => {
        localStorage.setItem('skipTour', 'true'); // Save that the user skipped
        tour.complete(); // Close the tour
    };

    // Show popup when the page starts
    const showPopup = ref(false);
    const audioPlayer = ref(null);
    const isPlaying = ref(true); // Track audio state (playing or paused)
    const countdownMessage = ref(5); // Countdown starts from 5

    onMounted(() => {
        // Start playing audio when content page loads
        playAudio();

        // Delay showing the event message by 3 seconds
        setTimeout(() => {
            showPopup.value = true; // Show message
            pauseAudio();// Pause audio when message appears
            disableScroll(); // Stop scrolling when message appears
            startCountdown(); // Start countdown after message appears
        }, 3000); // 3 seconds delay before showing message

        updateCountdown(); // Initial call
        timerInterval = setInterval(updateCountdown, 1000); // Update every second

        // Set the current year when the component is mounted
        currentYear.value = new Date().getFullYear()
    });

    // Function to close the message after a delay (10 seconds)
    const startCountdown = () => {
        const interval = setInterval(() => {
            if (countdownMessage.value > 0) {
                countdownMessage.value -= 1; // Decrease the countdown by 1 each second
            }
            
            if (countdownMessage.value === 0) {
                clearInterval(interval); // Stop the countdown when it reaches 0
                showPopup.value = false; // Hide the event message
                enableScroll(); // Allow scrolling again

                // Wait for the event message to disappear, then resume audio
                nextTick(() => {
                    playAudio();
                });
            }
        }, 1000); // Update countdown every second
        setTimeout(startTour, 12000); // Start the tour after 12 seconds
    };
    
    // Disable scrolling
    const disableScroll = () => {
        document.body.style.overflow = "hidden";
    };

    // Enable scrolling
    const enableScroll = () => {
        document.body.style.overflow = "";
    };

    // Function to play audio (ensuring it's not played before popup closes)
    const playAudio = () => {
        if (!showPopup.value && audioPlayer.value) {
            const playPromise = audioPlayer.value.play();
            if (playPromise !== undefined) {
                playPromise
                .then(() => {
                    isPlaying.value = true;// Update icon to 🔊
                    localStorage.setItem("audioPlaying", "true");
                })
                .catch((error) => console.log("Autoplay blocked:", error));
            }
        }
    };

    // Pause audio function
    const pauseAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            isPlaying.value = false;// Update icon to 🔇
        }
    };

    // Function to toggle audio manually
    const toggleAudio = () => {
        if (audioPlayer.value) {
            if (isPlaying.value) {
                audioPlayer.value.pause();
                isPlaying.value = false;
            } else {
                playAudio();
            }
            localStorage.setItem("audioPlaying", isPlaying.value);
        }
    };

    // Set the wedding date (YYYY, MM (0-based), DD, HH, MM, SS)
    const weddingDate = new Date(2025, 2, 15, 6, 30, 0); // March 15, 2025, at 06:30 AM

    // Reactive countdown object
    const countdown = ref({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Track if the event has started
    const eventStarted = ref(false);

    let timerInterval = null;

    // Function to update the countdown
    const updateCountdown = () => {
    const now = new Date().getTime();
    const timeDifference = weddingDate - now;

    if (timeDifference > 0) {
        countdown.value.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        countdown.value.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        countdown.value.minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        countdown.value.seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    } else {
        // Show event message when the countdown reaches 0
        eventStarted.value = true;
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

    // Clear the interval when the component is unmounted
    onUnmounted(() => {
    clearInterval(timerInterval);
    });

    // Default font size
    const fontSize = ref(18);

    // Create a reactive ref to hold the current year
    const currentYear = ref('')
</script>
<template>
    <!-- Font Size Slider -->
    <div id="font-size">
        <input type="range" id="fontSize" class="form-range vertical-slider" min="12" max="36" step="2" v-model="fontSize"/>
    </div>
    <!--Content-->
    <div class="container-fluid" id="content" :style="{ fontSize: fontSize + 'px' }">
        <div class="container pt-4" id="container-box">
            <!-- Apology Popup -->
            <div v-if="showPopup" class="popup-overlay">
                <div class="popup-box text-dark">
                    <h2 class="mb-3">សុំការអធ្យាស្រ័យ🙏</h2>
                    <p class="text-apology">យើងខ្ញុំសុំអភ័យទោស ដែលមិនបានជួបអញ្ជើញដោយផ្ទាល់។ 
                        សូមទទួលយកការអញ្ជើញ ដើម្បីអបអរថ្ងៃពិសេសរបស់យើងខ្ញុំទាំងអស់គ្នា។ 
                    </p>
                    <p class="bg-danger message-countdown rounded-circle fs-2 fw-bold border-light border-3">{{ countdownMessage }}</p>
                </div>
            </div>
            <div class="row text-center" 
            data-aos="fade-down" 
            data-aos-anchor-placement="center-center"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out">
                <div class="col-lg-12">
                    <h1 class="text-center mb-3 gradient-text">សិរីមង្គលអាពាហ៍ពិពាហ៍</h1>
                    <span class="fs-2">The Wedding Day</span>
                </div>
            </div>
            <div class="row mt-5" id="parents"
            data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                <div class="col-lg-6 col-md-6 col-sm-6" id="box">
                    <div class="row m-0">
                        <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                            <h4><span>លោក</span> ម៉ឹក ចាន់វាសនា</h4>
                        </div>
                        <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                            <h4><span>លោកស្រី</span> លឹម សុន</h4>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6" id="box">
                    <div class="row text-end m-0">
                        <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                            <h4><span>លោក</span> ឃិន ណី</h4>
                        </div >
                        <div class="col-lg-12 col-md-12 col-sm-12 p-0">
                            <h4><span>លោកស្រី</span> ឡុង វណ្ណនាង</h4>
                        </div >
                    </div >
                </div>
            </div>
            <div class="row mt-5" id="invitation" data-aos="fade-down" data-aos-duration="500">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <h6 class="text-center mb-2">មានកិត្តិយស</h6 >
                    <h3 class="text-center mb-2">សូមគោរពអញ្ចើញ</h3>
                    <p class="text-break lh-lg text-modify">
                    សម្តេចទ្រង់ ឯកឧត្តម លោកជំទាវ​ អ្នកឧកញ៉ា ​ឧកញ៉ា លោក លោក​ស្រី អ្នកនាងកញ្ញា
                    អញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិតិ្តយសដើម្បីប្រសិទ្ធិពរជ័យ សិរីមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍
                    កូនប្រុស-ស្រី របស់យើងខ្ញុំ
                    </p  >
                </div >
            </div >
            <div class="row mt-3">
                <div class="col-lg-6 col-md-6 col-sm-6 box groom">
                    <div class="text-center">
                        <div class="row mb-2 m-0" data-aos="fade-up">
                            <div class="col-12 mb-3">
                                <h6>កូនប្រុសនាម</h6>
                            </div>
                            <div class="col-12">
                                <h4 class="text-warning fw-semibold">ចាន់វណ្ណៈ</h4 >
                            </div >
                        </div >
                        <div class="row m-0 groom-img">
                            <div class="box-img col-lg-12 p-0" 
                            data-aos="fade-right"
                            data-aos-anchor="#example-anchor"
                            data-aos-offset="500"
                            data-aos-duration="500">
                                <img src="/images/groom.jpg" alt="Groom">
                            </div >
                        </div >
                    </div >
                </div >
                <div class="col-lg-6 col-md-6 col-sm-6 box">
                    <div class="text-center">
                        <div class="row mb-2 m-0" data-aos="fade-up">
                            <div class="col-12 mb-3">
                                <h6>កូនស្រីនាម</h6>
                            </div>
                            <div class="col-12">
                                <h4 class="text-warning fw-semibold">ឃិនស្រីណយ</h4>
                            </div >
                        </div >
                        <div class="row m-0 groom-img">
                            <div class="box-img col-lg-12 p-0" 
                            data-aos="fade-left"
                            data-aos-anchor="#example-anchor"
                            data-aos-offset="500"
                            data-aos-duration="500">
                                <img src="/images/bride.jpg" alt="Bride">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-5" id="date-time">
                <div class="col-12 text-center">
                    <h3 data-aos="fade-up"
                        data-aos-anchor="#example-anchor"
                        data-aos-offset="500"
                        data-aos-duration="500">
                        និងពិសារភោជនាអាហារដែលនឹងប្រព្រឹត្តទៅ
                    </h3>
                    <p class="mt-2 lh-lg text-modify"
                        data-aos="fade-up"
                        data-aos-anchor="#example-anchor"
                        data-aos-offset="500"
                        data-aos-duration="500">
                    នៅ ថ្ងៃ<span class="text-warning fs-5 fw-medium">សៅរ៍ </span>
                    ទី<span class="text-warning fs-5 fw-medium">១៥ </span>
                    ខែ<span class="text-warning fs-5 fw-medium">មីនា </span>
                    ឆ្នាំ<span class="text-warning fs-5 fw-medium">២០២៥ </span>
                    ត្រូវនឹង ថ្ងៃ<span class="text-warning fs-5 fw-medium">២រោច </span>
                    ខែ<span class="text-warning fs-5 fw-medium">ផល្គុន </span>
                    ឆ្នាំ<span class="text-warning fs-5 fw-medium">រោង ឆស័ក </span>
                    ពុទ្ធសករាជ<span class="text-warning fs-5 fw-medium"> ២៥៦៨ </span>
                    វេលាម៉ោង<span class="text-warning fs-5 fw-medium"> ៥:០០នាទីល្ងាច </span>
                    នៅ<span class="text-warning fs-5 fw-medium"> គេហដ្ឋានខាងស្រី </span>
                    ស្ថិតនៅ ភូមិ<span class="text-warning fs-5 fw-medium">កសិករ </span>
                    ឃុំ<span class="text-warning fs-5 fw-medium">សំឡាញ </span>
                    ស្រុក<span class="text-warning fs-5 fw-medium">អង្គជ័យ </span>
                    ខេត្ត<span class="text-warning fs-5 fw-medium">កំពត </span>ដោយមេត្រីភាព។ សូមអរគុណ!
                    <br>(សូមពិនិត្យមើលប្លង់បញ្ជាក់)</p>
                </div>
            </div>
            <div class="row mt-5" id="event">
                <div class="col-12 text-center mb-2">
                    <h3 data-aos="fade-up"
                        data-aos-duration="500">
                    កម្មវិធីសិរីសួស្ដីអាពាហ៍ពិពាហ៍
                    </h3>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6" 
                        data-aos="fade-right"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine">
                        <h4 class="mt-4 text-decoration-underline">កម្មវិធីថ្ងៃទី១</h4>
                        <h5 class="mt-4 text-start text-warning">ថ្ងៃសុក្រ ទី១៤ ខែមីនា ឆ្នាំ២០២៥</h5>
                        <table class="table table-hover">
                            <tr>
                                <td>ម៉ោង ០២ៈ០០ រសៀល</td>
                                <td>:</td >
                                <td>ពិធីសែនក្រុងពាលី</td>
                            </tr>
                                <tr>
                                <td>ម៉ោង ០៣ៈ០០ រសៀល</td>
                                <td>:</td>
                                <td>ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៤ៈ០០ រសៀល</td>
                                <td>:</td>
                                <td>ពិធីជំពាលានិងជាវខាន់ស្លា</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៥ៈ០០ ល្ងាច</td>
                                <td>:</td>
                                <td>អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារពេលល្ងាច</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6" 
                        data-aos="fade-left"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine">
                        <h4 class="mt-4 text-decoration-underline">កម្មវិធីថ្ងៃទី២</h4>
                        <h5 class="mt-4 text-start text-warning">ថ្ងៃសៅរ៍ ទី១៥ ខែមីនា ឆ្នាំ២០២៥</h5>
                        <table class="table table-hover">
                            <tr>
                                <td>ម៉ោង ០៦ៈ៣០ ព្រឹក</td>
                                <td>:</td>
                                <td>ជួបជុំភ្ញៀវកិត្តិយសរៀបពិធីចំហែជំនូន</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៧ៈ០០ ព្រឹក</td>
                                <td>:</td>
                                <td>ពិធីហែជំនូន(ហែកំណត់) និងអញ្ជើញភ្ញៀវកិត្តយសពិសាអាហារពេលព្រឹក</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៧ៈ៣០ ព្រឹក</td>
                                <td>:</td>
                                <td>ពិធីចៅមហានិយាយជើងការរៀបរាប់ផ្លែឈើ</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៨ៈ៣០ ព្រឹក</td>
                                <td>:</td>
                                <td>ពិធីបំពាក់ចិញ្ចៀន</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៩ៈ១៥ ព្រឹក</td>
                                <td>:</td>
                                <td>ពិធីកាត់សក់បង្កក់សិរី</td >
                            </tr>
                            <tr>
                                <td>ម៉ោង ១១ៈ០០ ថ្ងៃត្រង់</td>
                                <td>:</td>
                                <td>ពិធីបង្វិលពពិលសំពះផ្ទឹមសែនចងដៃ</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ១២ៈ០០ ថ្ងៃត្រង់</td>
                                <td>:</td>
                                <td>អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារថ្ងៃត្រង់</td>
                            </tr>
                            <tr>
                                <td>ម៉ោង ០៥ៈ០០ ល្ងាច</td>
                                <td>:</td>
                                <td>ទទួលភ្ញៀវកិត្តិយសពិសាភោជនាហារ</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row mt-5" id="thank-sorry">
                <div class="col-12">
                    <h3 class="text-center"
                        data-aos="fade-up"
                        data-aos-duration="500">
                        សេចក្ដីថ្លែងអំណរគុណ និងសូមអភ័យទោស
                    </h3>
                    <p class="lh-lg mt-2 text-modify"
                        data-aos="fade-up"
                        data-aos-duration="600">យើងខ្ញុំ សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅ ចំពោះការអញ្ចើញចូលរួមជាភ្ញៀវកិត្តិយស
                    ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍កូនប្រុស-ស្រីរបស់យើងខ្ញុំ និងសូមខន្តី អភ័យទោស
                    ដោយពុំបានជួបអញ្ចើញដោយផ្ទាល់ និងការសរសេរឈ្មោះរបស់ភ្ញៀវកិត្តិយសមិនបានត្រឹមត្រូវ ឬពុំបានសរសេរឈ្មោះ។
                    សូមជូនពរសម្តេចទ្រង់ ឯកឧត្តម លោកជំទាវ​ អ្នកឧកញ៉ា ​ឧកញ៉ា លោក លោក​ស្រី អ្នកនាងកញ្ញា
                    និងភ្ញៀវកិត្តិយសទាំងអស់មានសុខភាពល្អ និងទទួលបានជោគជ័យគ្រប់ភារកិច្ច។</p>
                </div>
            </div>
            <div class="row mt-5" id="location">
                <div class="col-12 text-center">
                    <h3 data-aos="fade-up" data-aos-duration="500">ទីតាំងកម្មវិធី</h3>
                    <p class="lh-lg mt-2" data-aos="fade-up" data-aos-duration="600">ភូមិកសិករ ឃុំសំឡាញ ស្រុកអង្គជ័យ ខេត្តកំពត</p>
                </div>
                <div class="col-12 text-center mt-3">
                    <button type="button" class="btn btn-outline-warning btn-lg" data-aos="fade-up" data-aos-duration="650">
                        <a href="https://maps.google.com/maps?q=10.865470,104.590876&ll=10.865470,104.590876&z=16" class="text-warning text-decoration-none">
                        ទីតាំងផ្ទះការ <i class="fa-solid fa-map fa-bounce fa-lg"></i>
                        </a>
                    </button>
                    <div class="location-img mt-5" data-aos="fade-up" data-aos-duration="700">
                        <img src="/images/location.jpg" class="img-fluid" alt="Location">
                    </div>
                </div>
            </div>
            <div class="row mt-5 mb-5" id="gallery-box">
                <div class="col-lg-12 col-md-12 col-sm-12 text-center">
                    <h3 data-aos="fade-right"
                        data-aos-offset="300"
                        data-aos-easing="ease-in-sine">
                        កម្រងរូបភាព
                    </h3>
                </div>
                <div v-for="(gallery, i) in galleries" :key="i" class="col-lg-2 col-md-3 col-sm-6 col-6 mt-4">
                    <div class="gallery">
                        <img :src="gallery" alt="Image Gallery">
                    </div>
                </div>
            </div>
            <div class="row mb-5" id="rsvp">
                <Rsvp />
            </div>
        </div>
    </div>
    <div class="container p-0" id="audio">
        <div class="row m-0 text-center">
            <div class="col-12 box-icon">
                <!-- Audio Icon -->
                <div class="audio-control p-0" @click.stop="toggleAudio">
                    <span v-if="isPlaying"><i class="fa-solid fa-headphones fa-beat fa-lg"></i></span>
                    <span v-else><i class="fa-solid fa-music fa-lg"></i></span>
                </div>
                <!-- Audio Element -->
                <audio ref="audioPlayer" loop>
                    <source src="/audio/NolyRecord_ ប្រណម_feat_KanhchnaChet.mp3" type="audio/mp3">
                    <source src="/audio/Glomyy_ព្រេងកថា_Fairytales_feat_KZ.mp3" type="audio/mp3">
                    <source src="/audio/Noly_Record.mp3" type="audio/mp3">
                </audio>
            </div>
            <div class="col-12 box-icon" id="maps-icon">
                <a href="https://maps.google.com/maps?q=10.865470,104.590876&ll=10.865470,104.590876&z=16" target="_blank" class="btn p-0 rounded-circle text-decoration-none">
                    <i class="fa-solid fa-map fa-lg text-light"></i>
                </a>
            </div>
            <div class="col-12 box-icon">
                <!-- Add to Google Calendar Button -->
                <a class="btn btn-sm google-calendar-btn p-0 text-decoration-none" @click="addToGoogleCalendar">
                    <i class="fa-solid fa-calendar fa-lg"></i>
                </a>
            </div>
        </div>
    </div>
    <!--Footer-->
    <footer class="wedding-footer">
        <div class="footer-content">
            <div class="mt-3 mb-3" data-aos="fade-up" data-aos-duration="500">
                    <h3 class="footer-slogain" :style="{ fontSize: fontSize + 'px' }">ទំនាក់ទំនងម្ចាស់កម្មវិធី</h3>
            </div>
            <div class="social-icons mb-3" data-aos="fade-up" data-aos-duration="600">
                <a :href="link.url" target="_blank" v-for="(link, i) in socialLinks" :key="i">
                    <i :class="['fa-brands', link.icon]"></i>
                </a>
            </div>
        </div>
        <div>
            <p class="footer-tagline mb-3" :style="{ fontSize: fontSize + 'px' }">Thank you for being part of our special day! 💍</p>
            <p :style="{ fontSize: fontSize + 'px' }">&copy; {{ currentYear }} My Wedding. All rights reserved.</p>
        </div>
    </footer>
</template>
<style>
    
    /* Styling for popup overlay */
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    /* Styling for popup box */
    .popup-box {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        width: 80%;
        max-width: 900px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        position: relative;
    }

    .popup-overlay .popup-box .text-apology{
        text-align: justify;
        /* text-align-last: center; */
        font-size: 18px !important;
    }

    .message-countdown{
        position: absolute;
        width: 50px;
        height: 50px;
        top: -13%;
        right: -3.5%;
        transform: translate(3.5%, 13%);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #font-size{
        width: 100px;
        height: 150px;
        position: absolute;
        bottom: 22%;
        right: 3.7%;
        transform: translate(-3.7%, -22%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3;
    }
    #font-size .vertical-slider{
        transform: rotate(-90deg);
    }
    .container-fluid{
        background-color:#000000a9;
        /* padding: 50px; */
        position: relative;
        transition: font-size 0.3s ease;
        overflow: hidden;
        box-sizing: border-box;
    }
    .gradient-text{
        animation: colorChange 3s infinite;
        animation-timing-function: linear;
        animation-direction: alternate;
    }
    .text-modify{
        text-align: justify;
        text-align-last: center;
    }
    .box,.groom-img{
        display: flex;
        justify-content: center !important;
        align-items: center !important;
    }
    .box-img{
        width: 250px;
        height: 340px;
        border: 2px solid#fff;
        box-shadow: 1px 1px 10px 0#ffffff4b;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .box-img img{
        width: 98%;
        height: 98%;
        object-fit: cover;
        border-radius: 10px;
    }
    .container-fluid .footer-container .footer-slogain{
        margin-bottom: 15px;
    }
    .table tr td{
        padding-left: 0;
        padding-right: 0;
    }
    .table>:not(caption)>*>*{
        background: none;
        border-bottom-width: 0;
        box-shadow: none;
        color:#fff;
    }
    .table tr td:first-child{
        width: 200px;
    }
    .table tr td:nth-child(2){
        width: 30px;
    }
    button{
        background: transparent;
        box-shadow: 1px 1px 10px 0 #fff;
    }
    button:hover .text-warning{
        color: #fff !important;
    }
    .location-img{
        width: 100%;
        height: auto;
        border: 1px solid#fff;
        box-shadow: 1px 1px 10px 0#ffffff4b;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
    }
    .location-img img{
        width: 98%;
        height: 98%;
        object-fit: cover;
        border-radius: 5px;
    }
    .gallery{
        width: 100%;
        height: 100%;
        border-radius: 5px;
        border: 1px solid #fff;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 1px 1px 10px 0 #ffffff4b;
    }
    .gallery img{
        width: 99%;
        height: 99%;
        object-fit: cover;
        border-radius: 3px;
        margin: 10px;
        transition: transform .3s;
    }
    .gallery:hover img{
        transform: scale(1.1);
    }
    #audio{
        position: absolute;
        width: 40px !important;
        height: 130px !important;
        top: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50px;
        overflow: hidden;
        left: 93%;
        transform: translate(-93%, -95%);
        z-index: 9;
    }
    #audio:hover{
        background-color: red;
    }
    #audio .box-icon{
        padding: 3px;
    }
    #audio .box-icon i{
        font-size: 20px;
        color: #fff;
    }
    #audio .audio-control{
        padding: 6px 12px;
        cursor: pointer;
    }

    .box-img,.location-img,#audio,.gallery{
        animation: borderColorChange 3s infinite;
        animation-timing-function: linear;
        animation-direction: alternate;
    }

    /* Footer */
    .wedding-footer {
        background-color: #f7f7f7 !important;
        color: #333;
        text-align: center;
        padding: 65px;
        font-family: 'Arial', sans-serif;
    }

    .wedding-footer .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .wedding-footer .footer-content p {
        margin: 0;
        font-size: 14px;
    }

    .wedding-footer .footer-tagline {
        font-size: 12px;
        color: #888;
        margin-top: 15px;
        font-style: italic;
    }

    .social-icons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 25px; /* Space between icons */
        margin-top: 5px;
    }

    .social-icons a {
        font-size: 30px;
        color: #333;
        text-decoration: none;
        transition: transform 0.3s ease;
    }

    .social-icons a:hover i{
        color: #007bff;
        transform: scale(1.2);
    }

    .social-icons .fa-phone{
        font-size: 30px;
        cursor: pointer;
    }
</style>