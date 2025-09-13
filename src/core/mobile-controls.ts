import { getById } from "./dom-utils";

export class MobileControls {

  private static c: HTMLElement;

  private static pointerDownHandlerRef: any;

  private static pointerUpHandlerRef: any;

  public static init(): void {
    this.c = getById('mobile');
  }

  public static addHandlers(downHandler: any, upHandler: any): void {
    this.pointerDownHandlerRef = downHandler;
    this.pointerUpHandlerRef = upHandler;

    this.c.addEventListener('touchstart', downHandler);
    this.c.addEventListener('touchend', upHandler);
  }

  public static removeHandlers(): void {
    this.c.removeEventListener('touchstart', this.pointerDownHandlerRef);
    this.c.removeEventListener('touchend', this.pointerUpHandlerRef);

    this.pointerUpHandlerRef = null;
    this.pointerDownHandlerRef = null;
  }
}

