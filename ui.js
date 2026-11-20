function noProductsFoundHTML() {
    return `<div class="w-full mb-2">
                <h3 class="text-3xl font-bold text-[#70452F] mb-2">No Products Available for now!!</h3>
            </div>`
}


function constructProductCard(product) {
    let outOfStock = product.stock == 0;
    return `
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
        </article>
    `
}


function createOption(value, text){
    let option = document.createElement('option')
    option.value = value;
    option.innerText = text;
    return option;
}


function cartItemHtml(item){
    return `
    
    <article data-id="${item.product.id}"
            class="product-cart w-full bg-white rounded-2xl border border-[#eee2d7] shadow-sm flex items-center gap-4 p-4 mb-3">
            <img class="w-28 h-28 shrink-0 object-contain rounded-xl bg-[#f0e5d9] p-1"
                 src="http://localhost:3000${item.product.image}" alt="${item.product.name}">
            <div class="product-info flex-1 min-w-0">
                <h4 class="text-base font-bold text-[#382719] mb-2">${item.product.name}</h4>
                <span class="block text-sm text-[#9b765e] mb-1">${item.product.price} DH</span>
                <span class="block text-sm font-semibold text-[#382719] mb-2">Sous-total: ${item.product.price * item.selectedQuantity} DH</span>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-[#9b765e]">Quantité:</span>
                    <button class="quantityMinus w-7 h-7 rounded bg-[#f0e5d9]">-</button>
                    <input type="number" min="1" max="${item.product.stock}" value="${item.selectedQuantity}"
                        class="quantity-input w-12 h-7 text-center border border-[#eee2d7] rounded" readonly>
                    <button class="quantityPlus w-7 h-7 rounded bg-[#f0e5d9]">+</button>
                </div>
            </div>
            <button  title="Supprimer">
                <i class="removeLigne fa-solid fa-trash-can  w-10 h-10 flex items-center justify-center rounded-xl text-[#9b765e]
                 hover:bg-red-50 hover:text-red-500 transition duration-200" data-id="${item.id}"></i>
            </button>
        </article>
    `
}