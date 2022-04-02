import "../styles/theme/index.css";
import { AvailableLanguage } from "../config";
import ElementPlusEnLang from "element-plus/es/locale/lang/en";
import ElementPlusZhCNLang from "element-plus/es/locale/lang/zh-cn";

export function locale(lang: AvailableLanguage) {
  let langFile;
  switch (lang) {
    case AvailableLanguage.En:
      langFile = ElementPlusEnLang;
      break;
    case AvailableLanguage.ZhCn:
      langFile = ElementPlusZhCNLang;
      break;
  }

  return langFile;
}
