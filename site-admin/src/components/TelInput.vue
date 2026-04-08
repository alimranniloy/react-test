
<script>
import utils, { getCountry, setCaretPosition } from "@/utils/tel-input";
import clickOutside from "../directives/click-outside";
import { USER_PHONE_INFO } from "@/constants/graphql";
function getDefault(key) {
  const value = utils.options[key];
  if (typeof value === "undefined") {
    return utils.options[key];
  }
  return value;
}
export default {
  name: "PhoneCheck",
  directives: {
    clickOutside,
  },
  props: {
    allCountries: {
      type: Array,
      default: () => getDefault("allCountries"),
    },
    autocomplete: {
      type: String,
      default: () => getDefault("autocomplete"),
    },
    autofocus: {
      type: Boolean,
      default: () => getDefault("autofocus"),
    },
    defaultCountry: {
      // Default country code, ie: 'AU'
      // Will override the current country of user
      type: String,
      default: () => getDefault("defaultCountry"),
    },
    disabled: {
      type: Boolean,
      default: () => getDefault("disabled"),
    },
    dropdownOptions: {
      type: Object,
      default: () => getDefault("dropdownOptions"),
    },
    enabledCountryCode: {
      type: Boolean,
      default: () => getDefault("enabledCountryCode"),
    },
    enabledFlags: {
      type: Boolean,
      default: () => getDefault("enabledFlags"),
    },
    inputClasses: {
      type: [String, Array, Object],
      default: () => getDefault("inputClasses"),
    },
    inputId: {
      type: String,
      default: () => getDefault("inputId"),
    },
    inputOptions: {
      type: Object,
      default: () => getDefault("inputOptions"),
    },
    invalidMsg: {
      type: String,
      default: () => getDefault("invalidMsg"),
    },
    maxLen: {
      type: Number,
      default: () => getDefault("maxLen"),
    },
    name: {
      type: String,
      default: () => getDefault("name"),
    },
    mode: {
      type: String,
      default: () => getDefault("mode"),
    },
    placeholder: {
      type: String,
      default: () => getDefault("placeholder"),
    },
    preferredCountries: {
      type: Array,
      default: () => getDefault("preferredCountries"),
    },
    readonly: {
      type: Boolean,
      default: () => getDefault("readonly"),
    },
    required: {
      type: Boolean,
      default: () => getDefault("required"),
    },
    wrapperClasses: {
      type: [String, Array, Object],
      default: () => getDefault("wrapperClasses"),
    },
  },
  data() {
    return {
      isValid: false,
      activeCountry: {
        iso2: "",
      },
      phone: "",
      open: false,
      finishMounted: false,
      selectedIndex: null,
      typeToFindInput: "",
      typeToFindTimer: null,
      cursorPosition: 0,
      dropdownOpenDirection: "below",
    };
  },
  apollo: {
    // check user info
    userPhoneInfo: {
      query: USER_PHONE_INFO,
      variables() {
        return {
          countryCode: this.activeCountry.iso2,
          phone: this.phone,
        };
      },
      result({ data, loading }) {
        if (loading) {
          this.loading = true;
        }
        if (data) {
          if (data.userPhoneInfo) {
            this.isValid = data.userPhoneInfo.isValid;
            var info = {
              isValid: data.userPhoneInfo.isValid,
              phone: data.userPhoneInfo.phone,
            };
            this.$emit("input", info);
          } else {
            this.isValid = false;
            var info = {
              isValid: false,
              phone: this.phone,
            };
            this.$emit("input", info);
          }
        }
      },
      skip() {
        if (this.phone.length > 7) {
          return false;
        } else {
          return true;
        }
      },
    },
  },
  methods: {
    onInput(e) {},
    choose(country) {
      let parsedCountry = country;
      if (typeof parsedCountry === "string") {
        parsedCountry = this.findCountry(parsedCountry);
      }
      if (!parsedCountry) {
        return;
      } else {
        this.activeCountry.iso2 = parsedCountry.iso2;
      }
    },
    getItemClass(index, iso2) {
      const highlighted = this.selectedIndex === index;
      const lastPreferred = index === this.preferredCountries.length - 1;
      const preferred = this.preferredCountries.some(
        (c) => c.toUpperCase() === iso2
      );
      return {
        highlighted,
        "last-preferred": lastPreferred,
        preferred,
      };
    },
    sortedCountries() {
      // Sort the list countries: from preferred countries to all countries
      const preferredCountries = this.getCountries(this.preferredCountries).map(
        (country) => ({
          ...country,
          preferred: true,
        })
      );
      return [...preferredCountries, ...this.allCountries];
    },
    /**
     * Get the list of countries from the list of iso2 code
     */
    getCountries(list = []) {
      return list
        .map((countryCode) => this.findCountry(countryCode))
        .filter(Boolean);
    },
    findCountry(iso = "") {
      return this.allCountries.find(
        (country) => country.iso2 === iso.toUpperCase()
      );
    },
    onBlur() {
      this.$emit("blur");
    },
    onFocus() {
      this.$emit("focus");
    },
    onEnter() {
      this.$emit("enter");
    },
    onSpace() {
      this.$emit("space");
    },
    focus() {
      this.$refs.input.focus();
    },
    toggleDropdown() {
      if (this.disabled) {
        return;
      }
      this.open = !this.open;
    },
    clickedOutside() {
      this.open = false;
    },
    keyboardNav(e) {
      if (e.keyCode === 40) {
        // down arrow
        e.preventDefault();
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex = Math.min(
            this.sortedCountries.length - 1,
            this.selectedIndex + 1
          );
        }
        const selEle = this.$refs.list.children[this.selectedIndex];
        if (
          selEle.offsetTop + selEle.clientHeight >
          this.$refs.list.scrollTop + this.$refs.list.clientHeight
        ) {
          this.$refs.list.scrollTop =
            selEle.offsetTop -
            this.$refs.list.clientHeight +
            selEle.clientHeight;
        }
      } else if (e.keyCode === 38) {
        // up arrow
        e.preventDefault();
        this.open = true;
        if (this.selectedIndex === null) {
          this.selectedIndex = this.sortedCountries.length - 1;
        } else {
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        }
        const selEle = this.$refs.list.children[this.selectedIndex];
        if (selEle.offsetTop < this.$refs.list.scrollTop) {
          this.$refs.list.scrollTop = selEle.offsetTop;
        }
      } else if (e.keyCode === 13) {
        // enter key
        if (this.selectedIndex !== null) {
          this.choose(this.sortedCountries[this.selectedIndex]);
        }
        this.open = !this.open;
      } else {
        // typing a country's name
        this.typeToFindInput += e.key;
        clearTimeout(this.typeToFindTimer);
        this.typeToFindTimer = setTimeout(() => {
          this.typeToFindInput = "";
        }, 700);
        // don't include preferred countries so we jump to the right place in the alphabet
        const typedCountryI = this.sortedCountries
          .slice(this.preferredCountries.length)
          .findIndex((c) =>
            c.name.toLowerCase().startsWith(this.typeToFindInput)
          );
        if (typedCountryI >= 0) {
          this.selectedIndex = this.preferredCountries.length + typedCountryI;
          const selEle = this.$refs.list.children[this.selectedIndex];
          const needToScrollTop = selEle.offsetTop < this.$refs.list.scrollTop;
          const needToScrollBottom =
            selEle.offsetTop + selEle.clientHeight >
            this.$refs.list.scrollTop + this.$refs.list.clientHeight;
          if (needToScrollTop || needToScrollBottom) {
            this.$refs.list.scrollTop =
              selEle.offsetTop - this.$refs.list.clientHeight / 2;
          }
        }
      }
    },
    reset() {
      this.selectedIndex = this.sortedCountries
        .map((c) => c.iso2)
        .indexOf(this.activeCountry.iso2);
      this.open = false;
    },
    setDropdownPosition() {
      const spaceBelow =
        window.innerHeight - this.$el.getBoundingClientRect().bottom;
      const hasEnoughSpaceBelow = spaceBelow > 200;
      if (hasEnoughSpaceBelow) {
        this.dropdownOpenDirection = "below";
      } else {
        this.dropdownOpenDirection = "above";
      }
    },
  },
  created() {
    if (this.defaultCountry) {
      const defaultCountry = this.findCountry(this.defaultCountry);
      if (defaultCountry) {
        this.choose(defaultCountry);
        return;
      }
    }
  },
};
</script>
<template>
  <div :class="['bi', wrapperClasses, { disabled: disabled }]">
    <div
      v-click-outside="clickedOutside"
      :class="['bd', { open: open }]"
      :tabindex="
        dropdownOptions && dropdownOptions.tabindex
          ? dropdownOptions.tabindex
          : 0
      "
      @keydown="keyboardNav"
      @click="toggleDropdown"
      @keydown.esc="reset"
    >
      <span class="b_selection">
        <div
          v-if="enabledFlags"
          :class="['b_f', activeCountry.iso2.toLowerCase()]"
        />
        <span v-if="enabledCountryCode" class="b_country-code">
          +{{ activeCountry.dialCode }}
        </span>
        <slot name="arrow-icon" :open="open">
          <span class="bda">{{ open ? "▲" : "▼" }}</span>
        </slot>
      </span>
      <ul ref="list" class="bdl" v-show="open" :class="dropdownOpenDirection">
        <li
          v-for="(pb, index) in this.sortedCountries()"
          :class="['bdi', getItemClass(index, pb.iso2)]"
          :key="pb.iso2 + (pb.preferred ? '-preferred' : '')"
          @click="choose(pb)"
          @mousemove="selectedIndex = index"
        >
          <div v-if="enabledFlags" :class="['b_f', pb.iso2.toLowerCase()]" />
          <strong>{{ pb.name }}</strong>
          <span v-if="dropdownOptions && !dropdownOptions.disabledDialCode">
            +{{ pb.dialCode }}
          </span>
        </li>
      </ul>
    </div>
    <input
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :class="['bi', inputClasses]"
      :disabled="disabled"
      :id="inputId"
      :maxlength="maxLen"
      :name="name"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      ref="input"
      type="text"
      v-model="phone"
      :tabindex="
        inputOptions && inputOptions.tabindex ? inputOptions.tabindex : 0
      "
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
      @keyup.enter="onEnter"
      @keyup.space="onSpace"
      style="padding-left: 40px;"
    />
    <div style="right: 0px;margin: auto 10px;display: flex;align-items: center;cursor: pointer;">
      <svg
        v-if="this.isValid"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style="fill: #4cb14e"
      >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        style="fill: red"
      >
        <path
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
        ></path>
      </svg>
    </div>
  </div>
