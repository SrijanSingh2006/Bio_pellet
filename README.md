const fs = require('fs');

// Sexy README content
const readmeContent = `
# 🌱 Bio Pellet Plant Locator

> **Empowering a greener tomorrow, one plant at a time.**

---

## 🚀 Project Overview

**Bio Pellet Plant Locator** is a powerful, intuitive platform designed to help users locate the nearest bio pellet manufacturing plants based on their pincode.  
It promotes the use of **renewable energy** and **eco-friendly resources**, making green energy more accessible and practical for everyone.

---

## ✨ Features

- 🔍 **Smart Search**: Find nearby bio pellet plants instantly using a simple pincode search.
- 🏭 **Plant Database**: Pre-populated database of verified bio pellet manufacturers.
- 🛡️ **Secure Access**: Payment integration ensures premium access to plant information.
- 📍 **Interactive Map (Coming Soon)**: Visualize nearby plants on an embedded map.
- 🚀 **Fast & Responsive**: Built for performance with modern technologies.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Payment Integration |
|:--------:|:-------:|:---------:|:-------------------:|
| React.js | Node.js (Express) | MongoDB | PayPal API |

---

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/bio-pellet-plant-locator.git

# Navigate to project directory
cd bio-pellet-plant-locator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Run the backend server
cd ../backend
npm run dev

# Run the frontend
cd ../frontend
npm start
\`\`\`

---

## 🔑 Environment Variables

Make sure to add these variables to your \`.env\` file in the **backend** folder:

\`\`\`bash
MONGO_URI=your_mongodb_connection_string
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
\`\`\`

---

## 📸 Sneak Peek

> *Screenshots of the application coming soon... Stay tuned!*

---

## 🤝 Contributing

Contributions are warmly welcomed!  
If you have ideas to enhance the project, feel free to fork, create a new branch, and submit a pull request. Let’s make green energy more accessible together! 🌍

---

## 📄 License

Distributed under the **MIT License**.  
See \`LICENSE\` for more information.

---

## 🧡 Acknowledgments

- Thanks to all green energy supporters.
- Special shoutout to the open-source community for their amazing tools and libraries.
- Inspired by the vision of a sustainable future. 🌱

---

> **Bio Pellet Plant Locator** – *Building a cleaner, greener world, one plant at a time.*
`;

// Write the README.md file
fs.writeFile('README.md', readmeContent.trim(), (err) => {
    if (err) {
        console.error('❌ Error creating README.md:', err);
    } else {
        console.log('✅ README.md created successfully!');
    }
});
