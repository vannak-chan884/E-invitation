import { ref } from 'vue'

export const galleries = ref([
    "/gallery/15.jpg",
    "/gallery/17.jpg",
    "/gallery/18.jpg",
    "/gallery/21.jpg",
    "/gallery/22.jpg",
    "/gallery/23.jpg",
    "/gallery/24.jpg",
    "/gallery/25.jpg",
    "/gallery/26.jpg",
    "/gallery/27.jpg",
    "/gallery/28.jpg",
    "/gallery/29.jpg",
])

export const socialLinks = ref({
    Facebook: {
        url: 'https://www.facebook.com/vannak.chan.612/',
        icon: "fa-facebook",
    },
    Linkin: {
        url: 'https://www.linkedin.com/in/chan-vannak/',
        icon: "fa-linkedin-in"
    },
    Telegram: {
        url: 'https://t.me/vannak40',
        icon: "fa-telegram"
    }
})