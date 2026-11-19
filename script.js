import { readProduct } from "./storage.js";
import { saveProduct } from "./storage.js";

const products = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const category = document.getElementById("category");
const maxPrice = document.getElementById("maxPrice");
const inStock = document.getElementById("inStock");
const btnReset = document.getElementById("btnReset");
const cart = document.getElementById("cart");
const GoToCart = document.getElementById("GoToCart");
const closeCart = document.getElementById("closeCart");
const ListcartProduct = document.getElementById("ListCartProducts");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");



const API_URL = "http://localhost:3000/api";

let AllProducts = [];
let cartProducts = readProduct();



//Shop Manager 1/1
async function getProducts() {
    try {
        const response = await fetch(API_URL + "/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        AllProducts = await response.json();

        afficheCart();
        afficheProduct(AllProducts, "No products available at the moment!");

    } catch (error) {
        console.log(error);

        products.innerHTML = `
            <div class="w-full min-h-[60vh] flex items-center justify-center">
                <p class="font-bold text-[#795337] text-xl w-full">
                   Unable to load products. Please try again later.
                </p>
            </div>
        `;
    }
}
getProducts();



function afficheProduct(data, messageErr) {
    let template = "";
    if (data.length === 0) {
        products.innerHTML = `
    <p class="font-bold text-[#795337] text-xl w-full">${messageErr}</p>`;
        return;
    }
    data.forEach(product => {
        const outOfStock = product.stock === 0;
        template += `
       <article data-id="${product.id}" data-price="${product.price}" data-stock="${product.stock}"
                class="product-card  w-full sm:w-[48%] lg:w-[31%] bg-white rounded-3xl overflow-hidden border border-[#eee2d7] shadow-sm hover:shadow-lg transition duration-300">
                <img class="w-full h-64 object-contain bg-[#f0e5d9] p-6" src="http://localhost:3000${product.image}" alt="${product.name}">
                <div class="product-info p-6">
                    <h4 class="text-xl font-bold text-[#382719] mb-3">${product.name}</h4>
                    <p class="text-gray-600 text-base leading-7 mb-5">${product.description}</p>
                    <span class="block text-[#9b765e] border-t border-[#eee2d7] pt-4 mb-3">Price:${product.price}DH</span>
                    <span class="block text-[#9b765e] mb-3">Category:${product.categoryName}</span>
                </div>
                <div class="flex items-center justify-between mb-1 ml-5 mr-6">
                   <span class="inline-block bg-[#f3e9df] text-[#795337] rounded-full px-4 py-2   text-sm font-semibold">In stock:${product.stock}</span>
                   <input type="number" min="1" max="${product.stock}" value="1"
                        class="w-16 h-9 text-center bg-[#f8f3ee] border border-[#e5d5c5] rounded-lg text-sm text-[#382719] outline-none focus:border-[#9b765e]">
                </div>
                <div class="flex justify-center mt-8 mb-2">
                   <button ${outOfStock ? "disabled" : ""}
                        class="addToCard w-80 h-9 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2
                        ${outOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-[#795337] hover:bg-[#5f4029]"}">
                        <i class="fa-solid fa-cart-shopping"></i>${outOfStock ? "Out of stock" : "Add to cart"}
                   </button>
                </div>
        </article>`
        console.log(product.image);
    });
    products.innerHTML = template;
}



async function searchProduct(searchInput) {
    try {
        const response = await fetch(
            `${API_URL}/products?search=${searchInput}`
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data = await response.json();
        afficheProduct(data, "No products found!");

    } catch (error) {
        console.log(error);
        products.innerHTML = `
        <p class="font-bold text-[#795337] text-xl w-full">
            Unable to search products. Please try again.
        </p>
    `;
    }

}
searchInput.addEventListener("input", async function () {
    searchProduct(searchInput.value.trim());
})



async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error("Failed to load categories");
        }

        const data = await response.json();

        const option = document.createElement("option");
        option.value = "";
        option.textContent = "All Categories";
        category.appendChild(option);

        data.forEach(item => {
            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.name;

            category.appendChild(option);
        });

    } catch (error) {
        console.log(error.message);
    }
}
getCategories();



