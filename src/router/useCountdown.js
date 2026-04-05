// src/composables/useCountdown.js
import { ref } from 'vue';

export function useCountdown(targetDate) {
    const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    let timerInterval = null;
    const eventStarted = ref(false);

    const updateCountdown = () => {
        const now = new Date().getTime();
        const timeDifference = targetDate - now;

        if (timeDifference > 0) {
            countdown.value = {
                days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
            };
        } else {
            eventStarted.value = true;
            clearInterval(timerInterval);
        }
    };

    const startCountdown = () => {
        updateCountdown();
        timerInterval = setInterval(updateCountdown, 1000);
    };

    return { countdown, eventStarted, startCountdown };
}
