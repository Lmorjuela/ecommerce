async function getProducts(){
    try{
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const res = await data.json();
        window.localStorage.setItem("products", JSON.stringify(res));
        return res;

    } catch (error){
        console.log(error);
    }
}

function printProducts (db){
    const productsHTML = document.querySelector(".products");
    
    let html = "";
    for (const product of db.products) {
        const buttonAdd = product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : `<span class="soldOut">Sold Out</span>`

        html += `
        <div class="product">
             <div class="product_img">
                 <img src="${product.image}" alts="imagen"/>
            </div>
        
            <div class="product_info">
                <h3>$${product.price}.00
                    <span><b>Stock</b>: ${product.quantity}</span> 
                    ${buttonAdd}
                    
                </h3>
                
                <h4>${product.name}</h4>
            </div>
            </div>
        </div>`;
    }

    productsHTML.innerHTML = html;  
}

function handShowCart(){
    const iconBagHTML= document.querySelector(".bx-shopping-bag");
    const cartHTML= document.querySelector(".cart");

    let count =0;
    iconBagHTML.addEventListener("click",function(){
    cartHTML.classList.toggle("cart_show")
    })
}

function addToCartFromProducts(db){
    const productsHTML = document.querySelector(".products");
    
    productsHTML.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.id);

            let productFind = null;

            for(const product of db.products){
                if(product.id===id){
                    productFind = product;
                    break;
                }
            }
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount) 
                return alert("No tenemos más unidades disponibles");
                db.cart[productFind.id].amount++;
            } else {
                db.cart[productFind.id] = {...productFind, amount: 1};
            }

            window.localStorage.setItem("cart",JSON.stringify(db.cart));
            printProductsInCart(db);
            printTotal(db);
            handlePrintAmountProducts(db);
        }
    })
}

function printProductsInCart(db){
    const cardProducts = document.querySelector(".cart_products");
    let html ='';

    for (const product in db.cart) {
        
        const { quantity, price, name, image, id, amount } = db.cart[product];
        
        console.log({ quantity, price, name, image, id, amount });

        html += `
        <div class="cart_product">
            <div class="cart_product--img">
                <img src="${image}" alt="imagen">
            </div>

            <div class="cart_product--body">
                <h4>${name}</h4>
                <p>Stock: ${quantity} | <span>$${price}.00</span><p>
                <h4 class= "subtotal">Subtotal: $${amount*price}.00<h4>

    

                <div class="cart_product--body-op" id="${id}">
                <i class='bx bx-minus'></i>
                <span>${amount} unit</span>
                <i class='bx bx-plus' ></i>
                <i class='bx bx-trash-alt'></i>
                </div>

            </div>
        </div>
        `
    }
    cardProducts.innerHTML = html;
}

function handleProductInCart(db){
    const cartProducts = document.querySelector(".cart_products");

    cartProducts.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id);
            let productFind = null;

            for(const product of db.products){
                if(product.id===id){
                    productFind = product;
                    break;
                }
            }

            if(productFind.quantity === db.cart[productFind.id].amount) 
            return alert("No tenemos más unidades disponibles");

            db.cart[id].amount++;
        }

        if(e.target.classList.contains("bx-minus")){
            const id = Number(e.target.parentElement.id);

            if(db.cart[id].amount===1) {
                     const response = confirm("¿Estás seguro de que quieres eliminar este producto?");

                if(!response) return;
                delete db.cart[id];

            } else {
                db.cart[id].amount--;
            }
        }
        
        if(e.target.classList.contains("bx-trash-alt")){
            const id = Number(e.target.parentElement.id);
            const response = confirm("¿Estás seguro de que quieres eliminar este producto?");

            if (!response) return;
            delete db.cart[id];
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart))
        printProductsInCart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
    });
}

function printTotal(db){
    const infoTotal = document.querySelector(".info_total");
    const infoAmount = document.querySelector(".info_amount");

    let amountProducts = 0;
    let totalProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }

    infoTotal.textContent =  "$" + totalProducts + ".00";
    infoAmount.textContent = amountProducts + " items";
}

