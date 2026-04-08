<template>
    <div class="text-left whitespace-pre-line break-words">
        <span v-for="(part, index) in displayedParts" :key="index">
            <component :is="part.type" v-bind="part.props">{{ part.text }}</component>
        </span>
        <button v-if="showToggle" @click="toggleContent" class="text-blue-500">
            {{ isExpanded ? '[see less]' : 'see more' }}
        </button>
    </div>
</template>

<script>
import { shallowRef, computed } from 'vue';
import { RouterLink } from 'vue-router';

export default {
    name: 'DynamicContent',
    props: {
        content: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const parts = shallowRef([]);
        const isExpanded = shallowRef(false);
        const charLimit = 250; // Set the character limit here

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const hashtagRegex = /#(\w+)/g;
        const profileRegex = /@(\w+)/g;

        const textParts = props.content.split(/(https?:\/\/[^\s]+|#\w+|@\w+)/g).filter(Boolean);

        textParts.forEach((part) => {
            if (urlRegex.test(part)) {
                if (part.includes(window.location.host)) {
                    const parsedUrl = new URL(part);
                    parts.value.push({
                        type: RouterLink,
                        props: { to: parsedUrl.pathname, class: 'text-blue-500', target: '_self' },
                        text: part
                    });
                } else {
                    parts.value.push({
                        type: 'a',
                        props: { href: part, class: 'text-blue-500', target: '_blank' },
                        text: part
                    });
                }
            } else if (hashtagRegex.test(part)) {
                const hashtag = part.substring(1);
                parts.value.push({
                    type: RouterLink,
                    props: { to: `/hashtag/${hashtag.toLowerCase()}`, class: 'text-blue-500' },
                    text: part
                });
            } else if (profileRegex.test(part)) {
                const profile = part.substring(1);
                parts.value.push({
                    type: RouterLink,
                    props: { to: `/${profile}`, class: 'text-blue-500' },
                    text: part
                });
            } else {
                parts.value.push({
                    type: 'span',
                    props: {},
                    text: part
                });
            }
        });

        const totalCharCount = computed(() => {
            return parts.value.reduce((count, part) => count + part.text.length, 0);
        });

        const showToggle = computed(() => {
            return totalCharCount.value > charLimit;
        });

        const displayedParts = computed(() => {
            if (isExpanded.value || !showToggle.value) {
                return parts.value;
            }

            let chars = 0;
            const truncatedParts = [];
            for (let part of parts.value) {
                if (chars + part.text.length > charLimit) {
                    const remainingChars = charLimit - chars;
                    const truncatedText = part.text.slice(0, remainingChars) + '...';
                    truncatedParts.push({ ...part, text: truncatedText });
                    break;
                }
                chars += part.text.length;
                truncatedParts.push(part);
            }
            return truncatedParts;
        });

        const toggleContent = () => {
            isExpanded.value = !isExpanded.value;
        };

        return {
            displayedParts,
            showToggle,
            isExpanded,
            toggleContent
        };
    }
};
</script>

<style scoped>
button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
}
</style>
