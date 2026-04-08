<script>
import { required } from "vuelidate/lib/validators";
import Error from "@/components/Error.vue";
import ListLoading from "@/components/ListLoading.vue";
import {
  ACCOUNTING_TRANSACTIONS,
  SELF_ACCOUNTING_TRANSACTION_CREATE,
  SELF_ACCOUNTING_TRANSACTION_UPDATE,
  SELF_ACCOUNTING_TRANSACTION_DELETE,
} from "@/constants/graphql";
export default {
  name: "ContentTransactions",
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  components: {
    Error,
    ListLoading,
  },
  data() {
    return {
      ACCOUNTING_TRANSACTIONS,
      me: this.$store.state.me,
      site: this.$store.state.site,
      searchMock: null,
      searchValue: null,
      // data
      transactionId: null,
      //
      amount: 0,
      receive: 0,
      send: 0,
      amount: 0,
      note: "",
      refer: "",
      isReceive: true,
      isSend: false,
      // extra
      showModal: false,
      hasMore: true,
      after: null,
      loading: false,
      disabled: false,
      key: 1,
    };
  },
  validations: {
    amount: {
      required,
    },
    note: {
      required,
    },
  },
  watch: {
    searchMock: function (value) {
      if (value.length == 0) this.enterSearch();
    },
    amount: function (value) {
      if (parseFloat(value) > 0) {
        this.checkTransactionIsReceive();
        this.checkTransactionIsSend();
      }
    },
  },
  methods: {
    refreshQuery() {
      this.key += 1;
    },
    setTransaction(transaction) {
      this.transactionId = transaction.id;
      this.amount = transaction.amount;
      this.receive = transaction.receive;
      this.send = transaction.send;
      this.amount = transaction.amount;
      this.note = transaction.note;
      this.refer = transaction.refer;
      this.isReceive = transaction.isReceive;
      this.isSend = transaction.isSend;
      this.showModal = true;
    },
    toggleCreate() {
      this.transactionId = null;
      this.amount = 0;
      this.receive = 0;
      this.send = 0;
      this.amount = 0;
      this.note = "";
      this.refer = "";
      this.isReceive = true;
      this.isSend = false;
      this.showModal = true;
    },
    modalClose() {
      this.transactionId = null;
      this.amount = 0;
      this.receive = 0;
      this.send = 0;
      this.amount = 0;
      this.note = "";
      this.refer = "";
      this.isReceive = true;
      this.isSend = false;
      this.showModal = !this.showModal;
    },
    enterSearch() {
      if (this.searchMock.length == 0) {
        this.searchValue = null;
      } else {
        this.searchValue = this.searchMock;
      }
    },
    checkTransactionIsReceive() {
      if (this.isReceive == true) {
        this.isSend = false;
        this.receive = parseFloat(this.amount) ? parseFloat(this.amount) : 0.0;
        this.send = 0;
      } else {
        this.isSend = true;
        this.receive = 0;
        this.send = parseFloat(this.amount) ? parseFloat(this.amount) : 0.0;
      }
    },
    checkTransactionIsSend() {
      if (this.isSend == true) {
        this.isReceive = false;
        this.receive = 0;
        this.send = parseFloat(this.amount) ? parseFloat(this.amount) : 0.0;
      } else {
        this.isReceive = true;
        this.receive = parseFloat(this.amount) ? parseFloat(this.amount) : 0.0;
        this.send = 0;
      }
    },
    createTransaction() {
      this.disabled = true;
      this.loading = true;
      this.$apollo
        .mutate({
          // Query
          mutation: SELF_ACCOUNTING_TRANSACTION_CREATE,
          // Parameters
          variables: {
            userId: this.me.id,
            currency: this.me.currency,
            note: this.note,
            profileId: this.profile.id,
            receive: this.receive,
            refer: this.refer,
            send: this.send,
          },
        })
        .then((data) => {
          this.disabled = false;
          this.loading = false;
          this.transactionId = null;
          this.amount = 0;
          this.receive = 0;
          this.send = 0;
          this.amount = 0;
          this.note = "";
          this.refer = "";
          this.isReceive = true;
          this.isSend = false;
          this.showModal = false;
          this.key += 1;
          // push notification
          var notification = {
            type: "success",
            text: "Successfully created!",
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        })
        .catch((error) => {
          this.disabled = false;
          this.loading = false;
          if (error.graphQLErrors[0].extensions) {
            this.error = error.graphQLErrors[0].extensions.reason;
          } else {
            this.error = error.message.replace("GraphQL error:", "");
          }
          // push notification
          var notification = {
            type: "error",
            text: this.error,
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        });
    },
    updateTransaction() {
      this.disabled = true;
      this.loading = true;
      this.$apollo
        .mutate({
          // Query
          mutation: SELF_ACCOUNTING_TRANSACTION_UPDATE,
          // Parameters
          variables: {
            userId: this.me.id,
            siteId: this.site.id,
            id: this.transaction.id,
            description: this.description,
            image: this.image,
            isActive: this.isActive,
            priority: parseInt(this.priority),
            name: this.name,
          },
        })
        .then((data) => {
          this.disabled = false;
          this.loading = false;
          this.transactionId = null;
          this.amount = 0;
          this.receive = 0;
          this.send = 0;
          this.amount = 0;
          this.note = "";
          this.refer = "";
          this.isReceive = true;
          this.isSend = false;
          this.showModal = false;
          this.key += 1;
          // push notification
          var notification = {
            type: "success",
            text: "Successfully updated!",
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        })
        .catch((error) => {
          this.loading = false;
          this.disabled = false;
          if (error.graphQLErrors[0].extensions) {
            this.error = error.graphQLErrors[0].extensions.reason;
          } else {
            this.error = error.message.replace("GraphQL error:", "");
          }
          // push notification
          var notification = {
            type: "error",
            text: this.error,
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        });
    },
    deleteTransaction() {
      this.$apollo
        .mutate({
          // Query
          mutation: SELF_ACCOUNTING_TRANSACTION_DELETE,
          // Parameters
          variables: {
            userId: this.me.id,
            siteId: this.site.id,
            id: this.transaction.id,
          },
        })
        .then((data) => {
          this.disabled = false;
          this.loading = false;
          this.transactionId = null;
          this.amount = 0;
          this.receive = 0;
          this.send = 0;
          this.amount = 0;
          this.note = "";
          this.refer = "";
          this.isReceive = true;
          this.isSend = false;
          this.showModal = false;
          this.key += 1;
          // push notification
          var notification = {
            type: "success",
            text: "Successfully deleted!",
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        })
        .catch((error) => {
          this.disabled = false;
          this.loading = false;
          if (error.graphQLErrors[0].extensions) {
            this.error = error.graphQLErrors[0].extensions.reason;
          } else {
            this.error = error.message.replace("GraphQL error:", "");
          }
          // push notification
          var notification = {
            type: "error",
            text: this.error,
          };
          this.$store.commit("SET_NOTIFICATION", notification);
        });
    },
    async loadMore(endCursor, query) {
      this.hasMore = false;
      this.loading = true;
      await query.fetchMore({
        variables: {
          after: endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const pageInfo = fetchMoreResult.accountingTransactions.pageInfo;
          if (
            !fetchMoreResult ||
            fetchMoreResult.accountingTransactions.edges.length === 0
          ) {
            this.hasMore = false;
            this.loading = false;
            return prev;
          }
          this.hasMore = true;
          this.loading = true;
          return Object.assign({}, prev, {
            accountingTransactions: {
              __typename: prev.accountingTransactions.__typename,
              total: prev.accountingTransactions.total,
              edges: [
                ...prev.accountingTransactions.edges,
                ...fetchMoreResult.accountingTransactions.edges,
              ],
              pageInfo,
            },
          });
        },
      });
    },
  },
};
</script>
<template>
  <main class="main">
    <section class="canvas tags-view">
      <header class="canvas-header tags-header">
        <h2 class="canvas-title">
          Profile
          <span>
            <svg viewBox="0 0 48 48">
              <path
                fill="#010101"
                d="M37.802 23.247l-26.286-23a1 1 0 00-1.317 1.506L35.624 24 10.199 46.247a1 1 0 101.317 1.506l26.286-23a1.001 1.001 0 000-1.506z"
              />
            </svg> </span
          >Transactions
        </h2>
        <section class="view-actions">
          <div class="relative">
            <svg
              class="input-search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 16 16"
            >
              <use :xlink:href="'#search'" />
            </svg>
            <input
              class="input"
              placeholder="Search "
              type="text"
              v-model.trim.lazy="searchMock"
              v-on:keyup.enter="enterSearch"
            />
          </div>
          <button
            @click="toggleCreate()"
            style=" margin-left: 15px"
            class="btn c-btn"
          >
            <span>New</span>
          </button>
        </section>
      </header>
      <div :key="this.key" v-if="Number.isInteger(this.me.id)">
        <ApolloQuery
          :key="this.key"
          :query="ACCOUNTING_TRANSACTIONS"
          :variables="{
            profileId: this.profile.id,
            name: this.searchValue,
            after: this.after,
          }"
          v-slot="{ result: { error, data } }"
        >
          <div v-if="error" class="error">
            <error />
          </div>
          <div v-else-if="data" class="result">
            <section class="content-list">
              <ol class="list">
                <li class="list-row header">
                  <div class="list-header list-cellwidth-50">Note</div>
                  <div class="list-header list-cellwidth-10">Receive</div>
                  <div class="list-header list-cellwidth-10">Send</div>
                  <div class="list-header list-cellwidth-10">Tag</div>
                  <div class="list-header list-cellwidth-10">Validated</div>
                  <div class="list-header list-cellwidth-10">Updated</div>
                </li>
                <li
                  class="list-row click"
                  :class="
                    transaction.node.receive > transaction.node.send
                      ? 'status-success'
                      : 'status-error'
                  "
                  @click="setTransaction(transaction.node)"
                  v-for="(transaction, index) in data.accountingTransactions
                    .edges"
                  :key="transaction.node.id"
                >
                  <span
                    :name="transaction.node.note"
                    :data-tooltip="transaction.node.note"
                    class="list-data"
                  >
                    <h3>
                      <strong v-if="index == 0">#&nbsp;1</strong>
                      <strong v-else>#&nbsp;{{ index + 1 }}</strong
                      >&nbsp;{{ transaction.node.note }}
                    </h3>
                    <p class="ma0 pa0 f8 midgrey">
                      {{ transaction.node.refer }}
                    </p>
                  </span>
                  <span class="list-data">
                    <div class="items-center">
                      <span class="status nowrap"
                        >{{ me.currency | currency
                        }}{{ transaction.node.receive }}</span
                      >
                    </div>
                  </span>
                  <span class="list-data">
                    <div class="items-center">
                      <span class="status nowrap"
                        >{{ me.currency | currency
                        }}{{ transaction.node.send }}</span
                      >
                    </div>
                  </span>
                  <span class="list-data">
                    <div class="items-center">
                      <span class="status nowrap" v-if="transaction.node.tag">{{
                        transaction.node.tag.title
                      }}</span>
                      <span class="status nowrap" v-else>Unorganized</span>
                    </div>
                  </span>
                  <span class="list-data">
                    <div class="for-switch">
                      <label class="checkbox">
                        <input
                          type="checkbox"
                          disabled
                          v-model="transaction.node.isValid"
                        />
                        <span class="input-toggle-component"></span>
                      </label>
                    </div>
                  </span>
                  <span class="list-data">
                    <span class="nowrap f8 midlightgrey">{{
                      transaction.node.updatedAt | moment("hh:mm A - DD MMM")
                    }}</span>
                  </span>
                </li>
              </ol>
            </section>
          </div>
          <div v-else>
            <list-loading />
          </div>
        </ApolloQuery>
      </div>

      <div
        v-if="this.showModal"
        class="liquid-destination default-liquid-destination has-wormholes"
      >
        <div class="liquid-destination-stack">
          <div class="liquid-child">
            <div class="fullscreen-modal-container liquid-wormhole-element">
              <div class="fullscreen-modal-background"></div>
              <div
                class="
                  fullscreen-modal fullscreen-modal-action fullscreen-modal-wide
                "
              >
                <button @click="toggleModal()" class="close" title="Close">
                  <svg version="1" viewBox="0 0 24 24">
                    <path
                      d="M12.707 12L23.854.854a.5.5 0 00-.707-.707L12 11.293.854.146a.5.5 0 00-.707.707L11.293 12 .146 23.146a.5.5 0 00.708.708L12 12.707l11.146 11.146a.5.5 0 10.708-.706L12.707 12z"
                    />
                  </svg>
                  <span class="hidden">Close</span>
                </button>
                <section class="modal-content pa1">
                  <div class="modal-body">
                    <section class="canvas" style="padding: 0px 24px 24px">
                      <header class="canvas-header">
                        <router-link :to="`/transaction/`">
                          <h2 class="canvas-title">
                            Transaction
                            <span>
                              <svg
            
            xmlns="http://www.w3.org/2000/svg"
            
          >
            <use :xlink:href="'#arrow-right'" />
          </svg> </span
                            ><span v-if="transactionId">Update</span
                            ><span v-else>Create</span>
                          </h2>
                        </router-link>
                        <section v-if="transactionId" class="view-actions">
                          <button
                            @click="updateTransaction(transactionId)"
                            class="btn c-btn btn-icon mr5"
                          >
                            <span>Update</span>
                          </button>
                          <button
                            @click="deleteTransaction(transactionId)"
                            class="btn d-btn btn-icon"
                          >
                            <span>Delete</span>
                          </button>
                        </section>
                        <section v-else class="view-actions">
                          <button
                            :disabled="disabled == true || this.$v.$invalid"
                            @click="createTransaction()"
                            class="btn c-btn btn-icon"
                          >
                            <span>Create</span>
                          </button>
                        </section>
                      </header>
                      <div
                        class="
                          pa5
                          br4
                          shadow-1
                          bg-grouped-table
                          flex flex-column flex-row-ns
                          items-start
                        "
                      >
                        <div class="flex flex-column items-start w-100">
                          <div class="mb3 mt0 td-cta w-100">
                            <label class="checkbox" for="receive">
                              <div class="td-cta-box td-cta-marketplace">
                                <div class="td-cta-icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                  >
                                    <use :xlink:href="'#box-seam'" />
                                  </svg>
                                </div>
                                <div class="td-cta-content-wrapper">
                                  <div class="td-cta-content">
                                    <h4 class="fw6 f6">Receive</h4>
                                    <div class="form-group for-checkbox">
                                      <input
                                        class="input"
                                        type="checkbox"
                                        id="receive"
                                        name="receive"
                                        v-model="isReceive"
                                        @change="checkTransactionIsReceive()"
                                      />
                                      <span
                                        class="input-toggle-component"
                                      ></span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </label>
                            <label class="checkbox" for="send">
                              <div class="td-cta-box td-cta-docs">
                                <div class="td-cta-icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                  >
                                    <use :xlink:href="'#box-seam'" />
                                  </svg>
                                </div>
                                <div class="td-cta-content-wrapper">
                                  <div class="td-cta-content">
                                    <h4 class="fw6 f6">Send</h4>
                                    <div class="form-group for-checkbox">
                                      <input
                                        class="input"
                                        type="checkbox"
                                        id="send"
                                        name="send"
                                        v-model="isSend"
                                        @change="checkTransactionIsSend()"
                                      />
                                      <span
                                        class="input-toggle-component"
                                      ></span>
                                    </div>
                                  </div>
                                </div></div
                            ></label>
                          </div>
                          <div class="form-group">
                            <label for="amount">
                              Amount
                              <span class="error" v-if="!$v.amount.required"
                                >(required)</span
                              >
                            </label>
                            <input
                              name="amount"
                              tabindex="1"
                              id="amount"
                              class="input"
                              type="number"
                              placeholder="Enter total amount"
                              required
                              v-model.number="amount"
                            />
                            <p class="description">Total transaction amount</p>
                          </div>
                          <div class="form-group">
                            <label for="note">
                              Note
                              <span class="error" v-if="!$v.note.required"
                                >(required)</span
                              >
                            </label>
                            <textarea
                              name="note"
                              tabindex="3"
                              id="note"
                              class="b-text-area input"
                              required
                              v-model="note"
                              placeholder="Description"
                            ></textarea>
                            <p>
                              Maximum:
                              <b>500</b> characters. You’ve used
                              <span
                                class="word-count"
                                style="color: rgb(159, 187, 88)"
                                >{{ this.note.length }}</span
                              >
                            </p>
                          </div>
                          <div class="form-group">
                            <label for="refer"> Refer </label>
                            <input
                              name="refer"
                              tabindex="1"
                              id="refer"
                              class="input"
                              type="text"
                              placeholder="Enter refer"
                              required
                              v-model.trim.lazy="refer"
                            />
                            <p class="description">Transaction refer</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>