import { ref } from 'vue';

export function useFontSize() {
    const fontSize = ref(18); // Default font size

    const increaseFontSize = () => {
        fontSize.value += 2;
    };

    const decreaseFontSize = () => {
        if (fontSize.value > 10) {
            fontSize.value -= 2;
        }
    };

    return { fontSize, increaseFontSize, decreaseFontSize };
}
