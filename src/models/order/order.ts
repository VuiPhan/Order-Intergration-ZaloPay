export interface Order{
    order_id: number,
    notes: string,
    order_detail: OrderDetail[]

}

export interface OrderDetail{
    product_id : number
    product_name: string
    price : number
    amount : number
    notes ?: string
}


export interface InfoOrderPayment{
    "order_id": number,
    "payment_amount": number,
    "created_by": string,
    "created_on": Date,
    "status": number
}

