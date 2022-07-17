import axiosClient from "./axiosClient";

const productApi = {
    getListProduct() {
        const url = '/get-list-product';
        return axiosClient.get(url);
    }
}
export default productApi;