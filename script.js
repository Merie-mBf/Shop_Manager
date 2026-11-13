const products = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const category = document.getElementById("category");
const maxPrice = document.getElementById("maxPrice");
const inStock = document.getElementById("inStock");
const btnReset=document.getElementById("btnReset");
const form=document.querySelectorAll(".form");


const API_URL = "http://localhost:3000/api";


async function getProducts() {
    try {
        const response = await fetch(API_URL + "/products");

        if (!response.ok) {
            throw new Error("Loading products...");
        }

        const data = await response.json();

        afficheProduct(data, "No products available at the moment!");

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
        template += `
       <article 
                class="product-card  w-full sm:w-[48%] lg:w-[31%] bg-white rounded-3xl overflow-hidden border border-[#eee2d7] shadow-sm hover:shadow-lg transition duration-300">
                <img class="w-full h-64 object-contain bg-[#f0e5d9] p-6" src="http://localhost:3000${product.image}" alt="${product.name}">
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



function searchProduct() {
    searchInput.addEventListener("input", async function () {
        const searchValue = searchInput.value.trim();

        try {
            const response = await fetch(
                `${API_URL}/products?search=${searchValue}`
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
    });
}
searchProduct();



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



function filterByCategories() {
    category.addEventListener("change", async function () {
        try {
            const selectedCategory = this.value;
            let URL;

            if (selectedCategory === "") {
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

    });
}
filterByCategories()



function filterByMaxPrice() {
    maxPrice.addEventListener("input", async function () {

        try {
            const price = maxPrice.value;
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


    })
}
filterByMaxPrice()



function filterByStock() {
    inStock.addEventListener("change", async function () {
        try {
            let URL;

            if (this.checked) {
                URL = `${API_URL}/products?inStock=true`;
            } else {
                URL = `${API_URL}/products`;
            }

            const response = await fetch(URL);

            if (!response.ok) {
                throw new Error("Failed to filter products by stock");
            }

            const data = await response.json();

            afficheProduct(data, "No products match your selected filters!");

        } catch (error) {
            console.log(error);
        }
    });
}

filterByStock();



async function filterByAll() {

    category.addEventListener("change", FilteredProducts);
    maxPrice.addEventListener("input", FilteredProducts);
    inStock.addEventListener("change", FilteredProducts);

    async function FilteredProducts() {
        try {
            let url = `${API_URL}/products?`;

            if (category.value !== "") {
                url += `categoryId=${category.value}&`;
            }

            if (maxPrice.value !== "") {
                url += `maxPrice=${maxPrice.value}&`;
            }

            if (inStock.checked) {
                url += `inStock=true`;
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
}

filterByAll();

//swith alert 
function resetForm(){
  btnReset.addEventListener('click', () => {
    searchInput.value = "";
    category.value = "";
    maxPrice.value = "";
   inStock.checked = "";
   console.log("réinitialiser des filtres ")
    
   getProducts()
  });

}
resetForm();
