function getCartItems(){
    db.collection("cart-items").onSnapshot((snapshot)=>{
        let cartItems = [];
        snapshot.docs.forEach((doc)=>{
            cartItems.push({
                id: doc.id,
                ...doc.data()
                /* This is the longer way
                image: doc.data().image,
                name: doc.data().name,
                make: doc.data().make,
                rating: doc.data().rating,
                price: doc.data().price*/

                
            })

        })
        generateCartItems(cartItems);
        getTotalCost(cartItems)
    })
}
function getTotalCost(items){
    let totalCost = 0;
    items.forEach((item) => {
        totalCost += (item.price * item.quantity);
    })
     /* instead of using `$ ${totalCost}` use numeral for formating */
    document.querySelector(".total-cost-number").innerText = numeral(totalCost).format('$0,0.00');
}
function decreaseCount(itemid){
    let cartItem = db.collection("cart-items").doc(itemid);
    cartItem.get().then(function(doc){
        if(doc.exists){
            if(doc.data().quantity > 1){
                cartItem.update({
                    quantity: doc.data().quantity - 1      
                })
                
            }
        }
    })
}

function increaseCount(itemid){
    let cartItem = db.collection("cart-items").doc(itemid);
    cartItem.get().then(function(doc){
        if(doc.exists){
            if(doc.data().quantity > 0){
                cartItem.update({
                    quantity: doc.data().quantity + 1 
                })
            }
        }
    })
}

function deleteItem(itemid){
    db.collection("cart-items").doc(itemid).delete();
}

function generateCartItems(cartItems){
    let itemsHTML = "";
    cartItems.forEach((item)=>{
        
        itemsHTML += `
        
        <div class="cart-item flex items-center pb-4 border-b border-gray-200 ">
        <div class="cart-item-image w-40 h-24 bg-white rounded-lg p-4">
            <img class="w-full h-full object-contain" src="${item.image}" alt="">

        </div>
        <div class="cart-item-details flex-grow">
            <div class="cart-item-title font-bold text-sm text-gray-600">
                ${item.name}

            </div>
            <div class="cart-item-brand text-sm text-gray-400">
                ${item.make}

            </div>

        </div>
        <div  class="cart-item-counter w-48 flex items-center">
            <div data-id = "${item.id}" class="cart-item-decrease cursor-pointer text-gray-400 bg-gray-100 rounded h-6 w-6 flex justify-center items-center hover:bg-gray-200 mr-2">
                <i class="fas fa-chevron-left fa-xs"></i>

            </div>
            <h4 class="text-gray-400">${item.quantity}</h4>
            <div data-id = "${item.id}" class="cart-item-increase cursor-pointer text-gray-400 bg-gray-100 h-6 w-6 flex justify-center items-center hover:bg-gray-200 ml-2">
                <i class="fas fa-chevron-right fa-xs"></i>

            </div>

        </div>
        <div class="cart-item-total-cost font-bold w-48 text-gray-400">
            ${numeral(item.price * item.quantity).format('$0,0.00')}
        
      </div>
        <div data-id = "${item.id}" class="cart-item-delete w-10 text-gray-300 font-bold cursor-pointer hover:bg-gray-400 flex justify-center items-center">
            <i class="fas fa-times"></i>

        </div>

       </div>
        
        `

    })
    document.querySelector(".cart-items" ).innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners(){
  let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
  let increaseButtons = document.querySelectorAll(".cart-item-increase");
  let deleteButtons = document.querySelectorAll(".cart-item-delete");

  decreaseButtons.forEach((button) =>{
      button.addEventListener("click", function(){
          decreaseCount(button.dataset.id);
      })
  })

  increaseButtons.forEach((button) => {
      button.addEventListener("click", function(){
          increaseCount(button.dataset.id);
      })
  })

  deleteButtons.forEach((button) =>{
      button.addEventListener("click", function(){
          deleteItem(button.dataset.id);
      })
  })
}

getCartItems();