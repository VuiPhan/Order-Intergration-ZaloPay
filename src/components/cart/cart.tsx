import CartItem from "../../models/cart/Cart";
import {Button, Popover} from "antd";
import {
    ShoppingCartOutlined,

} from '@ant-design/icons';
import './cart.scss'
import {Link} from "react-router-dom";
interface CartProps {
    cart: CartItem[]
}


export const Cart: React.FC<{ cardProps: CartProps }> = props => {
    const {cart} = props.cardProps;
    const content = (
        <div>
            {cart.map((d) =><ItemCartView itemCartViewProps={{item: d}}></ItemCartView>)}
            <Link to="/view-cart">Mua hàng</Link>
        </div>
    );

    return (
        <>
            <Popover placement="top" title="Giỏ hàng" content={content} trigger="click">
                <ShoppingCartOutlined/> {cart.length}
            </Popover>

        </>
    );
};

interface ItemCartViewProps {
    item: CartItem
}

const ItemCartView: React.FC<{ itemCartViewProps: ItemCartViewProps }> = props => {
    var item = props.itemCartViewProps.item;
    return (
        <div className="item-card-view">
            <p>{item.productName}</p>
            <p>{item.amount}</p>
            <p></p>
        </div>
    )
}