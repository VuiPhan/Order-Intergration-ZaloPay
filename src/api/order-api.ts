import axiosClient from "./axiosClient";
import {Order} from "../models/order/order";

const orderApi = {
    createOrder(order:Order){
        let url = '/create-order';
        return axiosClient.post(url,order)
    },
    getInfoOrderPayment(orderID:number){
        let url = `/info-order-payment?orderID=${orderID}`;
        return axiosClient.get(url)
    }
}
export  default  orderApi;