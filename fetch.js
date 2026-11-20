const API_URL = "http://localhost:3000/api";




async function postReservations(reservations) {

 
    let failedResIds = [];

    try {

        reservations.forEach(async (res) => {

           let response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                body: JSON.stringify(res),
                headers: { "Content-Type": "application/json" },
            });

            if(!response.ok) failedResIds.push(res.productId);
 
        })


        return failedResIds;


    } catch (error) {
        Swal.fire({
            title: 'Fetch products request error.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff0000',
        });
    }
}


async function fetchProducts() {
    try {
        let respone = await fetch(`${API_URL}/products`);

        if (respone.ok) {
            let products = respone.json();
            return products;
        }

    } catch (error) {
        Swal.fire({
            title: 'Fetch products request error.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff0000',
        });
    }
}

async function fetchProductById(id) {
    try {
        let response = await fetch(`${API_URL}/products/${id}`);

        if (response.ok) {
            let product = response.json();
            return product;
        }

    } catch (error) {
        Swal.fire({
            title: 'Fetch products request error.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff0000',
        });
    }
}

async function fetchProductsWithCriteria(queryParams) {
    try {

        let query = `search=${queryParams.searchValue}&inStock=${queryParams.inStock}`;

        (!queryParams.categoryId || queryParams.categoryId == 0) ? query += "" : query += `&categoryId=${queryParams.categoryId}`;
        (queryParams.maxPrice <= 0) ? query += "" : query += `&maxPrice=${queryParams.maxPrice}`;

        let respone = await fetch(`${API_URL}/products?${query}`);

        if (respone.ok) {
            let products = respone.json();
            return products;
        }

    } catch (error) {
        Swal.fire({
            title: 'Fetch products request error.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff0000',
        });
    }
}

async function fetchCategories() {
    try {
        let respone = await fetch(`${API_URL}/categories`);

        if (respone.ok) {
            let categories = respone.json();
            return categories;
        }

    } catch (error) {
        Swal.fire({
            title: 'Fetch categories request error.',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff0000',
        });
    }
}

