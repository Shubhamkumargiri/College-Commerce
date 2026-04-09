const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const demoUsers = [
  {
    name: 'Aarav Mehta',
    email: 'aarav@college.edu',
    password: 'password123',
    campus: 'North Campus',
    location: 'Hostel Block A',
    bio: 'CS student selling gadgets and taking freelance UI work.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
  },
  {
    name: 'Siya Kapoor',
    email: 'siya@college.edu',
    password: 'password123',
    campus: 'Central Campus',
    location: 'Library Lane',
    bio: 'Literature student offering content writing and second-hand books.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Rohan Verma',
    email: 'rohan@college.edu',
    password: 'password123',
    campus: 'North Campus',
    location: 'Innovation Hub',
    bio: 'Electronics enthusiast renting calculators, headphones, and tablets.',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
];

async function ensureDemoUsers() {
  const users = {};

  for (const demoUser of demoUsers) {
    let user = await User.findOne({ email: demoUser.email });
    if (!user) {
      user = await User.create(demoUser);
    }
    users[demoUser.email] = user;
  }

  return {
    adminUser: users['aarav@college.edu'],
    writerUser: users['siya@college.edu'],
    gadgetUser: users['rohan@college.edu'],
  };
}

async function seedDatabase() {
  const { adminUser, writerUser, gadgetUser } = await ensureDemoUsers();

  const demoProducts = [
    {
      title: 'Operating Systems Textbook',
      description: 'Clean copy with highlighted key chapters and handwritten exam notes included.',
      price: 24,
      originalPrice: 32,
      category: 'Books',
      type: 'sell',
      seller: writerUser._id,
      campus: writerUser.campus,
      location: 'Central Library',
      isNearby: true,
      featured: true,
      tags: ['semester', 'cs', 'notes'],
      images: ['https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80'],
    },
    {
      title: 'MacBook Air for Weekend Projects',
      description: 'Rent for hackathons, assignments, and quick design work. Charger included.',
      price: 18,
      originalPrice: 25,
      category: 'Electronics',
      type: 'rent',
      seller: gadgetUser._id,
      campus: gadgetUser.campus,
      location: 'Innovation Hub',
      isNearby: true,
      featured: true,
      tags: ['laptop', 'hackathon', 'rent'],
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'],
    },
    {
      title: 'Content Writing for Clubs & Events',
      description: 'Posters, announcements, newsletters, and polished write-ups for college societies.',
      price: 12,
      category: 'Services',
      type: 'service',
      seller: writerUser._id,
      campus: writerUser.campus,
      location: 'Media Lab',
      featured: true,
      tags: ['writing', 'clubs', 'marketing'],
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80'],
    },
    {
      title: 'TI-84 Calculator',
      description: 'Perfect for engineering and maths exams, available for daily and weekly rent.',
      price: 9,
      originalPrice: 14,
      category: 'Electronics',
      type: 'rent',
      seller: gadgetUser._id,
      campus: gadgetUser.campus,
      location: 'Cafeteria Court',
      isNearby: true,
      tags: ['exam', 'engineering'],
      images: ['https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=900&q=80'],
    },
    {
      title: 'App Development Mentor',
      description: 'One-on-one guidance for React, Node.js, and project reviews before submissions.',
      price: 20,
      category: 'Services',
      type: 'service',
      seller: adminUser._id,
      campus: adminUser.campus,
      location: 'Startup Cell',
      tags: ['mentor', 'react', 'node'],
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'],
    },
    {
      title: 'Desk Lamp with USB Port',
      description: 'Bright study lamp with warm and cool light modes for late-night sessions.',
      price: 15,
      originalPrice: 22,
      category: 'Furniture',
      type: 'sell',
      seller: adminUser._id,
      campus: adminUser.campus,
      location: 'Hostel Reception',
      isNearby: true,
      tags: ['hostel', 'study'],
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'],
    },
  ];

  const existingTitles = new Set((await Product.find({}, 'title')).map((product) => product.title));
  const missingProducts = demoProducts.filter((product) => !existingTitles.has(product.title));

  if (missingProducts.length > 0) {
    await Product.insertMany(missingProducts);
  }

  const products = await Product.find().sort({ createdAt: 1 });

  if ((await Review.countDocuments()) === 0 && products.length >= 2) {
    await Review.create([
      {
        reviewer: adminUser._id,
        seller: writerUser._id,
        rating: 5,
        comment: 'Delivered the write-up on time and it looked very polished.',
      },
      {
        reviewer: writerUser._id,
        seller: gadgetUser._id,
        rating: 4,
        comment: 'Smooth rental process and the calculator worked perfectly.',
      },
    ]);
  }

  if ((await Order.countDocuments()) === 0 && products[0]) {
    await Order.create({
      buyer: adminUser._id,
      seller: writerUser._id,
      product: products[0]._id,
      status: 'completed',
      agreedPrice: 24,
      note: 'Picked up near the library entrance.',
    });
  }

  if ((await Message.countDocuments()) === 0 && products[1]) {
    const room = [adminUser._id.toString(), gadgetUser._id.toString()].sort().join('_');
    await Message.create([
      {
        sender: adminUser._id,
        receiver: gadgetUser._id,
        product: products[1]._id,
        room,
        content: 'Is the MacBook available this weekend?',
      },
      {
        sender: gadgetUser._id,
        receiver: adminUser._id,
        product: products[1]._id,
        room,
        content: 'Yes, I can reserve it for Saturday morning.',
      },
    ]);
  }

  if ((await Notification.countDocuments()) === 0) {
    await Notification.create({
      user: adminUser._id,
      title: 'Welcome to College Commerce',
      message: 'Your admin demo account is ready with seeded listings and orders.',
      type: 'system',
      link: '/admin',
    });
  }
}

module.exports = { seedDatabase };
