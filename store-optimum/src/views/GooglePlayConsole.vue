<template>
  <div
    class="pt-10 relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden"
  >
    <header class="text-center px-4 py-16 sm:py-20">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-bold text-amber-300 mb-3">
          আপনি কি মোবাইল অ্যাপ ডেভেলপার?
        </h1>
        <h2 class="text-xl sm:text-2xl font-semibold text-slate-100 mb-4">
          আপনার Google Play Console অ্যাকাউন্টটি সর্বোচ্চ মূল্যে বিক্রি করুন।
        </h2>
        <p class="text-slate-300 leading-relaxed max-w-2xl mx-auto">
          আমরা ১-৩টি বা তার বেশি লাইভ অ্যাপসহ সচল প্লে কনসোল সর্বোচ্চ দামে কিনে
          থাকি। এছাড়াও, বন্ধ হয়ে যাওয়া কনসোল আলোচনা সাপেক্ষে ক্রয় করা হয়।
        </p>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
        >
          <a
            href="tel:+919836941943"
            class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <PhoneIcon class="w-5 h-5" />
            <span>এখনই কল করুন</span>
          </a>

          <a
            href="https://wa.me/+919836941943"
            target="_blank"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <ChatBubbleLeftIcon class="w-5 h-5" />
            <span>WhatsApp-এ যোগাযোগ</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Why Us Section -->
    <section id="why-us" class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-amber-400 mb-10">
          কেন আমরাই সেরা?
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center"
        >
          <div
            v-for="(feature, i) in features"
            :key="i"
            class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
          >
            <div class="text-4xl mb-3">{{ feature.icon }}</div>
            <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ feature.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section id="process" class="bg-white py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">
          মাত্র ৩টি সহজ ধাপে ডিল সম্পন্ন করুন
        </h2>
        <div
          class="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative"
        >
          <div
            v-for="(step, i) in steps"
            :key="i"
            class="flex-1 text-center bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <div
              class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-blue-500 text-white text-xl font-bold border-4 border-white shadow mb-3"
            >
              {{ i + 1 }}
            </div>
            <h3 class="font-semibold text-lg mb-2">{{ step.title }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ step.text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="bg-gray-50 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">
          আমাদের সার্ভিস প্যাকেজ
        </h2>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <div
            v-for="(plan, i) in pricing"
            :key="i"
            class="bg-white rounded-xl p-6 w-full sm:w-72 shadow hover:shadow-xl border-t-4 transition-transform hover:scale-105 flex flex-col items-center text-center"
            :class="
              plan.type === 'active' ? 'border-green-500' : 'border-red-500'
            "
          >
            <h3 class="text-lg font-bold">{{ plan.title }}</h3>
            <p class="text-gray-500 text-sm mb-2">{{ plan.subtitle }}</p>
            <div
              class="text-2xl font-bold mb-4"
              :class="
                plan.type === 'active' ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ plan.price }}
            </div>
            <p class="text-gray-600 text-sm flex-grow">{{ plan.text }}</p>
            <a
              :href="plan.link"
              target="_blank"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium mt-4 shadow hover:shadow-md transition-all"
            >
              {{ plan.button }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 pb-10">
      <div class="container max-w-[1000px] mx-auto sm:px-0 px-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          আমাদের সাম্প্রতিক ডিল
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Deal 1 -->
          <div
            class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <img
              src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b6dc0d00-2e5d-4671-8b89-ba469641b63e.jpeg"
              alt="Play Console Purchase"
              class="w-full sm:h-96 h-64 object-cover object-top"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">
                গুগল প্লে কনসোল ক্রয় সম্পন্ন
              </h3>
              <p class="text-gray-600 text-sm mt-2 leading-relaxed">
                আমাদের টিমের মাধ্যমে সফলভাবে গুগল প্লে কনসোল একাউন্ট ক্রয় করা
                হয়েছে। আমরা প্রতিটি ক্রয়ের স্ক্রিনশট এবং ডকুমেন্ট শেয়ার করি যাতে
                ক্লায়েন্টরা সম্পূর্ণ নিশ্চিন্ত থাকতে পারেন।
              </p>
            </div>
          </div>

          <!-- Deal 2 -->
          <div
            class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <img
              src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/dd7ca43d-90ef-435c-a57e-584fb2b3aa52.jpeg"
              alt="Client Deal"
              class="w-full sm:h-96 h-64 object-cover object-top"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">
                ক্লায়েন্টের সাথে ডিল সম্পন্ন
              </h3>
              <p class="text-gray-600 text-sm mt-2 leading-relaxed">
                এই ডিলের সময় আমরা সরাসরি অফিসে উপস্থিত থেকে চুক্তিপত্র ও
                একাউন্টের তথ্য হস্তান্তর করেছি। স্বচ্ছতা ও বিশ্বস্ততা আমাদের
                প্রথম অগ্রাধিকার।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="bg-blue-950 text-white text-center py-12 px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">
          আপনার প্লে কনসোলটির সেরা মূল্য পেতে আর দেরি কেন?
        </h2>
        <p class="text-gray-200 mb-6 leading-relaxed">
          আজই আমাদের বিশেষজ্ঞ টিমের সাথে কথা বলুন এবং আপনার অ্যাকাউন্টের জন্য
          একটি আকর্ষণীয় অফার নিন।
        </p>
        <a
          href="tel:+919836941943"
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
        >
          <PhoneIcon class="w-5 h-5" />
          <span>+91 98369 41943</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ChatBubbleLeftIcon, PhoneIcon } from "@heroicons/vue/24/outline";

