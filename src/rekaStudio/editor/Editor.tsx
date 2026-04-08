import { Frame, Reka } from '@rekajs/core';
import * as t from '@rekajs/types';
import {
  action,
  makeObservable,
  observable,
  runInAction,
  computed,
} from 'mobx';
import randomColor from 'randomcolor';

import { generateRandomName } from '@app/utils';

import { ComponentEditor } from './ComponentEditor';
import { Event } from './Event';

export type User = {
  id: string;
  name: string;
  color: string;
};

export enum EditorMode {
  Preview = 'preview',
  UI = 'ui',
  Code = 'code',
}

export type LeftSidebarScreen =
  | 'component-list'
  | 'component-editor'
  | 'component-order';

type IframEventListeners = Array<{
  type: string;
  handler: EventListenerOrEventListenerObject;
}>;

export type StudioRouter = {
  pathname: string;
  query?: Record<string, any>;
  push: (path: string) => void;
  replace?: (path: string) => void;
};

type EditorOptions = {
  previewDocument?: string | null;
};

function createLocalId() {
  if (
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `studio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class Editor {
  compactSidebar: boolean = false;
  compactSidebarVisible: boolean = false;
  leftSidebarScreen: LeftSidebarScreen = 'component-list';

  activeFrame: Frame | null;
  user: User;
  peers: User[];
  connected: boolean;
  frameToEvent: WeakMap<Frame, Event>;
  componentToComponentEditor: WeakMap<t.Component, ComponentEditor>;
  activeComponentEditor: ComponentEditor | null;
  iframe: HTMLIFrameElement | null;
  mode: EditorMode;
  previewDocument: string | null;
  ready: boolean;
  reka: Reka;

  private declare windowResizeHandler: () => void;
  private iframeEventHandlers: IframEventListeners = [];

  constructor(
    readonly router: StudioRouter,
    reka: Reka,
    options: EditorOptions = {}
  ) {
    this.activeFrame = null;

    this.mode = EditorMode.UI;
    this.previewDocument = options.previewDocument ?? null;
    this.ready = true;

    this.user = {
      id: createLocalId(),
      name: generateRandomName(),
      color: randomColor({
        luminosity: 'dark',
        hue: 'random',
        format: 'hex',
      }),
    };

    this.peers = [];
    this.connected = false;
    this.frameToEvent = new WeakMap();
    this.componentToComponentEditor = new WeakMap();
    this.activeComponentEditor = null;
    this.iframe = null;

    makeObservable(this, {
      compactSidebar: observable,
      compactSidebarVisible: observable,
      leftSidebarScreen: observable,
      showCompactSidebar: action,
      setLeftSidebarScreen: action,
      activeFrame: observable,
      setActiveFrame: action,
      peers: observable,
      connected: observable,
      setConnected: action,
      setMode: action,
      mode: observable,
      allUsers: computed,
      activeComponentEditor: observable,
      setActiveComponentEditor: action,
      ready: observable,
      setReady: action,
      dispose: action,
    });

    this.reka = reka;
    if (this.reka.state?.program?.components?.length) {
      const initialName =
        (router.query?.component as string | undefined) ?? null;
      const initial =
        (initialName
          ? this.reka.state.program.components.find(
              (component) => component.name === initialName
            )
          : null) ?? this.reka.state.program.components[0];
      if (initial) this.setActiveComponentEditor(initial);
    }

    if (typeof window === 'undefined') {
      return;
    }

    this.windowResizeHandler = () => {
      if (document.body.clientWidth <= 1100) {
        runInAction(() => {
          this.compactSidebar = true;
          this.compactSidebarVisible = false;
        });

        return;
      }

      runInAction(() => {
        this.compactSidebar = false;
        this.compactSidebarVisible = false;
      });
    };

    this.windowResizeHandler();
    window.addEventListener('resize', this.windowResizeHandler);

    (window as any).editor = this;
  }

  showCompactSidebar(bool: boolean) {
    this.compactSidebarVisible = bool;
  }

  setLeftSidebarScreen(screen: LeftSidebarScreen) {
    this.leftSidebarScreen = screen;
  }

  setReady(bool: boolean) {
    this.ready = bool;
  }

  dispose() {
    // The caller owns `reka` lifecycle; we only disconnect listeners we created.

    if (typeof window === 'undefined') {
      return;
    }

    this.removeIframeEventListeners();
    window.removeEventListener('resize', this.windowResizeHandler);

    this.frameToEvent = new WeakMap();
    this.componentToComponentEditor = new WeakMap();
    this.activeComponentEditor = null;
    this.iframe = null;
  }

  private addIframeEventListeners() {
    this.iframeEventHandlers.forEach((listener) => {
      this.iframe?.contentWindow?.addEventListener(
        listener.type,
        listener.handler
      );
    });
  }

  private removeIframeEventListeners() {
    this.iframeEventHandlers.forEach((h) => {
      this.iframe?.contentWindow?.removeEventListener(h.type, h.handler);
    });
  }

  registerIframe(iframe: HTMLIFrameElement) {
    if (!iframe) {
      return;
    }

    if (this.iframe) {
      this.removeIframeEventListeners();
    }

    this.iframe = iframe;

    const iframeScrollTopListener = () => {
      if (!this.iframe) {
        return;
      }

      const scrollY = this.iframe?.contentDocument?.documentElement.scrollTop;

      this.reka.updateExternalState('scrollTop', scrollY);
    };

    const iframePropagateEventHandler = (e: any) => {
      window.dispatchEvent(new e.constructor(e.type, e));
    };

    this.iframeEventHandlers = [
      { type: 'scroll', handler: iframeScrollTopListener },
      { type: 'mousedown', handler: iframePropagateEventHandler },
      { type: 'mouseup', handler: iframePropagateEventHandler },
      { type: 'click', handler: iframePropagateEventHandler },
    ];

    this.addIframeEventListeners();
  }

  get allUsers() {
    return [this.user, ...this.peers];
  }

  getUserById(id: string) {
    return this.allUsers.find((user) => user.id === id);
  }

  setActiveFrame(frame: Frame | null) {
    this.activeFrame = frame;
  }

  setConnected(connected: boolean) {
    this.connected = connected;
  }

  setMode(mode: EditorMode) {
    this.mode = mode;
  }

  toggleConnected() {
    this.setConnected(!this.connected);
  }

  getEvent(frame: Frame) {
    let event = this.frameToEvent.get(frame);

    if (!event) {
      event = new Event(frame);
      this.frameToEvent.set(frame, event);
    }

    return event;
  }

  setActiveComponentEditorByName(name: string) {
    const component = this.reka.program.components.find(
      (component) => component.name === name
    );

    if (!component) {
      return false;
    }

    this.setActiveComponentEditor(component);
    return true;
  }

  setActiveComponentEditor(component: t.Component) {
    let componentEditor = this.componentToComponentEditor.get(component);

    if (!componentEditor) {
      componentEditor = new ComponentEditor(component, this);
      this.componentToComponentEditor.set(component, componentEditor);
    }

    this.activeComponentEditor = componentEditor;

    return componentEditor;
  }
}
