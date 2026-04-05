<script setup>
    import { ref, computed } from "vue";
    import { sendRSVP } from "../router/sendRSVP.js"; // Import the function

    // Form fields
    const name = ref("");
    // const email = ref("");
    const attending = ref("");
    const guests = ref("");

    // Computed property to check if all fields are filled
    const isFormValid = computed(() => {
        return name.value && attending.value && guests.value;
        // return name.value && email.value && attending.value && guests.value;
    });

    // Handle form submission
    const handleRSVP  = (event) => {
        event.preventDefault();

        const formData = {
            name: name.value,
            // email: email.value,
            attending: attending.value,
            guests: guests.value,
        };

        console.log("Sending RSVP with data:", formData); // Debugging

        sendRSVP(
            formData,
            () => {
                alert("✅ លោកអ្នកបានឆ្លើយតប! 🎉 Thank you for your response!🙏");
                name.value = "";
                // email.value = "";
                attending.value = "";
                guests.value = "";
            },
            (error) => {
                console.error("Failed to send RSVP:", error.text);
                alert("⚠️ ការឆ្លើយតបមិនបានជោគជ័យ, សូមព្យាយាមម្ដងទៀត!");
            }
        );
    };
</script>

<template>
  <div class="rsvp-form mt-5">
    <h2 class="mb-4 text-center" id="rsvp-title" data-aos="fade-up" data-aos-duration="500">ទទួលយកការអញ្ចើញ</h2>
    <form class="row g-3" @submit.prevent="handleRSVP">
      <div class="col-lg-6 col-md-12 col-sm-12 mb-3" data-aos="fade-up" data-aos-duration="550">
        <label for="name" class="form-label">ឈ្មោះរបស់អ្នក</label>
        <input type="text" class="form-control" id="name" v-model="name" placeholder="ឈ្មោះរបស់អ្នក" required />
      </div>
      <!-- <div class="col-lg-6 col-md-12 col-sm-12 mb-3" data-aos="fade-up" data-aos-duration="600">
        <label for="email" class="form-label">អ៊ីម៉ែលរបស់អ្នក</label>
        <input type="email" class="form-control" id="email" v-model="email" placeholder="name@gmail.com"/>
      </div> -->
      <div class="col-lg-6 col-md-6 col-sm-6 mb-3" data-aos="fade-up" data-aos-duration="650">
        <label for="attending" class="form-label">តើអ្នកនឹងចូលរួមទេ?</label>
        <select v-model="attending" id="attending" class="form-select" required>
          <option value="" disabled>តើអ្នកនឹងចូលរួមទេ?</option>
          <option value="ចូលរួម">ចូលរួម</option>
          <option value="មិនបានចូលរួម">មិនបានចូលរួម</option>
        </select>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-6 mb-3" data-aos="fade-up" data-aos-duration="700">
        <label for="guests" class="form-label">ចំនួនភ្ញៀវចូលរួម</label>
        <input type="number" class="form-control" id="guests" v-model="guests" placeholder="0" required />
      </div>
      <div class="col-12 mb-5 text-center" data-aos="fade-up" data-aos-duration="650">
        <button type="submit" class="btn btn-success" :disabled="!isFormValid">បញ្ចូនការឆ្លើយតប</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
    .rsvp-form {
        font-family: "Kantumruy Pro";
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>
