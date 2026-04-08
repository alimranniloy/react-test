<template>
  <Site></Site>
</template>
<script setup>
import Site from "@/views/site/Site.vue";
import { useRouter } from "vue-router";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useMeStore } from "@/stores/me";
const router = useRouter();
const { me } = storeToRefs(useMeStore());
</script>
