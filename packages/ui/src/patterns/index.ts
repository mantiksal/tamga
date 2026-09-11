/**
 * ŞABLON KATMANI — `tamga-ui/patterns`.
 *
 * AYRI GİRİŞ, ana `tamga-ui` değil, ve bu bilinçli: bir bileşen ile bir ekran
 * şekli aynı şey değil. Kitin bileşenleri hiçbir düzen dayatmıyor; şablonlar
 * dayatıyor, çünkü işleri o. Ayrı bir giriş, bir ürünün "yalnız bileşenleri
 * alayım" diyebilmesi demek.
 */
/* `ErrorSlot` ve `Busy` DIŞA VURULMUYOR: şablonların iç makinesi. Hata ve
   yükleme hâllerini şablonlar zaten kendileri çiziyor, ve ikisini ayrıca
   sunmak "aynı hâli iki farklı yoldan çizme" davetiydi. Bir tüketici o
   görünümü istiyorsa şablonu kullanıyor. */
export {
  PlainLink,
  errorDetail,
  type ErrorLabels,
  type LinkComponent,
  type TemplateError,
} from "./shared.js";
export { ListTemplate, type ListState, type ListTemplateProps } from "./list-template.js";
export {
  OverviewTemplate,
  type OverviewState,
  type OverviewTemplateProps,
} from "./overview-template.js";
export {
  DetailTemplate,
  type DetailState,
  type DetailTab,
  type DetailTemplateProps,
} from "./detail-template.js";
export {
  SettingsTemplate,
  SettingsPanel,
  type SettingsScope,
  type SettingsSection,
  type SettingsState,
  type SettingsTemplateProps,
} from "./settings-template.js";
export { AuthTemplate, AuthProviders } from "./auth-template.js";
export { WizardTemplate, type WizardStep, type WizardTemplateProps } from "./wizard-template.js";
export { PublicTemplate, type PublicState, type PublicTemplateProps } from "./public-template.js";
export { AppShell, type NavEntry, type AppShellProps } from "./app-shell.js";
