// src/composables/usePopup.js
import { ref, nextTick } from 'vue';
import { useAudio } from './useAudio';

export function usePopup(startTour) {
    const showPopup = ref(false);
    const countdownMessage = ref(10);
    const { playAudio, pauseAudio } = useAudio();

    const disableScroll = () => {
        document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
        document.body.style.overflow = "";
    };

    const startCountdown = () => {
        console.log("Countdown started...");
        
        // Pause audio when popup appears
        pauseAudio();
        
        const interval = setInterval(() => {
            console.log("Countdown:", countdownMessage.value);
            if (countdownMessage.value > 0) {
                countdownMessage.value -= 1;
            }
            if (countdownMessage.value === 0) {
                clearInterval(interval);
                showPopup.value = false;
                enableScroll();
                console.log("Closing popup, playing audio...");
                nextTick(() => {
                    playAudio();
                    console.log("Audio should be playing now.");
                });
            }
        }, 1000);

        setTimeout(startTour, 12000);
    };

    return { showPopup, countdownMessage, disableScroll, enableScroll, startCountdown };
}
