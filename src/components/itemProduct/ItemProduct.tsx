import PropTypes from 'prop-types';
import Item from "../../models/product/ItemProduct";
import './itemProduct.scss';
import {CURRENCY} from "../../utils/utils";

interface ItemProductProps {
    item: Item,
    addProductToCart: (item:Item) => void;
}

export const ItemProduct: React.FC<{ itemProductProps: ItemProductProps }> = props => {
    const item = props.itemProductProps.item;

    return (
        <>
            <div className="detail-item">
                <img className="detail-item__image" src={item.imageUrl}/>
                <h4>{item.productName}</h4>
                <p>{CURRENCY.format(item.price)}</p>
                <button className="detail-item__add-item" onClick={()=>{props.itemProductProps.addProductToCart(item)}}>Thêm vào giỏ hàng</button>
            </div>
        </>
    );
};
