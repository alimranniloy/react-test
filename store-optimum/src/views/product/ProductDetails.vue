<template>
  <main class="sm:px-0 pb-[60px] pt-12 sm:pt-16 md:pt-0">
    <div class="max-w-screen-2xl mx-auto sm:px-4 flex pb-5">
      <div class="w-full relative">
        <div class="w-full md:overflow-hidden md:mt-4" v-if="product">
          <div class="p-4 bg-white md:rounded-xl md:flex w-full">
            <div class="flex-1">
              <div class="block md:flex gap-5">
                <div class="w-full md:w-1/2" style="height: 100%">
                  <div
                    v-if="product.extraImages.length > 0"
                    @click="showPdf = !showPdf"
                    class="text-sm font-semibold pb-1 text-red-500 flex items-center justify-between"
                  >
                    কিছু অংশ পড়ে দেখতে নিচের ছবিতে ক্লিক করুন
                    <ArrowUturnDownIcon
                      class="h-5 w-5 text-red-500 font-bold -rotate-360"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="border rounded-md md:h-full aspect-square">
                    <img
                      @click="showPdf = !showPdf"
                      class="object-contain rounded-md h-full w-full"
                      :src="selectedImage ? selectedImage : product.thumbnail"
                      alt=""
                    />
                  </div>

                  <div class="flex gap-2 w-full overflow-auto py-3">
                    <img
                      @click="imageIndex = item.id"
                      v-for="item in images"
                      :key="item.id"
                      :src="item.image"
                      class="border object-cover rounded-md h-[80px] min-w-[80px]"
                      :class="imageIndex == item.id ? 'border-red-500' : ''"
                    />
                  </div>
                </div>
                <div class="w-full md:w-1/2">
                  <h2 class="font-bold text-xl sm:text-xl text-gray-600">
                    {{ locale === "en" ? product.title : product.translation }}
                  </h2>
                  <!-- product price -->
                  <div class="flex items-center justify-between w-full md:pt-2">
                    <div>
                      <span
                        class="text-[#fc5230] text-xl sm:text-2xl font-semibold"
                        >{{
                          site.isPublic || (customer && customer.isActive)
                            ? formatMoney(price, product.currency)
                            : "***"
                        }}</span
                      >
                      <span
                        v-if="
                          (selectedVariant
                            ? selectedVariant.comparePrice +
                              product.comparePrice
                            : product.comparePrice) > price
                        "
                        class="ml-2 text-gray-500 text-md sm:text-xl font-semibold relative after:block after:absolute after:h-[1px] after:bg-[#fc5230] after:w-full after:right-0 after:top-[10px] after:-rotate-3"
                        >{{
                          site.isPublic || (customer && customer.isActive)
                            ? formatMoney(
                                selectedVariant
                                  ? selectedVariant.comparePrice +
                                      product.comparePrice
                                  : product.comparePrice,
                                product.currency
                              )
                            : "***"
                        }}</span
                      >
                    </div>
                  </div>
                  <!-- emi price -->
                  <div
                    v-if="product.emiPrice && product.emiDuration > 0"
                    class="mt-2 pt-2 border-t"
                  >
                    <div class="grid gap-5 mt-2 grid-flow-col auto-cols-max">
                      <div
                        @click="isEmi = false"
                        :class="[
                          !isEmi
                            ? 'bg-[#23b47e1a] border-[#24b47e] z-10'
                            : 'border-gray-200',
                          'rounded-md relative border p-2 px-3 flex items-center cursor-pointer focus:outline-none',
                        ]"
                      >
                        <div class="flex items-center gap-3">
                          <p :class="!isEmi ? 'block' : 'hidden'">
                            <CheckCircleIcon
                              :class="'w-6 h-6 text-[#23b47e]'"
                            />
                          </p>
                          <div
                            :class="[
                              false ? '' : 'text-gray-900',
                              'block text-sm font-medium',
                            ]"
                          >
                            <h4
                              class="text-[#fc5230] text-xl sm:text-2xl font-semibold"
                            >
                              {{
                                site.isPublic || (customer && customer.isActive)
                                  ? formatMoney(price, product.currency)
                                  : "***"
                              }}
                            </h4>
                            <p class="text-xs text-gray-900 mt-1">
                              Cash Discount Price
                            </p>
                            <p class="text-xs text-gray-900">
                              Online / Cash Payment
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        @click="isEmi = true"
                        :class="[
                          isEmi
                            ? 'bg-[#23b47e1a] border-[#24b47e] z-10'
                            : 'border-gray-200',
                          'rounded-md relative border p-2 px-3 flex items-center cursor-pointer focus:outline-none',
                        ]"
                      >
                        <div class="flex items-center gap-3">
                          <p :class="isEmi ? 'block' : 'hidden'">
                            <CheckCircleIcon
                              :class="'w-6 h-6 text-[#23b47e]'"
                            />
                          </p>
                          <div
                            :class="[
                              false ? '' : 'text-gray-900',
                              'block text-sm font-medium',
                            ]"
                          >
                            <h4
                              class="text-[#fc5230] text-xl sm:text-2xl font-semibold"
                            >
                              {{
                                site.isPublic || (customer && customer.isActive)
                                  ? formatMoney(
                                      product.emiDuration > 0
                                        ? product.emiPrice / product.emiDuration
                                        : product.emiPrice,
                                      product.currency
                                    )
                                  : "***"
                              }}
                              <span class="text-sm"> /month</span>
                            </h4>
                            <p class="font-bold text-gray-900 mt-1">
                              EMI Price:
                              {{
                                site.isPublic || (customer && customer.isActive)
                                  ? formatMoney(
                                      product.emiPrice,
                                      product.currency
                                    )
                                  : "***"
                              }}
                            </p>
                            <p class="text-xs text-gray-900">
                              {{ product.emiInterest }}% EMI for
                              {{ product.emiDuration }} Months
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Product price end -->
                  <!-- variant -->
                  <RadioGroup
                    :key="group.title"
                    v-for="group in variantGroups"
                    @update:modelValue="(value) => selectVariantGroup(value)"
                    class="mt-2"
                  >
                    <RadioGroupLabel
                      class="text-sm font-semibold text-gray-600 uppercase"
                    >
                      {{ group.title }}
                    </RadioGroupLabel>
                    <div class="grid mt-2 grid-flow-col auto-cols-max">
                      <RadioGroupOption
                        as="template"
                        v-for="item in group.items"
                        :key="product.id + '_' + item"
                        :id="product.id + '_' + item"
                        :value="{ key: group.title, value: item }"
                      >
                        <div
                          :class="[
                            variantGroup.find((a) => a.value == item)
                              ? 'bg-[#23b47e1a] border-[#24b47e] z-10'
                              : 'border-gray-200',
                            'rounded-md relative border p-2 px-3 flex items-center cursor-pointer focus:outline-none mr-3',
                          ]"
                        >
                          <span class="flex flex-col">
                            <RadioGroupLabel
                              as="span"
                              :class="[
                                false ? '' : 'text-gray-900',
                                'block text-sm font-medium',
                              ]"
                              >{{ item }}</RadioGroupLabel
                            >
                          </span>
                        </div>
                      </RadioGroupOption>
                    </div>
                  </RadioGroup>

                  <!-- <div v-if="product.features.length > 0" class="py-3">
                    <div class="flex gap-3" v-for="item in product.features">
                      <div class="text-gray-600">{{ item.key }}:</div>
                      <div class="text-red-600">{{ item.value }}</div>
                    </div>
                  </div> -->
                  <div
                    v-if="
                      (product.variants.length > 0 &&
                        selectedVariant &&
                        selectedVariant.quantity > 0) ||
                      (product.variants.length === 0 && product.quantity > 0) ||
                      product.isContinueSelling
                    "
                    class="flex gap-4 py-2 sticky"
                    :class="
                      productVisible && isMobile
                        ? 'w-full z-40 left-0 right-0 bg-white px-2 pt-0 border-t border-gray-100 bottom-12'
                        : 'sticky'
                    "
                  >
                    <button
                      @click="toggleAddToCart(product)"
                      class="bg-gray-200 p-3 rounded text-md mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
                    >
                      {{ $t("content.addToCart") }}
                    </button>
                    <button
                      @click="toggleAddToBuy(product)"
                      class="bg-[--primary] text-white p-3 rounded text-md mt-2 w-full hover:opacity-90 transition-all whitespace-nowrap"
                    >
                      {{ $t("content.buyNow") }}
                    </button>
                  </div>

                  <div v-else class="flex py-2">
                    <button
                      class="bg-gray-200 p-3 rounded text-md mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
                    >
                      Stock Out&nbsp;
                      <ArrowLongRightIcon
                        class="h-5 w-5 inline text-gray-700"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <!-- others info -->
                  <div class="border-l-4 border-red-400 pl-3 my-2 md:my-3">
                    <div
                      v-if="product.categories.length > 0"
                      class="flex flex-wrap gap-3 items-center"
                    >
                      <div class="text-gray-500">Category:</div>
                      <router-link
                        :to="`/category/${product.slug}/${encodeId(category)}/`"
                        v-for="category in product.categories"
                        class="text-red-600"
                        :class="
                          product.categories.length > 1
                            ? 'border-r border-red-600 last:border-0 pr-3'
                            : ''
                        "
                        >{{
                          categories.find((v) => v.id == category)
                            ? categories.find((v) => v.id == category).title
                            : ""
                        }}</router-link
                      >
                    </div>
                    <div
                      v-if="product.subCategories.length > 0"
                      class="flex flex-wrap gap-3 items-center pt-1"
                    >
                      <div class="text-gray-500">Child category:</div>
                      <router-link
                        :to="`/sub-category/${product.slug}/${encodeId(
                          subCategory
                        )}/`"
                        v-for="subCategory in product.subCategories"
                        class="text-red-600"
                        :class="
                          product.subCategories.length > 1
                            ? 'border-r border-red-600 last:border-0 pr-3'
                            : ''
                        "
                        >{{
                          subCategories.find((v) => v.id == subCategory)
                            ? subCategories.find((v) => v.id == subCategory)
                                .title
                            : ""
                        }}</router-link
                      >
                    </div>
                    <div
                      v-if="product.brands.length > 0"
                      class="flex flex-wrap gap-3 items-center pt-1"
                    >
                      <div class="text-gray-500">
                        {{ product.productType == 6 ? "Author" : "Brand" }}:
                      </div>
                      <router-link
                        :to="`/${
                          product.productType == 6 ? 'author' : 'brand'
                        }/${brands.find((v) => v.id == brand)?.slug}/${encodeId(
                          brand
                        )}/`"
                        v-for="brand in product.brands"
                        class="text-red-600"
                        >{{
                          brands.find((v) => v.id == brand)
                            ? brands.find((v) => v.id == brand)?.title
                            : ""
                        }}</router-link
                      >
                    </div>

                    <div
                      v-if="product.shops.length > 0"
                      class="border px-3 pt-3 my-3 rounded-md w-full"
                    >
                      <router-link
                        :to="`/${
                          product.productType == 6 ? 'publishers' : 'shops'
                        }/${product.slug}/${encodeId(shop)}/`"
                        v-for="shop in uniqueShops(product.shops)"
                        class="flex justify-between w-full items-center pb-3"
                      >
                        <div class="flex gap-3">
                          <img
                            class="w-12 h-12 rounded-full"
                            v-lazy="
                              shops.find((v) => v.id == shop)
                                ? shops.find((v) => v.id == shop).logo
                                : ''
                            "
                          />
                          <div class="block">
                            <p class="text-md font-medium text-gray-800">
                              {{
                                shops.find((v) => v.id == shop)
                                  ? shops.find((v) => v.id == shop).title
                                  : ""
                              }}
                            </p>
                            <p class="text-xs font-normal text-gray-600">
                              {{
                                shops.find((v) => v.id == shop)
                                  ? shops.find((v) => v.id == shop).address
                                  : ""
                              }}
                            </p>
                          </div>
                        </div>

                        <div
                          class="px-5 py-2 rounded-3xl shadow-sm hover:bg-gray-100 transition-all bg-green-200"
                        >
                          visit
                        </div>
                      </router-link>
                    </div>
                    <div class="flex gap-3 items-center pt-1">
                      <div class="text-gray-500">Stock:</div>
                      <div class="text-red-600">
                        {{
                          product.variants.length > 0
                            ? selectedVariant
                              ? selectedVariant.quantity
                              : 0
                            : product.quantity
                        }}
                      </div>
                    </div>
                    <div class="flex gap-3 items-center pt-1">
                      <span class="text-gray-500">SKU:</span>
                      <span class="text-red-600">
                        {{ product.sku }}
                      </span>
                    </div>
                  </div>

                  <div class="flex justify-between flex-wrap gap-3 mt-5">
                    <div class="flex items-center gap-1">
                      <button
                        class="bg-bg rounded-md"
                        @click="toggleFavorite(product, isFavorite(product))"
                      >
                        <HeartIcon
                          class="h-6 w-6"
                          :class="
                            isFavorite(product)
                              ? 'text-red-500'
                              : 'text-gray-300'
                          "
                          aria-hidden="true"
                        />
                      </button>
                      <p class="text-gray-400">Add to your favorite list</p>
                    </div>

                    <div class="flex gap-2">
                      <p class="text-gray-400">Share:</p>
                      <div class="flex gap-3 items-center">
                        <div class="group relative">
                          <p
                            v-if="productLink == false"
                            class="bg-teal-600 px-2 py-1 rounded-sm text-white text-xs w-[65px] text-center absolute bottom-3 left-[50%] translate-x-[-50%] translate-y-[-50%] before:content-[''] before:w-4 before:h-4 before:bg-teal-600 before:-z-10 z-10 before:top-2 before:left-7 before:absolute before:rotate-45 hidden group-hover:block"
                          >
                            Copy link
                          </p>
                          <p
                            v-else
                            class="bg-teal-600 px-2 py-1 rounded-sm text-white text-xs absolute bottom-3 left-[50%] translate-x-[-50%] translate-y-[-50%] before:content-[''] before:w-4 before:h-4 before:bg-teal-600 before:-z-10 z-10 before:top-2 before:left-[22px] before:absolute before:rotate-45 hidden group-hover:block"
                          >
                            Copied
                          </p>
                          <LinkIcon
                            @click="
                              copyLink(
                                site.domain + router.currentRoute.value.fullPath
                              ),
                                (productLink = true)
                            "
                            class="w-6 h-6 text-gray-400 md:cursor-pointer"
                          />
                        </div>
                        <Share
                          :share="{
                            title: product.title,
                            url: currentUrl(),
                            description: product.description,
                            quote: '',
                            media: '',
                            twitterUser: '',
                            hashtags: [],
                          }"
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="me && customer && customer.isAffiliate"
                    class="border mt-5 px-3 pt-3 my-3 rounded-md w-full"
                  >
                    <div class="flex justify-between w-full items-center pb-3">
                      <div class="flex gap-3">
                        <div class="block">
                          <p class="text-md font-medium text-gray-800">
                            Affiliate commission
                          </p>
                          <p class="text-xs font-normal text-gray-600">
                            {{
                              formatMoney(
                                price * (product.affiliateCommission / 100),
                                product.currency
                              )
                            }}
                          </p>
                        </div>
                      </div>

                      <button
                        @click="copyAffiliateUrl(product)"
                        class="px-5 py-2 rounded-3xl shadow-sm hover:bg-gray-100 transition-all bg-yellow-100 text-gray-600"
                      >
                        Earn
                      </button>
                    </div>
                  </div>
                  <div class="mt-5">
                    <p
                      v-html="product.description"
                      class="text-base whitespace-pre-line"
                    ></p>
                  </div>
                  <div class="mt-5">
                    <p class="text-base">{{ getBrand(product.brands) }}</p>
                  </div>
                </div>
              </div>
              <div class="mt-5">
                <Editor
                  ref="productDescription"
                  :editorId="'product_' + product.id"
                  :html="product.html"
                  :key="product.id"
                />
              </div>
              <div
                v-if="
                  site.siteInfo == 'reseller' ||
                  (customer && customer.isReseller)
                "
                class="flex gap-2"
              >
                <button
                  @click="downloadImage(product)"
                  class="bg-gray-200 p-3 rounded text-sm mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
                >
                  Download image
                </button>
                <button
                  @click="copyDetails()"
                  class="bg-gray-200 p-3 rounded text-sm mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
                >
                  Copy description
                </button>
              </div>

              <div
                v-if="product.faq"
                class="w-full rounded-md bg-white p-2 flex flex-col gap-3"
              >
                <Disclosure
                  v-for="item in product.faq"
                  :key="item.key"
                  v-slot="{ open }"
                >
                  <div>
                    <DisclosureButton
                      class="flex w-full justify-between rounded bg-purple-100 p-4 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <span v-html="item.key"></span>
                      <ChevronDownIcon
                        :class="open ? 'rotate-180 transform' : ''"
                        class="h-5 w-5 text-purple-500"
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      class="px-4 pb-2 pt-4 text-sm text-gray-500 bg-purple-50 rounded-b-md"
                      v-html="item.value"
                    >
                    </DisclosurePanel>
                  </div>
                </Disclosure>
              </div>

              <Review
                :key="product.id"
                v-if="showReview"
                :productId="product.id"
                @refresh="true"
              />
              <div
                v-else
                class="text-center p-2 text-blue-400 hover:text-blue-500 cursor-pointer"
                @click="showReview = true"
              >
                Show review
              </div>
            </div>

            <div
              v-if="recentProducts.length > 1"
              class="hidden xl:block ml-10 max-w-xs w-full"
            >
              <div class="flex flex-col items-center mb-4">
                <h4
                  class="font-bold text-gray-800 text-base mb-2 text-center underline decoration-4 underline-offset-8 decoration-gray-200"
                >
                  Recent View
                </h4>
              </div>
              <div class="overflow-auto md:h-[600px]">
                <div
                  v-for="item in recentProducts.filter(
                    (a) => a.id != product.id
                  )"
                  :key="item.id"
                  class="border rounded-md p-3 mb-3 hover:bg-gray-50 duration-300"
                >
                  <router-link
                    class="flex"
                    :to="`/product/${item.slug}/${item.hid}/`"
                  >
                    <div class="w-[60px] mr-4">
                      <router-link :to="`/product/${item.slug}/${item.hid}/`">
                        <img
                          class="object-cover w-[60px] h-[60px] rounded-md"
                          v-lazy="item.image"
                          alt=""
                        />
                      </router-link>
                    </div>
                    <div class="w-full">
                      <router-link :to="`/product/${item.slug}/${item.hid}/`">
                        <h2 class="text-md line-clamp-2">
                          {{ locale === "en" ? item.title : item.translation }}
                        </h2>
                      </router-link>
                      <div class="mt-0 flex">
                        <span class="text-[14px] font-bold mr-3">{{
                          site.isPublic ||
                          (customer && customer.isActive) ||
                          source == "package"
                            ? formatMoney(item.price, site.currency)
                            : "***"
                        }}</span>
                        <span
                          v-if="item.comparePrice > item.price"
                          class="text-[14px] mr-3 line-through text-gray-500"
                          >{{
                            site.isPublic ||
                            (customer && customer.isActive) ||
                            source == "package"
                              ? formatMoney(item.comparePrice, site.currency)
                              : "***"
                          }}</span
                        >
                        <span
                          v-if="item.comparePrice > item.price"
                          class="text-[14px] text-[#EE741F]"
                          >({{
                            discount(item.price, item.comparePrice).toFixed(1)
                          }}%)</span
                        >
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <!-- Products start -->
          <div class="bg-white pt-4 pb-12 px-4 mt-4 md:rounded-xl">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="font-bold text-xl">Related Products</h2>
              </div>
            </div>
            <ProductList
              :categoryId="
                product.categories.length > 0 ? product.categories[0] : null
              "
              :subCategoryId="
                product.subCategories.length > 0
                  ? product.subCategories[0]
                  : null
              "
              :first="deviceType === 'lg' ? 10 : 12"
            />
          </div>
          <div
            id="product-modal"
            class="z-[9999] w-full h-screen transition-all fixed top-0 left-0 items-center pb-16 sm:items-center justify-center bg-[#4848488a] hidden"
            :style="!isFull ? '' : 'display: flex'"
          >
            <div class="mx-4 sm:mx-0 w-[600px] bg-white p-5 rounded-2xl">
              <div class="">
                <div class="flex justify-between">
                  <h2 class="text-2xl font-bold line-clamp-2 leading-6">
                    {{ locale === "en" ? product.title : product.translation }}
                  </h2>
                  <button
                    @click="toggleFull()"
                    type="button"
                    class="text-gray-400 flex items-center justify-center bg-transparent h-10 w-10 hover:bg-gray-200 hover:text-gray-900 rounded-lg"
                  >
                    <XCircleIcon
                      class="h-5 w-5 text-gray-800"
                      aria-hidden="true"
                    />
                    <span class="sr-only">Close menu</span>
                  </button>
                </div>
                <div>
                  <span
                    class="text-[#fc5230] text-xl sm:text-2xl font-semibold"
                    >{{
                      site.isPublic || (customer && customer.isActive)
                        ? formatMoney(price, product.currency)
                        : "***"
                    }}</span
                  >
                  <span
                    v-if="product.comparePrice > price"
                    class="ml-2 text-gray-500 text-md sm:text-xl font-semibold relative after:block after:absolute after:h-[1px] after:bg-[#fc5230] after:w-full after:right-0 after:top-[18px] after:-rotate-3"
                    >{{
                      site.isPublic || (customer && customer.isActive)
                        ? formatMoney(product.comparePrice, product.currency)
                        : "***"
                    }}</span
                  >
                </div>

                <RadioGroup
                  :key="group.title"
                  v-for="group in variantGroups"
                  @update:modelValue="(value) => selectVariantGroup(value)"
                  class="mt-2"
                >
                  <RadioGroupLabel
                    class="text-sm font-semibold text-gray-600 uppercase"
                  >
                    {{ group.title }}
                  </RadioGroupLabel>
                  <div class="grid mt-2 grid-flow-col auto-cols-max">
                    <RadioGroupOption
                      as="template"
                      v-for="item in group.items"
                      :key="product.id + '_' + item"
                      :id="product.id + '_' + item"
                      :value="{ key: group.title, value: item }"
                    >
                      <div
                        :class="[
                          variantGroup.find((a) => a.value == item)
                            ? 'bg-[#23b47e1a] border-[#24b47e] z-10'
                            : 'border-gray-200',
                          'rounded-md relative border p-2 px-3 flex items-center cursor-pointer focus:outline-none mr-3',
                        ]"
                      >
                        <span class="flex flex-col">
                          <RadioGroupLabel
                            as="span"
                            :class="[
                              false ? '' : 'text-gray-900',
                              'block text-sm font-medium',
                            ]"
                            >{{ item }}</RadioGroupLabel
                          >
                        </span>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <div
                  class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 mt-5"
                >
                  <div class="sm:col-span-3">
                    <div class="relative">
                      <label
                        for="resellPrice"
                        class="absolute -top-2 z-10 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >Resell Price (Min resell
                        {{
                          site.isPublic ||
                          (customer && customer.isActive) ||
                          source == "package"
                            ? formatMoney(
                                product.minResellPrice,
                                product.currency
                              )
                            : "***"
                        }})</label
                      >
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <span class="text-gray-500 sm:text-sm">{{
                            formatCurrency(site.currency)
                          }}</span>
                        </div>
                        <input
                          v-model.number="resellPrice"
                          type="number"
                          name="resellPrice"
                          id="resellPrice"
                          class="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0.00"
                          aria-describedby="cost-currency"
                        />
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          <span
                            class="text-gray-500 sm:text-sm"
                            id="cost-currency"
                            >{{ site.currency }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-10 mt-4">
                  <div>
                    <p
                      class="text-lg font-semibold"
                      :class="
                        resellPrice - price > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                    >
                      {{
                        site.isPublic || (customer && customer.isActive)
                          ? formatMoney(
                              resellPrice - price > 0 ? resellPrice - price : 0,
                              product.currency
                            )
                          : "***"
                      }}
                    </p>
                    <p class="text-gray-400 text-base">Profit</p>
                  </div>
                  <div>
                    <p
                      class="text-lg font-semibold"
                      :class="
                        resellPrice - price > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      "
                    >
                      {{
                        resellPrice - price > 0
                          ? ((100 * (resellPrice - price)) / price).toFixed(0)
                          : 0
                      }}%
                    </p>
                    <p class="text-gray-400 text-base">Margin</p>
                  </div>
                  <div>
                    <p class="text-lg font-semibold text-red-500">
                      {{
                        site.isPublic || (customer && customer.isActive)
                          ? formatMoney(
                              product.maxResellPrice,
                              product.currency
                            )
                          : "***"
                      }}
                    </p>
                    <p class="text-gray-400 text-base">Max Resell</p>
                  </div>
                </div>
              </div>
              <div
                class="pt-5 bg-white w-full flex justify-between items-center"
              >
                <div
                  v-if="
                    (product.variants.length > 0 &&
                      selectedVariant &&
                      selectedVariant.quantity > 0) ||
                    (product.variants.length === 0 &&
                      (product.quantity > 0 || product.isContinueSelling))
                  "
                  class="flex w-full gap-2"
                >
                  <button
                    class="bg-[--primary] text-white p-3 w-full rounded-xl"
                    @click="toggleAddToCart(product)"
                  >
                    Add to cart
                  </button>
                  <button
                    class="border p-3 w-32 rounded-xl flex justify-between"
                  >
                    <button
                      :disabled="!cartProduct"
                      @click="removeFromCart(cartProduct)"
                    >
                      <MinusIcon
                        class="h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                    </button>
                    <span>{{ cartProduct ? cartProduct.qnt : 0 }}</span>
                    <button @click="addToCart(product)">
                      <PlusIcon
                        class="h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                    </button>
                  </button>
                </div>

                <div v-else class="flex w-full gap-2">
                  <button
                    class="bg-gray-200 p-3 rounded text-md mt-2 w-full hover:bg-gray-300 transition-all whitespace-nowrap"
                  >
                    Stock Out&nbsp;
                    <ArrowLongRightIcon
                      class="h-5 w-5 inline text-gray-700"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Products end -->
          <AppPdf
            v-if="showPdf && product.extraImages.length > 0"
            @canceled="showPdf = false"
            :extraImages="product.extraImages"
          />
        </div>
      </div>
    </div>
    <!-- modal -->
  </main>
</template>
<script>
export default {
  name: "ProductDetails",
};
</script>
<script setup>
import analytics from "@/analytics";
import { cloneDeep } from "lodash";
import QRCode from "qrcode";
import { copyText } from "vue3-clipboard";
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  XCircleIcon,
  MinusIcon,
  PlusIcon,
  HeartIcon,
  LinkIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import {
  computed,
  ref,
  watch,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
} from "vue";
import { STORE_PRODUCT_BY_HID } from "@/gql/product";
import {
  STORE_CUSTOMER_REMOVE_FAVORITE,
  STORE_CUSTOMER_ADD_FAVORITE,
  STORE_CUSTOMER_ADD_CART,
} from "@/gql/customer";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import { useCartStore } from "@/stores/cart";
import { useNotificationsStore } from "@/stores/notifications";
import { useBrandStore } from "@/stores/brand";
import { useShopStore } from "@/stores/shop";
import { useCategoryStore } from "@/stores/category";
import { useSubCategoryStore } from "@/stores/subCategory";
import { useRecentStore } from "@/stores/recent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ArrowUturnDownIcon,
  ArrowLongRightIcon,
} from "@heroicons/vue/24/outline";
dayjs.extend(relativeTime);
const { addNotification } = useNotificationsStore();
const ProductList = defineAsyncComponent(() =>
  import("@/components/ProductList.vue")
);
const Editor = defineAsyncComponent(() => import("@/components/Editor.vue"));
const AppPdf = defineAsyncComponent(() => import("@/components/AppPdf.vue"));
const Review = defineAsyncComponent(() => import("@/components/Review.vue"));
const Share = defineAsyncComponent(() => import("@/components/Share.vue"));
const router = useRouter();
const { site, isMobile, deviceType, locale } = storeToRefs(useSiteStore());
const { brands } = storeToRefs(useBrandStore());
const { getBrands } = useBrandStore();
const { customer } = storeToRefs(useCustomerStore());
const showReview = ref(false);
const { recentProducts } = storeToRefs(useRecentStore());

const discount = (sale, regular) => {
  return ((regular - sale) / regular) * 100;
};

if (brands.value.length == 0) {
  getBrands(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
const { categories } = storeToRefs(useCategoryStore());
const { subCategories } = storeToRefs(useSubCategoryStore());
const { shops } = storeToRefs(useShopStore());
const { getShops } = useShopStore();
const { me } = storeToRefs(useMeStore());
const { cart } = storeToRefs(useCartStore());
const { addToCart, removeFromCart } = useCartStore();
if (
  shops.value.length == 0 &&
  (site.value.siteInfo == "hyperlocation" ||
    site.value.siteInfo == "multivendor")
) {
  getShops(site.value.id);
}
const product = ref(null);
const cartProduct = computed(() => {
  if (product.value) {
    let item = cart.value.find(
      (el) =>
        el.id == product.value.id &&
        el.variant.find((a) => a.id == selectedVariant.value?.id)
    );
    return item ? item : null;
  } else {
    return null;
  }
});
const resellPrice = ref(0.0);
const showPdf = ref(false);
const images = ref([]);
const imageIndex = ref(0);
const selectedImage = computed(() => {
  return images.value.find((a) => a.id == imageIndex.value)
    ? images.value.find((a) => a.id == imageIndex.value)?.image
    : "";
});
if (
  router.currentRoute.value.params.id &&
  router.currentRoute.value.name == "ProductDetails"
) {
  const { onResult, loading, error, refetch } = useQuery(STORE_PRODUCT_BY_HID, {
    childId:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.id
        : null,
    percentage:
      site.value.parent.filter((item) => item.isActive).length > 0
        ? site.value.parent
            .filter((item) => item.isActive)
            .map((el) => {
              return {
                site_id: el.id,
                percentage: el.percentage,
                is_fixed: el.isFixed,
                parent_id: el.parentId,
              };
            })
        : null,
    isReseller:
      site.value.siteInfo == "reseller"
        ? true
        : customer.value &&
          customer.value.customerTypes.includes(2) &&
          customer.value.isReseller
        ? true
        : false,
    hid: router.currentRoute.value.params.id,
  });
  onResult((queryResult) => {
    product.value = cloneDeep(queryResult.data.storeProductByHid);
    images.value = [
      ...new Set(
        [
          { id: 0, image: product.value.image },
          ...product.value.images.filter((v) => isValidImageLink(v.image)),
        ].map((v) => {
          return {
            id: v.id,
            image: v.image,
          };
        })
      ),
    ];
    toAnalytics(product.value);
    // variants
    variantGroups.value = {};
    variantGroup.value = [];
    product.value.variants.forEach((item) => {
      item.variant.forEach((variant) => {
        const key = variant.key;
        const value = variant.value;

        if (!variantGroups.value[key]) {
          variantGroups.value[key] = { title: key, items: [] };
        }

        if (!variantGroups.value[key].items.includes(value)) {
          variantGroups.value[key].items.push(value);
        }
      });
    });
    if (cartProduct.value && cartProduct.value.variant.length > 0) {
      selectedVariant.value = cartProduct.value.variant.find(
        (a) => a.quantity > 0
      );
      variantGroup.value = cloneDeep(selectedVariant.value.variant);
    } else if (product.value.variants.length > 0) {
      selectedVariant.value = product.value.variants.find(
        (a) => a.quantity > 0
      );
      variantGroup.value = cloneDeep(selectedVariant.value.variant);
    }
    if (selectedVariant.value) {
      imageIndex.value = selectedVariant.value.imageIndex;
    }
    // end variants
    // add to recent products
    const item = {
      hid: product.value.hid,
      id: product.value.id,
      slug: product.value.slug,
      image: product.value.image,
      title: product.value.title,
      translation: product.value.translation,
      price: product.value.price,
      comparePrice: product.value.comparePrice,
    };
    if (recentProducts.value.length > 0) {
      let found = recentProducts.value.find((content) => content.id == item.id);
      if (!found) {
        var items = [item];
        for (let index in recentProducts.value) {
          if (index < 6) {
            items.push(recentProducts.value[index]);
          }
        }
        recentProducts.value = items;
      }
    } else {
      var items = [item];
      recentProducts.value = items;
    }
  });
  watch(router.currentRoute, () => {
    if (
      router.currentRoute.value.params.id &&
      router.currentRoute.value.name == "ProductDetails"
    ) {
      refetch({
        childId:
          site.value.parent.filter((item) => item.isActive).length > 0
            ? site.value.id
            : null,
        percentage:
          site.value.parent.filter((item) => item.isActive).length > 0
            ? site.value.parent
                .filter((item) => item.isActive)
                .map((el) => {
                  return {
                    site_id: el.id,
                    percentage: el.percentage,
                    is_fixed: el.isFixed,
                    parent_id: el.parentId,
                  };
                })
            : null,
        hid: router.currentRoute.value.params.id,
      });
    }
  });
}

const isValidImageLink = (link) => {
  return /\.[a-zA-Z0-9]+$/.test(link);
};
const isFull = ref(false);
const toggleFull = () => {
  isFull.value = !isFull.value;
};
const isEmi = ref(false);
const toggleAddToCart = (product) => {
  let index = selectedVariant.value ? selectedVariant.value.id : 0;
  if (cart.value.filter((v) => v.productType == 4).length > 0) {
    router.push(`/checkout/`);
  } else if (
    !isFull.value &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    isFull.value = !isFull.value;
  } else {
    // resell price check
    if (
      site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller)
    ) {
      if (
        !(
          resellPrice.value >= product.minResellPrice &&
          resellPrice.value <= product.maxResellPrice
        )
      ) {
        addNotification({
          title: "Product info",
          subTitle: "Review resell price",
        });
        return false;
      }
    }
    var item = {
      affiliateCommission: product.affiliateCommission,
      cashback: product.cashback,
      comparePrice: product.comparePrice,
      cost: product.cost,
      currency: product.currency,
      deliveryCharge: product.deliveryCharge,
      emiDuration: product.emiDuration ? product.emiDuration : 0,
      emiInterest: product.emiInterest ? product.emiInterest : 0,
      emiPrice: product.emiPrice,
      hid: product.hid,
      id: product.id,
      index: index,
      isContinueSelling: product.isContinueSelling,
      isEmi: isEmi.value,
      maxOrder: product.maxOrder,
      maxResellPrice: product.maxResellPrice,
      minOrder: minOrder.value,
      price: !isEmi.value ? price.value : product.emiPrice,
      basePrice: product.price,
      basecomparePrice: product.comparePrice,
      cost: product.cost,
      baseWholesalePrice: product.wholesalePrice,
      productType: product.productType,
      quantity: selectedVariant.value
        ? selectedVariant.value.quantity
        : product.quantity,
      resellPrice: resellPrice.value ? resellPrice.value : price.value,
      rewardPoints: product.rewardPoints,
      sku: product.sku,
      slug: product.slug,
      thumbnail: selectedImage.value ? selectedImage.value : product.thumbnail,
      title: product.title,
      translation: product.translation,
      unit: product.unit,
      unitType: product.unitType,
      variant: cloneDeep(selectedVariant.value ? [selectedVariant.value] : []),
      variants: cloneDeep(product.variants ? product.variants : []),
      vat: product.vat,
      weight: product.weight,
    };
    addToCart(cloneDeep(item));
    toAnalyticsAddCart(product);
    toCustomerCart(product);
    isFull.value = false;
  }
};
const toggleAddToBuy = (product) => {
  let index = selectedVariant.value ? selectedVariant.value.id : 0;
  if (cart.value.filter((v) => v.productType == 4).length > 0) {
    router.push(`/checkout/`);
  } else if (
    !isFull.value &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    isFull.value = !isFull.value;
  } else {
    // resell price check
    if (
      site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller)
    ) {
      if (
        !(
          resellPrice.value >= product.minResellPrice &&
          resellPrice.value <= product.maxResellPrice
        )
      ) {
        addNotification({
          title: "Product info",
          subTitle: "Review resell price",
        });
        return false;
      }
    }
    var item = {
      affiliateCommission: product.affiliateCommission,
      cashback: product.cashback,
      comparePrice: product.comparePrice,
      cost: product.cost,
      currency: product.currency,
      deliveryCharge: product.deliveryCharge,
      emiDuration: product.emiDuration ? product.emiDuration : 0,
      emiInterest: product.emiInterest ? product.emiInterest : 0,
      emiPrice: product.emiPrice,
      hid: product.hid,
      id: product.id,
      index: index,
      isContinueSelling: product.isContinueSelling,
      isEmi: false,
      maxOrder: product.maxOrder,
      maxResellPrice: product.maxResellPrice,
      minOrder: minOrder.value,
      price: price.value,
      basePrice: product.price,
      basecomparePrice: product.comparePrice,
      cost: product.cost,
      baseWholesalePrice: product.wholesalePrice,
      productType: product.productType,
      quantity: selectedVariant.value
        ? selectedVariant.value.quantity
        : product.quantity,
      resellPrice: resellPrice.value ? resellPrice.value : price.value,
      rewardPoints: product.rewardPoints,
      sku: product.sku,
      slug: product.slug,
      thumbnail: selectedImage.value ? selectedImage.value : product.thumbnail,
      title: product.title,
      translation: product.translation,
      unit: product.unit,
      unitType: product.unitType,
      variant: cloneDeep(selectedVariant.value ? [selectedVariant.value] : []),
      variants: cloneDeep(product.variants ? product.variants : []),
      vat: product.vat,
      weight: product.weight,
    };
    addToCart(cloneDeep(item));
    toAnalyticsAddCart(product);
    toCustomerCart(product);
    isFull.value = false;
    router.push("/checkout/");
  }
};
const toCustomerCart = (item) => {
  if (customer.id) {
    let cartProduct = cart.find((el) => el.id == item.id);
    if (cartProduct) {
      let data = {
        id: cartProduct.id,
        price: cartProduct.price,
        quantity: cartProduct.qnt,
        resellPrice: 0.0,
        shopId: null,
        title: cartProduct.title,
        variant: cartProduct.variant,
        variantId: cartProduct.variantId,
      };
      customerAddCart(data);
    }
  }
};
const customerAddCart = async (data) => {
  try {
    await mutate({
      mutation: STORE_CUSTOMER_ADD_CART,
      variables: {
        customerId: customer.id,
        id: data.id,
        price: data.price,
        quantity: data.quantity,
        resellPrice: data.resellPrice,
        shopId: data.shopId,
        title: data.title,
      },
    });
  } catch (error) {
    if (error.graphQLErrors[0].extensions) {
      error.value = error.graphQLErrors[0].extensions.reason;
    } else {
      error.value = error.message.replace("GraphQL error:", "");
    }
    var notification = {
      type: "error",
      text: error.value,
    };
    store.commit("SET_NOTIFICATION", notification);
  }
};

const getBrand = (ids) => {
  if (ids.length > 0) {
    return brands.value.find((v) => v.id == ids[0])
      ? brands.value.find((v) => v.id == ids[0]).title
      : "";
  }
};

// variant setting
const selectedVariant = ref(null);
const variantGroups = ref({});
const variantGroup = ref([]);
const selectVariantGroup = (v) => {
  let found = variantGroup.value.find((a) => a.key == v.key);
  if (found) {
    found.value = cloneDeep(v.value);
  } else {
    variantGroup.value.push(cloneDeep(v));
  }
  selectedVariant.value = product.value.variants.find((a) => {
    // Check if all properties in variant are present in variantGroup.value
    return variantGroup.value.every((groupItem) => {
      const matchingVariantProperty = a.variant.find(
        (variantItem) =>
          variantItem.key === groupItem.key &&
          variantItem.value === groupItem.value
      );
      return matchingVariantProperty !== undefined;
    });
  });

  const imageIndexdata = selectedVariant.value
    ? selectedVariant.value.imageIndex
    : 0;
  if (images.value[imageIndexdata]) {
    imageIndex.value = imageIndexdata;
  }
};

// variants
const selectedVariants = ref([]);
const variants = computed(() => {
  if (product.value) {
    if (selectedVariants.value.length > 0) {
      return selectedVariants.value;
    } else if (cartProduct.value) {
      return cartProduct.value.variant;
    } else {
      const defaultVariantsMap = new Map();
      // Iterate through the variants to find and set default variants
      product.value.variants.forEach((variant) => {
        const { variantType } = variant;
        if (!defaultVariantsMap.has(variantType)) {
          defaultVariantsMap.set(variantType, variant);
        }
      });
      return Array.from(defaultVariantsMap.values());
    }
  } else {
    return [];
  }
});
const price = computed(() => {
  var price = 0.0;
  if (customer.value && customer.value.isWholesale) {
    if (product.value.wholesale.length > 0) {
      const sortedArray = product.value.wholesale.sort(
        (a, b) => a.price - b.price
      );
      price =
        sortedArray[0].price > 0 ? sortedArray[0].price : product.value.price;
    } else {
      price =
        product.value.wholesalePrice > 0
          ? product.value.wholesalePrice
          : product.value.price;
    }
  } else if (customer.value && customer.value.isReseller) {
    price =
      product.value.wholesalePrice > 0
        ? product.value.wholesalePrice
        : product.value.price;
  } else if (product.value.isFlash) {
    price =
      product.value.flashPrice > 0
        ? product.value.flashPrice
        : product.value.price;
  } else {
    price = product.value.price;
  }
  if (selectedVariant.value) {
    if (product.value.wholesale.length > 0) {
      price += selectedVariant.value.wholesalePrice;
    } else if (customer.value && customer.value.isReseller) {
      price += selectedVariant.value.wholesalePrice;
    } else {
      price += selectedVariant.value.price;
    }
  }
  return price;
});
const minOrder = computed(() => {
  if (customer.value && customer.value.isWholesale) {
    if (product.value.wholesale.length > 0) {
      const sortedArray = product.value.wholesale.sort(
        (a, b) => a.price - b.price
      );
      return sortedArray[0].minOrder;
    } else {
      return product.value.minOrder;
    }
  } else {
    return product.value.minOrder;
  }
});
const downloadImage = async (product) => {
  for (let url of images.value.map((a) => a.image)) {
    var name = product.slug + "-" + 1;
    var extension = url.split(".").pop();
    try {
      const response = await fetch(url + "?nocros", {
        mode: "cors",
        headers: {
          Origin: window.location.href,
        },
      })
        .then(async (response) => response.blob())
        .then(async (blob) => {
          addNotification(
            { title: "Product info", subTitle: "Image downloading...." },
            "success"
          );
          const newBlob = new Blob([blob], {
            type: "image/" + extension,
          });
          const image = new Image();
          image.src = URL.createObjectURL(newBlob);
          // for qrcode
          const qrCodeText = product.sku;
          const qrCodeSize = 50; // Size of the QR code
          // Generate the QR code as a data URL
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText, {
            width: qrCodeSize,
            margin: 1,
          });
          ///// end qrcode
          // for barcode
          // const canvas = document.createElement("canvas");
          // JsBarcode(canvas, product.sku, {
          //   format: "CODE128", // Barcode format, you can change it as per your requirement
          //   //displayValue: false, // Do not display the value below the barcode
          //   fontSize: 10,
          //   height: 15,
          //   width: 2,
          //   font: "system-ui",
          //   margin: 10,
          //   textAlign: "right",
          // });
          // const barcodeImage = new Image();
          // barcodeImage.src = canvas.toDataURL();
          // Promise.all([loadImage(image), loadImage(barcodeImage)]).then(() => {
          //   const canvas = document.createElement("canvas");
          //   canvas.width = image.width;
          //   canvas.height = image.height;

          //   const context = canvas.getContext("2d");
          //   context.drawImage(image, 0, 0);
          //   context.drawImage(
          //     barcodeImage,
          //     image.width - barcodeImage.width - 10,
          //     image.height - barcodeImage.height - 10
          //   );

          //   // Set the final image as the data URL of the modified image
          //   canvas.toBlob((blob) => {
          //     const newBlob = new File([blob], name, { type: "image/jpeg" });

          //                 if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //           window.navigator.msSaveOrOpenBlob(newBlob);
          //         } else {
          //           // For other browsers: create a link pointing to the ObjectURL containing the blob.
          //           const objUrl = window.URL.createObjectURL(newBlob);
          //           if (window.location.host.includes("bponi")) {
          //             var win = window.open(objUrl, "_blank");
          //             win.focus();
          //           } else {
          //             let link = document.createElement("a");
          //             link.href = objUrl;
          //             link.download = name + "." + extension;
          //             link.click();
          //             // For Firefox it is necessary to delay revoking the ObjectURL.
          //             setTimeout(() => {
          //               window.URL.revokeObjectURL(objUrl);
          //             }, 250);
          //           }
          //         }

          //   }, "image/jpeg");
          // });
          // // Function to load an image and return a Promise
          // function loadImage(image) {
          //   return new Promise((resolve, reject) => {
          //     image.onload = resolve;
          //     image.onerror = reject;
          //   });
          // }
          image.onload = async (f) => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            // Draw the original image on the canvas
            context.drawImage(image, 0, 0);
            const qrCodeImage = new Image();
            qrCodeImage.src = qrCodeDataUrl;
            // Wait for the QR code image to load
            qrCodeImage.onload = () => {
              // Draw the QR code on the image
              context.drawImage(
                qrCodeImage,
                image.width - qrCodeSize - 10, // X-coordinate
                image.height - qrCodeSize - 5, // Y-coordinate
                qrCodeSize,
                qrCodeSize
              );
              // context.font = "10px Arial";
              // context.fillStyle = "white"; // Set background color to white
              // const text = "bponi.com";
              // const textWidth = context.measureText(text).width;
              // context.fillRect(
              //   image.width - textWidth - 14,
              //   image.height - 12,
              //   textWidth + 4,
              //   40
              // );

              // // Draw a rectangle as the text background

              // context.fillStyle = "black"; // Set text color to black
              // context.fillText(
              //   text,
              //   image.width - textWidth - 12,
              //   image.height - 3
              // );
              // Set the final image as the data URL of the modified image
              const dataURL = canvas.toDataURL("image/jpeg");
              const base64Data = dataURL.split(",")[1];
              const binaryData = window.atob(base64Data);
              const dataArray = new Uint8Array(binaryData.length);
              for (let i = 0; i < binaryData.length; i++) {
                dataArray[i] = binaryData.charCodeAt(i);
              }
              const blob = new Blob([dataArray], { type: "image/jpeg" });
              const newBlob = new File([blob], "fileName", {
                type: "image/jpeg",
              });
              // const reader = new FileReader();
              // reader.onload = () => {
              //   file.value = reader.result;
              // };
              // reader.readAsDataURL(f);
              //saveAs(newBlob, name);
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
              } else {
                // For other browsers: create a link pointing to the ObjectURL containing the blob.
                const objUrl = window.URL.createObjectURL(newBlob);
                if (window.location.host.includes("bponi")) {
                  const reader = new FileReader();

                  // Define the onload event for the reader.
                  reader.onload = function (event) {
                    const base64String = event.target.result;
                    if (window.flutter_inappwebview) {
                      window.flutter_inappwebview.callHandler(
                        "Download",
                        base64String
                      );
                    }
                  };

                  // Read the Blob data as Data URL, which will give us the Base64 representation.
                  reader.readAsDataURL(newBlob);
                } else {
                  let link = document.createElement("a");
                  link.href = objUrl;
                  link.download = name + "." + extension;
                  link.click();
                  // For Firefox it is necessary to delay revoking the ObjectURL.
                  setTimeout(() => {
                    window.URL.revokeObjectURL(objUrl);
                  }, 250);
                }
              }
            };
          };
        });
    } catch (e) {
      window.location.reload();
    }
  }
};
const productDescription = ref(null);
const copyDetails = () => {
  let html = productDescription.value.$el.innerHTML;
  let tmp = document.createElement("DIV");
  tmp.setAttribute("style", "white-space: pre;");
  tmp.innerHTML = html
    .replace(/(<([^>]+)>)/gi, "\n")
    .replace(/(\r\n|\r|\n){2,}/g, "$1\n");
  var text = tmp.textContent || tmp.innerText || "";
  copyText(text.trim());
};
const productLink = ref(false);
const copyLink = () => {
  copyText(site.value.domain + router.currentRoute.value.fullPath);
};
const uniqueShops = (array) => {
  const seenShops = new Set();
  return array.reduce((unique, shop) => {
    if (!seenShops.has(shop)) {
      seenShops.add(shop);
      unique.push(shop);
    }
    return unique;
  }, []);
};
const currentUrl = () => {
  return "https://" + site.value.domain + window.location.pathname;
};
const toggleFavorite = async (product, isFavorite) => {
  if (me.value.id && customer.value && customer.value.id) {
    if (isFavorite) {
      const { mutate, loading, error } = useMutation(
        STORE_CUSTOMER_REMOVE_FAVORITE,
        {
          variables: {
            userId: me.value.id,
            customerId: customer.value.id,
            productId: product.id,
          },
        }
      );
      try {
        const response = await mutate();
        if (response.data.selfStoreCustomerRemoveFavorite) {
          customer.value.favorite = customer.value.favorite.filter(
            (number) => number !== product.id
          );
        }
      } catch (error) {}
    } else {
      const { mutate, loading, error } = useMutation(
        STORE_CUSTOMER_ADD_FAVORITE,
        {
          variables: {
            userId: me.value.id,
            customerId: customer.value.id,
            productId: product.id,
          },
        }
      );
      try {
        const response = await mutate();
        if (response.data.selfStoreCustomerAddFavorite) {
          customer.value.favorite.push(product.id);
        }
      } catch (error) {
        addNotification(
          { title: "Order info", subTitle: error.message },
          "error"
        );
      }
    }
  } else {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};

const isFavorite = (item) => {
  if (customer.value) {
    let found = customer.value.favorite.find((el) => el == item.id);
    if (found) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
const copyAffiliateUrl = (product) => {
  const url = `https://${site.value.domain}/product/${product.slug}/${product.hid}/?refer=${me.value.referCode}`;
  copyText(url);
  addNotification(
    { title: "Product info", subTitle: "Successfully copied data." },
    "success"
  );
};

