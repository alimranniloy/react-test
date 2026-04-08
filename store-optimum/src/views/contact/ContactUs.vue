<template>
  <div class="relative bg-gradient-to-br from-gray-900 to-slate-950 font-sans overflow-hidden py-20">
    <div class="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"></div>
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob"></div>
    <div class="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-lighten filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div class="text-center mb-16 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-shadow">
          <span class="text-amber-400">Contact Us</span>
        </h1>
        <p class="mt-5 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
          Curious about our services or ready to build your next flagship experience? Reach out and our team will get back to you shortly.
        </p>
      </div>

      <div class="w-full max-w-6xl mx-auto">
        <div class="card-wrapper">
          <div class="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-12">
            <div class="lg:col-span-5 p-8 md:p-12 text-white">
              <div class="animate-fade-in-right">
                <h2 class="text-3xl font-extrabold tracking-tight">Corporate Office</h2>
                <p class="mt-4 text-lg text-gray-300">
                  We are here to help and happy to answer questions about your next launch or existing stack. Let’s talk about building something remarkable.
                </p>

                <div class="mt-10 space-y-6">
                  <div class="contact-item">
                    <MapPinIcon class="h-6 w-6 text-teal-400 flex-shrink-0 mt-1" />
                    <div class="ml-4">
                      <h3 class="text-lg font-medium">Corporate Office</h3>
                      <p class="text-gray-400">
                        Subhash Sadan, Champadali More, 22, Jessore Rd,<br />
                        Champadali, Barasat, Kolkata, West Bengal 700124, India
                      </p>
                    </div>
                  </div>
                  <div class="contact-item">
                    <PhoneIcon class="h-6 w-6 text-teal-400 flex-shrink-0 mt-1" />
                    <div class="ml-4">
                      <h3 class="text-lg font-medium">Phone / WhatsApp</h3>
                      <p>
                        <a href="tel:+919836941943" class="contact-link">+91 98369 41943</a><br />
                        <a href="tel:+919956851612" class="contact-link">+91 99568 51612</a>
                      </p>
                    </div>
                  </div>
                  <div class="contact-item">
                    <EnvelopeIcon class="h-6 w-6 text-teal-400 flex-shrink-0 mt-1" />
                    <div class="ml-4">
                      <h3 class="text-lg font-medium">Email</h3>
                      <a href="mailto:info@os.com.bd" class="contact-link">info@os.com.bd</a>
                    </div>
                  </div>
                </div>

                <div class="mt-12"></div>
              </div>
            </div>

            <div class="lg:col-span-7 p-4 md:p-2 flex items-center justify-center bg-white/5">
              <div class="animate-fade-in-left w-full max-w-xs mx-auto">
                <img src="https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/ea99e0a0-1f36-404e-9978-c06d394da5ce.png" alt="Contact Optimum Soft" class="mb-6 rounded-full" />
                <a href="https://wa.me/+919836941943?text=Hi!%20I'd%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer" class="whatsapp-button">
                  <span class="relative z-10 text-base font-semibold">Message us on WhatsApp</span>
                  <div class="shine-effect"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full max-w-6xl mx-auto mt-12">
        <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="lg:grid lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-5 p-8 md:p-10 text-white space-y-4">
              <p class="text-sm uppercase tracking-[0.2em] text-amber-400">Visit us</p>
              <h2 class="text-3xl font-bold leading-tight">See our office on the map</h2>
              <p class="text-gray-300 leading-relaxed">
                Subhash Sadan, Champadali More, 22, Jessore Rd,<br />
                Champadali, Barasat, Kolkata,<br />
                West Bengal 700124, India
              </p>
              <div class="flex flex-wrap gap-3">
                <a
                  class="inline-flex items-center px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
                  href="https://www.google.com/maps?q=Subhash%20Sadan%2C%20Champadali%20More%2C%2022%2C%20Jessore%20Rd%2C%20Champadali%2C%20Barasat%2C%20Kolkata%2C%20West%20Bengal%20700124%2C%20India"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
                <a
                  class="inline-flex items-center px-4 py-2 rounded-lg border border-white/10 text-gray-200 hover:border-amber-400 hover:text-amber-300 transition"
                  href="tel:+919836941943"
                >
                  Call now
                </a>
              </div>
            </div>
            <div class="lg:col-span-7">
              <div class="relative h-[320px] md:h-[420px]">
                <iframe
                  class="absolute inset-0 w-full h-full rounded-none lg:rounded-l-2xl brightness-110 contrast-125"
                  src="https://www.google.com/maps?q=Subhash%20Sadan%2C%20Champadali%20More%2C%2022%2C%20Jessore%20Rd%2C%20Champadali%2C%20Barasat%2C%20Kolkata%2C%20West%20Bengal%20700124%2C%20India&output=embed"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Optimum Soft office map"
                ></iframe>
                <div class="pointer-events-none absolute inset-0 ring-1 ring-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";
</script>

<style>
.text-shadow {
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.card-wrapper {
  @apply relative rounded-2xl p-[2px] overflow-hidden;
  background-image: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}

.contact-item {
  @apply flex items-start p-3 rounded-lg transition-colors duration-300 -m-3;
}
.contact-item:hover {
  @apply bg-white/5;
}

.contact-link {
  @apply text-gray-300 hover:text-amber-400 transition;
}

.whatsapp-button {
  @apply relative w-full flex items-center justify-center px-6 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg overflow-hidden;
}

.shine-effect {
  @apply absolute inset-0 bg-white/20 blur-lg opacity-0;
  animation: shine 2.6s infinite;
}

@keyframes shine {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
