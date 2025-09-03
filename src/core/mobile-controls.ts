import { getById } from "./dom-utils";

export class MobileControls {

  private static container: HTMLElement;

  private static pointerDownHandlerRef: any;

  private static pointerUpHandlerRef: any;

  public static init(): void {
    this.container = getById('mobile');
  }

  public static addHandlers(downHandler: any, upHandler: any): void {
    this.pointerUpHandlerRef = downHandler;
    this.pointerUpHandlerRef = upHandler;

    for (const child of this.container.children) {
      child.addEventListener('pointerdown', downHandler);
      child.addEventListener('pointerup', upHandler);
    }
  }

  public static removeHandlers(): void {
    for (const child of this.container.children) {
      child.removeEventListener('pointerdown', this.pointerDownHandlerRef);
      child.removeEventListener('pointerup', this.pointerUpHandlerRef);
    }

    this.pointerUpHandlerRef = null;
    this.pointerUpHandlerRef = null;
  }
}