const toAnalyticsAddCart = (product) => {
  analytics({
    siteId: site.value.id,
  }).track("itemPurchased", {
    price: 11,
    sku: "1234",
  });
  // f
  // facebook pixel track AddToCart
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.hid],
      content_name: product.title,
      content_type: "product",
      currency: product.currency,
      value: price.value,
      num_items: 1,
      source: `https://${site.value.domain}`,
      contents: [
        {
          id: product.hid,
          quantity: product.quantity,
          item_price: price.value,
        },
      ],
    });
  }
  // end facebook pixel track AddToCart
  // google analytics track add_to_cart
  if (window.gtag) {
    gtag("event", "add_to_cart", {
      currency: product.currency,
      value: price.value,
      items: [
        {
          item_id: product.hid,
          item_name: product.title,
          price: price.value,
          quantity: 1,
        },
      ],
    });
  }
  // end google analytics track add_to_cart
  // google analytics track view_item
  if (window.dataLayer) {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: product.currency,
        value: price.value,
        items: [
          {
            item_id: product.hid,
            item_name: product.title,
            price: price.value,
            quantity: 1,
          },
        ],
      },
    });
  }
  // end google analytics track view_item
};
const toAnalytics = (product) => {
  analytics({
    siteId: site.value.id,
  }).track("itemPurchased", {
    price: 11,
    sku: "1234",
  });
  // facebook pixel track ViewContent
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.hid],
      content_name: product.title,
      content_type: "product",
      value: price.value,
      currency: product.currency,
      source: site.value.domain,
    });
  }
  // end facebook pixel track ViewContent
  // google analytics track view_item
  if (window.gtag) {
    gtag("event", "view_item", {
      currency: product.currency,
      value: price.value,
      items: [
        {
          item_id: product.hid,
          item_name: product.title,
          price: price.value,
          quantity: 1,
        },
      ],
    });
  }
  // end google analytics track view_item
  // google analytics track view_item
  if (window.dataLayer) {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "view_item",
      ecommerce: {
        currency: product.currency,
        value: price.value,
        items: [
          {
            item_id: product.hid,
            item_name: product.title,
            price: price.value,
            quantity: 1,
          },
        ],
      },
    });
  }
  // end google analytics track view_item
  // schema data
  let data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      author: "Bponi",
      contentLocation: site.value.street,
      contentUrl: product.image,
      datePublished: product.createdAt,
      description: product.metaDescription,
      name: product.title,
      license: "https://www.bponi.com/license#image",
      acquireLicensePage: "https://www.bponi.com/license/how-to-use-images",
      copyrightHolder: {
        "@context": "http://schema.org",
        "@type": "Organization",
        name: "Bponi",
        description: "Make Your Business More Profitable.",
        image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
        logo: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
        brand: "Bponi",
        department: "Internet",
        email: "contact@bponi.com",
        url: "https://www.bponi.com",
        sameAs: [
          "https://twitter.com/BponiHQ",
          "https://facebook.com/BponiHQ/",
          "http://youtube.com/bponi",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "Subhash Sadan, Champadali More, 22, Jessore Rd, Champadali, Barasat, Kolkata, West Bengal 700124",
          addressLocality: "Kolkata",
          postalCode: "700124",
          addressCountry: "India",
        },
        founder: {
          "@type": "Person",
          name: "Mazharul Islam",
          email: "mailto:mazharul@bponi.com",
          image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
          url: "https://www.bponi.com",
          birthDate: "1999-11-23",
          birthPlace:
            "Subhash Sadan, Champadali More, 22, Jessore Rd, Champadali, Barasat, Kolkata, West Bengal 700124",
          gender: "Male",
          nationality: "India",
          owns: "Bponi",
        },
        foundingDate: "2019-04-31",
        foundingLocation: "Kolkata, India",
        legalName: "Bponi",
        numberOfEmployees: "30",
        slogan: "Empower individual",
      },
    },
    description: product.metaDescription,
    url: `https://${site.value.domain}`,
    brand: {
      "@context": "https://schema.org",
      "@context": "http://schema.org",
      "@type": "Organization",
      name: "Bponi",
      description: "Make Your Business More Profitable.",
      image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
      logo: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
      brand: "Bponi",
      department: "Internet",
      email: "contact@bponi.com",
      url: "https://www.bponi.com",
      sameAs: [
        "https://twitter.com/BponiHQ",
        "https://facebook.com/BponiHQ/",
        "http://youtube.com/bponi",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Subhash Sadan, Champadali More, 22, Jessore Rd, Champadali, Barasat, Kolkata, West Bengal 700124",
        addressLocality: "Kolkata",
        postalCode: "700124",
        addressCountry: "India",
      },
      founder: {
        "@type": "Person",
        name: "Mazharul Islam",
        email: "mailto:mazharul@bponi.com",
        image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/logo.png",
        url: "https://www.bponi.com",
        birthDate: "1999-11-23",
        birthPlace:
          "Subhash Sadan, Champadali More, 22, Jessore Rd, Champadali, Barasat, Kolkata, West Bengal 700124",
        gender: "Male",
        nationality: "India",
        owns: "Bponi",
      },
      foundingDate: "2019-04-31",
      foundingLocation: "Kolkata, India",
      legalName: "Bponi",
      numberOfEmployees: "30",
      slogan: "Empower individual",
    },
    identifier: "Bponi",
    sku: product.sku,
    productID: product.barcode,
    gtin8: product.barcode,
    aggregateRating: {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      reviewCount: parseInt((Math.random() * (50 - 10) + 10).toFixed(0)),
      ratingValue: parseInt((Math.random() * (5 - 3) + 3).toFixed(1)),
    },
    offers: {
      "@context": "https://schema.org",
      "@type": "Offer",
      url: `https://${site.value.domain}`,
      availability: "https://schema.org/InStock",
      priceCurrency: product.currency,
      itemCondition: "https://schema.org/NewCondition",
      price: price.value,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
      seller: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.value.title,
        url: site.value.domain,
      },
    },
    review: {
      "@context": "https://schema.org",
      "@type": "Review",
      author: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Bponi",
      },
      reviewRating: {
        "@context": "https://schema.org",
        "@type": "Rating",
        worstRating: 1,
        ratingValue: parseInt((Math.random() * (5 - 3) + 3).toFixed(1)),
        bestRating: 5,
      },
    },
  };
  document.title = product.title + " | " + site.value.title;
  var recaptchaScript = window.document.createElement("script");
  recaptchaScript.setAttribute("type", "application/ld+json");
  recaptchaScript.innerHTML = JSON.stringify(data);
  window.document.body.appendChild(recaptchaScript);
};

const scrollPosition = ref(0);
const productVisible = ref(true);
const handleScroll = () => {
  scrollPosition.value = window.scrollY;
};
// Watch for changes in the scroll position
watch(scrollPosition, (newScrollPosition) => {
  // Adjust the scroll threshold as needed
  if (newScrollPosition < 800) {
    productVisible.value = true;
  } else {
    productVisible.value = false;
  }
});
onMounted(() => {
  // Add event listener for the scroll event
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  // Remove event listener for the scroll event
  window.removeEventListener("scroll", handleScroll);
});
</script>
