const PRODUCT_KEY = "cartProducts";

export function readProduct() {
    return JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];
}

export function saveProduct(cartProducts) {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(cartProducts))
}
