export interface MallBanner {
  id: number;
  pic: string;
}

export interface MallBrand {
  id: number;
  name: string;
  logo: string;
  productCount: number;
}

export interface MallProductSummary {
  id: number;
  name: string;
  subTitle: string;
  pic: string;
  price: number;
}

export interface MallFlashPromotion {
  id: number;
  productList: MallProductSummary[];
}

export interface MallHomeContent {
  advertiseList: MallBanner[];
  brandList: MallBrand[];
  homeFlashPromotion: MallFlashPromotion | null;
  newProductList: MallProductSummary[];
  hotProductList: MallProductSummary[];
}

export interface MallProductCategory {
  id: number;
  name: string;
  icon?: string;
  parentId: number;
}

export interface MallProduct {
  id: number;
  name: string;
  subTitle: string;
  pic: string;
  albumPics: string;
  price: number;
  originalPrice: number;
  sale: number;
  stock: number;
  detailMobileHtml: string;
}

export interface MallProductDetailPayload {
  product: MallProduct;
}
