<template>
  <div class="relative flex-1">
    <div class="absolute w-full h-full top-0 flex flex-col">
      <div
        class="flex px-5 py-1.5 flex-col border-b border-solid border-outline setting-section last:border-none flex-1"
      >
        <div class="flex relative items-center cursor-pointer mt-2 mb-1">
          <header class="flex flex-1 items-center">
            <span class="text-slate-800 text-sm font-medium flex items-center"
              >Components</span
            ><button
              class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3 ml-1"
            >
              <ChevronDownIcon class="h-4 w-4" />
            </button>
          </header>
          <button
            class="inline-flex [&amp;>svg]:pointer-events-inherit cursor-pointer items-center border border-solid border-transparent justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-transparent text-gray-500 hover:bg-black/5 hover:text-neutral-900 text-xs py-1.5 px-1.5 rounded-md [&amp;>svg]:w-3 [&amp;>svg]:h-3"
          >
            <PlusIcon class="h-4 w-4" />
          </button>
        </div>
        <section
          class="-mx-4"
          style="opacity: 1; height: auto; overflow: unset"
        >
          <div class="py-2 pb-4 px-4 h-full">
            <div class="flex h-full flex-col">
              <div class="flex-1">
                <div
                  @click="selectComponent('header')"
                  class="group px-3 py-2 my-0.5 rounded-md text-xs leading-1 group cursor-pointer flex items-center [&amp;>svg]:w-3.5 [&amp;>svg]:h-3.5 [&amp;>button]:opacity-0 bg-primary/10 text-primary"
                >
                  <CubeTransparentIcon class="h-4 w-4 mr-3" />
                  <span class="flex-1">Header</span>
                  <ChevronRightIcon class="h-4 w-4" />
                </div>
                <div
                  @click="selectComponent('section')"
                  class="group px-3 py-2 my-0.5 rounded-md text-xs leading-1 group cursor-pointer flex items-center [&amp;>svg]:w-3.5 [&amp;>svg]:h-3.5 [&amp;>button]:opacity-0 text-slate-700 hover:bg-black/5 hover:text-slate-900"
                >
                  <CubeTransparentIcon class="h-4 w-4 mr-3" /><span
                    class="flex-1"
                    >Section</span
                  ><ChevronRightIcon class="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
import { Parser } from "@rekajs/parser";
import {
  ChevronDownIcon,
  PlusIcon,
  ChevronRightIcon,
  CubeTransparentIcon,
} from "@heroicons/vue/24/outline";

