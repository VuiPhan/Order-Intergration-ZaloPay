import {useEffect, useState} from 'react'
import {ItemProduct} from "../../components/itemProduct/ItemProduct";
import './viewProduct.scss'
import Item from '../../models/product/ItemProduct';
import {Cart} from 'components/cart/cart';
import CartItem from "../../models/cart/Cart";
import productApi from "../../api/product-api";

export const ViewProduct: React.FC<{}> = props => {
    const LIST_PRODUCT: Item[] = [{
        productID: 1,
        productName: "Sữa tươi có đường Vinamilk A",
        imageUrl: "https://cdn.tgdd.vn/Products/Images/8275/174506/bhx/hat-dieu-mau-viet-san-goi-100g-202206031527347837_300x300.jpg",
        price: 20000
    },
        {
            productID: 2,
            productName: "Sữa bột Wincofood GoldCare Gain vani ",
            imageUrl: "https://cdn.tgdd.vn/Products/Images/7199/224816/bhx/keo-deo-hinh-banh-xe-play-more-wheel-goi-27g-202205191513119831_300x300.jpg",
            price: 40000
        }, {
            productID: 3,
            productName: "Bánhs quy sữa",
            imageUrl: "https://cdn.tgdd.vn/Products/Images/3357/224802/bhx/banh-quy-sua-hokka-moominvalley-goi-23g-202205170815172419_300x300.jpg",
            price: 50000
        }, {
            productID: 4,
            productName: "Xà phòng",
            price: 30000,
            imageUrl: "https://cdn.tgdd.vn/Products/Images/8275/174506/bhx/hat-dieu-mau-viet-san-goi-100g-202206031527347837_300x300.jpg",

        },
    ];
    const [listProduct, setListProduct] = useState(LIST_PRODUCT);
    const [listItemCart, setListItemCart] = useState([] as CartItem[]);

    const addProductToCart = (item: Item) => {
        let itemExistIndex = listItemCart.findIndex(p => p.productID == item.productID);
        let itemCart: CartItem = {
            productID: item.productID,
            productName: item.productName,
            price: item.price,
            amount: 0,
            imageUrl:item.imageUrl
        }
        if (itemExistIndex < 0) {
            itemCart.amount = 1;
            setListItemCart([...listItemCart, itemCart]);
            localStorage.setItem('items', JSON.stringify([...listItemCart, itemCart]));


        } else {
            let listCartNew = [...listItemCart];
            listCartNew[itemExistIndex].amount += 1;
            setListItemCart(listCartNew);
            localStorage.setItem('items', JSON.stringify(listCartNew));

        }

    }
    useEffect(() => {
        var listCart = localStorage.getItem('items');
        const items = JSON.parse(listCart || '[]');
        if (items) {
            setListItemCart(items);
        }
        productApi.getListProduct().then((result)=>{
            console.log(result);
        })



    }, []);
    return (
        <div className="container view-list-product">
            <div className="view-list-product__header">
                <h1> View product </h1>
                <Cart cardProps={{cart: listItemCart}}></Cart>
            </div>
            <div className="per-product">
                {listProduct.map((item, index) => (
                    <ItemProduct itemProductProps={{item: item, addProductToCart}} key={index}></ItemProduct>
                ))}
            </div>
        </div>
    );
};