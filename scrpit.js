// Sample product data
const products = [
    {
        id: 1,
        name: "Designer Silk Saree",
        price: 3499,
        image: "https://picsum.photos/seed/saree1/300/300",
        description: "Exquisite designer silk saree with intricate embroidery. Perfect for special occasions and celebrations.",
        colors: ["Gold", "Red", "Green"],
        sizes: ["S", "M", "L"],
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Premium Handbag",
        price: 899,
        image: "https://picsum.photos/seed/handbag2/300/300",
        description: "Luxurious handbag crafted with genuine leather. Spacious and stylish for everyday use.",
        colors: ["Black", "Brown", "Tan"],
        sizes: ["One Size"],
        badge: "Premium"
    },
    {
        id: 3,
        name: "Casual Dress",
        price: 599,
        image: "https://picsum.photos/seed/dress3/300/300",
        description: "Comfortable yet stylish casual dress perfect for daily wear. Made with breathable fabric.",
        colors: ["Blue", "Pink", "White"],
        sizes: ["S", "M", "L", "XL"],
        badge: "New Arrival"
    },
    {
        id: 4,
        name: "Traditional Jewelry Set",
        price: 1299,
        image: "https://picsum.photos/seed/jewelry4/300/300",
        description: "Elegant traditional jewelry set with gold plating. Perfect complement to ethnic wear.",
        colors: ["Gold", "Silver", "Rose Gold"],
        sizes: ["One Size"],
        badge: "Limited Edition"
    },
    {
        id: 5,
        name: "Designer Watch",
        price: 2199,
        image: "https://picsum.photos/seed/watch5/300/300",
        description: "Stylish designer watch with premium build quality. A perfect accessory for any outfit.",
        colors: ["Black", "Silver", "Gold"],
        sizes: ["One Size"],
        badge: "Luxury"
    },
    {
        id: 6,
        name: "Fashion Sunglasses",
        price: 799,
        image: "https://picsum.photos/seed/sunglasses6/300/300",
        description: "Trendy sunglasses with UV protection. Elevate your style with these fashionable shades.",
        colors: ["Black", "Brown", "Tortoise"],
        sizes: ["One Size"],
        badge: "Trending"
    }
];

// Global variables
let cart = [];
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let quantity = 1;
const whatsappNumber = "918891519975"; // Updated WhatsApp number

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after page loads
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
    
    // Load products
    loadProducts();
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.getElementById('navLinks').classList.remove('active');
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">₹${product.price}</div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <a href="#" class="whatsapp-order" onclick="orderViaWhatsApp(${product.id})">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
            </div>
        </div>
    `;
    
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.product-actions')) {
            showProductModal(product);
        }
    });
    
    return card;
}

// Toggle view (grid/list)
function toggleView(view) {
    const productsGrid = document.getElementById('productsGrid');
    const buttons = document.querySelectorAll('.view-toggle button');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (view === 'list') {
        productsGrid.classList.add('list-view');
    } else {
        productsGrid.classList.remove('list-view');
    }
}

// Show product modal
function showProductModal(product) {
    currentProduct = product;
    selectedColor = product.colors[0];
    selectedSize = product.sizes[0];
    quantity = 1;
    
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `₹${product.price}`;
    document.getElementById('modalDescription').textContent = product.description;
    
    // Load color options
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = '';
    product.colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = color;
        btn.onclick = () => selectOption('color', color);
        if (color === selectedColor) btn.classList.add('selected');
        colorOptions.appendChild(btn);
    });
    
    // Load size options
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = '';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = size;
        btn.onclick = () => selectOption('size', size);
        if (size === selectedSize) btn.classList.add('selected');
        sizeOptions.appendChild(btn);
    });
    
    document.getElementById('quantity').textContent = quantity;
    document.getElementById('whatsappOrderModal').onclick = () => orderViaWhatsApp(product.id);
    document.getElementById('productModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Select option (color/size)
function selectOption(type, value) {
    if (type === 'color') {
        selectedColor = value;
        document.querySelectorAll('#colorOptions .option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === value) btn.classList.add('selected');
        });
    } else if (type === 'size') {
        selectedSize = value;
        document.querySelectorAll('#sizeOptions .option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === value) btn.classList.add('selected');
        });
    }
}

// Change quantity
function changeQuantity(change) {
    quantity = Math.max(1, quantity + change);
    document.getElementById('quantity').textContent = quantity;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = {
        ...product,
        quantity: 1,
        color: product.colors[0],
        size: product.sizes[0]
    };
    
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// Add to cart from modal
function addToCartFromModal() {
    if (!currentProduct) return;
    
    const cartItem = {
        ...currentProduct,
        quantity: quantity,
        color: selectedColor,
        size: selectedSize
    };
    
    const existingItem = cart.find(item => 
        item.id === currentProduct.id && 
        item.color === selectedColor && 
        item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    updateCartCount();
    showToast(`${currentProduct.name} added to cart!`);
    closeModal();
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Order via WhatsApp
function orderViaWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    const message = `Hello! I'm interested in ordering:\n\n` +
                   `Product: ${product.name}\n` +
                   `Price: ₹${product.price}\n` +
                   `Image: ${product.image}\n\n` +
                   `Please let me know the next steps.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}