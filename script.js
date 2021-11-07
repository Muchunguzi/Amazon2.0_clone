
function getItems(){
    let items = [];
    db.collection("items").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          items.push({
              id: doc.id,
              image: doc.data().image,
              name: doc.data().name,
              make: doc.data().make,
              rating: doc.data().rating,
              price: doc.data().price
          })
        });
        generateItems(items)
    });
    
}

function addToCart(items){
    console.log(items);
    let cartItem = db.collection("cart-items").doc(items.id);
    cartItem.get()
    .then(function(doc){
        if(doc.exists){
            cartItem.update({
                quantity: doc.data().quantity +1
            })
        }else{

            cartItem.set({
                image: items.image,
                make: items.make,
                name: items.name,
                rating:items.rating,
                price: items.price,
                quantity: 1
            })

        }
    })
    
    

}

function generateItems(items){
    let itemsHTML = "";
   items.forEach((items) =>{
      let doc = document.createElement("div");
      doc.classList.add("main-product", "mr-6");
      doc.innerHTML = `
      
      <div class="product-image bg-white w-48 h-52 rounded-lg p-4  ">
           <img class="w-full h-full object-contain" src="${items.image}" alt="nitendo switch store image">
       </div>
       <div class="product-name text-white font-bold mt-2 text-sm">
           ${items.name}
       </div>
       <div class="product-make text-white font-bold">
           ${items.make}
       </div>
       <div class="product-rating text-yellow-300 font-bold my-1">
           ⭐⭐⭐⭐⭐${items.rating}

       </div>
       <div class="product-price font-bold text-white text-lg">
           $${items.price}

       </div>
      `
      
      let addToCartEl = document.createElement("div");
      addToCartEl.classList.add("add-to-cart","h-8","w-28","bg-yellow-800", "text-white","font-bold","flex","justify-center","items-center","rounded","text-md","cursor-pointer","hover:bg-yellow-900");
      addToCartEl.innerHTML = "Add to cart";
      addToCartEl.addEventListener("click", function(){
          addToCart(items)
      })
      doc.appendChild(addToCartEl);
      document.querySelector(".main-section-products").appendChild(doc);
   })
}

getItems();