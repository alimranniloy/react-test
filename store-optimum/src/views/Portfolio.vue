<template>
  <div
    class="min-h-screen bg-gradient-to-br text-slate-50 px-5 py-10 overflow-x-hidden"
  >
    <div class="container max-w-6xl mx-auto">
      <!-- Portfolio Header -->
      <!-- Portfolio Header -->
      <div class="portfolio-header text-center mb-16">
        <p
          class="pre-title inline-block text-sm text-amber-500 mb-4 uppercase tracking-wider"
        >
          আমাদের কাজ
        </p>
        <h1
          class=".text-xl sm:text-2xl lg:text-3xl xl:text-4xl max-w-2xl font-bold text-[3.5rem] mb-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded"
        >
          নির্বাচিত প্রজেক্টসমূহ
        </h1>
        <p class="subtitle text-lg text-black max-w-xl mx-auto leading-relaxed">
          আমাদের উদ্ভাবনী সফটওয়্যার সমাধানের পোর্টফোলিও দেখুন যা ব্যবসাগুলোকে
          রূপান্তরিত ও বৃদ্ধি পেতে সহায়তা করেছে
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="filter-buttons flex justify-center flex-wrap gap-4 mb-10">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="[
            'px-6 py-3 bg-black text-white border border-white/10 rounded-full font-medium cursor-pointer transition',
            {
              'bg-gradient-to-r from-amber-500 to-amber-700 text-white border-transparent shadow-lg':
                activeFilter === filter.value,
            },
          ]"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Portfolio Grid -->
      <div
        class="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        <div
          v-for="(project, index) in filteredProjects"
          :key="index"
          class="portfolio-item bg-white-800/60 rounded-2xl overflow-hidden transition duration-400 border border-amber-500/10 shadow-sm hover:-translate-y-3 hover:shadow-md hover:border-amber-500/50 cursor-pointer"
          :data-category="project.category"
        >
          <div
            class="portfolio-img h-64 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-6xl relative overflow-hidden"
          >
            <img :src="project.image" alt="" class="w-full h-full" />
            <component
              :is="project.icon"
              class="w-9 h-9 sm:w-12 sm:h-12"
              :style="{ color: project.iconColor }"
            />
            <div
              class="portfolio-overlay absolute inset-0 bg-gradient-to-b from-white-500/20 to-purple-500/40 flex items-center justify-center opacity-0 transition duration-300 hover:opacity-100"
            >
              <div
                class="view-project w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 text-2xl scale-90 transition duration-300 hover:scale-100"
                @click="openModal(project)"
              >
                <PlusIcon />
              </div>
            </div>
          </div>
          <div class="portfolio-content p-6">
            <h3 class="portfolio-title text-xl font-bold mb-3 text-black">
              {{ project.title }}
            </h3>
            <p class="portfolio-desc text-black leading-relaxed mb-5">
              {{ project.desc }}
            </p>
            <div class="portfolio-tags flex flex-wrap gap-2">
              <span
                v-for="(tag, tIndex) in project.tags"
                :key="tIndex"
                class="tag px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-sm"
                >{{ tag }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <div
      v-if="isModalOpen"
      class="project-modal fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 transition duration-300"
      :class="{
        'opacity-100 visible': isModalOpen,
        'opacity-0 invisible': !isModalOpen,
      }"
      @click="closeModalIfOutside"
    >
      <div
        class="modal-content bg-slate-800/95 w-[90%] max-w-4xl rounded-2xl p-10 relative transition duration-300 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
        :class="{ 'scale-100': isModalOpen, 'scale-90': !isModalOpen }"
      >
        <div
          class="close-modal absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-lg cursor-pointer transition hover:bg-amber-500 hover:rotate-90"
          @click="closeModal"
        >
          <XMarkIcon />
        </div>

        <div
          class="modal-img h-80 bg-gradient-to-br from-amber-500 to-amber-500 rounded-xl mb-8 flex items-center justify-center text-white text-7xl"
        >
          <img
            :src="currentProject.image"
            alt=""
            class="w-full h-full object-cover rounded-md"
          />
          <i :class="['fas', currentProject.icon]"></i>
        </div>

        <h2 class="modal-title text-3xl font-bold mb-4 text-white">
          {{ currentProject.title }}
        </h2>
        <p class="modal-subtitle text-amber-500 text-lg mb-6">
          {{ currentProject.modal.subtitle }}
        </p>

        <p class="modal-desc text-slate-300 leading-relaxed mb-8">
          {{ currentProject.modal.fullDesc }}
        </p>

        <div class="modal-features mb-8">
          <h4 class="text-xl mb-4 text-white">Key Features</h4>
          <ul class="features-list space-y-3">
            <li
              v-for="(feature, fIndex) in currentProject.modal.features"
              :key="fIndex"
              class="flex items-center text-slate-400"
            >
              <i class="fas fa-check-circle text-amber-500 mr-3"></i>
              {{ feature }}
            </li>
          </ul>
        </div>

        <div class="modal-tags flex flex-wrap gap-2 mb-8">
          <span
            v-for="(tag, tIndex) in currentProject.modal.modalTags"
            :key="tIndex"
            class="tag px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-sm"
            >{{ tag }}</span
          >
        </div>

        <a
          :href="currentProject.modal.link"
          class="cta-button inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-800 text-white rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_10px_20px_rgba(202,138,4,0.3)] relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(202,138,4,0.4)] before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
        >
          View Live Project
          <i
            class="fas fa-arrow-right ml-2 transition duration-300 group-hover:translate-x-1"
          ></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const activeFilter = ref("all");

