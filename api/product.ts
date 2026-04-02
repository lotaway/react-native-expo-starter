import client from './client';

export function fetchProductDetail(id: number) {
  return client.get(`/product/detail/${id}`);
}

export function fetchProductList(params: any) {
  return client.get('/product/queryProductList', { params });
}
