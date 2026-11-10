const products = document.getElementById("products");
const API_URL = "http://localhost:3000/api";

async function getProducts() {
    const response = await fetch(API_URL + "/products");

    const data = await response.json();

    console.log(data);

    afficheProduct(data)
}

getProducts();


