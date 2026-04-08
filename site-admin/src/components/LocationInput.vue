
<script>
import Multiselect from "vue-multiselect";
import {
  HOME_LOCATION_PLACE,
  HOME_LOCATION_SUGGESTION,
} from "@/constants/graphql";
const { v4: uuidV4 } = require("uuid");
export default {
  name: "LocationInput",
  components: { Multiselect },
  props: {
    placeholder: {
      type: String,
      default: () => "Enter nearby location",
    },
  },
  data() {
    return {
      suggestions: [],
      sessionToken: uuidV4(),
      suggestion: {
        description: this.placeholder,
        placeId: "",
      },
      loading: false,
      disabled: false,
    };
  },
  apollo: {
    homeLocationPlace: {
      query: HOME_LOCATION_PLACE,
      variables() {
        return {
          placeId: this.suggestion.placeId,
          sessionToken: this.sessionToken,
        };
      },
      result({ data, loading }) {
        if (loading) {
          this.loading = true;
        }
        if (data) {
          let location = {
            address: data.homeLocationPlace.address.replace(/['"]+/g, ""),
            latitude: data.homeLocationPlace.latitude,
            longitude: data.homeLocationPlace.longitude,
          };
          this.$emit("onLocation", location);
        }
      },
      skip() {
        if (this.suggestion.placeId.length > 0) {
          return false;
        } else {
          return true;
        }
      },
    },
  },
  methods: {
    limitText(count) {
      return `and ${count} other suggestions`;
    },
    asyncFind(query) {
      this.loading = false;
      if (query.length > 3) {
        this.loading = true;
        this.$apollo
          .query({
            // Query
            query: HOME_LOCATION_SUGGESTION,
            // Parameters
            variables: {
              place: query,
              sessionToken: this.sessionToken,
            },
          })
          .then((data) => {
            if (data && data.data.homeLocationSuggestion.length > 0) {
              this.loading = false;
              this.suggestions = data.data.homeLocationSuggestion;
            }
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },
    clearAll() {
      this.suggestion = [];
    },
  },
};
</script>
<template>
  <multiselect
    v-model="suggestion"
    id="location"
    label="description"
    track-by="placeId"
            selectLabel=""
            deselectLabel=""
    :suggestionholder="placeholder"
    :placeholder="placeholder"
    :options="this.suggestions"
    :searchable="true"
    :loading="loading"
    :internal-search="false"
    :clear-on-select="false"
    :close-on-select="true"
    :options-limit="300"
    :limit="5"
    :limit-text="limitText"
    :max-height="600"
    :show-no-results="false"
    @search-change="asyncFind"
  >
    <template slot="singleLabel" slot-scope="{ option }">{{
      option.description
    }}</template>
    <template slot="clear" slot-scope="props">
      <div
        class="multiselect__clear"
        v-if="suggestion.length"
        @mousedown.prevent.stop="clearAll(props.search)"
      ></div> </template
    ><span slot="noResult"
      >Oops! No elements found. Consider changing the search query.</span
    >
  </multiselect>
</template>