const features = [
  {
    icon: "📄",
    title: "লিখিত চুক্তিপত্রের সুবিধা",
    text: "সম্পূর্ণ স্বচ্ছতা ও সুরক্ষার জন্য আমরা সরকার-অনুমোদিত স্ট্যাম্পে লিখিত চুক্তিপত্র করে থাকি।",
  },
  {
    icon: "🤝",
    title: "অনলাইন বা সরাসরি ডিল",
    text: "আপনার সুবিধা অনুযায়ী আমাদের অফিসে সরাসরি এসে অথবা অনলাইনে ডিল করতে পারেন।",
  },
  {
    icon: "🌍",
    title: "আন্তর্জাতিক সার্ভিস",
    text: "আমরা সফলতার সাথে India, USA এবং অন্যান্য আন্তর্জাতিক বাজারে বিশ্বস্ত সার্ভিস দিয়ে আসছি।",
  },
  {
    icon: "🛡️",
    title: "১০০% নিরাপদ লেনদেন",
    text: "অফিসে এসে সরাসরি সম্পূর্ণ প্রক্রিয়া সম্পন্ন করে টাকা নিয়ে যাওয়ার নিশ্চয়তা।",
  },
  {
    icon: "💰",
    title: "বাজারের সেরা মূল্য",
    text: "আমরা আপনার অ্যাকাউন্টের অবস্থা অনুযায়ী সর্বোচ্চ মূল্য অফার করি।",
  },
  {
    icon: "🕒",
    title: "দ্রুত পেমেন্ট",
    text: "ডিল ফাইনাল হওয়ার সাথে সাথেই নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে টাকা পেমেন্ট করা হয়।",
  },
];

const steps = [
  {
    title: "যোগাযোগ করুন",
    text: "আমাদের হটলাইন নম্বরে কল করুন অথবা WhatsApp-এ আপনার অ্যাকাউন্টের বিস্তারিত তথ্য পাঠান।",
  },
  {
    title: "অ্যাকাউন্ট পর্যালোচনা",
    text: "আমাদের টিম আপনার অ্যাকাউন্টটি রিভিউ করে সর্বোচ্চ সম্ভাব্য মূল্য অফার করবে।",
  },
  {
    title: "ডিল ও পেমেন্ট",
    text: "আমাদের অফিসে এসে ডিল সম্পন্ন করুন এবং তাৎক্ষণিকভাবে আপনার সম্পূর্ণ টাকা বুঝে নিন।",
  },
];

const pricing = [
  {
    type: "active",
    title: "সচল প্লে কনসোল",
    subtitle: "(Live Apps Console)",
    price: "সর্বোচ্চ মূল্য",
    text: "লাইভ অ্যাপের সংখ্যা, অ্যাকাউন্টের বয়স এবং পারফর্মেন্সের উপর ভিত্তি করে সেরা মূল্য দেওয়া হবে।",
    link: "https://wa.me/8801626993634?text=I%20want%20to%20sell%20my%20ACTIVE%20Play%20Console.",
    button: "মূল্য জানতে চান",
  },
  {
    type: "terminated",
    title: "বন্ধ কনসোল",
    subtitle: "(Closed Console)",
    price: "আলোচনা সাপেক্ষে",
    text: "বন্ধ হয়ে যাওয়া অ্যাকাউন্টের জন্য আমাদের সাথে যোগাযোগ করে বিশেষ মূল্য অফার পেতে পারেন।",
    link: "https://wa.me/8801626993634?text=I%20want%20to%20sell%20my%20TERMINATED%20Play%20Console.",
    button: "আলোচনা করুন",
  },
];
</script>
