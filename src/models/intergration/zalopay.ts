export interface ResponseCreateOrder{
    order_id: number
    info_order_from_zalo_pay: InfoOrderZaloPay
}
interface InfoOrderZaloPay{
    order_url: string
}