import Shepherd from 'shepherd.js';

// Function to start the tour
export const startContentTour = () => {
    if (localStorage.getItem('skipTour') === 'true') {
        return; // Don't show the tour if the user already skipped
    }

    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'custom-tour',
            scrollTo: true,
        },
    });

    // Disable scrolling when the tour starts
    tour.on('start', () => {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    });

    // Re-enable scrolling when the tour ends
    tour.on('complete', () => {
        document.body.style.overflow = 'auto';
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
        attachTo: { element: '.audio-control', on: 'left' },
        buttons: [
            { text: 'Skip', action: () => skipTour(tour) },
            { text: 'Next', action: tour.next }
        ],
    });

    tour.addStep({
        id: 'location',
        title: '📍 ទីតាំងផ្ទះការ',
        text: 'សូមធ្វើការចុចបើកមើលទីតាំងផ្ទះការតាម Google Maps! 🗺️',
        attachTo: { element: '#maps-icon', on: 'left' },
        buttons: [
            { text: 'Skip', action: () => skipTour(tour) },
            { text: 'Back', action: tour.back },
            { text: 'Next', action: tour.next }
        ],
    });

    tour.addStep({
        id: 'Add-to-Google-Caledar',
        title: '📅 កត់ទុកក្នុងប្រតិទិន',
        text: 'សូមធ្វើការកត់ចំណាំការអញ្ចើញរបស់យើងខ្ញុំទៅក្នុង Google Caledar! ✍️',
        attachTo: { element: '.google-calendar-btn', on: 'left' },
        buttons: [
            { text: 'Skip', action: () => skipTour(tour) },
            { text: 'Back', action: tour.back },
            { text: 'Next', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'Telegram',
        title: '📩 Telegram',
        text: `<a href="https://t.me/vannak40">@vannak40</a>`,
        attachTo: { element: '.fa-telegram', on: 'left' },
        buttons: [
            { text: 'Skip', action: () => skipTour(tour) },
            { text: 'Back', action: tour.back },
            { text: 'Ok', action: tour.complete }
        ]
    });

    tour.start();
};

export const startHomeTour = () => {
    if (localStorage.getItem('skipTour') === 'true') {
        return; // Don't show the tour if the user already skipped
    }

    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'custom-tour',
            scrollTo: true,
        },
    });

    // Disable scrolling when the tour starts
    tour.on('start', () => {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    });

    // Re-enable scrolling when the tour ends
    tour.on('complete', () => {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
    });

    tour.on('cancel', () => {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
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

// Function to skip the tour and store that information
export const skipTour = (tour) => {
    localStorage.setItem('skipTour', 'true'); // Save that the user skipped
    tour.complete(); // Close the tour
};