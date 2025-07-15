// Enhanced product data with categories, descriptions, and images
const products = [
  {
    id: "product1",
    name: "Premium Running Shoes",
    desc: "Lightweight, breathable running shoes with advanced cushioning technology.",
    price: 2999,
    category: "fashion",
    image: "/shoes.jpeg",
  },
  {
    id: "product2",
    name: "Stylish Baseball Cap",
    desc: "Comfortable cotton cap with adjustable strap, perfect for casual wear.",
    price: 899,
    category: "fashion",
    image: "/cap.jpeg",
  },
  {
    id: "product3",
    name: "Smart Fitness Watch",
    desc: "Track your fitness goals with this feature-packed smartwatch.",
    price: 12999,
    category: "electronics",
    image: "/smartwatch.jpeg",
  },
  {
    id: "product4",
    name: "Travel Backpack",
    desc: "Durable, spacious backpack perfect for travel and daily use.",
    price: 2499,
    category: "accessories",
    image: "/bagpack.jpeg",
  },
  {
    id: "product5",
    name: "Polarized Sunglasses",
    desc: "UV protection sunglasses with polarized lenses for clear vision.",
    price: 1899,
    category: "accessories",
    image: "/sunglasses.jpeg",
  },
  {
    id: "product6",
    name: "Cotton T-Shirt",
    desc: "Soft, comfortable cotton t-shirt available in multiple colors.",
    price: 799,
    category: "fashion",
    image: "/tshirt.jpeg",
  },
  {
    id: "product7",
    name: "Gaming Laptop",
    desc: "High-performance laptop with dedicated graphics card for gaming.",
    price: 89999,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "product8",
    name: "Smartphone",
    desc: "Latest smartphone with advanced camera and long-lasting battery.",
    price: 24999,
    category: "electronics",
    image: "/public/smartphone.jpeg",
  },
  {
    id: "product9",
    name: "Professional Camera",
    desc: "DSLR camera with interchangeable lenses for photography enthusiasts.",
    price: 49999,
    category: "electronics",
    image: "/camera.jpeg",
  },
  {
    id: "product10",
    name: "Wireless Headphones",
    desc: "Noise-cancelling wireless headphones with premium sound quality.",
    price: 4999,
    category: "electronics",
    image: "/headphone.jpeg",
  },
];

// Cart management
let cart = [];
let currentFilter = "all";
let currentSort = "";

// Initialize cart from localStorage
function initializeCart() {
  const savedCart = localStorage.getItem("mycart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.error("Error parsing cart data:", e);
      cart = [];
    }
  }
  updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem("mycart", JSON.stringify(cart));
  } catch (e) {
    console.error("Error saving cart:", e);
  }
}

// Render products based on filter and search
function renderProducts(searchTerm = "") {
  const productsGrid = document.getElementById("products-grid");
  let filteredProducts = [...products]; // Create a copy

  // Apply search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply category filter
  if (currentFilter !== "all") {
    if (currentFilter === "price-low") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentFilter === "price-high") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    } else {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === currentFilter
      );
    }
  }

  // Clear and render products
  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
    return;
  }

  filteredProducts.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.style.animationDelay = `${index * 0.1}s`;

    productCard.innerHTML = `
            <div class="product-image-container">
                <img class="product-image" src="${product.image}" alt="${
      product.name
    }">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <div class="product-description">${product.desc}</div>
            <button class="add-to-cart-btn" onclick="addToCart('${
              product.id
            }')">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        `;

    productsGrid.appendChild(productCard);
  });
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
  updateCartDisplay();
  showSuccessMessage();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartDisplay();
  }
}

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const totalAmount = document.getElementById("total-amount");

  if (!cartItems || !cartCount || !cartTotal || !totalAmount) {
    console.error("Cart elements not found");
    return;
  }

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    cartTotal.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${
                          item.id
                        }', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${
                          item.id
                        }', 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${
                  item.id
                }')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
      )
      .join("");

    // Calculate and display total
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    totalAmount.textContent = total.toLocaleString();
    cartTotal.style.display = "block";
  }
}

// Show success message
function showSuccessMessage() {
  const message = document.getElementById("success-message");
  if (message) {
    message.classList.add("show");
    setTimeout(() => {
      message.classList.remove("show");
    }, 2000);
  }
}

// Filter functionality
function setupFilters() {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");
  const filterOptions = document.querySelectorAll(".filter-option");

  if (!filterBtn || !filterMenu) {
    console.error("Filter elements not found");
    return;
  }

  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterMenu.classList.toggle("active");
  });

  // Close filter menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!filterBtn.contains(e.target) && !filterMenu.contains(e.target)) {
      filterMenu.classList.remove("active");
    }
  });

  filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Update active filter
      filterOptions.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      currentFilter = option.dataset.filter;
      renderProducts(document.getElementById("search-box").value);
      filterMenu.classList.remove("active");
    });
  });
}

// Search functionality
function setupSearch() {
  const searchBox = document.getElementById("search-box");
  if (!searchBox) {
    console.error("Search box not found");
    return;
  }

  let searchTimeout;

  searchBox.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      renderProducts(e.target.value);
    }, 300);
  });
}

// Checkout functionality
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!checkoutBtn) {
    console.error("Checkout button not found");
    return;
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Simple checkout simulation
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (confirm(`Proceed to checkout?\nTotal: ₹${total.toLocaleString()}`)) {
      alert(
        "Order placed successfully! 🎉\nThank you for shopping with MyCart!"
      );
      cart = [];
      saveCart();
      updateCartDisplay();
    }
  });
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("MyCart application initializing...");

  try {
    initializeCart();
    renderProducts();
    setupFilters();
    setupSearch();
    setupCheckout();

    console.log("MyCart application initialized successfully!");
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});

// Additional utility functions for debugging
function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
  console.log("Cart cleared");
}

function getCartStats() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  console.log("Cart Statistics:", {
    items: totalItems,
    value: totalValue,
    products: cart.length,
  });

  return { totalItems, totalValue, productCount: cart.length };
}
