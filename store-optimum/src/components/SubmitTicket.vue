<template>
  <section
    class="relative bg-gradient-to-br from-gray-900 to-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8">
      <div class="md:w-1/2 w-full text-left space-y-6">
        <!-- Section Header -->
        <div class="flex items-center gap-3">
          <h2 class="text-4xl md:text-5xl font-bold text-white">
            Submit a Ticket
          </h2>
        </div>

        <!-- Description -->
        <p class="text-gray-300 text-lg max-w-md leading-relaxed">
          Need help or have a question? Submit a ticket to the
          <span class="font-semibold text-amber-500">Bponi Store</span>. Our
          customer support team will review your request and provide a solution
          promptly.
        </p>
      </div>

      <div class="md:w-1/2 w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <div
          class="flex w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-4"
        >
          <div
            class="h-full transition-all duration-500 ease-in-out"
            :style="{ width: isStep1Valid ? '50%' : '0%' }"
            :class="isStep1Valid ? 'bg-amber-600' : 'bg-gray-200'"
          ></div>

          <div
            class="h-full transition-all duration-500 ease-in-out"
            :style="{ width: isStep2Valid ? '50%' : '0%' }"
            :class="isStep2Valid ? 'bg-amber-600' : 'bg-gray-200'"
          ></div>
        </div>

        <form @submit.prevent="submitTicket">
          <div v-if="step === 1" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1" for="name"
                >Full Name</label
              >
              <input
                v-model="ticket.name"
                type="text"
                id="name"
                placeholder="Enter your full name"
                class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div class="phone-email flex flex-col gap-y-1.5">
              <div class="label-switch flex justify-between items-end">
                <label
                  class="text-sm font-medium"
                  :for="contactMethod === 'phone' ? 'phone' : 'email'"
                  >{{
                    contactMethod === "phone" ? "Phone Number" : "Email Address"
                  }}</label
                >
                <div class="flex items-center justify-start">
                  <div
                    class="relative w-fit gap-4 px-2 bg-gray-700 rounded-full flex cursor-pointer select-none"
                    @click="toggleContactMethod"
                  >
                    <div
                      class="absolute top-0 left-0 h-full w-1/2 bg-amber-500 rounded-full shadow-md transition-transform duration-300"
                      :class="
                        contactMethod === 'email'
                          ? 'translate-x-full'
                          : 'translate-x-0'
                      "
                    ></div>

                    <span
                      class="w-1/2 text-center z-10 text-[10px] font-medium text-gray-100 transition-colors duration-300"
                      :class="
                        contactMethod === 'phone'
                          ? 'text-white'
                          : 'text-slate-100'
                      "
                    >
                      Phone
                    </span>
                    <span
                      class="w-1/2 text-center z-10 text-[10px] font-medium text-gray-100 transition-colors duration-300"
                      :class="
                        contactMethod === 'email'
                          ? 'text-white'
                          : 'text-slate-100'
                      "
                    >
                      Email
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="contactMethod === 'email'">
                <input
                  v-model="ticket.email"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  :required="contactMethod === 'email'"
                />
              </div>

              <div v-if="contactMethod === 'phone'">
                <input
                  v-model="ticket.phone"
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  :required="contactMethod === 'phone'"
                />
              </div>
            </div>

            <!-- Next Step Button -->
            <div class="flex justify-end mt-2">
              <button
                type="button"
                class="bg-amber-600 hover:bg-amber-700 aspect-square text-white font-semibold p-2 rounded-full transition-colors duration-300"
                @click="nextStep"
              >
                <ChevronRightIcon
                  class="w-5 h-5 hover:scale-105 text-slate-200"
                />
              </button>
            </div>
          </div>

          <div v-if="step === 2" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1" for="subject"
                >Subject</label
              >
              <input
                v-model="ticket.subject"
                type="text"
                id="subject"
                placeholder="Enter the ticket subject"
                class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1" for="message"
                >Message</label
              >
              <textarea
                v-model="ticket.message"
                id="message"
                rows="5"
                placeholder="Describe your issue or request in detail"
                class="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 max-h-24 overflow-y-auto"
                required
              ></textarea>
            </div>

            <div class="flex justify-end gap-2 items-center w-full">
              <button
                type="button"
                class="bg-gray-600 hover:bg-gray-700 aspect-square text-white font-semibold p-2 rounded-full transition-colors duration-300"
                @click="prevStep"
              >
                <ChevronLeftIcon class="w-5 h-5 text-white hover:scale-105" />
              </button>

              <button
                type="submit"
                class="bg-amber-600 hover:bg-amber-700 aspect-square text-white font-semibold p-2 rounded-full transition-colors duration-300"
              >
                <PaperAirplaneIcon
                  class="w-5 h-5 text-slate-200 hover:scale-105 -rotate-45"
                />
              </button>
            </div>
          </div>
        </form>

        <div v-if="success" class="mt-4 text-green-400 text-center font-medium">
          Your ticket has been submitted successfully. Our team will contact you
          soon.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/solid";
