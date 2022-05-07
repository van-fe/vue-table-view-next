export class StringHelper {
  public static getChineseLetterLength(str: string): number {
    return /\p{Unified_Ideograph}/gu[Symbol.match](str)?.length ?? 0;
  }

  public static getEnglishLetterLength(str: string): number {
    return /[A-Za-z]/g[Symbol.match](str)?.length ?? 0;
  }
}
