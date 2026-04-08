<template>
    <div v-if="showInstallBanner"
        class="md:hidden w-full px-4 py-1 bg-orange-500 text-white text-sm text-center z-[99999] flex items-center justify-between">
        <p class="mb-0">Install our app!</p>
        <div class="flex gap-4">
            <button @click="installApp" class=" text-white underline uppercase">
                Install
            </button>
            <button @click="closeBanner" class="text-white underline uppercase">
                X
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showInstallBanner = ref(false)
let deferredPrompt = null

// Check if the app is already installed
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}

// Show the install banner if the app is not installed and the event is triggered
onMounted(() => {
    if (!isAppInstalled()) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            deferredPrompt = e
            showInstallBanner.value = true
        })
    }
})

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt')
            } else {
                console.log('User dismissed the install prompt')
            }
            deferredPrompt = null
            showInstallBanner.value = false
        })
    }
}

function closeBanner() {
    showInstallBanner.value = false
}
</script>
