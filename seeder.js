const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const sampleProducts = [
  // ===== ELECTRONICS =====
  {
    name: 'iPhone 15 Pro Max',
    description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x optical zoom. Features a 6.7-inch Super Retina XDR display.',
    price: 134900, discountedPrice: 129900, category: 'Electronics', brand: 'Apple', stock: 50, featured: true, ratings: 4.8, numReviews: 245,
    images: [{ url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&fit=crop' }],
    tags: ['smartphone', 'apple', '5g'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung flagship with 200MP camera, built-in S Pen, 5000mAh battery, and Snapdragon 8 Gen 3 processor.',
    price: 124999, discountedPrice: 114999, category: 'Electronics', brand: 'Samsung', stock: 40, featured: true, ratings: 4.7, numReviews: 189,
    images: [{ url: 'https://images.unsplash.com/photo-1707412911244-99ac5b1eb5c0?w=800&fit=crop' }],
    tags: ['smartphone', 'samsung', '5g'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life and multipoint connection.',
    price: 29990, discountedPrice: 24990, category: 'Electronics', brand: 'Sony', stock: 30, featured: true, ratings: 4.7, numReviews: 312,
    images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&fit=crop' }],
    tags: ['headphones', 'noise-canceling', 'wireless'],
  },
  {
    name: 'MacBook Pro 14"',
    description: 'MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display, and all-day battery life.',
    price: 199900, discountedPrice: 189900, category: 'Electronics', brand: 'Apple', stock: 20, featured: true, ratings: 4.9, numReviews: 567,
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&fit=crop' }],
    tags: ['laptop', 'apple', 'macbook'],
  },
  {
    name: 'iPad Air 5th Generation',
    description: 'Powerful iPad Air with M1 chip, 10.9-inch Liquid Retina display, Touch ID, and support for Apple Pencil.',
    price: 59900, discountedPrice: 54900, category: 'Electronics', brand: 'Apple', stock: 35, featured: false, ratings: 4.6, numReviews: 234,
    images: [{ url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&fit=crop' }],
    tags: ['tablet', 'apple', 'ipad'],
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Flagship killer with Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging, and 5400mAh battery.',
    price: 64999, discountedPrice: 59999, category: 'Electronics', brand: 'OnePlus', stock: 45, featured: false, ratings: 4.5, numReviews: 178,
    images: [{ url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&fit=crop' }],
    tags: ['smartphone', 'oneplus', '5g'],
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: '15.6-inch OLED 4K display, Intel Core i9, 32GB RAM, 1TB SSD. Premium laptop for power users.',
    price: 189990, discountedPrice: 174990, category: 'Electronics', brand: 'Dell', stock: 15, featured: false, ratings: 4.6, numReviews: 143,
    images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&fit=crop' }],
    tags: ['laptop', 'dell', 'windows'],
  },
  {
    name: 'Samsung 65" 4K QLED TV',
    description: '65-inch QLED 4K Smart TV with Quantum HDR, 120Hz refresh rate, built-in Alexa, and Gaming Hub.',
    price: 129990, discountedPrice: 99990, category: 'Electronics', brand: 'Samsung', stock: 12, featured: false, ratings: 4.7, numReviews: 289,
    images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834b?w=800&fit=crop' }],
    tags: ['tv', 'samsung', '4k'],
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with S9 chip, Double Tap gesture, always-on Retina display, blood oxygen sensor, and ECG app.',
    price: 41900, discountedPrice: 38900, category: 'Electronics', brand: 'Apple', stock: 60, featured: false, ratings: 4.8, numReviews: 421,
    images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&fit=crop' }],
    tags: ['smartwatch', 'apple', 'wearable'],
  },
  {
    name: 'Canon EOS R50 Camera',
    description: 'Mirrorless camera with 24.2MP APS-C sensor, 4K video, subject detection AF. Perfect for beginners and vloggers.',
    price: 74990, discountedPrice: 69990, category: 'Electronics', brand: 'Canon', stock: 18, featured: false, ratings: 4.5, numReviews: 96,
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&fit=crop' }],
    tags: ['camera', 'canon', 'photography'],
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Portable waterproof speaker with powerful sound, 12 hours battery life, and IP67 water and dust resistance.',
    price: 9999, discountedPrice: 7499, category: 'Electronics', brand: 'JBL', stock: 75, featured: false, ratings: 4.6, numReviews: 1243,
    images: [{ url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&fit=crop' }],
    tags: ['speaker', 'bluetooth', 'jbl'],
  },
  {
    name: 'Logitech MX Master 3 Mouse',
    description: 'Advanced wireless mouse with MagSpeed electromagnetic scrolling, ergonomic design, and 70-day battery life.',
    price: 8995, discountedPrice: 6995, category: 'Electronics', brand: 'Logitech', stock: 55, featured: false, ratings: 4.8, numReviews: 876,
    images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&fit=crop' }],
    tags: ['mouse', 'wireless', 'logitech'],
  },

  // ===== CLOTHING =====
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by two icons of big Air, the Nike Air Max 270 delivers a super-soft ride with its large Air unit in the heel.',
    price: 12995, discountedPrice: 9995, category: 'Clothing', brand: 'Nike', stock: 100, featured: true, ratings: 4.5, numReviews: 432,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop' }],
    tags: ['shoes', 'sports', 'running', 'nike'],
  },
  {
    name: "Levi's 511 Slim Jeans",
    description: 'Classic slim fit jeans in stretch denim for all-day comfort. Sits below the waist with a slim leg from hip to ankle.',
    price: 3999, discountedPrice: 2999, category: 'Clothing', brand: "Levi's", stock: 150, featured: false, ratings: 4.4, numReviews: 678,
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&fit=crop' }],
    tags: ['jeans', 'denim', 'casual'],
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Running shoes with responsive Boost midsole, Primeknit+ upper, and Continental rubber outsole for exceptional grip.',
    price: 14999, discountedPrice: 11999, category: 'Clothing', brand: 'Adidas', stock: 80, featured: false, ratings: 4.6, numReviews: 321,
    images: [{ url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&fit=crop' }],
    tags: ['shoes', 'running', 'adidas'],
  },
  {
    name: 'Allen Solly Formal Shirt',
    description: 'Premium cotton formal shirt with wrinkle-resistant finish. Perfect for office and formal occasions.',
    price: 1999, discountedPrice: 1299, category: 'Clothing', brand: 'Allen Solly', stock: 200, featured: false, ratings: 4.2, numReviews: 543,
    images: [{ url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&fit=crop' }],
    tags: ['shirt', 'formal', 'office'],
  },
  {
    name: "Puma Men's Hoodie",
    description: 'Comfortable fleece hoodie with kangaroo pocket and adjustable drawcord hood. Perfect for casual wear.',
    price: 2999, discountedPrice: 1999, category: 'Clothing', brand: 'Puma', stock: 120, featured: false, ratings: 4.3, numReviews: 267,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&fit=crop' }],
    tags: ['hoodie', 'casual', 'puma'],
  },
  {
    name: 'Zara Women Summer Dress',
    description: 'Elegant floral summer dress with V-neckline, midi length, and flowy fabric. Perfect for casual and semi-formal occasions.',
    price: 3499, discountedPrice: 2499, category: 'Clothing', brand: 'Zara', stock: 90, featured: false, ratings: 4.4, numReviews: 389,
    images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&fit=crop' }],
    tags: ['dress', 'women', 'summer', 'zara'],
  },

  // ===== BOOKS =====
  {
    name: 'Atomic Habits',
    description: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones by James Clear. The #1 New York Times bestseller.',
    price: 999, discountedPrice: 699, category: 'Books', brand: 'Avery', stock: 200, featured: false, ratings: 4.8, numReviews: 2891,
    images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&fit=crop' }],
    tags: ['self-help', 'habits', 'productivity'],
  },
  {
    name: 'Rich Dad Poor Dad',
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not by Robert T. Kiyosaki.',
    price: 499, discountedPrice: 349, category: 'Books', brand: 'Plata Publishing', stock: 300, featured: false, ratings: 4.6, numReviews: 4521,
    images: [{ url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&fit=crop' }],
    tags: ['finance', 'money', 'investing'],
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 699, discountedPrice: 499, category: 'Books', brand: 'Jaico Publishing', stock: 250, featured: false, ratings: 4.7, numReviews: 1876,
    images: [{ url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&fit=crop' }],
    tags: ['finance', 'psychology', 'money'],
  },
  {
    name: 'Zero to One',
    description: 'Notes on Startups, or How to Build the Future by Peter Thiel. Essential reading for entrepreneurs.',
    price: 599, discountedPrice: 449, category: 'Books', brand: 'Crown Business', stock: 180, featured: false, ratings: 4.5, numReviews: 1243,
    images: [{ url: 'https://images.unsplash.com/photo-1467991521834-fb8e202c7074?w=800&fit=crop' }],
    tags: ['startup', 'entrepreneurship', 'business'],
  },

  // ===== HOME & KITCHEN =====
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker and warmer.',
    price: 8999, discountedPrice: 6499, category: 'Home & Kitchen', brand: 'Instant Pot', stock: 45, featured: false, ratings: 4.6, numReviews: 567,
    images: [{ url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&fit=crop' }],
    tags: ['kitchen', 'cooking', 'appliance'],
  },
  {
    name: 'Philips Air Fryer XXL',
    description: 'Extra large 7.3L capacity air fryer with Rapid Air technology. Cook crispy food with up to 90% less fat.',
    price: 12999, discountedPrice: 9999, category: 'Home & Kitchen', brand: 'Philips', stock: 35, featured: false, ratings: 4.5, numReviews: 892,
    images: [{ url: 'https://images.unsplash.com/photo-1644066566800-37a66a1de1c4?w=800&fit=crop' }],
    tags: ['air-fryer', 'kitchen', 'healthy-cooking'],
  },
  {
    name: 'Dyson V12 Vacuum Cleaner',
    description: 'Cordless vacuum with laser dust detection, HEPA filtration, and up to 60 minutes of fade-free suction.',
    price: 44900, discountedPrice: 39900, category: 'Home & Kitchen', brand: 'Dyson', stock: 20, featured: false, ratings: 4.7, numReviews: 321,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop' }],
    tags: ['vacuum', 'cleaning', 'dyson'],
  },
  {
    name: 'Bombay Dyeing Bedsheet Set',
    description: 'Premium 100% cotton double bedsheet with 2 pillow covers. 300 thread count, soft and breathable.',
    price: 1999, discountedPrice: 1299, category: 'Home & Kitchen', brand: 'Bombay Dyeing', stock: 200, featured: false, ratings: 4.3, numReviews: 1543,
    images: [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&fit=crop' }],
    tags: ['bedsheet', 'cotton', 'home'],
  },

  // ===== SPORTS =====
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with alignment lines, eco-friendly TPE material. Perfect for all types of yoga.',
    price: 2499, discountedPrice: 1999, category: 'Sports', brand: 'Manduka', stock: 80, featured: false, ratings: 4.4, numReviews: 234,
    images: [{ url: 'https://images.unsplash.com/photo-1601925228925-f9028af2a96a?w=800&fit=crop' }],
    tags: ['yoga', 'fitness', 'exercise'],
  },
  {
    name: 'Decathlon Dumbbells Set',
    description: 'Adjustable dumbbell set from 2kg to 20kg. Rubber coated for floor protection. Perfect for home gym.',
    price: 4999, discountedPrice: 3999, category: 'Sports', brand: 'Decathlon', stock: 60, featured: false, ratings: 4.5, numReviews: 432,
    images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop' }],
    tags: ['dumbbells', 'gym', 'fitness'],
  },
  {
    name: 'Nivia Football Size 5',
    description: 'FIFA approved match football with 32-panel design, PU leather, latex bladder for consistent bounce.',
    price: 1299, discountedPrice: 999, category: 'Sports', brand: 'Nivia', stock: 150, featured: false, ratings: 4.3, numReviews: 876,
    images: [{ url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&fit=crop' }],
    tags: ['football', 'sports', 'outdoor'],
  },

  // ===== BEAUTY =====
  {
    name: 'The Ordinary Niacinamide 10%',
    description: 'High-strength vitamin and mineral blemish formula. Reduces appearance of blemishes and congestion.',
    price: 1290, discountedPrice: 999, category: 'Beauty', brand: 'The Ordinary', stock: 150, featured: false, ratings: 4.3, numReviews: 876,
    images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&fit=crop' }],
    tags: ['skincare', 'serum', 'beauty'],
  },
  {
    name: 'Lakme Eyeconic Kajal',
    description: 'Long-lasting smudge-proof kajal that lasts up to 16 hours. Rich black color with intense pigmentation.',
    price: 299, discountedPrice: 229, category: 'Beauty', brand: 'Lakme', stock: 300, featured: false, ratings: 4.4, numReviews: 3421,
    images: [{ url: 'https://images.unsplash.com/photo-1631214524020-3c69888d5b43?w=800&fit=crop' }],
    tags: ['kajal', 'makeup', 'eyes'],
  },
  {
    name: 'Mamaearth Vitamin C Face Wash',
    description: 'Brightening face wash with Vitamin C and Turmeric. Removes tan, brightens skin. 100% natural.',
    price: 399, discountedPrice: 299, category: 'Beauty', brand: 'Mamaearth', stock: 250, featured: false, ratings: 4.2, numReviews: 2134,
    images: [{ url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&fit=crop' }],
    tags: ['face-wash', 'skincare', 'vitamin-c'],
  },

  // ===== TOYS =====
  {
    name: 'LEGO Technic Bugatti',
    description: 'Build the iconic Bugatti Chiron with 3599 pieces. Features working 8-speed gearbox and aerodynamic spoiler.',
    price: 19999, discountedPrice: 16999, category: 'Toys', brand: 'LEGO', stock: 25, featured: false, ratings: 4.9, numReviews: 432,
    images: [{ url: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800&fit=crop' }],
    tags: ['lego', 'toys', 'building'],
  },
  {
    name: 'Hot Wheels Track Builder Set',
    description: '200-piece track builder set with loops, curves, launchers and 3 cars. For kids aged 5 and above.',
    price: 2999, discountedPrice: 2299, category: 'Toys', brand: 'Hot Wheels', stock: 70, featured: false, ratings: 4.5, numReviews: 654,
    images: [{ url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&fit=crop' }],
    tags: ['toys', 'cars', 'kids'],
  },

  // ===== GROCERY =====
  {
    name: 'Tata Tea Gold 500g',
    description: 'Premium blend of long and short leaf teas for a rich, aromatic cup. Perfect balance of strength and flavor.',
    price: 299, discountedPrice: 249, category: 'Grocery', brand: 'Tata', stock: 500, featured: false, ratings: 4.5, numReviews: 8976,
    images: [{ url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&fit=crop' }],
    tags: ['tea', 'beverage', 'grocery'],
  },
  {
    name: "Bagrry's Oats 1kg",
    description: 'Whole grain rolled oats, rich in fiber and protein. No added sugar or preservatives. Quick cook in 3 minutes.',
    price: 299, discountedPrice: 239, category: 'Grocery', brand: "Bagrry's", stock: 400, featured: false, ratings: 4.3, numReviews: 2341,
    images: [{ url: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&fit=crop' }],
    tags: ['oats', 'healthy', 'breakfast'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('✅ Users created');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  john@example.com / user123');

    const productsWithCreator = sampleProducts.map((p) => ({
      ...p,
      createdBy: admin._id,
    }));

    await Product.insertMany(productsWithCreator);
    console.log(`✅ ${sampleProducts.length} products created with fixed images!`);
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
