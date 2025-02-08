export type ReceiptItem = {
  name: string
  price: number
}

export type ReceiptData = {
  restaurant: string
  items: ReceiptItem[]
  subtotal: number
  total: number
  currency: string
} 