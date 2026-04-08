<template>
  <div
    class="md:min-h-[83vh] bg-white py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:mx-auto">
      <div
        class="relative bg-white md:mx-0 mx-5 border rounded-md md:min-w-[400px] mt-16 md:mt-0"
      >
        <p
          class="text-md text-center text-gray-800 font-semibold leading-relaxed border-b px-5 py-2"
        >
          {{ isSignup ? "Sign up" : "Login" }} with
          {{ site && site.isWhiteLabel ? "Us" : "Bponi" }}
        </p>
        <div class="max-w-xs mx-auto px-4 md:px-5 py-5 md:min-w-[400px]">
          <div v-if="page == 'Update'" class="flex items-center space-x-2">
            <div class="h-10 w-10 flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full border"
                v-lazy="
                  site && site.favicon
                    ? site.favicon
                    : 'https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-black.png'
                "
              />
            </div>
            <div
              class="block pl-2 font-semibold text-xm self-start text-gray-700"
            >
              <h2 class="leading-relaxed">{{ name }}</h2>
              <p class="text-sm text-gray-500 font-normal leading-relaxed">
                Update your phone number
              </p>
            </div>
          </div>
          <div v-else class="flex items-center space-x-2">
            <div class="h-10 w-10 flex-shrink-0">
              <img
                class="h-10 w-10 rounded-full border"
                v-lazy="
                  site && site.favicon
                    ? site.favicon
                    : 'https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-black.png'
                "
              />
            </div>
            <div
              class="block pl-2 font-semibold text-xm self-start text-gray-700"
            >
              <h2 class="leading-relaxed">{{ site ? site.title : "" }}</h2>
              <p
                v-if="message.length > 0"
                class="text-sm text-red-300 font-normal leading-relaxed"
              >
                {{ message }}
              </p>
              <p
                v-else
                class="text-sm text-gray-500 font-normal leading-relaxed"
              >
                এ প্রবেশ করুন ফোন নাম্বার এর মাধ্যমে
              </p>
            </div>
          </div>
          <div v-if="page == 'Update'" class="divide-y divide-gray-200">
            <div
              class="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <PhoneNumber
                :height="'py-3'"
                :key="phone"
                @onPhone="onPhoneUpdate"
                @onPhoneError="onPhoneError"
                :phone="phone"
              />
              <!-- <OtpNumber
                v-if="phone"
                @onOtp="otpValidityActionUpdate"
                :otpFor="'Update'"
              /> -->
            </div>
            <div v-if="phone" class="pt-5 flex items-center space-x-4">
              <button
                v-if="otpStatus == 'otpSubmit'"
                @click="otpSendAction()"
                :disabled="phone == null"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                {{ otpMessage }}
              </button>
              <button
                v-else
                @click="otpSendAction()"
                :disabled="phone == null || timer > 0"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                {{ otpMessage }}{{ timer > 0 ? " - " + timer + "s" : "" }}
              </button>
            </div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                @click="togglePage('Reset')"
                type="button"
                class="text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Forgot password?
              </button>
              <button
                @click="togglePage('Create')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>
          </div>
          <div v-if="page == 'Login'" class="divide-y divide-gray-200">
            <div
              class="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <PhoneNumber :height="'py-3'" @onPhone="onPhone" :phone="phone" />
              <OtpNumber
                v-if="isActive == false && userId != null"
                @onOtp="otpValidityAction"
                :otpFor="'Login'"
              />
              <div
                v-if="isActive == true || userId == null"
                class="relative rounded-md border px-3 py-3 shadow-sm focus-within:border-[--primary] focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label
                  for="password"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >Password</label
                >
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="off"
                  class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                v-if="isActive == true || userId == null"
                @click="logIn()"
                :disabled="
                  password.length < 3 || phone == null || userId == null
                "
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                Log In
              </button>
              <button
                v-else
                @click="otpSendAction()"
                :disabled="phone == null || timer > 0"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                Resend OTP{{ timer > 0 ? " - " + timer + "s" : "" }}
              </button>
            </div>
            <div class="text-center py-3 text-gray-800 font-semibold">Or</div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                @click="togglePage('Reset')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Forgot Password?
              </button>
              <button
                @click="togglePage('Create')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>
          </div>
          <div
            v-if="
              page == 'Login' &&
              !(site && site.domain.includes('bponi')) &&
              site &&
              !site.isWhiteLabel
            "
            class="w-full flex items-center pt-5 gap-x-4"
          >
            <div class="text-center text-gray-400 text-xs">Or</div>
            <div>
              <a
                href="https://auth.bponi.com/"
                target="_blank"
                class="flex cursor-pointer items-center text-center text-gray-600 font-medium text-sm w-full py-2 border rounded-full px-3 focus:bg-blue-50 hover:bg-blue-50"
              >
                <img
                  class="w-6 h-6 rounded-full mr-3"
                  src="https://bponi.sgp1.cdn.digitaloceanspaces.com/logo-black.png"
                />
                Bponi এর মাধ্যমে সাইন-ইন করুন</a
              >
            </div>
          </div>

          <div v-if="page == 'Reset'" class="divide-y divide-gray-200">
            <div
              class="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <PhoneNumber :height="'py-3'" @onPhone="onPhone" :phone="phone" />
              <OtpNumber
                v-if="
                  phone &&
                  ['otpWaiting', 'otpInvalid', 'otpSubmit'].includes(otpStatus)
                "
                @onOtp="otpValidityAction"
                :otpFor="'Reset'"
              />
              <div
                v-if="otpStatus == 'otpSubmit'"
                class="relative rounded-md border px-3 py-3 shadow-sm focus-within:border-[--primary] focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label
                  for="password"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >Password</label
                >
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="off"
                  class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Enter password"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="password.length < 3"
                    class="h-5 w-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                v-if="otpStatus == 'otpSubmit'"
                @click="otpResetAction()"
                :disabled="phone == null"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                {{ otpMessage }}
              </button>
              <button
                v-else
                @click="otpSendAction()"
                :disabled="phone == null || timer > 0"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                {{ otpMessage }}{{ timer > 0 ? " - " + timer + "s" : "" }}
              </button>
            </div>
            <div class="text-center py-3 text-gray-800 font-semibold">Or</div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                @click="togglePage('Login')"
                type="button"
                class="text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Login
              </button>
              <button
                @click="togglePage('Create')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>
          </div>
          <div v-if="page == 'Create'" class="divide-y divide-gray-200">
            <div
              class="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div
                class="relative rounded-md border px-3 py-3 shadow-sm focus-within:border-[--primary] focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label
                  for="name"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >Name</label
                >
                <input
                  v-model="name"
                  type="text"
                  name="name"
                  id="name"
                  autocomplete="off"
                  class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Enter name"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="name.length < 3"
                    class="h-5 w-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <PhoneNumber
                :height="'py-3'"
                :key="key"
                @onPhone="onPhone"
                :phone="phone"
              />
              <div
                class="relative rounded-md border px-3 py-3 shadow-sm focus-within:border-[--primary] focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label
                  for="password"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >Password</label
                >
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  id="password"
                  autocomplete="off"
                  class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Enter password"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="password.length < 3"
                    class="h-5 w-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div
                @click="showRefer = !showRefer"
                class="text-xs text-right text-blue-500 h-0"
                :class="showRefer ? 'pb-2' : ''"
              >
                {{ showRefer ? "Don't have refer code!" : "Have refer code?" }}
              </div>
              <div
                v-if="showRefer"
                class="relative rounded-md border px-3 py-3 shadow-sm focus-within:border-[--primary] focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label
                  for="referedCode"
                  class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >Refer code</label
                >
                <input
                  v-model.trim.lazy="referedCode"
                  type="text"
                  name="referedCode"
                  id="referedCode"
                  autocomplete="off"
                  class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                  placeholder="Enter refered code"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="!isReferValid"
                    class="h-5 w-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                @click="join()"
                :disabled="
                  password.length < 3 ||
                  phone == null ||
                  name.length < 3 ||
                  isReferValid == false ||
                  message == 'Account already exists. Try to login!'
                "
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white px-4 py-2 rounded-md focus:outline-none"
              >
                Join
              </button>
            </div>
            <div class="text-center py-3 text-gray-800 font-semibold">Or</div>
            <div class="pt-5 flex items-center space-x-4">
              <button
                @click="togglePage('Reset')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Forgot Password?
              </button>
              <button
                @click="togglePage('Login')"
                type="button"
                class="w-full text-center rounded-md border-transparent bg-indigo-50 px-4 py-2 text-sm font-normal text-indigo-700 hover:bg-indigo-200 focus:ring-offset-2"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
};
</script>
<script setup>
// import { decodeCredential } from "vue3-google-login";
import { useQuery, useMutation } from "@vue/apollo-composable";
import OtpNumber from "@/components/OtpNumber.vue";
import { ref, computed, watch, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useNotificationsStore } from "@/stores/notifications";
import { onLogin } from "@/vue-apollo";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import {
  ME,
  LOGIN,
  JOIN,
  USER_CHECK,
  USER_OTP_UPDATE,
  USER_OTP_PASSWORD_UPDATE,
  USER_ACTIVE_UPDATE,
  SELF_USER_UPDATE_PHONE,
  USER_BY_HID,
} from "@/gql/me";
const PhoneNumber = defineAsyncComponent(() =>
  import("@/components/PhoneNumber.vue")
);
const { addNotification } = useNotificationsStore();
const { getMe, setToken, setAuth } = useMeStore();
const { site, referCode } = storeToRefs(useSiteStore());
const { setLoading } = useSiteStore();
const router = useRouter();
const message = ref("");
// update
const password = ref("");
const name = ref("");
const phone = ref(null);
const page = ref("Login");
const otp = ref(null);
const userId = ref(null);
const isActive = ref(true);
const country = ref(50);
const currency = ref("BDT");
const language = ref("en");
const referedCode = ref(referCode.value ? referCode.value : "6");
const source = ref(site.value ? site.value.domain : "www.bponi.com");
const sourceId = ref(site.value ? site.value.createdById : 1);
const key = ref(1);
const showRefer = ref(false);
const timer = ref(0);
const startTimer = () => {
  if (timer.value > 0) {
    timer.value--;
  }
};
const firstName = computed(() => {
  return name.value.split(" ")[0] ? name.value.split(" ")[0] : name.value;
});
const lastName = computed(() => {
  return name.value.trim().split(" ")[name.value.trim().split(" ").length - 1]
    ? name.value.trim().split(" ")[name.value.trim().split(" ").length - 1]
    : name.value;
});
const username = computed(() => {
  const randomNumber = Math.floor(Math.random() * (999999 - 10000 + 1)) + 1000;
  return (
    name.value
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "") + randomNumber
  );
});
// otp
const otpStatus = ref("otpSend");
const otpMessage = computed(() => {
  if (phone.value == null) {
    return "Reset Password";
  } else if (otpStatus.value == "otpSend") {
    return "Send OTP";
  } else if (otpStatus.value == "otpWaiting") {
    return "Waiting for OTP";
  } else if (otpStatus.value == "otpInvalid") {
    return "Invalid OTP";
  } else if (otpStatus.value == "otpSubmit") {
    return "Reset Password";
  }
});
const otpSendAction = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(USER_OTP_UPDATE, {
    variables: {
      id: userId.value,
      source: source.value,
      sourceId: sourceId.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userOtpUpdate) {
      message.value = "";
      otpStatus.value = "otpWaiting";
      isActive.value = false;
      timer.value = 60;
      startTimer();
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
  }
  setLoading(false);
};
const otpValidityAction = async (otpValue) => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(USER_ACTIVE_UPDATE, {
    variables: {
      id: userId.value,
      otp: otpValue,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userActiveUpdate) {
      message.value = "";
      isActive.value = response.data.userActiveUpdate.isActive;
      otp.value = otpValue;
      otpStatus.value = "otpSubmit";
    }
  } catch (error) {
    // Error handling
    message.value = "Invalid OTP, please try again";
    addNotification(
      { title: "Account info", subTitle: "Invalid OTP, please try again" },
      "error"
    );
    //! Error handling
    otpStatus.value = "otpInvalid";
  }
  setLoading(false);
};
const otpResetAction = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(USER_OTP_PASSWORD_UPDATE, {
    variables: {
      id: userId.value,
      email: phone.value.toString(),
      otp: otp.value,
      new: password.value,
      parentId: site.value.isOtp ? sourceId.value : null,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userOtpPasswordUpdate) {
      message.value = "";
      page.value = "Login";
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
  }
  setLoading(false);
};
const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(USER_OTP_PASSWORD_UPDATE, {
    variables: {
      id: userId.value,
      email: phone.value.toString(),
      otp: otp.value,
      new: password.value,
      parentId: site.value.isOtp ? sourceId.value : null,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userOtpPasswordUpdate) {
      message.value = "";
      page.value = "Login";
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
  }
  setLoading(false);
};
// end otp
// join
const join = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(JOIN, {
    variables: {
      country: country.value,
      currency: currency.value,
      firstName: firstName.value,
      language: language.value,
      lastName: lastName.value,
      name: name.value,
      password: password.value,
      phone: phone.value,
      referedCode: referedCode.value,
      source: source.value,
      username: username.value,
      sourceId: sourceId.value,
      parentId: site.value.isOtp ? sourceId.value : null,
    },
  });
  try {
    const response = await mutate();
    if (response.data.join) {
      message.value = "";
      userId.value = response.data.join.id;
      phone.value = response.data.join.phone;
      isActive.value = response.data.join.isActive;
      page.value = "Login";
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
  }
  setLoading(false);
};
// end join
const onPhone = (data) => {
  phone.value = data;
  const { onResult, loading, onError } = useQuery(USER_CHECK, {
    data: phone.value.toString(),
    parentId: site.value.isOtp ? sourceId.value : null,
  });
  onResult((queryResult) => {
    userId.value = queryResult.data?.userCheck?.id;
    if (page.value == "Create") {
      // Error handling
      message.value = "Account already exists. Try to login!";
      addNotification(
        {
          title: "Account info",
          subTitle: "Account already exists. Try to login!",
        },
        "error"
      );
      //! Error handling
    } else if (page.value == "Reset") {
    } else {
      message.value = "";
      phone.value = queryResult.data?.userCheck?.phone;
      isActive.value = queryResult.data?.userCheck?.isActive;
      //page.value = "Login";
    }
  });
  onError((error) => {
    if (error.message == "Item not found.") {
      // Error handling
      message.value = "Don't have an account! Create new.";
      addNotification(
        {
          title: "Account info",
          subTitle: "Don't have an account! Create new.",
        },
        "error"
      );
      //! Error handling
      page.value = "Create";
    }
  });
};
const onPhoneUpdate = (data) => {
  const { onResult, loading, onError } = useQuery(USER_CHECK, {
    data: data.toString(),
    parentId: site.value.isOtp ? sourceId.value : null,
  });
  onResult((queryResult) => {
    phone.value = null;
    page.value = "Update";
    // Error handling
    message.value = "Already used this phone number";
    addNotification(
      { title: "Account info", subTitle: "Already used this phone number" },
      "error"
    );
    //! Error handling
  });
  onError((error) => {
    if (error.message == "Item not found.") {
      page.value = "Update";
      updatePhone(data);
      // Error handling
      message.value = "Valid phone number, update now!";
      addNotification(
        {
          title: "Account info",
          subTitle: "Valid phone number, update now!",
        },
        "success"
      );
      //! Error handling
    }
  });
};

const updatePhone = async (data) => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_USER_UPDATE_PHONE, {
    variables: {
      userId: userId.value,
      phone: data,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfUserUpdatePhone) {
      message.value = "";
      isActive.value = true;
      phone.value = response.data.selfUserUpdatePhone.phone;
      logIn();
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
  }
  setLoading(false);
};
const otpValidityActionUpdate = async (otpValue) => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(USER_ACTIVE_UPDATE, {
    variables: {
      id: userId.value,
      otp: otpValue,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userActiveUpdate) {
      message.value = "";
      isActive.value = response.data.userActiveUpdate.isActive;
      console.log(response.data.userActiveUpdate);
      if (isActive.value) {
        logIn();
      }
    }
  } catch (error) {
    // Error handling
    message.value = error.message;
    addNotification(
      { title: "Account info", subTitle: error.message },
      "error"
    );
    //! Error handling
    otpStatus.value = "otpInvalid";
  }
  setLoading(false);
};
const logIn = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(LOGIN, {
    variables: {
      id: userId.value,
      password: password.value,
      parentId: site.value.isOtp ? sourceId.value : null,
    },
  });
  try {
    const response = await mutate();
    if (response.data.login) {
      if (response.data.login.token.length > 0) {
        message.value = response.data.login.message;
        setToken(response.data.login.token);
        setAuth(true);
        onLogin(response.data.login.token);
        getMe();
        setTimeout(() => {
          let redirect = router.currentRoute.value.query.redirect
            ? router.currentRoute.value.query.redirect
            : "/";
          router.replace(`${redirect}`);
        }, 1000);
      } else {
        message.value = response.data.login.message;
      }
    } else {
      if (error.message == "Item not found.") {
        // Error handling
        message.value = "Don't have an account! Create new.";
        addNotification(
          {
            title: "Account info",
            subTitle: "Don't have an account! Create new.",
          },
          "error"
        );
        //! Error handling
      } else {
        // Error handling
        message.value = "Invalid password!";
        addNotification(
          { title: "Account info", subTitle: "Invalid password!" },
          "error"
        );
        //! Error handling
      }
    }
  } catch (error) {
    if (error.message == "Item not found.") {
      // Error handling
      message.value = "Don't have an account! Create new.";
      addNotification(
        {
          title: "Account info",
          subTitle: "Don't have an account! Create new.",
        },
        "error"
      );
      //! Error handling
    } else {
      // Error handling
      message.value = error.message;
      addNotification(
        { title: "Account info", subTitle: error.message },
        "error"
      );
      //! Error handling
      otpStatus.value = "otpInvalid";
    }
  }
  setLoading(false);
};
const togglePage = (data) => {
  if (data == "Create") {
    message.value = "";
    key.value += 1;
    name.value = "";
    phone.value = null;
    password.value = "";
    isActive.value = false;
  }
  page.value = data;
  otpStatus.value = "otpSend";
};
watch(timer, () => {
  if (timer.value > 0) {
    setTimeout(startTimer, 1000); // Decrease timer every second
  }
});

// const callback = async (response) => {
//   // This callback will be triggered when the user selects or login to
//   // his Google account from the popup
//   const userData = decodeCredential(response.credential);
//   const gEmail = userData.email;
//   const gFirstName = userData.given_name;
//   const gLastName = userData.family_name;
//   const gName = userData.name;
//   const gPassword = userData.sub;
//   const gCredential = response.credential;
//   const { onResult, loading, onError } = useQuery(USER_CHECK, {
//     data: gEmail.split("@")[0].toString() + "@bponi.com",
//   });
//   onResult(async (queryResult) => {
//     userId.value = queryResult.data.userCheck.id;
//     password.value = gPassword;
//     name.value = queryResult.data.userCheck.name;
//     phone.value = queryResult.data.userCheck.phone;
//     if (queryResult.data.userCheck.phone == null) {
//       const { mutate, loading, error } = useMutation(LOGIN, {
//         variables: {
//           id: userId.value,
//           password: gPassword,
//         },
//       });
//       try {
//         const response = await mutate();
//         if (response.data.login) {
//           message.value = "";
//           onLogin(response.data.login);
//           page.value = "Update";
//         } else {
//           // Error handling
//           message.value = error.message;
//           addNotification(
//             { title: "Account info", subTitle: error.message },
//             "error"
//           );
//         }
//         //! Error handling
//       } catch (error) {
//         // Error handling
//         message.value = error.message;
//         addNotification(
//           { title: "Account info", subTitle: error.message },
//           "error"
//         );
//       }
//       //! Error handling
//     } else {
//       logIn();
//     }
//   });
//   onError(async (error) => {
//     if (error.message == "Item not found.") {
//       const { mutate, loading, error } = useMutation(JOIN, {
//         variables: {
//           country: 50,
//           currency: "BDT",
//           firstName: gFirstName,
//           language: "bn",
//           lastName: gLastName,
//           name: gName,
//           password: gPassword,
//           phone: null,
//           referedCode: referedCode.value,
//           source: source.value,
//           username: gEmail.split("@")[0],
//           sourceId: sourceId.value,
//         },
//       });
//       try {
//         const response = await mutate();
//         if (response.data.join) {
//           message.value = "";
//           userId.value = response.data.join.id;
//           password.value = gPassword;

//           if (
//             response.data.join.phone == null ||
//             response.data.join.isActive == false
//           ) {
//             const { mutate, loading, error } = useMutation(LOGIN, {
//               variables: {
//                 id: userId.value,
//                 password: gPassword,
//               },
//             });
//             try {
//               const response = await mutate();
//               if (response.data.login) {
//                 message.value = "";
//                 onLogin(response.data.login);
//                 page.value = "Update";
//               } else {
//                 // Error handling
//                 message.value = error.message;
//                 addNotification(
//                   { title: "Account info", subTitle: error.message },
//                   "error"
//                 );
//                 //! Error handling
//               }
//             } catch (error) {
//               // Error handling
//               message.value = error.message;
//               addNotification(
//                 { title: "Account info", subTitle: error.message },
//                 "error"
//               );
//               //! Error handling
//             }
//           } else {
//             logIn();
//           }
//         }
//       } catch (error) {
//         // Error handling
//         message.value = error.message;
//         addNotification(
//           { title: "Account info", subTitle: error.message },
//           "error"
//         );
//         //! Error handling
//       }
//     }
//   });
// };
const onPhoneError = () => {
  phone.value = null;
};
const isReferValid = ref(true);
watch(referedCode, () => {
  if (referedCode.value.length > 0) {
    const { onResult, loading, onError } = useQuery(USER_BY_HID, {
      hid: referedCode.value.length > 0 ? referedCode.value : "6",
    });
    onResult((queryResult) => {
      isReferValid.value = true;
    });
    onError((error) => {
      isReferValid.value = false;
    });
  } else {
    isReferValid.value = false;
  }
});
onMounted(() => {
  let token = router.currentRoute.value.query.token;
  let redirect = router.currentRoute.value.query.redirect
    ? router.currentRoute.value.query.redirect
    : "/";
  if (token) {
    setToken(window.atob(token));
    setAuth(true);
    onLogin(window.atob(token));
    getMe();
    setTimeout(() => {
      setLoading(false);
      router.replace(`${redirect}`);
    }, 1000);
  }
});
const isSignup = computed(() => router.currentRoute.value.name == "Signup");
watch(isSignup, () => {
  page.value = isSignup.value ? "Create" : "Login";
});
</script>
