<template>
  <section class="my-8 lg:my-20 bg-white">
    <div class="max-w-[1600px] mx-auto px-4">
      <h2
        class="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold lg:mb-10 text-center mb-6"
      >
        আমাদের গ্রাহকরা যা বলছেন
      </h2>
      <div class="flex justify-between items-center gap-3 relative">
        <button
          @click="prevSlide"
          class="group p-2 absolute -left-3 z-10 hidden md:block bg-[#fff3e9] hover:bg-amber-600 rounded-full border border-gray-600 hover:border-white transform transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-black group-hover:text-white transform transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div class="w-full blurry-bg relative">
          <div class="topright z-1"></div>
          <div class="bottomleft z-1"></div>
          <Flicking
            ref="flicking"
            :options="{
              circular: true,
              infinite: true,
              loop: true,
              nested: true,
              autoplay: false,
              center: false,
              gap: 16,
              moveType: 'snap', // Ensure it snaps to one slide at a time
            }"
          >
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="w-full z-2 lg:w-1/3 p-1"
            >
              <div
                class="border w-full relative z-3 p-12 bg-black shadow-sm flex flex-col"
              >
                <div class="">
                  <div class="flex flex-col gap-3">
                    <div
                      class="image-container h-14 w-14 flex items-center justify-center border border-2 border-amber-600 rounded-full"
                    >
                      <img
                        :src="testimonial.image"
                        alt="Profile"
                        class="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p
                        class="font-semibold text-lg leading-tight text-amber-600"
                      >
                        {{ testimonial.name }}
                      </p>
                      <p class="text-white text-sm leading-tight pt-1">
                        {{ testimonial.position }}
                      </p>
                    </div>
                  </div>
                  <p class="text-slate-100 text-sm mt-10">
                    {{ testimonial.message }}
                  </p>
                </div>
              </div>
            </div>
          </Flicking>
        </div>
        <button
          @click="nextSlide"
          class="group p-2 absolute -right-3 z-10 hidden md:block bg-[#fff3e9] hover:bg-amber-600 rounded-full border border-gray-600 hover:border-white transform transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-black group-hover:text-white transform transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";
// Import Flicking from @egjs/vue3-flicking
import "@egjs/flicking/dist/flicking.css";
import Flicking from "@egjs/vue3-flicking";