</template>
<style src="../assets/sprite.css"></style>
<style lang="css" scoped>
.bi.disabled .selection,
.bi.disabled .dropdown,
.bi.disabled input {
  cursor: no-drop;
}

.bd {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: absolute;
  left: 0px;
  margin: auto 5px;
  top: 50%;
  bottom: 50%;
  cursor: pointer;
  z-index: 999;
}

.bd.show {
  max-height: 300px;
  overflow: scroll;
}

.b_selection {
  font-size: 0.8em;
  display: flex;
  align-items: center;
}

.b_selection .b_country-code {
  color: #666;
}

.b_f {
  margin-right: 5px;
  margin-left: 5px;
}

.bdl {
  z-index: 1;
  padding: 0;
  margin: 0;
  text-align: left;
  list-style: none;
  max-height: 200px;
  overflow-y: scroll;
  position: absolute;
  left: -1px;
  background-color: #fff;
  width: 320px;
  -webkit-box-shadow: 0 2px 12px rgb(116 119 148 / 18%);
  box-shadow: 0 2px 12px rgb(116 119 148 / 18%);
  border-radius: 4px;
}

.bdl.below {
  top: 33px;
}

.bdl.above {
  top: auto;
  bottom: 100%;
}

.bda {
  transform: scaleY(0.5);
  display: inline-block;
  color: #666;
  display: none;
}

.bdi {
  cursor: pointer;
  padding: 4px 15px;
  font-size: 14px;
}

.bdi.highlighted {
  background-color: #f3f3f3;
}

.bdi.last-preferred {
  border-bottom: 1px solid #d6e2eb;
}

.bdi .b_f {
  display: inline-block;
  margin-right: 5px;
}

.bi {
  width: 100%;
  display: flex;
  text-align: left;
  font-size: 15px;
  position: relative;
}
</style>