/* async function filterByCategories(selectedCategory) {
    try {
        let URL;

        if (category.value === "") {
            URL = `${API_URL}/products`;
        } else {
            URL = `${API_URL}/products?categoryId=${selectedCategory}`;
        }

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to filter products by category");
        }

        const data = await response.json();

        afficheProduct(data, "No products match your selected filters!");

    } catch (error) {
        console.log(error);
    }
} */
category.addEventListener("change", async function () {
    //filterByCategories(category.value);
    filterByAll();
})



/* async function filterByMaxPrice(price) {

    try {
        const response = await fetch(
            `${API_URL}/products?maxPrice=${price}`
        );

        if (!response.ok) {
            throw new Error("Failed to filter products by maximum price");
        }

        const data = await response.json();

        afficheProduct(data, "No products match your selected filters!");

    } catch (error) {
        console.log(error);
    }



} */
maxPrice.addEventListener("input", async function () {
    //filterByMaxPrice(maxPrice.value);
    filterByAll();
})



/* async function filterByStock(isChecked) {
    try {
        let URL;

        if (isChecked) {
            URL = `${API_URL}/products?inStock=true`;
            console.log("-----products in stock-----")
        } else {
            URL = `${API_URL}/products`;
            console.log("-----products in data-----")
        }

        const response = await fetch(URL);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();

        afficheProduct(data, "No products found!");

    } catch (error) {
        console.log(error);
    }
}
 */
inStock.addEventListener("change", () => {
    //filterByStock(inStock.checked);
    filterByAll();
});


async function filterByAll() {
    try {
        let url = `${API_URL}/products?`;

        if (category.value !== "") {
            url += `categoryId=${category.value}&`;
        }

        if (maxPrice.value !== "") {
            url += `maxPrice=${maxPrice.value}&`;
        }

        if (inStock.checked) {
            url += `inStock=true&`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to filter products");
        }

        const data = await response.json();

        afficheProduct(data, "No products match your selected filters!");

    } catch (error) {
        console.log(error);
    }
}



function resetForm() {
    btnReset.addEventListener('click', () => {
        searchInput.value = "";
        category.value = "";
        maxPrice.value = "";
        inStock.checked = false;
        console.log("réinitialiser des filtres!")

        getProducts();
    });
}
resetForm();


//Shop Manager 2/2
GoToCart.addEventListener("click", (e) => {
    e.preventDefault();
    afficheCart();
    cart.showModal();
});

closeCart.addEventListener("click", () => {
    cart.close()
});

cart.addEventListener("click", (e) => {
    if (e.target === cart) cart.close();
});

//Ajouter un produit au panier depuis sa carte
function getInfosProduct(button) {
    const card = button.closest(".product-card");
    const quantity = Number(card.querySelector("input").value);
    const product = AllProducts.find(p => p.id == card.dataset.id);

    if (quantity < 1 || quantity > product.stock) {
        Swal.fire({
            title: 'Invalid Quantity!',
            text: `Please enter a quantity between 1 and ${product.stock}.`,
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#795337'
        });
        return;
    }
    return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
    };
}

