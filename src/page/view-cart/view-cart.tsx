import {useState, useEffect} from 'react'
import Cart from "../../models/cart/Cart";
import './view-cart.scss'
import {inspect} from "util";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Customer from "../../models/customer/customer";
import {json} from "stream/consumers";
import {ChangeEvent} from 'react';
import orderApi from "../../api/order-api";
import {InfoOrderPayment, Order, OrderDetail} from "../../models/order/order";

import QRCode from 'qrcode.react';
import {ResponseCreateOrder} from "../../models/intergration/zalopay";
import {AxiosResponse} from "axios";

import {Modal} from 'antd';

export const ViewCard: React.FC<{}> = props => {
    const [items, setItems] = useState([] as Cart[]);
    const [infoCus, setInfoCus] = useState({
        customerName: '',
        customerAddress: '',
        phoneNumber: '',
        notes: ''
    } as Customer);
    const [resCreateOrder, setResCreateOrder] = useState({
        order_id: 0,
        info_order_from_zalo_pay: {order_url: ''}
    } as ResponseCreateOrder);
    const [resInfoPayment, setResInfoPayment] = useState({} as InfoOrderPayment)

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        var listCart = localStorage.getItem('items');
        const items = JSON.parse(listCart || '[]');
        if (items) {
            setItems(items);
        }
    }, []);
    const handleCancel = () =>{
        setIsModalVisible(false);
    }
    const onChangeCustomerName = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInfoCus({...infoCus, customerName: newValue})
    }
    const onChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInfoCus({...infoCus, phoneNumber: newValue})
    }
    const onChangeNotes = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInfoCus({...infoCus, notes: newValue})
    }
    const onChangeAddress = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInfoCus({...infoCus, customerAddress: newValue})
    }
    const createOrder = () => {
        let detail = items.map((item, index) => {
            let detail: OrderDetail = {
                product_id: item.productID,
                product_name: item.productName,
                price: item.price,
                amount: item.amount
            };
            return detail;
        });
        let order: Order = {
            order_id: 1,
            notes: '',
            order_detail: detail
        };
        orderApi.createOrder(order).then((result: AxiosResponse<ResponseCreateOrder>) => {
            let newRes = {...resCreateOrder};
            newRes.info_order_from_zalo_pay.order_url = result.data.info_order_from_zalo_pay.order_url;
            newRes.order_id = result.data.order_id;
            setResCreateOrder(newRes);
            setIsModalVisible(true)
            setTimeout(()=>{callApiCheckStatusPayment(true,result.data.order_id)},3000)

        });
    }
    const callApiCheckStatusPayment= (isRun:boolean,orderID: number) =>{
        if(isRun)
        {
            setTimeout(()=>{
                orderApi.getInfoOrderPayment(orderID).then((result: AxiosResponse<InfoOrderPayment>) => {
                    if(result.data.status == 1){
                        setResInfoPayment(result.data);
                    }
                    else{
                        callApiCheckStatusPayment(true,orderID);
                    }
                })
            },1000)

        }
    }
    return (
        <>
            <div className="info-feature">Th??ng tin ????n h??ng</div>
            <div className="info-order">
                <div className="info-order__customer">
                    <h3 className="info-order__customer__header">Th??ng tin kh??ch h??ng</h3>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>T??n kh??ch h??ng</Form.Label>
                            <Form.Control type="text" value={infoCus.customerName} onChange={onChangeCustomerName}
                                          placeholder="Nh???p t??n kh??ch h??ng"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>S??? ??i???n tho???i</Form.Label>
                            <Form.Control type="text" placeholder="S??? ??i???n tho???i" value={infoCus.phoneNumber}
                                          onChange={onChangePhone}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Ghi ch??</Form.Label>
                            <Form.Control type="text" placeholder="Ghi ch??" value={infoCus.notes}
                                          onChange={onChangeNotes}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>?????a ch??? giao h??ng</Form.Label>
                            <Form.Control type="text" placeholder="?????a ch??? giao h??ng" value={infoCus.customerAddress}
                                          onChange={onChangeAddress}/>
                        </Form.Group>
                        <p>Vui l??ng ch???n h??nh th???c thanh to??n:</p>
                        <div className="mb-1">
                            <label><input type="radio" name="iCheck" className="iradio_flat-blue"/> V?? <img
                                src="images/logo-zalopay.svg" alt=""/></label>
                        </div>
                        <div className="mb-1">
                            <label><input type="radio" name="iCheck" className="iradio_flat-blue"/> Visa, Mastercard,
                                JCB <span className="txtGray">(qua c???ng ZaloPay)</span></label>
                        </div>
                        <div className="mb-1">
                            <label><input type="radio" name="iCheck" className="iradio_flat-blue" checked/> Th???
                                ATM <span
                                    className="txtGray">(qua c???ng ZaloPay)</span></label>
                        </div>
                        <Button variant="primary" onClick={createOrder}>
                            ?????t h??ng
                        </Button>


                    </Form>

                </div>
                <div className="info-order__cart">
                    <h3 className="info-order__cart__header">Th??ng tin s???n ph???m</h3>
                    {items.map((item, index) => (
                        <div className="info-order__cart__item" key={index}>
                            <img className="info-order__cart__item__image" src={item.imageUrl}/>
                            <div className="info-order__cart__info">
                                <h6 className="info-order__cart__info__productName">T??n s???n
                                    ph???m: {item.productName}</h6>
                                <h6 className="info-order__cart__info__amount">S??? l?????ng: {item.amount}</h6>
                                <h6 className="info-order__cart__info__amount">????n gi??: {item.price}</h6>
                                <h6 className="info-order__cart__info__amount">T???ng
                                    ti???n: {item.amount * item.price}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <Modal title="Kh???i t???o ????n h??ng th??nh c??ng" visible={isModalVisible} onCancel={handleCancel}>
                <div className="popup_order_payment">
                    <div className="popup_order_payment__QR">
                    {resCreateOrder.info_order_from_zalo_pay.order_url ? <QRCode
                        id='qrcode'
                        value={resCreateOrder.info_order_from_zalo_pay.order_url}
                        size={190}
                        level={'H'}
                        includeMargin={true}
                    /> : null}
                        <h6>Giao d???ch k???t th??c trong: 15:00</h6>
                        <h6 style={{ color: resInfoPayment.status == 1 ? 'green': 'red'}}>Tr???ng th??i giao d???ch: {resInfoPayment.status == 1 ? "Thanh to??n th??nh c??ng" : "Ch??? thanh to??n"}</h6>
                    </div>
                    <div className="popup_order_payment__info">
                    <h4>Th??ng tin ????n h??ng</h4>
                    <h6>M?? ????n h??ng: {resCreateOrder.order_id}</h6>
                    <h6>N???i dung: Thanh to??n ????n h??ng #{resCreateOrder.order_id} t???i Shop VuiPhan</h6>
                        <div className="popup_order_payment__instruction">
                            <h4>Thanh to??n v???i ZaloPay b???ng m?? QR</h4>
                            <h6>B?????c 1: M??? ???ng d???ng ZaloPay</h6>
                            <h6>B?????c 2: Ch???n thanh to??n v?? qu??t m?? QR</h6>
                            <h6>B?????c 3: X??c nh???n thanh to??n ??? ???ng d???ng</h6>
                        </div>
                    </div>

                </div>
            </Modal>
        </>
    );
};

