const products = document.getElementById("products");
const API_URL = "http://localhost:3000/api";

async function getProducts() {
    try {
        const response = await fetch(API_URL + "/products");

        if (!response.ok) {
            throw new Error("Loading products...");
        }

        const data = await response.json();

        afficheProduct(data);

    } catch (error) {
        console.log(error);

        products.innerHTML = `
            <div class="w-full min-h-[60vh] flex items-center justify-center">
                <p class="text-center font-bold text-xl text-red-600">
                   Unable to load products. Please try again later.
                </p>
            </div>
        `;
    }
}
getProducts();

function afficheProduct(data) {
    let template = "";
    if (data.length === 0) {
        products.innerHTML = `
    <p class="font-bold text-[#795337] text-xl w-full">No products available at the moment !</p>`;
        return;
    }
    data.forEach(product => {
        template += `
       <article 
                class="w-full sm:w-[48%] lg:w-[31%] bg-white rounded-3xl overflow-hidden border border-[#eee2d7] shadow-sm hover:shadow-lg transition duration-300">
                <img class="w-full h-64 object-contain bg-[#f0e5d9] p-6" src="http://localhost:3000${product.image}" alt="Smart Watch Pro">
                <div class="product-info p-6">
                    <h4 class="text-xl font-bold text-[#382719] mb-3">${product.name}</h4>
                    <p class="text-gray-600 text-base leading-7 mb-5">${product.description}</p>
                    <span class="block text-[#9b765e] border-t border-[#eee2d7] pt-4 mb-3">Price:${product.price}DH</span>
                    <span class="block text-[#9b765e] mb-3">Category:${product.categoryName}</span>
                    <span class="inline-block bg-[#f3e9df] text-[#795337] rounded-full px-4 py-2 text-sm font-semibold">In stock:${product.stock}</span>
                </div>
            </article>`
        console.log(product.image);
    });
    products.innerHTML = template;
}
