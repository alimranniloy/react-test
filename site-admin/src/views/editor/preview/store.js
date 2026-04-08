import { makeObservable, observable, computed, action } from "mobx";

class ViewStore {
  view = null;

  constructor() {
    makeObservable(this, {
      view: observable,
      setView: action,
      currentView: computed,
    });
  }

  setView(view) {
    this.view = view;
  }

  get currentView() {
    return this.view;
  }
}

export const viewStore = new ViewStore();
