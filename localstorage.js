const CART_KEY = "cart";


function readCartFromLS(){
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}


function saveCartToLS(newCartItems){
    localStorage.setItem(CART_KEY, JSON.stringify(newCartItems) ) ;
}