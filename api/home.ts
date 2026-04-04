import MallClient from './client';
import { MallHomeContent, MallProductCategory, MallProductSummary } from '@/types/mall';

export function fetchMallHomeContent() {
  return MallClient.get<MallHomeContent>('/home/content');
}

export function fetchRecommendMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get<MallProductSummary[]>('/home/recommendProductList', { params });
}

export function fetchProductCategoryList(parentId: number) {
  return MallClient.get<MallProductCategory[]>(`/home/productCateList/${parentId}`);
}

export function fetchNewMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get<MallProductSummary[]>('/home/newProductList', { params });
}

export function fetchHotMallProductList(params: { pageSize: number; pageNum: number }) {
  return MallClient.get<MallProductSummary[]>('/home/hotProductList', { params });
}
