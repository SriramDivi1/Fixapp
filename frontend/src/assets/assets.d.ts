// Type declarations for assets module
declare module '../assets/assets.js' {
  interface Assets {
    logo: string;
    about_image: string;
    contact_image: string;
    menu_icon: string;
    cross_icon: string;
    dropdown_icon: string;
    upload_icon: string;
    [key: string]: string;
  }

  export const assets: Assets;
  export const specialityData: Array<{ speciality: string; image: string }>;
  export const doctors: Array<any>;
}
