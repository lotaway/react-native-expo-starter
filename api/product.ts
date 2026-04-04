import client from './client';
import { MallProductDetailPayload, MallProductSummary } from '@/types/mall';

export function fetchProductDetail(id: number) {
  return client.get<MallProductDetailPayload>(`/product/detail/${id}`);
}

export interface ProductListQuery {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  productCategoryId?: number;
}

export function fetchProductList(params: ProductListQuery) {
  return client.get<MallProductSummary[]>('/product/queryProductList', { params });
}
