

const productsContainer = document.querySelector("#products");
const selectCategoryInput = document.querySelector("#category");
const filtersContainer = document.querySelector("#filter");
const openCartButton = document.querySelector("#GoToCart");
const closeCartButton = document.querySelector("#closeCart");
const cartDialog = document.querySelector("#cart");
const ListCartProducts = document.querySelector("#ListCartProducts");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const reserveCartBtn = document.querySelector("#reserveCart");
const clearCartBtn = document.querySelector("#clearCart");
const reservationForm = document.querySelector("#FormClient");
const envoieDataBtn = document.querySelector("#envoieData");


function displayProducts(products) {
    if (!products || products.length == 0) {
        productsContainer.innerHTML = noProductsFoundHTML();
    }

    let productsCards = products.map((product) => constructProductCard(product)).join("");

    productsContainer.innerHTML = productsCards;
}


function displaycategories(categories) {

    if (!categories || categories.length == 0) {
        selectCategoryInput.appendChild(createOption("", "No Categories Available!"))
    }

    selectCategoryInput.append(createOption(0, "All"))

    let options = categories.map((category) => createOption(category.id, category.name));

    selectCategoryInput.append(...options);
}


function attachInputEventToFilters() {
    filtersContainer.addEventListener('input', async (event) => {
        if (!event.target.classList.contains('products-data-filter')) return;

        let maxPriceValue = document.querySelector('#maxPrice').value;
        let maxPrice = 0;
        if (maxPriceValue && maxPriceValue > 0) maxPrice = maxPriceValue;

        let searchValue = document.querySelector('#searchInput').value
        let inStock = document.querySelector('#inStock').checked
        let categoryId = document.querySelector('#category').value

        let queryParams = {
            maxPrice,
            searchValue,
            inStock,
            categoryId
        }

        //console.log(queryParams);

        let products = await fetchProductsWithCriteria(queryParams);

        displayProducts(products);

    })

}



function fillTheCart() {

    let items = readCartFromLS();


    let articles = items.map((item) => cartItemHtml(item)).join("")

    ListCartProducts.innerHTML = articles;

    cartCount.textContent = items.length;
    cartTotal.textContent = items.reduce((acc, item) => acc + (item.product.price * item.selectedQuantity), 0);


}


function attachCartEvents() {

    openCartButton.addEventListener('click', () => {

        fillTheCart();

        cartDialog.showModal();
    })

    closeCartButton.addEventListener('click', () => {
        cartDialog.close();
    })


    productsContainer.addEventListener('click', async (event) => {
        if (!event.target.classList.contains("addToCard")) return;


        let idProduct = event.target.closest("[data-id]").dataset.id;

        let product = await fetchProductById(idProduct);


        let selectedQuantity = +event.target.parentElement.parentElement.querySelector("input").value;


        let item = {
            product,
            selectedQuantity
        }

        if (selectedQuantity > product.stock) {
            Swal.fire({
                title: 'Invalid Quantity!',
                text: `Please enter a quantity between 1 and ${product.stock}.`,
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#795337'
            });
            return;
        };

        let cartItems = readCartFromLS();


        let productToFind = cartItems.find((it) => it.product.id == idProduct);

        if (productToFind) {

            if (productToFind.selectedQuantity + selectedQuantity > product.stock) {
                Swal.fire({
                    title: 'Invalid Quantity!',
                    text: `Please enter a quantity between 1 and ${product.stock}.`,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#795337'
                });
                return;
            };


            productToFind.selectedQuantity += selectedQuantity;


        }
        else cartItems.push(item)

        saveCartToLS(cartItems);

    })


    clearCartBtn.addEventListener('click', (event) => {
        saveCartToLS([]);
        fillTheCart();
    })

    reserveCartBtn.addEventListener('click', (event) => {
        cartDialog.close();
        reservationForm.showModal();
    })


    envoieDataBtn.addEventListener('click', async (event) => {

        event.preventDefault();

        let form = event.target.closest('form')

        let inputs = form.querySelectorAll('input')
        let notes = form.querySelector('textarea').value
        let customer = {};

        inputs.forEach((inpt) => {
            customer[inpt.name] = inpt.value
        })


        let items = readCartFromLS();

        let reservations = items.map((it) => {

            return {
                quantity: it.selectedQuantity,
                productId: it.product.id,
                customer: customer,
                notes: notes
            }


        })




        let failed = await postReservations(reservations);


        if (!failed.length == 0) {
            Swal.fire({
                title: 'Invalid Reservation Creation',
                text: `something whaever 3yiit!!`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#795337'
            });

        }


        let failedItems = items.filter((it) => failed.includes(it.product.id))


        saveCartToLS(failedItems);



        fillTheCart()


    })

}

async function initApp() {

    //init products
    let products = await fetchProducts();
    displayProducts(products);


    let categories = await fetchCategories();
    displaycategories(categories);


    //search filters
    attachInputEventToFilters();


    //attach cart click listener
    attachCartEvents();



}


initApp();