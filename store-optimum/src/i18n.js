// i18n.js
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

const en = {
  checkout: {
    account: "Account",
    address: "Address",
    averageDeliveryTime: "Average delivery time",
    back: "Back",
    bag: "Bag",
    categories: "Categories",
    confirm: "Confirm",
    continue: "Continue",
    copy: "Copy",
    couponsAndOffers: "Coupons and offers",
    customLogisticsExtraCharge: "Your delivery charge (if any)",
    customerAddress: "Customer address",
    deliveryCompany: "Delivery method",
    deliveryCost: "Delivery cost",
    deliveryExtraFee: "Delivery extra fee",
    deliveryFee: "Delivery fee",
    deliveryOption: "Delivery option",
    deliveryTime: "Preferred date time",
    discount: "Discount",
    discountName: "Discount name",
    enterAddress: "Enter address",
    enterName: "Enter name",
    enterNote: "Enter details note",
    enterPhone: "Enter phone",
    free: "0.0",
    grandTotal: "Grand total",
    inclusiveTaxes: "Inclusive of all taxes",
    itemTotal: "Item total",
    items: "items",
    note: "Note",
    off: "off",
    offer: "Offer",
    ourDeliveryCharge: "Our delivery charge",
    pay: "Pay",
    payment: "Payment",
    paymentFee: "Payment fee",
    productPrice: "Bill",
    profitSoFar: "profited on this order",
    qty: "Quantity",
    remove: "Remove",
    resell: "Resell",
    resellPrice: "Resell price",
    resellerAdvanceCollect: "Advance payment collected (if any)",
    resellerAdvanceCollected: "Advance payment collected",
    save: "Save",
    savedSoFar: "saved so far on this order",
    selectArea: "Select sub city",
    selectCity: "Select district",
    selectSubCity: "Select city",
    shoppingBag: "Shopping bag",
    step: "Step",
    total: "Total product",
    totalCashback: "Total cashback",
    totalPayable: "Total payable",
    totalRewardPoints: "Total reward points",
    viewPriceDetails: "View price details",
    with: "with",
    youSaved: "You saved",
    yourDeliveryCharge: "Your delivery charge",
    yes: "Yes",
    yesDetails: "Yes, I have",
    received: "Yes received",
    no: "No",
    noDetails: "No, I don't have",
    due: "Not received",
    isCustomLogisticsExtraCharge: "Do you have custom delivery charge?",
    isResellerAdvanceCollect: "Did you received any advance payment?",
  },
  nav: {
    home: "Home",
    community: "Community",
    writer: "Writer",
    subject: "Subject",
    subjects: "Subjects",
    publisher: "Publisher",
    bookfair: "Bookfair",
    institutionalOrder: "Institutional Order",
    blog: "Blog",
    category: "Category",
    categories: "Categories",
    subCategory: "Sub Category",
    subSubCategory: "Sub Sub Category",
    newProduct: "New Product",
    flashSale: "Flash Sale",
    brand: "Brand",
    collection: "Collection",
    campaign: "Campaign",
    cart: "Cart",
    Order: "order",
    profile: "Profile",
    logIn: "Log In",
    logOut: "Log Out",
    register: "Register",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    wishlist: "Wishlist"
  },
  content: {
    newArrival: "New Arrival",
    newArrivalBook: "New Arrival Book",
    allProducts: "All Products",
    seeMore: "See More",
    popular: "Popular",
    popularSubject: "Popular Subject",
    popularCategory: "Popular Category",
    essentialLink: "Essential Link",
    contact: "Contact",
    bestDeal: "Today's Best Deal",
    allOffers: "All Offers",
    noOffer: "No Offer Available",
    addToCart: "Add to cart",
    buyNow: "Buy Now"
  }
};

const bn = JSON.parse(JSON.stringify(en));

const messages = {
  en: en,
  bn: bn,
};

const i18n = createI18n({
  legacy: false,
  locale: "bn",
  fallbackLocale: "bn",
  messages,
});

// export function changeLocale(locale) {
//   i18n.global.locale.value = locale;
//   console.log(i18n.global.locale.value);
  
// }

export function setupI18n(app) {
  app.use(i18n);
}
