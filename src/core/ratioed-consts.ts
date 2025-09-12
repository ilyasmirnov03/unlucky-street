/**
 * Constant integers (like objects dimensions) but with applied ratio
 */
export class RatioedConstants {

  public static player = 96;

  public static obstacle = 100;

  public static humanWidth = 80;

  public static humanHeight = 160;

  public static candy = 32;

  public static applyRatio(ratio: number) {
    for (const key of Object.keys(this)) {
      this[key] *= ratio;
    }
  }
}

