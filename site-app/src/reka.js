import { ref, h } from "vue";
// add reka
import { Reka } from "@rekajs/core";
import * as t from "@rekajs/types";
import confetti from "canvas-confetti";
import Icon from "@/views/editor/components/Icon.vue";
import { storeToRefs } from "pinia";
import { createOrder } from "@/utils/order";
import parsePhoneNumber from "libphonenumber-js/max";

const reka = ref(
  Reka.create({
    kinds: {
      Color: {
        validate(field) {
          return field.string((value) => value.startsWith("#"));
        },
      },
    },
    externals: {
      components: [
        // t.externalComponent({
        //   name: 'Animation',
        //   render: () => {
        //     return <UserAnimation />;
        //   },
        // }),
        t.externalComponent({
          name: "Icon",
          props: [
            t.componentProp({
              name: "name",
            }),
          ],
          render: (props) =>
            h(Icon, {
              name: props.name,
              className: props.className,
            }),
        }),
      ],
      states: [
        t.externalState({
          name: "scrollTop",
          init: 0,
        }),
        t.externalState({
          name: "myString",
          init: "Hello from External Variable",
        }),
        t.externalState({
          name: "products",
          init: [
            {
              name: "Interesting Products111",
              image: "/images/pawel-olek-1.png",
              description:
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco",
            },
            {
              name: "Hello World",
              image: "/images/pawel-olek-2.png",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
            },
          ],
        }),
      ],
      functions: (self) => {
        return [
          t.externalFunc({
            name: "confetti",
            func: () => {
              confetti();
            },
          }),
          t.externalFunc({
            name: "getScrollTop",
            func: () => {
              return self.getExternalState("scrollTop");
            },
          }),
          t.externalFunc({
            name: "getProducts",
            func: (siteId) => {
              // const { products } = storeToRefs(useProductStore());
              // const { getProducts } = useProductStore();
              // if (products.value.length == 0) {
              //   getProducts(13413);
              // }
              return [];
            },
          }),
          t.externalFunc({
            name: "createStoreOrder",
            func: async (siteId, customer, products) => {
              console.log(siteId, customer, products);
              const result = await createOrder(siteId, customer, products);
              if (result.status == "success") {
                location.replace(
                  location.href + "success/?message=" + result.message
                );
              } else {
                location.replace(
                  location.href + "error/?message=" + result.message
                );
              }
            },
          }),
          t.externalFunc({
            name: "parseInt",
            func: (number) => {
              return parseInt(number) ? parseInt(number) : 0;
            },
          }),
          t.externalFunc({
            name: "validatePhone",
            func: (number) => {
              const phone = number.toString();
              const countryCode = "BD";

              try {
                const parsedPhoneNumber = parsePhoneNumber(phone, countryCode);
                if (!parsedPhoneNumber.isValid()) {
                  console.log("Invalid phone number");
                  return 0;
                } else {
                  return parseInt(parsedPhoneNumber.number);
                }
              } catch (error) {
                return 0;
              }
            },
          }),
        ];
      },
    },
    extensions: [],
  })
);

export default reka;