import {
  AcademicCapIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const filters = [
  { label: "All Projects", value: "all" },
  { label: "Web Development", value: "web" },
  { label: "Mobile Apps", value: "mobile" },
  { label: "AI Solutions", value: "ai" },
  { label: "Cloud Services", value: "cloud" },
];

const projects = ref([
  {
    category: "web",
    icon: AcademicCapIcon,
    title: "এআই-চালিত অ্যানালিটিক্স প্ল্যাটফর্ম",
    desc: "একটি পূর্ণাঙ্গ ডেটা অ্যানালিটিক্স সলিউশন যা মেশিন লার্নিং ব্যবহার করে কার্যকরী ব্যবসায়িক অন্তর্দৃষ্টি প্রদান করে।",
    image:
      "https://images.unsplash.com/photo-1600529782623-5d3cb98476c9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["এআই/এমএল", "React", "Node.js"],
    modal: {
      subtitle: "ওয়েব ডেভেলপমেন্ট • এআই সলিউশন",
      fullDesc:
        "একটি পূর্ণাঙ্গ ডেটা অ্যানালিটিক্স সলিউশন যা মেশিন লার্নিং ব্যবহার করে কার্যকরী ব্যবসায়িক অন্তর্দৃষ্টি প্রদান করে। এই প্ল্যাটফর্মটি রিয়েল-টাইমে বড় ডেটাসেট প্রসেস করে, প্যাটার্ন ও ট্রেন্ড শনাক্ত করে এবং একটি সহজবোধ্য ড্যাশবোর্ডের মাধ্যমে তথ্য উপস্থাপন করে। ইমপ্লিমেন্টেশনের পর আমাদের ক্লায়েন্ট ৩৫% কার্যক্ষমতা বৃদ্ধি পেয়েছে।",
      features: [
        "রিয়েল-টাইম ডেটা প্রসেসিং ও ভিজুয়ালাইজেশন",
        "মেশিন লার্নিং অ্যালগরিদম দিয়ে প্রেডিক্টিভ অ্যানালিটিক্স",
        "কাস্টমাইজড ড্যাশবোর্ড ও রিপোর্টিং",
        "সুরক্ষিত ডেটা এনক্রিপশন ও অ্যাক্সেস কন্ট্রোল",
        "জনপ্রিয় বিজনেস টুলের সাথে ইন্টিগ্রেশন",
      ],
      modalTags: ["React", "Node.js", "Python", "TensorFlow", "MongoDB", "AWS"],
      link: "#",
    },
  },
  {
    category: "mobile",
    icon: DevicePhoneMobileIcon,
    image:
      "https://plus.unsplash.com/premium_photo-1754823341228-2942d681244b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ই-কমার্স মোবাইল অ্যাপ",
    desc: "পার্সোনালাইজড সাজেশন ও সুরক্ষিত পেমেন্ট প্রসেসিং সহ একটি নিরবচ্ছিন্ন শপিং এক্সপেরিয়েন্স।",
    tags: ["iOS", "Android", "React Native"],
    modal: {
      subtitle: "মোবাইল ডেভেলপমেন্ট",
      fullDesc:
        "পার্সোনালাইজড সাজেশন ও সুরক্ষিত পেমেন্ট প্রসেসিং সহ একটি নিরবচ্ছিন্ন শপিং এক্সপেরিয়েন্স। এই অ্যাপটিতে সহজ নেভিগেশন, রিয়েল-টাইম ইনভেন্টরি আপডেট এবং ইন্টিগ্রেটেড পেমেন্ট গেটওয়ে রয়েছে।",
      features: [
        "পার্সোনালাইজড প্রোডাক্ট সাজেশন",
        "সুরক্ষিত পেমেন্ট প্রসেসিং",
        "রিয়েল-টাইম ইনভেন্টরি ম্যানেজমেন্ট",
        "প্রমোশনের জন্য পুশ নোটিফিকেশন",
        "ইউজার অ্যাকাউন্ট ম্যানেজমেন্ট",
      ],
      modalTags: ["React Native", "Firebase", "Stripe", "iOS", "Android"],
      link: "#",
    },
  },
  {
    category: "web",
    icon: "fa-chart-line",
    title: "ফাইন্যান্সিয়াল ড্যাশবোর্ড",
    image:
      "https://plus.unsplash.com/premium_photo-1753231048311-ced973c9cdac?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "ইনভেস্টমেন্ট ফার্ম ও ফাইন্যান্সিয়াল অ্যানালিস্টদের জন্য রিয়েল-টাইম ফাইন্যান্সিয়াল ডেটা ভিজুয়ালাইজেশন ও রিপোর্টিং।",
    tags: ["React", "D3.js", "Python"],
    modal: {
      subtitle: "ওয়েব ডেভেলপমেন্ট",
      fullDesc:
        "ইনভেস্টমেন্ট ফার্ম ও ফাইন্যান্সিয়াল অ্যানালিস্টদের জন্য রিয়েল-টাইম ফাইন্যান্সিয়াল ডেটা ভিজুয়ালাইজেশন ও রিপোর্টিং। এই ড্যাশবোর্ডে ইন্টারঅ্যাকটিভ চার্ট, কাস্টম রিপোর্ট এবং একাধিক সোর্স থেকে ডেটা ইন্টিগ্রেশন রয়েছে।",
      features: [
        "ইন্টারঅ্যাকটিভ ডেটা ভিজুয়ালাইজেশন",
        "কাস্টম রিপোর্ট জেনারেশন",
        "রিয়েল-টাইম মার্কেট ডেটা ইন্টিগ্রেশন",
        "ইউজার-ডিফাইন্ড অ্যালার্ট ও নোটিফিকেশন",
        "সুরক্ষিত ডেটা হ্যান্ডলিং",
      ],
      modalTags: ["React", "D3.js", "Python", "Django", "PostgreSQL"],
      link: "#",
    },
  },
  {
    category: "ai",
    icon: ChatBubbleLeftIcon,
    title: "চ্যাটবট প্ল্যাটফর্ম",
    image:
      "https://plus.unsplash.com/premium_photo-1676068244719-765a1964d25e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "একটি বুদ্ধিমান চ্যাটবট সলিউশন যা ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং ব্যবহার করে কাস্টমার সার্ভিস উন্নত করে।",
    tags: ["AI", "NLP", "Vue.js"],
    modal: {
      subtitle: "এআই সলিউশন",
      fullDesc:
        "একটি বুদ্ধিমান চ্যাটবট সলিউশন যা ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং ব্যবহার করে কাস্টমার সার্ভিস উন্নত করে। এই প্ল্যাটফর্ম কাস্টমারের প্রশ্ন হ্যান্ডেল করে, তাত্ক্ষণিক উত্তর প্রদান করে এবং বিদ্যমান সিআরএম সিস্টেমের সাথে ইন্টিগ্রেটেড।",
      features: [
        "ন্যাচারাল ল্যাঙ্গুয়েজ আন্ডারস্ট্যান্ডিং",
        "মাল্টি-চ্যানেল সাপোর্ট",
        "কনভারসেশন অ্যানালিটিক্স",
        "সিআরএম এর সাথে সহজ ইন্টিগ্রেশন",
        "কাস্টমাইজড রেসপন্স টেমপ্লেট",
      ],
      modalTags: ["Vue.js", "Dialogflow", "Node.js", "MongoDB"],
      link: "#",
    },
  },
  {
    category: "cloud",
    icon: CloudIcon,
    title: "ক্লাউড মাইগ্রেশন সলিউশন",
    image:
      "https://plus.unsplash.com/premium_photo-1739267887095-4725620ea921?q=80&w=1732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "বড় প্রতিষ্ঠানের জন্য উন্নত স্কেলেবিলিটি ও সিকিউরিটি সহ ক্লাউড ইনফ্রাস্ট্রাকচারে নিরবচ্ছিন্ন মাইগ্রেশন।",
    tags: ["AWS", "DevOps", "Docker"],
    modal: {
      subtitle: "ক্লাউড সার্ভিসেস",
      fullDesc:
        "বড় প্রতিষ্ঠানের জন্য উন্নত স্কেলেবিলিটি ও সিকিউরিটি সহ ক্লাউড ইনফ্রাস্ট্রাকচারে নিরবচ্ছিন্ন মাইগ্রেশন। এই সলিউশনটিতে রয়েছে অ্যাসেসমেন্ট, মাইগ্রেশন প্ল্যানিং ও চলমান অপটিমাইজেশন।",
      features: [
        "অটোমেটেড মাইগ্রেশন টুল",
        "স্কেলেবল ক্লাউড আর্কিটেকচার",
        "উন্নত সিকিউরিটি মেজার",
        "কস্ট অপটিমাইজেশন",
        "কন্টিনিউয়াস মনিটরিং",
      ],
      modalTags: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
      link: "#",
    },
  },
  {
    category: "web",
    icon: "fa-shopping-cart",
    title: "ই-কমার্স প্ল্যাটফর্ম",
    image:
      "https://plus.unsplash.com/premium_photo-1752111382495-97f90e81fab3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "ইনভেন্টরি ম্যানেজমেন্ট, পেমেন্ট প্রসেসিং ও কাস্টমার অ্যানালিটিক্স সহ একটি পূর্ণাঙ্গ অনলাইন স্টোর।",
    tags: ["React", "MongoDB", "Stripe"],
    modal: {
      subtitle: "ওয়েব ডেভেলপমেন্ট",
      fullDesc:
        "ইনভেন্টরি ম্যানেজমেন্ট, পেমেন্ট প্রসেসিং ও কাস্টমার অ্যানালিটিক্স সহ একটি পূর্ণাঙ্গ অনলাইন স্টোর। এই প্ল্যাটফর্মটি মাল্টি ভেন্ডর সাপোর্ট, অ্যাডভান্সড সার্চ ও মার্কেটিং টুলস প্রদান করে।",
      features: [
        "মাল্টি-ভেন্ডর সাপোর্ট",
        "অ্যাডভান্সড প্রোডাক্ট সার্চ",
        "ইন্টিগ্রেটেড পেমেন্ট গেটওয়ে",
        "কাস্টমার অ্যানালিটিক্স ড্যাশবোর্ড",
        "মার্কেটিং অটোমেশন",
      ],
      modalTags: ["React", "Node.js", "MongoDB", "Stripe", "Elasticsearch"],
      link: "#",
    },
  },
]);

const filteredProjects = computed(() => {
  return activeFilter.value === "all"
    ? projects.value
    : projects.value.filter((p) => p.category === activeFilter.value);
});

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const isModalOpen = ref(false);
const currentProject = ref({});

const openModal = (project) => {
  currentProject.value = project;
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

const closeModalIfOutside = (e) => {
  if (e.target.classList.contains("project-modal")) {
    closeModal();
  }
};

const counts = ref({
  clients: 0,
  projects: 0,
  satisfaction: 0,
  experience: 0,
});

const animateCount = (key, target, duration) => {
  let start = 0;
  const increment = target / (duration / 16);
  const update = () => {
    start += increment;
    if (start < target) {
      counts.value[key] = Math.ceil(start);
      requestAnimationFrame(update);
    } else {
      counts.value[key] = target;
    }
  };
  update();
};

onMounted(() => {
  animateCount("clients", 150, 2000);
  animateCount("projects", 300, 2000);
  animateCount("satisfaction", 98, 2000);
  animateCount("experience", 8, 2000);
});
</script>

<style scoped>
@media (max-width: 992px) {
  h1 {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 2.2rem;
  }

  .pre-title {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .modal-content {
    padding: 30px 20px;
  }

  .modal-img {
    height: 200px;
  }

  .modal-title {
    font-size: 1.8rem;
  }
}
</style>
