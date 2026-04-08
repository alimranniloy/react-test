<template>
    <div class="space-y-3">
        <div v-for="(item, itemIndex) in value" :key="itemIndex"
            class="relative rounded-md border border-gray-300 px-3 py-3  space-y-4">
            <div v-for="(prop, propIndex) in transformProperties(item)" :key="propIndex"
                class="relative rounded-md border border-gray-300 px-3 py-3 ">
                <div class="flex gap-4">
                    <div class="w-full">
                        <label :for="`${prop.id}`"
                            class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                            {{ formatLabel(prop.title) }}
                        </label>
                        <div :key="propIndex" class="flex items-center gap-2">
                            <component :is="getComponentType(prop.value)" :value="prop.value"
                                @input="value => changeData(itemIndex, prop.title, value)" :id="`${prop.id}`" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-0 -right-2 py-1 bg-white border rounded-md space-y-2">
                <button @click="addItem" class=" text-blue-500 block">
                    <PlusCircleIcon class="h-4 w-4">
                    </PlusCircleIcon>
                </button>

                <button @click="removeItem(itemIndex)" class=" text-red-500 block">
                    <TrashIcon class="h-4 w-4"></TrashIcon>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    TrashIcon, ClipboardDocumentIcon,
    PlusCircleIcon
} from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
import { ref, inject, computed, defineAsyncComponent } from "vue";
import BooleanComponent from './BooleanComponent.vue';
import DateComponent from './DateComponent.vue';
import NumberComponent from './NumberComponent.vue';
import StringComponent from './StringComponent.vue';

const { componentId } = storeToRefs(useEditorStore());
const reka = inject("reka");
const component = computed(() => {
    return reka.value.getNodeFromId(componentId.value);
});

const props = defineProps({
    value: {
        type: Array,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
});
const emit = defineEmits(["input"]);

const addItem = () => {
    if (props.value.length === 0) return;
    const newItem = props.value[0];

    const existingStateWithSameName = component.value.state.find(
        (state) => state.name === props.title
    );
    if (existingStateWithSameName) {
        reka.value.change(() => {
            existingStateWithSameName.init.elements.push(newItem)
        });
    }
};

const removeItem = (index) => {
    const existingStateWithSameName = component.value.state.find(
        (state) => state.name === props.title
    );
    if (existingStateWithSameName) {
        reka.value.change(() => {
            const updatedValue = props.value.filter((_, i) => i !== index);
            console.log(updatedValue)
        });
    }
};

const getComponentType = (value) => {
    if (typeof value === "boolean") {
        return BooleanComponent;
    } else if (isValidDate(value)) {
        return DateComponent;
    } else if (typeof value === "number" || (!isNaN(parseFloat(value)) && isFinite(value))) {
        return NumberComponent;
    } else {
        return StringComponent;
    }
};

const formatLabel = (id) => {
    return id.replace(/[0-9]/g, "").replace(/([A-Z])/g, " $1").trim();
};

const isValidDate = (value) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(value) && !isNaN(Date.parse(value));
};

const transformProperties = (input) => {
    const result = [];
    // Iterate over the properties of the input object
    for (const key in input.properties) {
        if (input.properties.hasOwnProperty(key)) {
            const property = input.properties[key];
            result.push({
                id: property.id,
                title: key,
                value: property.value
            });
        }
    }

    return result;
}

const changeData = (itemIndex, title, data) => {
    const existingStateWithSameName = component.value.state.find(
        (state) => state.name === props.title
    );
    if (existingStateWithSameName) {
        reka.value.change(() => {
            const updatedValue = [...props.value];
            updatedValue[itemIndex].properties[title] = t.literal({ value: data });
        });
    }
};
</script>
