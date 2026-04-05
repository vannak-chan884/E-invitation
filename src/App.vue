<script setup>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const router = useRouter();
  const updateAvailable = ref(false);

  onMounted(() => {
    window.addEventListener('swUpdated', () => {
      updateAvailable.value = true; // Show notification
    });

    // 🔒 Disable Right Click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // 🔒 Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "J")) ||
        (event.ctrlKey && event.key === "U")
      ) {
        event.preventDefault();
      }
    });

    // 🔒 Detect DevTools Every 3 Seconds
    setInterval(() => {
      const before = new Date().getTime();
      debugger; // This line will stop the script if DevTools is open
      const after = new Date().getTime();
      
      if (after - before > 100) {
        alert("🚨 Developer tools detected! Access denied.");
        window.location.href = "about:blank"; // Redirect to a blank page
      }
    }, 3000);

    if (window.location.pathname !== '/') {
      router.push('/'); // Redirect to Home if refreshed
    }
  });

  const refreshPage = () => {
    window.location.reload(); // Refresh page when clicked
  };
</script>
<template>
  <div>
    <!-- Update Notification -->
    <div v-if="updateAvailable" class="update-banner">
        A new version is available!  
        <button @click="refreshPage">Refresh</button>
    </div>
  </div>
  <div class="background"></div>
  <RouterView />
</template>

<style>
  .update-banner {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffcc00;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
    z-index: 100;
  }
  .background {
        background-image: url('/background.jpg');
        background-size: cover;
        background-position: center 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        transform: translateZ(0);
        z-index: -1;
  }
</style>