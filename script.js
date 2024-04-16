const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
  let parentBtn = event.target.closest(".add-to-cart-btn");

  if (parentBtn) {
    const name = parentBtn.getAttribute("data-name");
    const price = parseFloat(parentBtn.getAttribute("data-price"));

    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.qtd += 1;
    return;
  } else {
    cart.push({
      name,
      price,
      qtd: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");

    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-5",
      "flex-col",
    );

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.qtd}</p>
          <p class="mt-2 font-medium">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="text-red-500 remove-btn" data-name="${item.name}">
          Remover
        </button>      
      </div>
    `;

    total += item.price * item.qtd;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerText = cart.length;
}

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.qtd > 1) {
      item.qtd -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (addressInput.value !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "O restaurante está fechado",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name}, Quantidade: (${item.qtd}), Preço: R$ ${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "19920009409";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank",
  );

  cart = [];
  updateCartModal();
});

const checkRestaurantOpen = () => {
  const data = new Date();
  const hora = data.getHours();

  return hora >= 18 && hora < 22;
};

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}
