import MallClient from './client';

export interface MallHomeContent {
  advertiseList: any[];
  brandList: any[];
  homeFlashPromotion: any;
  newProductList: any[];
  hotProductList: any[];
  subjectList: any[];
}

export function fetchMallHomeContent() {
  return MallClient.get<MallHomeContent>('/home/content');
}

export function fetchRecommendMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get('/home/recommendProductList', { params });
}

export function fetchProductCategoryList(parentId: number) {
  return MallClient.get(`/home/productCateList/${parentId}`);
}

export function fetchNewMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get('/home/newProductList', { params });
}

export function fetchHotMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get('/home/hotProductList', { params });
}
