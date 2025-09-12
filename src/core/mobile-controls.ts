import { getById } from "./dom-utils";

export class MobileControls {

  private static container: HTMLElement;

  private static pointerDownHandlerRef: any;

  private static pointerUpHandlerRef: any;

  public static init(): void {
    this.container = getById('mobile');
  }

  public static addHandlers(downHandler: any, upHandler: any): void {
    this.pointerDownHandlerRef = downHandler;
    this.pointerUpHandlerRef = upHandler;

    this.container.addEventListener('touchstart', downHandler);
    this.container.addEventListener('touchend', upHandler);
  }

  public static removeHandlers(): void {
    this.container.removeEventListener('touchstart', this.pointerDownHandlerRef);
    this.container.removeEventListener('touchend', this.pointerUpHandlerRef);

    this.pointerUpHandlerRef = null;
    this.pointerDownHandlerRef = null;
  }
}