export default defineComponent({
  name: "TestimonialSection",
  components: {
    Flicking,
  },
  data() {
    return {
      autoplayInterval: null, // To store the interval ID
      currentIndex: 0,
      testimonials: [
        {
          message:
            "আমাদের সোশ্যাল মিডিয়া কৌশলে বিপণির সাথে কাজ করা একটি গেম-চেঞ্জার ছিল। তারা কেবল আমাদের ব্র্যান্ড ভিজিবিলিটিই বাড়ায়নি, বরং প্রতিটি পোস্টের জন্য গভীর বিশ্লেষণ এবং কনটেন্ট অপ্টিমাইজেশনও করেছে। পুরো টিমের দৃষ্টিভঙ্গি এবং ফলাফল-কেন্দ্রিক মনোভাব আমাদের প্রচেষ্টাকে নতুন উচ্চতায় নিয়ে গেছে।",
          name: "ব্র্যাড থম্পসন",
          position: "মার্কেটিং ডিরেক্টর @ ইকোগ্লোবাল",
          image: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          message:
            "বিপণিকে ধন্যবাদ, আমাদের সর্বশেষ মার্কেটিং প্রচারণা লিড জেনারেশনে দ্বিগুণ বৃদ্ধি পেয়েছে। তারা আমাদের লক্ষ্য শ্রোতাদের গভীরভাবে বুঝেছে এবং সেই অনুযায়ী স্ট্র্যাটেজি তৈরি করেছে। এক মাসের মধ্যেই আমরা আগের তুলনায় প্রায় ৭৫% বেশি কোয়ালিটি লিড পেয়েছি, যা আমাদের বিক্রয় টিমকে ব্যাপকভাবে সাহায্য করেছে।",
          name: "জন স্মিথ",
          position: "লিড মার্কেটার @ ফ্রেশস্টার্ট",
          image: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
          message:
            "বিপণির সাথে কাজ করা আমাদের সোশ্যাল মিডিয়া কৌশলে বিপ্লব এনেছে। তারা ট্রেন্ড, অ্যালগরিদম এবং কনটেন্ট টাইপ সম্পর্কে অত্যন্ত দক্ষ। নিয়মিত বিশ্লেষণ এবং ক্রিয়েটিভ ক্যাম্পেইনের মাধ্যমে তারা আমাদের এনগেজমেন্ট ও ফলোয়ারের সংখ্যা দ্বিগুণ করেছে। এমন প্রফেশনাল, সৃজনশীল ও কার্যকর টিমের সাথে কাজ করতে পেরে আমরা কৃতজ্ঞ।",
          name: "এলা ডেভিস",
          position: "সোশ্যাল মিডিয়া ম্যানেজার @ কানেক্টমি",
          image: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
          message:
            "বিপণি টিমের পেশাদারিত্ব এবং সমস্যা সমাধানের ক্ষমতা অসাধারণ। তারা শুধু কনসাল্টেশনই দেয়নি, বরং আমাদের পুরোনো মার্কেটিং মডেল বিশ্লেষণ করে এমন একটি কৌশল তৈরি করেছে যা প্রযুক্তি ও ব্যবহারকারীর আচরণের সাম্প্রতিক প্রবণতাগুলোর সাথে সম্পূর্ণভাবে খাপ খায়। তাদের পরামর্শ আমাদের উন্নয়নের গতি উল্লেখযোগ্যভাবে বাড়িয়েছে।",
          name: "লিয়াম কার্টার",
          position: "সিটিও @ ইনোভেটএক্স",
          image: "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
          message:
            "তাদের সুপারিশকৃত কৌশল বাস্তবায়নের পর থেকে আমাদের বিক্রয় ক্রমাগত বাড়ছে। বিপণি শুধু মার্কেটিং টুলস ও ট্রেন্ড বোঝে না, তারা আমাদের টার্গেট অডিয়েন্সের ব্যাবহারিক দৃষ্টিকোণ থেকেও চিন্তা করে। তাদের প্রফেশনাল দৃষ্টিভঙ্গি এবং সময়মত সাপোর্ট আমাদের ব্র্যান্ডকে গ্রাহকদের সাথে দৃঢ়ভাবে সংযুক্ত করেছে।",
          name: "সোফিয়া বেনেট",
          position: "সেলস লিড @ মার্কেটপালস",
          image: "https://randomuser.me/api/portraits/women/5.jpg",
        },
      ],
    };
  },
  methods: {
    prevSlide() {
      // Use this.$refs.flicking to access Flicking instance and call its methods
      if (this.$refs.flicking) {
        this.$refs.flicking.prev();
      }
    },
    nextSlide() {
      // Use this.$refs.flicking to access Flicking instance and call its methods
      if (this.$refs.flicking) {
        this.$refs.flicking.next();
      }
    },
    startAutoplay() {
      // Clear any previous interval to avoid multiple intervals running
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }

      // Start the interval
      this.autoplayInterval = setInterval(() => {
        // Calculate the next index
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        // Move to the next slide using the Flicking API
        this.$refs.flicking.moveTo(this.currentIndex);
      }, 3000); // Change slide every 3000ms (3 seconds)
    },
  },
  mounted() {
    this.startAutoplay(); // Start autoplay when the component is mounted
  },
  beforeDestroy() {
    // Clear the interval when the component is destroyed
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  },
});
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
.topright {
  width: 15%;
  height: 40%;
  bottom: 15%;
  right: -12px;
  position: absolute;

  background: #dea145cc;
  filter: blur(90px);
}
.bottomleft {
  width: 15%;
  height: 40%;
  top: 15%;
  left: -20px;
  position: absolute;
  background: #dea145cc;
  filter: blur(90px);
}
</style>
