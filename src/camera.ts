export class Camera {

  public static y = 0;

  public static worldYToScreen(y: number, spriteHeight: number): number {
    return -y + this.y - spriteHeight;
  }
}