const emit = defineEmits(["onSelect"]);
const header = ref({
  type: "Program",
  id: "xJlB9rThOjPCJIoNbNgfP",
  meta: {},
  globals: [],
  components: [
    {
      type: "RekaComponent",
      id: "2qZpj1rxpdYtxJrTUNF7L",
      meta: {},
      name: "Header",
      template: {
        type: "TagTemplate",
        id: "RSZCZ69SdTB6WsF8ArT22",
        meta: {},
        props: {
          style: {
            type: "ObjectExpression",
            id: "OeZxd8WNAISVuyVYj2TWX",
            meta: {},
            properties: {
              backgroundImage: {
                type: "Literal",
                id: "dkIeNxdpL1N3G6qKbX0v0",
                meta: {},
                value:
                  "linear-gradient(180deg, #FFB7B7 0%, #727272 100%), radial-gradient(60.91% 100% at 50% 0%, #FFD1D1 0%, #260000 100%), linear-gradient(127.43deg, #00FFFF 0%, #FFFFFF 100%), radial-gradient(100.22% 100% at 70.57% 0%, #FF0000 0%, #00FFE0 100%), linear-gradient(64.82deg, #DBFF00 0%, #3300FF 100%)",
              },
              backgroundBlendMode: {
                type: "Literal",
                id: "BkCMa0oHNVQFHOZDHOhjk",
                meta: {},
                value: "screen, overlay, color-burn, color-dodge, normal",
              },
            },
          },
          className: {
            type: "Literal",
            id: "6Dc6vkQSZwkVn9E2XiCEU",
            meta: {},
            value:
              "text-neutral-800 w-full h-full flex flex-col justify-center",
          },
        },
        if: null,
        each: null,
        classList: null,
        children: [
          {
            type: "TagTemplate",
            id: "CmTNrVGUCLEAtMtL6nxTp",
            meta: {},
            props: {
              className: {
                type: "Literal",
                id: "OCFh2isoDfbyavvzx8G23",
                meta: {},
                value:
                  "px-8 max-w-2xl m-auto w-full text-center flex flex-col items-center",
              },
            },
            if: null,
            each: null,
            classList: null,
            children: [
              {
                type: "TagTemplate",
                id: "haH1n9cnBlmrq7V3oKcmd",
                meta: {},
                props: {
                  className: {
                    type: "Literal",
                    id: "U6LgSQ8QnHsT167a5lruL",
                    meta: {},
                    value: "text-6xl mb-4 font-bold tracking-tighter",
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [
                  {
                    type: "TagTemplate",
                    id: "sy14FKpw9gHVKeu3pFjUb",
                    meta: {},
                    props: {
                      value: {
                        type: "Literal",
                        id: "YKMt3RwK2VqFrgK7U8QkI",
                        meta: {},
                        value: "Build powerful no-code editors",
                      },
                    },
                    if: null,
                    each: null,
                    classList: null,
                    children: [],
                    tag: "text",
                  },
                ],
                tag: "h2",
              },
              {
                type: "TagTemplate",
                id: "N5b4Ny8bOaLs12XjW7yCv",
                meta: {},
                props: {
                  className: {
                    type: "Literal",
                    id: "jHxcuK1Uh7nZhvKlYSA2J",
                    meta: {},
                    value:
                      "flex flex-col gap-4 px-12 opacity-80 font-light tracking-tight text-md",
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [
                  {
                    type: "TagTemplate",
                    id: "ugC5fyx754lI3o3LLmFQL",
                    meta: {},
                    props: {},
                    if: null,
                    each: null,
                    classList: null,
                    children: [
                      {
                        type: "TagTemplate",
                        id: "EOKVTCCdYP5YKoQD84HZz",
                        meta: {},
                        props: {
                          value: {
                            type: "Literal",
                            id: "3KW7dHBInzmRAhpQc6kyc",
                            meta: {},
                            value:
                              "Reka is a state management system for building no-code editors.",
                          },
                        },
                        if: null,
                        each: null,
                        classList: null,
                        children: [],
                        tag: "text",
                      },
                      {
                        type: "TagTemplate",
                        id: "3wfpwDPOXIr6EcK0c7aZK",
                        meta: {},
                        props: {},
                        if: null,
                        each: null,
                        classList: null,
                        children: [],
                        tag: "br",
                      },
                      {
                        type: "TagTemplate",
                        id: "izIxId9iRo7Ek1wnvXPNM",
                        meta: {},
                        props: {
                          value: {
                            type: "Literal",
                            id: "eiwcB3JiLp4ZcjxvE0TZh",
                            meta: {},
                            value:
                              "It enables you to build page editors where your users can design complex UI components on the browser the same way you could with code.",
                          },
                        },
                        if: null,
                        each: null,
                        classList: null,
                        children: [],
                        tag: "text",
                      },
                    ],
                    tag: "p",
                  },
                ],
                tag: "div",
              },
              {
                type: "ComponentTemplate",
                id: "Fz73RsRHwZMoS5N4J3FA8",
                meta: {},
                props: {
                  className: {
                    type: "Literal",
                    id: "mflCS4S4jUJP3luj1GZ0L",
                    meta: {},
                    value: "mt-3 bg-indigo-500",
                  },
                  text: {
                    type: "Literal",
                    id: "6ppvjtNav8d0h6eZtVRkX",
                    meta: {},
                    value: "Show me confetti",
                  },
                  icon: {
                    type: "Literal",
                    id: "hJ6FxswvI4VEh5Y4ClAcN",
                    meta: {},
                    value: "HeartFilledIcon",
                  },
                  onClick: {
                    type: "Func",
                    id: "HSvgn7HiizVvUubXMxlD4",
                    meta: {},
                    name: null,
                    params: [],
                    body: {
                      type: "Block",
                      id: "UOUAdnGVx5Z0Rt1Yy9ZQ1",
                      meta: {},
                      statements: [
                        {
                          type: "CallExpression",
                          id: "8izFTs1IuxbTLiGOV5pvF",
                          meta: {},
                          identifier: {
                            type: "Identifier",
                            id: "eZvGj9y3yf0VHHVN0tPaS",
                            meta: {},
                            name: "confetti",
                            external: true,
                          },
                          arguments: [],
                        },
                      ],
                    },
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [],
                component: {
                  type: "Identifier",
                  id: "SfwJlDDaeh6G5N0Kj471n",
                  meta: {},
                  name: "Button",
                  external: false,
                },
              },
            ],
            tag: "div",
          },
        ],
        tag: "div",
      },
      state: [
        {
          type: "Val",
          id: "YR95F6vUzEJYJHC7tpOv0",
          meta: {},
          name: "text",
          kind: {
            type: "PrimitiveKind",
            id: "EipXf1UsfPiKU1cFsaIYx",
            primitive: "any",
          },
          init: {
            type: "Literal",
            id: "e4ixsmUKEhZVZoabCZc2P",
            meta: {},
            value: "Bye",
          },
        },
        {
          type: "Val",
          id: "CrsrLsb7P8UCNaFrUZRMi",
          meta: {},
          name: "counter",
          kind: {
            type: "PrimitiveKind",
            id: "PPjHoRKdqfvjy9vqaH0Os",
            primitive: "any",
          },
          init: {
            type: "Literal",
            id: "XQcYIp50U4GeYMgLlVgs7",
            meta: {},
            value: 0,
          },
        },
      ],
      props: [],
    },
    {
      type: "RekaComponent",
      id: "3f2VqJl1sZYJkPgJdH96B",
      meta: {},
      name: "Button",
      template: {
        type: "TagTemplate",
        id: "wDiecS9dYRDKuELSZ3Q0N",
        meta: {},
        props: {
          className: {
            type: "BinaryExpression",
            id: "34LCNm83cI2MgMs6ISPWP",
            meta: {},
            left: {
              type: "Literal",
              id: "AKYfg1QTFoqyCKrERHdo8",
              meta: {},
              value:
                "flex items-center gap-2 px-4 py-2 text-xs cursor-pointer rounded-full bg-black hover:bg-neutral-500 text-white ",
            },
            company: "+",
            right: {
              type: "Identifier",
              id: "4ioaFihvQsopHdDLUyBzC",
              meta: {},
              name: "className",
              external: false,
            },
          },
          onClick: {
            type: "Identifier",
            id: "YwWNT6fvtCeEQVqi6HIkq",
            meta: {},
            name: "onClick",
            external: false,
          },
        },
        if: null,
        each: null,
        classList: null,
        children: [
          {
            type: "TagTemplate",
            id: "2jmjvWU2qV1xba3vXq3pB",
            meta: {},
            props: {},
            if: {
              type: "Identifier",
              id: "oXvtrYVNMgoVfdrxHK2rN",
              meta: {},
              name: "text",
              external: false,
            },
            each: null,
            classList: null,
            children: [
              {
                type: "TagTemplate",
                id: "LVLed661dT2gf4MTPb99F",
                meta: {},
                props: {
                  value: {
                    type: "Identifier",
                    id: "vURagIOVymnqjcZIQiaBV",
                    meta: {},
                    name: "text",
                    external: false,
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [],
                tag: "text",
              },
            ],
            tag: "span",
          },
          {
            type: "ComponentTemplate",
            id: "j6AkTj7bmnhoETFYqisfl",
            meta: {},
            props: {
              name: {
                type: "Identifier",
                id: "9BYJCdF6xAhm1BZ4gX1QV",
                meta: {},
                name: "icon",
                external: false,
              },
            },
            if: {
              type: "Identifier",
              id: "1Z6mOxqYvPyDGaIH66znl",
              meta: {},
              name: "icon",
              external: false,
            },
            each: null,
            classList: null,
            children: [],
            component: {
              type: "Identifier",
              id: "1nXf2UHRLJivzZ6RuOk9o",
              meta: {},
              name: "Icon",
              external: true,
            },
          },
        ],
        tag: "button",
      },
      state: [],
      props: [
        {
          type: "ComponentProp",
          id: "Bn9cUZcwD0nL9FbU6R3v7",
          meta: {},
          name: "className",
          kind: {
            type: "PrimitiveKind",
            id: "c2yFeE5xNcs8mX9l6xe0d",
            primitive: "any",
          },
          init: null,
          bindable: false,
        },
        {
          type: "ComponentProp",
          id: "1odtLNvU3ZpXSaBOwdhdm",
          meta: {},
          name: "text",
          kind: {
            type: "PrimitiveKind",
            id: "kd0Nasn0tBqMhfjkqqDkY",
            primitive: "any",
          },
          init: null,
          bindable: false,
        },
        {
          type: "ComponentProp",
          id: "JoDEhfaIokaSW2VS4H916",
          meta: {},
          name: "icon",
          kind: {
            type: "PrimitiveKind",
            id: "EwuZetU3auNJ1I3pyA0u1",
            primitive: "any",
          },
          init: null,
          bindable: false,
        },
        {
          type: "ComponentProp",
          id: "vE6L3rxXnFsRJMF0FsYOz",
          meta: {},
          name: "onClick",
          kind: {
            type: "PrimitiveKind",
            id: "lmxv7i3JRGoikb6ZSwwaw",
            primitive: "any",
          },
          init: {
            type: "Func",
            id: "Bli7PaKEns7Yzw25VeWbK",
            meta: {},
            name: null,
            params: [],
            body: {
              type: "Block",
              id: "TNBQq2CQQgq6on4n35qjB",
              meta: {},
              statements: [],
            },
          },
          bindable: false,
        },
      ],
    },
  ],
});
const section = ref({
  type: "Program",
  id: "f9IyCZG9QErEwsWj5gq7M",
  meta: {},
  globals: [],
  components: [
    {
      type: "RekaComponent",
      id: "i8cryhkttd87XEecKixaR",
      meta: {},
      name: "Section",
      template: {
        type: "TagTemplate",
        id: "o1mFKviak5GRQbs56DMcw",
        meta: {},
        props: {
          className: {
            type: "Literal",
            id: "HIdGehq0pgsPDKh8oGCVD",
            meta: {},
            value: "pt-20 pb-10 max-w-4xl m-auto",
          },
        },
        if: null,
        each: null,
        classList: null,
        children: [
          {
            type: "TagTemplate",
            id: "9lHUFq1JKIXihS4qUu5ID",
            meta: {},
            props: {
              className: {
                type: "Literal",
                id: "lz2so7TAnVrOyy61yW8u6",
                meta: {},
                value: "flex",
              },
            },
            if: null,
            each: null,
            classList: null,
            children: [
              {
                type: "TagTemplate",
                id: "0AxOxzy3c5GOs8d4XhBf4",
                meta: {},
                props: {
                  className: {
                    type: "Literal",
                    id: "IJnrOMeqtAh2dSrw2cmih",
                    meta: {},
                    value: "px-8 w-1/3",
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [
                  {
                    type: "TagTemplate",
                    id: "2u65Zd2dt2S12tok3F10x",
                    meta: {},
                    props: {
                      className: {
                        type: "Literal",
                        id: "M4CcYAQVVP29Frqfz4lIU",
                        meta: {},
                        value: "text-3xl font-semibold tracking-tighter",
                      },
                    },
                    if: null,
                    each: null,
                    classList: null,
                    children: [
                      {
                        type: "TagTemplate",
                        id: "1Ls9J9khg3mAX7ZJ3dKYl",
                        meta: {},
                        props: {
                          value: {
                            type: "Literal",
                            id: "Stf9q2EXQxVxgxqGyy8G7",
                            meta: {},
                            value: "Powered by code for unlimited flexibility",
                          },
                        },
                        if: null,
                        each: null,
                        classList: null,
                        children: [],
                        tag: "text",
                      },
                    ],
                    tag: "h2",
                  },
                ],
                tag: "div",
              },
              {
                type: "TagTemplate",
                id: "Z9mjSPoy8DLtQ9jSGjoOJ",
                meta: {},
                props: {
                  className: {
                    type: "Literal",
                    id: "G9u31aT6OfXPQIBbuoNck",
                    meta: {},
                    value: "flex-1 px-10 text-slate-600",
                  },
                },
                if: null,
                each: null,
                classList: null,
                children: [
                  {
                    type: "TagTemplate",
                    id: "ob0I5AJQFGklyJw5I6zM1",
                    meta: {},
                    props: {
                      style: {
                        type: "ObjectExpression",
                        id: "t37vuWyzxbP9PGzASJmRR",
                        meta: {},
                        properties: {
                          fontSize: {
                            type: "Literal",
                            id: "Ml54KDG65WbbnxmAtONXG",
                            meta: {},
                            value: "1.05rem",
                          },
                        },
                      },
                      className: {
                        type: "Literal",
                        id: "3K2PIu9I4H7zf7vfwoSkP",
                        meta: {},
                        value: "leading-7",
                      },
                    },
                    if: null,
                    each: null,
                    classList: null,
                    children: [
                      {
                        type: "TagTemplate",
                        id: "JwLmzcyWFdjqP5Jk56q7u",
                        meta: {},
                        props: {
                          value: {
                            type: "Literal",
                            id: "uFnFp49JQK5LKkCraoGf0",
                            meta: {},
                            value:
                              "The contents of the editor is stored in an Abstract Syntax Tree, along with an interpreter that efficiently evaluates the output to render. This means your end-users could design UI components with the power of expressions, states, conditionals and loops.",
                          },
                        },
                        if: null,
                        each: null,
                        classList: null,
                        children: [],
                        tag: "text",
                      },
                    ],
                    tag: "p",
                  },
                ],
                tag: "div",
              },
            ],
            tag: "div",
          },
        ],
        tag: "div",
      },
      state: [],
      props: [],
    },
  ],
});
const selectComponent = (element) => {
  if (element == "header") {
    emit("onSelect", header.value);
  } else if (element == "section") {
    emit("onSelect", section.value);
  }
};
</script>
