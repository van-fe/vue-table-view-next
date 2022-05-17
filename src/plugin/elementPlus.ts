import { AvailableLanguage } from "@/config";
import ElementPlusEnLang from "element-plus/es/locale/lang/en";
import ElementPlusZhCNLang from "element-plus/es/locale/lang/zh-cn";
import type { App } from "vue";

export default {
  install(app: App) {},
};

export function getLocalFile(lang: AvailableLanguage) {
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