function handleTotal(db){
    const btnBuy = document.querySelector(".btn_buy");

    btnBuy.addEventListener("click", function(e){
        
        if(!Object.values(db.cart).length) 
        return alert ("No has seleccionado ningún producto para comprar");

        const response = confirm("¿Seguro que quieres comprar?");
        if(!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                })
            }else {
                currentProducts.push(product)
            }
            console.log({product, productsCart: db.cart[product.id]?.id});
        }

        db.products = currentProducts;
        db.cart={};
        
        window.localStorage.setItem("products", JSON.stringify(db.products))
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);
    })
}

function handlePrintAmountProducts(db){
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;

    for (const product in db.cart) {
        amount += db.cart[product].amount
    }

    amountProducts.textContent = amount;
}

function imageTransition() {
    const imagen = document.querySelector(".product_img");

    imagen.addEventListener("mouseenter", () => {
    imagen.classList.add("hover");

    imagen.addEventListener("mouseleave", () => {
    imagen.classList.remove("hover");
      });  
    });
}

function loading(){
    window.addEventListener("load", function () {
        const loading = document.getElementById("loading");
        setTimeout(() => {
          loading.style.display = "none";
        }, 2000);
      });
}

function filterProduct(db){
    const btnAll = document.querySelector(".showAllProducts");
    const btnShirt = document.querySelector(".shirt");
    const btnHoddies = document.querySelector(".hoddie");
    const btnSweater = document.querySelector(".sweater");
    const productsHTML = document.querySelector(".products");

    btnAll.addEventListener("click", function () {                     
        printProducts(db);
     });

     btnShirt.addEventListener("click", function () {
        const category = "shirt";
        const productsByCategory = db.products.filter(
            (product) => product.category === category);
            
            let html = "";

            for (product of productsByCategory) {
            const buttonAdd = product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : `<span class="soldOut">Sold Out</span>`
            
            html += `
                <div class="product">
                    <div class="product_img">
                        <img src="${product.image}" alts="imagen"/>
                    </div>
                
                    <div class="product_info">
                        <h3>$${product.price}.00
                            <span><b>Stock</b>: ${product.quantity}</span> 
                            ${buttonAdd} 
                        </h3>
                        
                        <h4>${product.name}</h4>
                    </div>
                    </div>
                </div>`
            }
            productsHTML.innerHTML = html;
      });


      btnHoddies.addEventListener("click", function () {
        const category = "hoddie";
        const productsByCategory = db.products.filter(
            (product) => product.category === category);
            
            let html = "";

            for (product of productsByCategory) {
            const buttonAdd = product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : `<span class="soldOut">Sold Out</span>`
            
            html += `
                <div class="product">
                    <div class="product_img">
                        <img src="${product.image}" alts="imagen"/>
                    </div>
                
                    <div class="product_info">
                        <h3>$${product.price}.00
                            <span><b>Stock</b>: ${product.quantity}</span> 
                            ${buttonAdd} 
                        </h3>
                        
                        <h4>${product.name}</h4>
                    </div>
                    </div>
                </div>`
            }
            productsHTML.innerHTML = html;
      });


      btnSweater.addEventListener("click", function () {
        const category = "sweater";
        const productsByCategory = db.products.filter(
            (product) => product.category === category);
            
            let html = "";

            for (product of productsByCategory) {
            const buttonAdd = product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : `<span class="soldOut">Sold Out</span>`
            
            html += `
                <div class="product">
                    <div class="product_img">
                        <img src="${product.image}" alts="imagen"/>
                    </div>
                
                    <div class="product_info">
                        <h3>$${product.price}.00
                            <span><b>Stock</b>: ${product.quantity}</span> 
                            ${buttonAdd} 
                        </h3>
                        
                        <h4>${product.name}</h4>
                    </div>
                    </div>
                </div>`
            }
            productsHTML.innerHTML = html;
      });
}

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };

    printProducts(db);
    handShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handleProductInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    imageTransition();
    loading();
    filterProduct(db);
}

main();