document.addEventListener("click", (e) => {
    const button = e.target.closest(".addToCard");
    if (!button) return;

    const product = getInfosProduct(button);
    if (!product) return;

    const stock = AllProducts.find(p => p.id == product.id).stock;
    const ProductExist = cartProducts.find(p => p.id == product.id);
    const quantity = ProductExist ? ProductExist.quantity : 0;
    const newQuantity = quantity + Number(product.quantity);

    if (newQuantity > stock) {
        const newStock = Math.max(stock - quantity, 0);
        Swal.fire({
            title: 'Insufficient stock',
            text:
                newStock > 0
                    ? `You can add ${newStock} more.`
                    : 'Cart is at max stock.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#795337',
        });
        return;
    }
    //augmenter la quantité au lieu de créer une deuxième ligne
    if (ProductExist) {
        ProductExist.quantity += product.quantity;

    } else {
        cartProducts.push(product);
    }
    saveProduct(cartProducts);
    Swal.fire({
        title: 'success',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#795337'
    });


});

//Afficher pour chaque ligne : Image, Nom, Prix unitaire, Quantité, Sous-total.
function afficheCart() {
    //Afficher un message lorsque le panier est vide.
    if (cartProducts.length === 0) {
        ListcartProduct.innerHTML = `<p class="text-[#795337] font-bold">Your cart is empty.</p>`;
        cartCount.textContent = 0;
        cartTotal.textContent = 0;
        return;
    }

    ListcartProduct.innerHTML = cartProducts.map(item => {
        const stock = AllProducts.find(p => p.id == item.id).stock;
        return ` <article data-id="${item.id}"
            class="product-cart w-full bg-white rounded-2xl border border-[#eee2d7] shadow-sm flex items-center gap-4 p-4 mb-3">
            <img class="w-28 h-28 shrink-0 object-contain rounded-xl bg-[#f0e5d9] p-1"
                 src="http://localhost:3000${item.image}" alt="${item.name}">
            <div class="product-info flex-1 min-w-0">
                <h4 class="text-base font-bold text-[#382719] mb-2">${item.name}</h4>
                <span class="block text-sm text-[#9b765e] mb-1">${item.price} DH</span>
                <span class="block text-sm font-semibold text-[#382719] mb-2">Sous-total: ${item.price * item.quantity} DH</span>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-[#9b765e]">Quantité:</span>
                    <button class="quantityMinus w-7 h-7 rounded bg-[#f0e5d9]">-</button>
                    <input type="number" min="1" max="${stock}" value="${item.quantity}"
                        class="quantity-input w-12 h-7 text-center border border-[#eee2d7] rounded" readonly>
                    <button class="quantityPlus w-7 h-7 rounded bg-[#f0e5d9]">+</button>
                </div>
            </div>
            <button  title="Supprimer">
                <i class="removeLigne fa-solid fa-trash-can self-end w-10 h-10 flex items-center justify-center rounded-xl text-[#9b765e]
                 hover:bg-red-50 hover:text-red-500 transition duration-200" data-id="${item.id}"></i>
            </button>
        </article>
    `}).join("");

    //Afficher le nombre d'articles et le total du panier.
    cartCount.textContent = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
    cartTotal.textContent = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
}


ListcartProduct.addEventListener("click", (e) => {
    const plus = e.target.closest(".quantityPlus");
    const minus = e.target.closest(".quantityMinus");
    if (!plus && !minus) return;


    const id = e.target.closest(".product-cart").dataset.id;
    const item = cartProducts.find(p => p.id == id);
    const stock = AllProducts.find(p => p.id == id).stock;

    if (plus && item.quantity < stock) item.quantity++;
    if (minus && item.quantity > 1) item.quantity--;

    saveProduct(cartProducts);
    afficheCart();
});


//supprimer (retirer une ligne)
ListcartProduct.addEventListener("click", function (event) {

    let button = event.target.closest(".removeLigne");

    if (button) {
        deleteLigne(button);
    }

});

function filterProductById(id) {
    return cartProducts.filter(item => item.id != id);
}


function deleteLigne(target) {
    let idDelete = target.dataset.id;

    cartProducts = filterProductById(idDelete);
    saveProduct(cartProducts);
    afficheCart();
}

//Vider le panier.
clearCart.addEventListener("click", () => {
    cartProducts = [];

    
    saveProduct(cartProducts);
    afficheCart();
});