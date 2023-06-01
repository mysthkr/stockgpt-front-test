// ユーザー
export type User = {
  id: number
  username: string
  displayName: string
  email: string
  profileImageUrl: string
  description: string
}

// 商品
export type Product = {
  id: number
  category_product_id: number
  sub_category_product_id: number
  item_id: number
  maker_id: number
  picture: string
}

// APIコンテキスト
export type ApiContext = {
  apiRootUrl: string = 'http://localhost:3010/api/v1'
}