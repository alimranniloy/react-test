<template>
    <div class="w-full bg-white border-b border-gray-100 fixed z-30 px-4 md:px-8 w-full-minus-appbar">
        <div class="flex content-center items-center justify-between">
            <div class="flex space-x-4">
                <div class="w-[168px] border-r border-gray-100 py-3 flex items-center"><router-link :to="`/`"
                        aria-current="page" class="nuxt-link-exact-active nuxt-link-active" name="Bponi Site home"
                        title="Bponi Site home">
                        <div class="flex items-center"><svg width="28px" height="29px" viewBox="0 0 28 29" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                class="w-6">
                                <defs>
                                    <linearGradient id="linearGradient-1" x1="50%" y1="100%" x2="50%"
                                        y2="3.061617e-15%">
                                        <stop stop-color="#8655D0" offset="0%"></stop>
                                        <stop stop-color="#32258C" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient id="linearGradient-2" x1="75.7911263%" y1="0%" x2="50%" y2="100%">
                                        <stop stop-color="#F187FE" offset="0%"></stop>
                                        <stop stop-color="#985ED9" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient id="linearGradient-3" x1="50%" y1="0%" x2="50%" y2="100%">
                                        <stop stop-color="#8655D0" offset="0%"></stop>
                                        <stop stop-color="#32258C" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient id="linearGradient-4" x1="50%" y1="0%" x2="50%" y2="100%">
                                        <stop stop-color="#8655D0" offset="0%"></stop>
                                        <stop stop-color="#32258C" offset="100%"></stop>
                                    </linearGradient>
                                    <linearGradient id="linearGradient-5" x1="67.4821749%" y1="0%" x2="50%" y2="100%">
                                        <stop stop-color="#F187FE" offset="0%"></stop>
                                        <stop stop-color="#985ED9" offset="100%"></stop>
                                    </linearGradient>
                                </defs>
                                <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Artboard" transform="translate(-10.000000, -11.000000)" fill-rule="nonzero">
                                        <g id="Group-4-Copy-2" transform="translate(10.000000, 11.000000)">
                                            <g id="Group-4-Copy">
                                                <g id="Group-3">
                                                    <g id="Group-2">
                                                        <g id="Group" transform="translate(0.000000, 3.965517)">
                                                            <polygon id="Path-2-Copy" fill="url(#linearGradient-1)"
                                                                points="15.4503906 6.09454494 24.7074219 6.61948524 28 13.8143019 12.983147 13.8143019">
                                                            </polygon>
                                                            <polyline id="Path-3" fill="url(#linearGradient-2)"
                                                                points="18.6441406 0.179344682 15.2 6.09454494 5.6 24.3781798 20.4691451 24.3781798 24.7074219 6.61948524">
                                                            </polyline>
                                                            <polygon id="Path-2" fill="url(#linearGradient-3)"
                                                                points="0.278515625 16.7726956 16.7097656 16.7726956 20.4915735 24.3781798 3.81015625 24.3781798">
                                                            </polygon>
                                                            <ellipse id="Path" fill="#FFFFFF" cx="20" cy="8.93866591"
                                                                rx="1.6" ry="1.62521198">
                                                            </ellipse>
                                                        </g>
                                                        <polygon id="Path-4" fill="url(#linearGradient-4)"
                                                            points="17.4799284 6.21998644 14.245614 3.0383241 13.8849082 0.671669062 18.2834348 4.81653099">
                                                        </polygon>
                                                        <polygon id="Path-4-Copy" fill="url(#linearGradient-5)"
                                                            points="16.4448773 7.97355906 13.2631579 4.52539306 13.2631579 1.48706897 17.4799284 6.21998644">
                                                        </polygon>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg> <span class="font-bold text-base ml-2 mt-1">
                                Bponi Site
                            </span></div>
                    </router-link></div>
                <ul class="py-3 hidden lg:flex content-center justify-start text-sm space-x-2 ml-8">
                    <li
                        class="text-gray-700 group rounded-full hover:bg-gray-100 group transition duration-300 relative">
                        <router-link :to="`inspiration/landing-page`"
                            class="font-medium group-hover:text-brand-600 text-gray-700 px-3 py-2 flex space-x-1 items-center transition duration-300"
                            name="Inspiration" title="Inspiration"><span>Inspiration</span> <svg
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2"
                                class="w-3 h-3 text-gray-600 group-hover:rotate-180 transform transition duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg></router-link>
                        <div
                            class="w-full lg:w-[700px] lg:absolute lg:top-6 lg:right-0 xl:left-0 z-10 bg-white lg:p-4 lg:shadow-md lg:rounded-xl lg:border lg:border-gray-100 lg:hidden group-hover:block">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><router-link
                                    :to="`/inspiration/landing-page`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100"
                                    title="Site &amp; Landing Page Inspiration"
                                    name="Site &amp; Landing Page Inspiration">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/template-gradient.74fe996.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Site &amp; Landing Page Inspiration
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Get inspired by the best landing page designs on the web.
                                        </p>
                                    </div>
                                </router-link><router-link :to="`/components`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100"
                                    title="Section &amp; Component Examples" name="Section &amp; Component Examples">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/component-gradient.40d9638.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Section &amp; Component Examples
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            A growing list of landing page components from hundreds of websites
                                        </p>
                                    </div>
                                </router-link></div>
                        </div>
                    </li>
                    <li
                        class="text-gray-700 group rounded-full hover:bg-gray-100 group transition duration-300 relative">
                        <router-link :to="`/library`"
                            class="font-medium group-hover:text-brand-600 text-gray-700 px-3 py-2 flex space-x-1 items-center transition duration-300"
                            name="Component Library" title="Component Library"><span>Component Library</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="2"
                                class="w-3 h-3 text-gray-600 group-hover:rotate-180 transform transition duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg></router-link>
                        <div
                            class="w-full lg:w-[500px] lg:absolute lg:top-6 lg:right-0 xl:left-0 z-10 bg-white lg:p-4 lg:shadow-md lg:rounded-xl lg:border lg:border-gray-100 lg:hidden group-hover:block">
                            <div class="grid grid-cols-3 gap-4">
                                <div class="col-span-3"><router-link :to="`/library`"
                                        class="flex items-start justify-start w-full py-4 px-5 rounded-lg bg-gray-50 hover:bg-gray-100 space-x-4"><img
                                            src="https://www.landingfolio.com/_nuxt/img/component-gradient.40d9638.png"
                                            class="w-14">
                                        <div class="flex flex-col -mt-2"><span
                                                class="font-bold text-base pt-2 pb-2">Component Library
                                                (805+)</span> <span class="text-sm text-gray-600">Discover instant
                                                copy+paste Tailwind,
                                                Webflow &amp; Figma components. Explore our huge library.</span></div>
                                    </router-link></div>
                            </div>
                        </div>
                    </li>
                    <li
                        class="text-gray-700 group rounded-full hover:bg-gray-100 group transition duration-300 relative">
                        <router-link :to="`/templates`"
                            class="font-medium group-hover:text-brand-600 text-gray-700 px-3 py-2 flex space-x-1 items-center transition duration-300"
                            name="Templates" title="Templates"><span>Templates</span> <svg
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2"
                                class="w-3 h-3 text-gray-600 group-hover:rotate-180 transform transition duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg></router-link>
                        <div
                            class="w-full lg:w-[700px] lg:absolute lg:top-6 lg:right-0 xl:left-0 z-10 bg-white lg:p-4 lg:shadow-md lg:rounded-xl lg:border lg:border-gray-100 lg:hidden group-hover:block">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><router-link :to="`/templates`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100" title="Landing Page Templates"
                                    name="Landing Page Templates">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/template-gradient.74fe996.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Landing Page Templates
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Third party templates from the best designers around the world.
                                        </p>
                                    </div>
                                </router-link><router-link :to="`/store/templates`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100" title="Pro Templates"
                                    name="Pro Templates">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/pro-gradient.17607e2.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Pro Templates
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Website templates for Webflow &amp; Tailwind. Included in our Pro
                                            membership.
                                        </p>
                                    </div>
                                </router-link></div>
                        </div>
                    </li>
                    <li
                        class="text-gray-700 group rounded-full hover:bg-gray-100 group transition duration-300 relative">
                        <router-link :to="`/blog`"
                            class="font-medium group-hover:text-brand-600 text-gray-700 px-3 py-2 flex space-x-1 items-center transition duration-300"
                            name="Learn" title="Learn"><span>Learn</span> <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                class="w-3 h-3 text-gray-600 group-hover:rotate-180 transform transition duration-200">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                            </svg></router-link>
                        <div
                            class="w-full lg:w-[700px] lg:absolute lg:top-6 lg:right-0 xl:left-0 z-10 bg-white lg:p-4 lg:shadow-md lg:rounded-xl lg:border lg:border-gray-100 lg:hidden group-hover:block">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><router-link :to="`/blog`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100" title="Blog" name="Blog">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/blog-gradient.ed71bde.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Blog
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Get expert advice on landing page design, copywriting, conversion
                                            optimization and more.
                                        </p>
                                    </div>
                                </router-link><router-link :to="`/learn/tips`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100" title="Optimization Tips"
                                    name="Optimization Tips">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/tip-gradient.faaf8f2.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Optimization Tips
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            Actional design tips to improve your landing page design
                                        </p>
                                    </div>
                                </router-link><router-link :to="`/blog/the-best-landing-page-builder-tools`"
                                    class="w-full py-4 px-5 rounded-lg hover:bg-gray-100" title="Tool Reviews"
                                    name="Tool Reviews">
                                    <div class="flex flex-col"><img
                                            src="https://www.landingfolio.com/_nuxt/img/review-gradient.fdd5c45.png"
                                            class="w-10">
                                        <h3 class="font-bold text-base pt-2 pb-2">
                                            Tool Reviews
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            The Best Landing Page Builder Software: The Definitive Guide.
                                        </p>
                                    </div>
                                </router-link></div>
                        </div>
                    </li>
                    <li
                        class="text-gray-700 group rounded-full hover:bg-gray-100 group transition duration-300 relative">
                        <router-link :to="`/pricing`"
                            class="font-medium group-hover:text-brand-600 text-gray-700 px-3 py-2 flex space-x-1 items-center transition duration-300"
                            name="Pricing" title="Pricing"><span>Pricing</span> </router-link>
                    </li>
                </ul>
            </div>
            <div class="flex justify-end space-x-4 md:space-x-4 items-center py-3">
                <div class="w-7 h-7 rounded-full bg-brand-200 flex items-center justify-center">
                    <div class="flex">
                        <div class="relative"><button type="button"
                                class="inline-flex items-center justify-center h-10 px-3 py-2 transition-all duration-200 bg-gray-100 border border-transparent focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 hover:bg-gray-200 rounded-xl"><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    class="w-4 h-4 text-gray-500">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clip-rule="evenodd"></path>
                                </svg></button> </div>
                    </div>
                </div>
                <div class="flex lg:hidden"><button aria-label="White button" type="button"
                        class="flex content-center items-center justify-center text-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"><svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg></button> </div>
            </div>
        </div>
    </div>
</template>