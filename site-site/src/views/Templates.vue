<script setup>
import { onMounted, ref, computed, defineAsyncComponent, inject } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { SITE } from "@/gql/site";

</script>
<template>
  <div class="w-full min-h-screen-header pt-[60px]">
    <div class="flex w-full">
      <div
        class="hidden lg:block w-[200px] min-w-[200px] bg-gray-50 border-r border-gray-100 max-h-screen-header overflow-hidden overflow-y-auto">
        <div class="p-6 space-y-5">
          <div class="space-y-2"><span class="text-sm text-gray-500 font-bold">Pages</span>
            <ul class="space-y-3">
              <li class="flex items-start"><a href="/inspiration/landing-page"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Landing Page inspiration" name=" Landing Page inspiration"><span>Landing
                    Page</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/pricing"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Pricing Page inspiration" name=" Pricing Page inspiration"><span>Pricing
                    Page</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/about"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" About Page inspiration" name=" About Page inspiration"><span>About
                    Page</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/login"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Login Page inspiration" name=" Login Page inspiration"><span>Login
                    Page</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/signup"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Signup Page inspiration" name=" Signup Page inspiration"><span>Signup
                    Page</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/notfound"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Not Found Page inspiration" name=" Not Found Page inspiration"><span>Not
                    Found Page</span> </a></li>
            </ul>
          </div>
          <div class="space-y-2"><span class="text-sm text-gray-500 font-bold">Industries</span>
            <ul class="space-y-3">
              <li class="flex items-start"><a href="/inspiration/landing-page/saas"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" SaaS inspiration" name=" SaaS inspiration"><span>SaaS</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (338)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/product"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Product inspiration" name=" Product inspiration"><span>Product</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (206)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/business"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Business inspiration" name=" Business inspiration"><span>Business</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (139)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/marketing"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Marketing inspiration" name=" Marketing inspiration"><span>Marketing</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (114)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/design-tools"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Design Tools inspiration" name=" Design Tools inspiration"><span>Design
                    Tools</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (113)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/software"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Software inspiration" name=" Software inspiration"><span>Software</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (85)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/technology"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Technology inspiration" name=" Technology inspiration"><span>Technology</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (78)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/mobile-app"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Mobile App inspiration" name=" Mobile App inspiration"><span>Mobile
                    App</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (70)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/freelance"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Freelance inspiration" name=" Freelance inspiration"><span>Freelance</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (35)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/artificial-intelligence"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Artificial Intelligence inspiration"
                  name=" Artificial Intelligence inspiration"><span>Artificial Intelligence</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (35)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/users"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Users inspiration" name=" Users inspiration"><span>Users</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (31)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/crypto"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Crypto inspiration" name=" Crypto inspiration"><span>Crypto</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (21)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/corporate"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Corporate inspiration" name=" Corporate inspiration"><span>Corporate</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (20)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/crm"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" CRM inspiration" name=" CRM inspiration"><span>CRM</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (19)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/fintech"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Fintech inspiration" name=" Fintech inspiration"><span>Fintech</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (18)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/course"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Course inspiration" name=" Course inspiration"><span>Course</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (17)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/accounting"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Accounting inspiration" name=" Accounting inspiration"><span>Accounting</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (14)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/book"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Book inspiration" name=" Book inspiration"><span>Book</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (13)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/mail"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Mail inspiration" name=" Mail inspiration"><span>Mail</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (12)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/nft"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" NFT inspiration" name=" NFT inspiration"><span>NFT</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (11)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/event"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Event inspiration" name=" Event inspiration"><span>Event</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (9)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/search"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Search inspiration" name=" Search inspiration"><span>Search</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (9)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/social-media"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Social Media inspiration" name=" Social Media inspiration"><span>Social
                    Media</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (8)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/wordpress"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Wordpress inspiration" name=" Wordpress inspiration"><span>Wordpress</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (8)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/squarespace"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Squarespace inspiration" name=" Squarespace inspiration"><span>Squarespace</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (8)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/health"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Health inspiration" name=" Health inspiration"><span>Health</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (7)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/email"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Email inspiration" name=" Email inspiration"><span>Email</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (7)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/real-estate"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Real Estate inspiration" name=" Real Estate inspiration"><span>Real
                    Estate</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (5)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/mailchimp"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Mailchimp inspiration" name=" Mailchimp inspiration"><span>Mailchimp</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (5)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/fashion"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Fashion inspiration" name=" Fashion inspiration"><span>Fashion</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (3)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/kickstarter"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Kickstarter inspiration" name=" Kickstarter inspiration"><span>Kickstarter</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (2)
                  </div>
                </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page/store"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold"
                  title=" Store inspiration" name=" Store inspiration"><span>Store</span>
                  <div class="text-[9px] text-gray-400 px-1.5">
                    (2)
                  </div>
                </a></li>
            </ul>
          </div>
          <div class="space-y-2"><span class="text-sm text-gray-500 font-bold">Colors</span>
            <ul class="space-y-3">
              <li class="flex items-start"><a href="/inspiration/landing-page?color=FF0000"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Red "
                  name=" Red "><span>Red</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=FFA500"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Orange "
                  name=" Orange "><span>Orange</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=964B00"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Brown "
                  name=" Brown "><span>Brown</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=FFFF00"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Yellow "
                  name=" Yellow "><span>Yellow</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=00FF00"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Green "
                  name=" Green "><span>Green</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=0000FF"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Blue "
                  name=" Blue "><span>Blue</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=808080"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Gray "
                  name=" Gray "><span>Gray</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=000000"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" Black "
                  name=" Black "><span>Black</span> </a></li>
              <li class="flex items-start"><a href="/inspiration/landing-page?color=FFFFFF"
                  class="text-sm font-medium text-gray-800 flex justify-between w-full hover:font-bold" title=" White "
                  name=" White "><span>White</span> </a></li>
            </ul>
          </div>
        </div>
      </div>
      <div id="content" class="flex flex-col p-4 lg:p-10 max-h-screen-header overflow-y-auto w-full">
        <div class="mb-4 flex flex-col md:flex-row justify-between px-2">
          <div class="text-left w-full lg:max-w-2xl lg:mx-0 w-full">
            <nav aria-label="Breadcrumb" class="flex relative z-10">
              <ol role="list" class="flex items-center space-x-2.5">
                <li>
                  <div class="-m-1"><a href="/"
                      class="inline-flex p-1 text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:text-gray-900 focus:ring-gray-900 nuxt-link-active"><svg
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2" class="flex-shrink-0 w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                        </path>
                      </svg> <span class="sr-only">Home</span></a></div>
                </li>
                <li>
                  <div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" aria-hidden="true" class="flex-shrink-0 w-4 h-4 text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                    </svg>
                    <div class="-m-1"><a href="/templates" aria-current="page"
                        class="capitalize p-1 ml-2.5 text-sm font-medium text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:text-gray-900 focus:ring-gray-900 hover:text-gray-700 nuxt-link-exact-active nuxt-link-active">
                        Templates
                      </a></div>
                  </div>
                </li>
              </ol>
            </nav>
            <div class="relative">
              <h1 class="text-2xl font-semibold text-gray-900 sm:text-3xl relative z-10 mt-6">
                Landing Page Templates
              </h1>
            </div>
            <h2 class="mt-4 text-base font-normal leading-7 text-gray-600">
              Beautiful, customizable landing page templates for every project. Get the best landing page template for
              your business with our collection of 79 free and premium templates. These have been professionally
              designed by experts in different technologies such as HTML, React, Vue, Tailwind CSS, Bootstrap, Webflow
              and WordPress so you can find one that suits your needs perfectly.
            </h2>
            <div class="text-yellow-500 italic font-semibold text-sm my-4">
              These are third-party templates and are
              <strong>not</strong> included in our
              <a href="/pricing" class="underline"> membership </a>.
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 p-2 rounded-lg w-full flex flex-col lg:flex-row justify-start mb-4 lg:mb-4 space-y-2 lg:space-y-0 lg:space-x-4">
          <div class="relative inline-block text-left">
            <div><button id="simple-menu-button" type="button" aria-expanded="true" aria-haspopup="true"
                class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"><label
                  for="email" class="block text-sm font-semibold leading-5 text-gray-900 mr-1.5">Sort:</label> <span
                  class="flex-shrink-0">All</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor" aria-hidden="true" class="-mr-1 ml-2 h-5 w-5">
                  <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
                </svg></button></div> <!----> <!---->
          </div>
          
        </div>
        <div>
          <div class="h-full">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <div class="relative group text-center">
                <div class="relative">
                  <div class="overflow-hidden rounded-xl border border-gray-200"><a href="/templates/post/clarityui"
                      class="block" rel="nofollow"><img
                        src="https://landingfoliocom.imgix.net/1639369173546-clarityui-template-desktop.png"
                        class="object-cover w-full h-full group-hover:scale-105 transition-transform v-lazy-image v-lazy-image-loaded"
                        alt=""
                        srcset="https://landingfoliocom.imgix.net/1639369173546-clarityui-template-desktop.png"></a>
                  </div>
                  <div class="absolute inset-x-0 bottom-6">
                    <div
                      class="bg-white rounded-full border border-gray-200 px-4 text-sm font-bold text-green-500 py-1.5 inline-flex items-center justify-center">
                      $39
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="w-full flex content-center items-center justify-center mt-8">
              <div><button aria-label="White button" type="button"
                  class="flex content-center items-center justify-center text-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"><svg
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4 text-gray-500 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg> <span>Load more</span></button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
