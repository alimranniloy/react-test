<script>
import Error from "@/components/Error.vue";
import ListLoading from "@/components/ListLoading.vue";
import {SITE_TEMPLATES} from "@/constants/graphql";
export default {
  name: "Templates",
  components: {
    Error,
    ListLoading,
  },
  data() {
    return {
      me: this.$store.state.me,
      tag: null,
      loading: false,
      key: 1,
    };
  },
  apollo: {
    siteTemplates: {
      query: SITE_TEMPLATES,
      variables() {
        return {
          isActive: true,
          after: null,
        };
      },
      result({ data, loading }) {
        if (data) {
          var items = [];
          data.siteTemplates.edges.forEach(function (item) {
            var i = {
              footer: item.node.footer,
              id: item.node.id,
              image: item.node.image,
              navigation: item.node.navigation,
              priority: item.node.priority,
              schema: item.node.schema,
              slug: item.node.slug,
              tags: item.node.tags,
              title: item.node.title,
            };
            if (!items.find((el) => el.id === i.id)) {
              items.push(i);
            }
          });
          this.$store.commit("SET_TEMPLATES", items);
        }
      },
      skip() {
        if (this.$store.state.templates.length > 0) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
  methods: {
    refreshTemplates() {
      this.$apollo.queries.siteTemplates.skip = false;
      this.$apollo.queries.siteTemplates.refetch();
    },
    toggleTag(tag) {
      this.tag = tag;
    },
    toggleTemplate(template) {
      this.$emit("onSelect", template);
    },
  },
  computed: {
    tags: function () {
      let tags = [];
      for (let template of this.$store.state.templates) {
        let items = template.tags.split(',');
        for (let item of items) {
          let found = tags.find((el) => el === item.trim());
          if (!found) {
            tags.push(item.trim());
          }
        }
      }
      return tags;
    },
  },
};
</script>
<template>
  <main class="main">
    <section class="canvas">
      <header class="canvas-header">
        <h2 class="canvas-title">
          Templates
            <span @click="refreshTemplates()">
              <svg xmlns="http://www.w3.org/2000/svg">
                <use :xlink:href="'#refresh'" />
              </svg>
            </span>
        </h2>
      </header>
      <div
        class="
          pa5
          br4
          shadow-1
          bg-grouped-table
          flex flex-column flex-row-ns
          items-start
          justify-between
        "
      >
        <div class="template-select">
          <ul class="template-select__tags">
            <li @click="toggleTag(null)" class="template-select__tags_item">
              <button
                type="button"
                class="
                  ant-btn
                  template-select__tags_item_button
                  
                  ant-btn-sm
                " :class="tag == null ? 'template-select__tags_item_button--active' : ''"
              >
                <span>All</span>
              </button>
            </li>
            <li v-for="(item, index) in tags" :key="index" @click="toggleTag(item)" class="template-select__tags_item">
              <button
                type="button"
                class="
                  ant-btn
                  template-select__tags_item_button
                  ant-btn-default ant-btn-sm
                "  :class="item == tag ? 'template-select__tags_item_button--active' : ''"
              >
                <span>{{ item }}</span>
              </button>
            </li>
          </ul>
          <ul class="template-select__list">
            <li class="template-select__item">
              <div class="template-select__item_header">
                <h3 class="template-select__item_title">Blank</h3>
                <i
                  aria-label="icon: info-circle"
                  class="
                    anticon anticon-info-circle
                    template-select__item_card_info
                  "
                  ><svg
                    viewBox="64 64 896 896"
                    class=""
                    data-icon="info-circle"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                    ></path>
                    <path
                      d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
                    ></path></svg
                ></i>
              </div>
              <div class="template-select__item_card">
                <svg
                  class="template-select__blank_icon"
                  width="60px"
                  height="60px"
                  viewBox="0 0 60 60"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g
                    id="Builder"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                    opacity="0.049999997"
                  >
                    <g
                      id="Templates"
                      transform="translate(-209.000000, -306.000000)"
                      fill-rule="nonzero"
                      fill="#000000"
                    >
                      <g
                        id="Group-3"
                        transform="translate(57.000000, 224.000000)"
                      >
                        <g id="item">
                          <g
                            id="Group"
                            transform="translate(19.000000, 19.000000)"
                          >
                            <g
                              id="command"
                              transform="translate(133.000000, 63.000000)"
                            >
                              <path
                                d="M49,38 L42,38 L42,22 L49,22 C55.065,22 60,17.065 60,11 C60,4.935 55.065,0 49,0 C42.935,0 38,4.935 38,11 L38,18 L22,18 L22,11 C22,4.935 17.065,0 11,0 C4.935,0 0,4.935 0,11 C0,17.065 4.935,22 11,22 L18,22 L18,38 L11,38 C4.935,38 0,42.935 0,49 C0,55.065 4.935,60 11,60 C17.065,60 22,55.065 22,49 L22,42 L38,42 L38,49 C38,55.065 42.935,60 49,60 C55.065,60 60,55.065 60,49 C60,42.935 55.065,38 49,38 Z M42,11 C42,7.141 45.14,4 49,4 C52.86,4 56,7.141 56,11 C56,14.859 52.86,18 49,18 L42,18 L42,11 Z M11,18 C7.14,18 4,14.859 4,11 C4,7.141 7.14,4 11,4 C14.86,4 18,7.141 18,11 L18,18 L11,18 Z M18,49 C18,52.859 14.86,56 11,56 C7.14,56 4,52.859 4,49 C4,45.141 7.14,42 11,42 L18,42 L18,49 Z M22,38 L22,22 L38,22 L38,38 L22,38 Z M49,56 C45.14,56 42,52.859 42,49 L42,42 L49,42 C52.86,42 56,45.141 56,49 C56,52.859 52.86,56 49,56 Z"
                                id="Shape"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <div class="template-select__item_card-controls">
                  <button @click="toggleTemplate(null)"
                    class="
                      btn
                      c-btn
                      template-select__item-card_button-create
                      js-tour__create-new-site__button
                    "
                  >
                    <i aria-label="icon: plus" class="anticon anticon-plus"
                      ><svg
                        viewBox="64 64 896 896"
                        class=""
                        data-icon="plus"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
                        ></path>
                        <path
                          d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"
                        ></path></svg></i
                    ><span>Create</span>
                  </button>
                </div>
              </div>
            </li>
            <li v-for="template in JSON.parse(JSON.stringify(this.$store.state.templates.filter((el) => el.tags.includes(tag ? tag : '')))).sort((a, b) => a.priority - b.priority)" :key="template.id" class="template-select__item">
              <div class="template-select__item_header">
                <h3 class="template-select__item_title">{{ template.title }}</h3>
              </div>
              <div
                class="
                  template-select__item_card
                  template-select__item_card--hover-effect
                "
                :style="'background-image : url('+template.image+');'"
              >
                <a
                  class="template-select__open-preview"
                  :href="'https://'+template.slug + '.site.bponi.com'"
                  target="_blank"
                ></a>
                <div class="template-select__item_card-controls">
                  <button @click="toggleTemplate(template)"
                    class="
                      btn
                      c-btn
                      template-select__item-card_button-create
                      js-tour__create-new-site__button
                    "
                  >
                    <i aria-label="icon: plus" class="anticon anticon-plus"
                      ><svg
                        viewBox="64 64 896 896"
                        class=""
                        data-icon="plus"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
                        ></path>
                        <path
                          d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"
                        ></path></svg></i
                    ><span>Create</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>
<style >
.template-select {
  width: 100%;
}

.template-select__tags {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  z-index: 10;
  padding-top: 10px;
  padding-bottom: 10px;
}

.template-select__tags_item {
  list-style: none;
  margin-right: 10px;
  position: relative;
}
.template-select__tags_item:last-child {
  margin-right: 0;
}

.template-select__tags_item_button {
  display: flex;
  align-items: center;
  border: none;
  box-shadow: none;
}
.template-select__tags_item_button:hover {
  background-color: #eff4fd;
}
.ant-btn.template-select__tags_item_button--active {
  background-color: #e9f1ff;
  /* background-color: #DFEAFE; */
  color: var(--ant);
}

.template-select__tags_item_count {
  margin-left: 2px;
  font-size: 0.8em;
  opacity: 0.6;
  position: relative;
  bottom: 3px;
}

.template-select__list {
  /* display: flex;
  align-items: center;
  flex-wrap: wrap; */
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
}

.template-select__item {
  display: inline-block;
  position: relative;
  margin-bottom: 60px;
  margin-left: 20px;
  margin-right: 20px;
  list-style: none;
  z-index: 1;
  max-width: 380px;
  width: 33%;
}

.template-select__item_header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.template-select__item_title {
  text-align: center;
}

.template-select__item_card {
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: 0;
  overflow: hidden;
  height: 200px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid var(--gray);
}
.template-select__item_card--hover-effect {
  transition: 1s ease-in-out background-position-y, 0.2s ease box-shadow,
    0.2s ease border-color, 0.2s ease transform;
}
.template-select__item_card--hover-effect:hover {
  box-shadow: var(--card-shadow);
  transform: translateY(-4px);
  background-position-y: 100%;
  transition: 5s ease-in-out background-position-y, 0.2s ease box-shadow,
    0.2s ease border-color, 0.2s ease transform;
  border-color: transparent;
}

.template-select__item_card-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10px;
  right: 10px;
  /*transition: .15s;*/
  /*opacity: 0;*/
}
/*.template-select__item_card:hover .template-select__item_card-controls{*/
/*  opacity: 1;*/
/*}*/

.template-select__item_card_info {
  padding: 10px 8px 8px 8px;
}

.template-select__open-preview {
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: 15px;
  margin-right: 10px;
  opacity: 0;
}

.template-select__blank_icon {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
}
.ant-btn {
  line-height: 1.499;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border: 1px solid #d9d9d9;
}
.ant-btn-primary {
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
}
.ant-btn-sm {
  height: 24px;
  padding: 0 7px;
  font-size: 14px;
  border-radius: 4px;
}

.ant-btn,
.ant-btn:active,
.ant-btn:focus {
  outline: 0;
}
</style>