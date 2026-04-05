// src/composables/useAudio.js
import { ref } from 'vue';

export function useAudio() {
    const audioPlayer = ref(null);
    const isPlaying = ref(true); // Track audio state (playing or paused)

    const playAudio = () => {
        if (audioPlayer.value) {
            const playPromise = audioPlayer.value.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying.value = true;
                        localStorage.setItem("audioPlaying", "true");
                    })
                    .catch((error) => console.log("Autoplay blocked:", error));
            }
        }
    };

    const pauseAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            isPlaying.value = false;
        }
    };

    const toggleAudio = () => {
        if (audioPlayer.value) {
            isPlaying.value ? pauseAudio() : playAudio();
            localStorage.setItem("audioPlaying", isPlaying.value);
        }
    };

    return {
        audioPlayer,
        isPlaying,
        playAudio,
        pauseAudio,
        toggleAudio
    };
}