import { reactive, ref, computed } from "vue";
import emailjs from "emailjs-com";
import { useNotificationsStore } from "@/stores/notifications";

const { addNotification } = useNotificationsStore();
const BPONI_SERVICE_ID = "service_apwcmi9";
const BPONI_TEMPLATE_ID = "template_vqgdo6t";
const BPONI_PUBLIC_KEY = "ECBQcdnmDogib_AbH";

const ticket = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});
const contactMethod = ref("phone");
const success = ref(false);
const step = ref(1);
const errors = reactive({ name: "", contact: "" });

const nextStep = () => {
  errors.name = "";
  errors.contact = "";

  if (!ticket.name.trim()) {
    errors.name = "Full name is required.";
    return;
  }

  if (contactMethod.value === "email" && !ticket.email.trim()) {
    errors.contact = "Email address is required.";
    return;
  }

  if (contactMethod.value === "phone" && !ticket.phone.trim()) {
    errors.contact = "Phone number is required.";
    return;
  }

  step.value = 2;
};

const prevStep = () => (step.value = 1);

const isStep1Valid = computed(() => {
  const nameValid = ticket.name.trim().length > 2;

  const emailValid =
    ticket.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticket.email);

  const phoneValid =
    ticket.phone.trim() !== "" && /^[0-9]{10,15}$/.test(ticket.phone);

  return nameValid && (emailValid || phoneValid);
});

const isStep2Valid = computed(() => {
  const subjectValid = ticket.subject.trim().length > 2;
  const messageValid = ticket.message.trim().length > 5;
  return subjectValid && messageValid;
});

const toggleContactMethod = () => {
  contactMethod.value = contactMethod.value === "email" ? "phone" : "email";
};
const SUBMIT_INTERVAL = 24 * 60 * 60 * 1000;

const submitTicket = async () => {
  const lastSubmit = localStorage.getItem("lastSubmit");
  if (lastSubmit && Date.now() - lastSubmit < SUBMIT_INTERVAL) {
    Object.keys(ticket).forEach((key) => (ticket[key] = ""));
    step.value = 1;
    addNotification(
      {
        title: "Email Limit",
        subTitle: "You can only submit once email per day",
      },
      "error"
    );
    return;
  }
  try {
    await emailjs.send(
      BPONI_SERVICE_ID,
      BPONI_TEMPLATE_ID,
      {
        name: ticket.name,
        contact: ticket.phone ?? ticket.email,
        subject: ticket.subject,
        message: ticket.message,
      },
      BPONI_PUBLIC_KEY
    );
    localStorage.setItem("lastSubmit", Date.now().toString());
    step.value = 1;
    success.value = true;
    Object.keys(ticket).forEach((key) => (ticket[key] = ""));
  } catch (error) {
    alert("Failed to send message.");
  } finally {
    setTimeout(() => (success.value = false), 5000);
  }
};
</script>

<style scoped></style>
