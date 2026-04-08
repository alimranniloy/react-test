<template>
  <div class="grid place-items-center min-h-[100dvh]">
    <div class="max-w-sm md:max-w-md w-full mx-auto border rounded-md">
      <div class="p-3 mb-4 mb:mb-6 border-b text-center font-semibold">
        {{ formName === "Login" ? "Welcome" : "Create your account" }}
        to
        {{ site && site.isWhiteLabel ? "Us" : "Bponi" }}
      </div>
      <div
        v-if="page == 'Update'"
        class="flex items-center space-x-2 px-4 md:px-6"
      >
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
        <div class="block pl-2 font-semibold text-xm self-start text-gray-700">
          <h2 class="leading-relaxed">{{ name }}</h2>
          <p class="text-sm text-gray-500 font-normal leading-relaxed">
            Update your phone number
          </p>
        </div>
      </div>
      <div v-else class="flex items-center space-x-2 px-4 md:px-6">
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
        <div class="block pl-2 font-semibold text-xm self-start text-gray-700">
          <h2 class="leading-relaxed">{{ site ? site.title : "" }}</h2>
          <p
            v-if="message.length > 0"
            class="text-sm text-red-300 font-normal leading-relaxed"
          >
            {{ message }}
          </p>
          <p v-else class="text-sm text-gray-500 font-normal leading-relaxed">
            {{ instraction }}
          </p>
        </div>
      </div>
      <div class="p-4 md:p-6">
        <!-- initial page -->
        <div v-if="page === 'Initial'">
          <form @submit.prevent="validatePhoneNumber">
            <!-- PhoneNumber Input Field -->
            <PhoneNumber
              v-model.trim="userInput"
              :message="message"
              :readonly="false"
              name="phone-number"
              id="phone-number"
            />
            <button
              class="bg-[color:var(--primary,#000)] w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none"
              :class="
                userInput.length > 3
                  ? 'opacity-100'
                  : 'disabled:cursor-not-allowed disabled:opacity-50'
              "
            >
              Continue
            </button>
          </form>
        </div>

        <!-- login page -->
        <div v-if="page === 'Login'">
          <div v-if="isActive == true || userId == null">
            <form @submit.prevent="logIn()">
              <!-- PhoneNumber Input Field -->
              <PhoneNumber
                v-model="userInput"
                :readonly="true"
                :editable="true"
                @updatePage="page = $event"
                name="phone-number2"
                id="phone-number2"
              />
              <!-- password field -->
              <Password
                v-model="password"
                :message="message"
                id="password"
                name="password"
              />
              <div @click="(page = 'Reset'), (message = '')" class="w-fit">
                <p
                  class="text-green-500 w-fit md:cursor-pointer text-sm md:text-base"
                >
                  Forgot Password?
                </p>
              </div>
              <button
                :disabled="password.length < 4 || userId == null"
                class="bg-[color:var(--primary,#000)] w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 my-4"
              >
                Login
              </button>
            </form>

            <div class="text-center">
              <p>
                Don't have an account?
                <span
                  @click="
                    (page = 'Initial'), (formName = 'Create'), (message = '')
                  "
                  class="text-green-500 md:cursor-pointer"
                  >Create new</span
                >
              </p>
            </div>
          </div>

          <!-- After creating an account, the user will be redirected here (OTP login) for activation. -->
          <form v-else @submit.prevent="otpSendAction">
            <h1
              class="text-gray-900 text-xl md:text-2xl lg:text-3xl font-semibold pt-6 pb-8 text-center"
            >
              Activate your account
            </h1>
            <!-- PhoneNumber Input Field -->
            <PhoneNumber
              v-model="userInput"
              name="phone-number3"
              id="phone-number3"
              :readonly="true"
            />
            <!-- OTP field -->
            <OtpNumber
              v-if="isActive == false && userId != null"
              @onOtp="otpValidityAction"
              :otpFor="'Login'"
            />
            <!-- error message -->
            <div
              v-if="message"
              class="text-red-600 text-sm font-medium flex items-center gap-1 mt-1"
            >
              <span>
                <ExclamationCircleIcon class="w-5 h-5" />
              </span>
              <span>{{ message }}</span>
            </div>
            <!-- Waiting for OTP and Resend OTP button -->
            <button
              @click="otpSendAction()"
              :disabled="timer > 0"
              class="bg-[color:var(--primary,#000)] w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 mt-4"
            >
              {{
                timer
                  ? "Waiting for OTP"
                  : otpMessage === "Send OTP"
                  ? otpMessage
                  : "Resend OTP"
              }}
              {{ timer > 0 ? " - " + timer + "s" : "" }}
            </button>
          </form>
        </div>

        <!-- create page -->
        <div v-if="page === 'Create'">
          <form @submit.prevent="join()">
            <!-- Name Input Field -->
            <div class="relative text-sm mb-4 md:mb-6">
              <fieldset
                class="relative bg-white border-2 rounded-md focus-within:border-[--primary]"
                :class="message ? 'border-red-600' : 'border-gray-200'"
              >
                <legend
                  class="text-xs font-medium text-gray-900 mx-2 px-0.5"
                  :class="message ? 'text-red-600' : ''"
                >
                  Name
                </legend>
                <input
                  ref="nameRef"
                  v-model.trim="name"
                  type="text"
                  name="name"
                  id="name"
                  autocomplete="off"
                  class="w-full border-0 rounded-md p-3 pt-1.5 text-gray-600 placeholder-gray-400 placeholder:text-sm text-sm md:text-base focus:ring-0"
                  placeholder="Enter your name"
                />
                <div
                  class="pointer-events-none absolute top-1.5 md:top-2 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="name.length < 3"
                    class="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </fieldset>
            </div>

            <!-- PhoneNumber Input Field -->
            <PhoneNumber
              v-model="userInput"
              :readonly="true"
              :editable="true"
              @updatePage="page = $event"
              name="phone-number4"
              id="phone-number4"
            />

            <!-- password field -->
            <Password
              v-model="password"
              :message="message"
              :page="page"
              id="password2"
              name="password2"
            />

            <!-- ReferCode Input Field -->
            <div v-if="showRefer" class="relative text-sm mt-4 md:mt-6">
              <fieldset
                class="relative bg-white border-2 rounded-md focus-within:border-[--primary]"
                :class="message ? 'border-red-600' : 'border-gray-200'"
              >
                <legend
                  class="text-xs font-medium text-gray-900 mx-2 px-0.5"
                  :class="message ? 'text-red-600' : ''"
                >
                  Refer code
                </legend>
                <input
                  v-model.trim="referedCode"
                  type="text"
                  name="referedCode"
                  id="referedCode"
                  autocomplete="off"
                  class="w-full border-0 rounded-md p-3 pt-1.5 text-gray-600 placeholder-gray-400 placeholder:text-sm text-sm md:text-base focus:ring-0"
                  placeholder="Enter refered code"
                />
                <div
                  class="pointer-events-none absolute top-1.5 md:top-2 right-0 flex items-center pr-3"
                >
                  <ExclamationCircleIcon
                    v-if="!isReferValid"
                    class="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                  <CheckCircleIcon
                    v-else
                    class="h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                </div>
              </fieldset>
            </div>

            <div
              @click="(showRefer = !showRefer), (message = '')"
              class="w-fit"
              :class="{ 'mt-2': showRefer }"
            >
              <p
                class="text-green-500 w-fit md:cursor-pointer text-sm md:text-base"
              >
                {{
                  showRefer ? "Don't have a refer code!" : "Have a refer code?"
                }}
              </p>
            </div>

            <button
              :disabled="password.length < 4 || name.length < 3"
              class="bg-[color:var(--primary,#000)] w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 my-4"
            >
              Create
            </button>
          </form>
          <div class="text-center">
            <p>
              Already have an account?
              <span
                @click="
                  (page = 'Initial'), (formName = 'Login'), (message = '')
                "
                class="text-green-500 md:cursor-pointer"
                >Log in</span
              >
            </p>
          </div>
        </div>

        <!-- reset page -->
        <div v-if="page === 'Reset'">
          <form @submit.prevent="userOtpUpdate" class="space-y-6">
            <!-- PhoneNumber Input Field -->
            <PhoneNumber
              v-model="userInput"
              :message="message"
              name="phone-number5"
              id="phone-number5"
              :readonly="true"
            />
            <!-- OTP field -->
            <OtpNumber
              v-if="phone && ['otpWaiting', 'otpInvalid'].includes(otpStatus)"
              @onOtp="otpValidityAction"
              :otpFor="'Reset'"
            />
            <!-- New Password Field -->
            <Password
              v-if="otpStatus == 'otpSubmit'"
              v-model="password"
              :label="'New Password'"
              id="password3"
              name="password3"
              :placeholder="'Enter your new password'"
            />
            <!-- buttons for Send OTP and Resend OTP -->
            <div class="flex items-center space-x-4">
              <button
                v-if="otpStatus == 'otpSubmit'"
                @click="otpResetAction()"
                :disabled="phone === null"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ otpMessage }}
              </button>
              <button
                v-else
                @click="otpSendAction()"
                :disabled="timer > 0"
                class="bg-[color:var(--primary,#000)] flex justify-center items-center w-full text-white text-sm md:text-base px-4 py-3 border border-transparent rounded-md focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{
                  timer
                    ? "Waiting for OTP"
                    : otpMessage === "Send OTP"
                    ? otpMessage
                    : "Resend OTP"
                }}
                {{ timer > 0 ? " - " + timer + "s" : "" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  ref,
  computed,
  watch,
  onMounted,
  defineAsyncComponent,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMeStore } from "@/stores/me";
import { useSiteStore } from "@/stores/site";
import { useNotificationsStore } from "@/stores/notifications";
import { onLogin } from "@/vue-apollo";
import parsePhoneNumber from "libphonenumber-js/max";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import {
  LOGIN,
  JOIN,
  USER_CHECK,
  USER_OTP_UPDATE,
  USER_OTP_PASSWORD_UPDATE,
  USER_ACTIVE_UPDATE,
  USER_BY_HID,
} from "@/gql/me";
// import { useHead } from "@unhead/vue";
import OtpNumber from "@/components/login/OtpNumber.vue";

const PhoneNumber = defineAsyncComponent(() =>
  import("@/components/login/PhoneNumber.vue")
);
const Password = defineAsyncComponent(() =>
  import("@/components/login/Password.vue")
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
const page = ref("Initial");
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
const formName = ref("Login");
const nameRef = ref(null);

// otp
const otpStatus = ref("otpSend");
const otpMessage = computed(() => {
  if (otpStatus.value == "otpSend") {
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
  if (!timer.value) {
    message.value = "OTP validity has expired. Please request a new OTP.";
    return;
  }
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

const userInput = ref("");
const userInputError = ref(true);

const validatePhoneNumber = () => {
  const phoneRegex = /^\+?\d{10,15}$/; // Phone regex
  if (userInput.value.trim() === "") {
    return (message.value = "Please enter your phone number");
  }
  if (phoneRegex.test(userInput.value)) {
    const userPhoneInput = userInput.value.toString();
    try {
      const parsedPhoneNumber = parsePhoneNumber(userPhoneInput, "BD");
      if (!parsedPhoneNumber.isValid()) {
        throw new Error("Invalid phone number");
      }
      userInputError.value = false;
      phone.value = parseInt(parsedPhoneNumber.number);

      userCheck(phone.value.toString());
    } catch (error) {
      userInputError.value = true;
      message.value = error.message;
    }
  } else {
    message.value = "Invalid Input!";
  }
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
      if (!isActive.value && userId.value) {
        otpSendAction();
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
  }
  setLoading(false);
};
// end join
const userCheck = (data) => {
  const { onResult, loading, onError } = useQuery(USER_CHECK, {
    data: data,
    parentId: site.value.isOtp ? sourceId.value : null,
  });
  onResult((queryResult) => {
    if (queryResult.data) {
      userId.value = queryResult.data?.userCheck?.id;
      // ____________ though userId exist, So go to login page _____________
      message.value = "";
      phone.value = queryResult.data?.userCheck?.phone;
      isActive.value = queryResult.data?.userCheck?.isActive;
      page.value = "Login";
      password.value = "";

      if (!isActive.value && userId.value) {
        otpSendAction();
      }
    }
  });
  onError((error) => {
    // though userId not found, So go to create account
    page.value = "Create";
    password.value = "";
    addNotification(
      {
        title: "Account info",
        subTitle: "Don't have an account! Create new.",
      },
      "warning"
    );
  });
};

watch(timer, () => {
  if (timer.value > 0) {
    setTimeout(startTimer, 1000); // Decrease timer every second
  }
});

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
  page.value = "Initial";
});

watch([password, userInput, page], () => {
  message.value = "";
});

watch(page, async (newPage) => {
  if (newPage === "Create") {
    await nextTick();
    nameRef.value?.focus();
  }
});
const isSignup = computed(() => router.currentRoute.value.name == "Signup");
const instraction = ref("এ প্রবেশ করুন ফোন নাম্বার এর মাধ্যমে");
watch(page, () => {
  if (page.value == "Initial") {
    instraction.value = "এ প্রবেশ করুন ফোন নাম্বার এর মাধ্যমে";
  } else if (page.value == "Login") {
    instraction.value = "Enter your password";
  } else if (page.value == "Login") {
    instraction.value = "Enter your password";
  } else if (page.value == "Create") {
    instraction.value = "Create your account";
  } else if (page.value == "Reset") {
    instraction.value = "Reset your password";
  }
});
// const pageTitle = computed(() => {
//   return router.currentRoute.value.path === "/login/"
//       ? `Login | ${site.value.metaTitle}`
//       : `Sign Up | ${site.value.metaTitle}`;
// });
// useHead({
//   title: pageTitle
// })
</script>
