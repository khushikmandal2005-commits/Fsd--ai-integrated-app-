const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial Data seed
const initialData = {
  users: [
    {
      id: 'usr_demo',
      email: 'student@college.edu',
      password: 'password123',
      name: 'Khushi Mandal',
      college: 'VIT Bhopal',
      createdAt: new Date().toISOString()
    }
  ],
  meals: [
    {
      id: 'meal_101',
      userId: 'usr_demo',
      mealName: 'Lunch - Chole + 2 Roti + Rice',
      foodItems: ['Chole Masala', '2 Wheat Roti', 'Steamed Rice'],
      calories: 580,
      protein: 18,
      carbs: 85,
      fats: 14,
      fiber: 9,
      messRating: 65,
      healthVerdict: 'Moderate balance. High carbs with decent protein. Consider adding curd or a fresh salad.',
      scannedAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: 'meal_102',
      userId: 'usr_demo',
      mealName: 'Dinner - Dal Tadka + 3 Roti + Paneer Butter Masala',
      foodItems: ['Dal Tadka', '3 Roti', 'Paneer Butter Masala'],
      calories: 640,
      protein: 24,
      carbs: 78,
      fats: 22,
      fiber: 8,
      messRating: 78,
      healthVerdict: 'Good protein content from Paneer and Dal! Well-balanced dinner meal.',
      scannedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'meal_103',
      userId: 'usr_demo',
      mealName: 'Breakfast - 3 Idli + Sambar + Coconut Chutney',
      foodItems: ['3 Steam Idli', 'Sambar', 'Coconut Chutney'],
      calories: 390,
      protein: 12,
      carbs: 62,
      fats: 9,
      fiber: 6,
      messRating: 82,
      healthVerdict: 'Light fermented breakfast rich in carbohydrates and good digestion qualities!',
      scannedAt: new Date().toISOString() // Today
    }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB file, re-initializing:', err);
    return initialData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

const db = {
  // Users
  findUserByEmail: (email) => {
    const data = readDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser: (user) => {
    const data = readDb();
    const newUser = {
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...user
    };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },

  // Meals
  getMealsByUserId: (userId) => {
    const data = readDb();
    return data.meals
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
  },

  addMeal: (meal) => {
    const data = readDb();
    const newMeal = {
      id: 'meal_' + Date.now(),
      scannedAt: new Date().toISOString(),
      ...meal
    };
    data.meals.push(newMeal);
    writeDb(data);
    return newMeal;
  },

  deleteMeal: (mealId, userId) => {
    const data = readDb();
    const index = data.meals.findIndex(m => m.id === mealId && m.userId === userId);
    if (index !== -1) {
      const deleted = data.meals.splice(index, 1);
      writeDb(data);
      return deleted[0];
    }
    return null;
  },

  // Stats calculation
  getStatsByUserId: (userId) => {
    const meals = db.getMealsByUserId(userId);
    if (!meals || meals.length === 0) {
      return {
        totalMeals: 0,
        avgCalories: 0,
        avgMessRating: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        dailyTrends: []
      };
    }

    const totalMeals = meals.length;
    const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const totalRating = meals.reduce((sum, m) => sum + (m.messRating || 0), 0);
    const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const totalFats = meals.reduce((sum, m) => sum + (m.fats || 0), 0);

    // Group meals by date
    const dailyMap = {};
    meals.forEach(m => {
      const dateStr = new Date(m.scannedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = { date: dateStr, calories: 0, rating: 0, count: 0 };
      }
      dailyMap[dateStr].calories += (m.calories || 0);
      dailyMap[dateStr].rating += (m.messRating || 0);
      dailyMap[dateStr].count += 1;
    });

    const dailyTrends = Object.values(dailyMap).map(d => ({
      date: d.date,
      calories: d.calories,
      avgRating: Math.round(d.rating / d.count)
    })).reverse();

    return {
      totalMeals,
      avgCalories: Math.round(totalCalories / totalMeals),
      avgMessRating: Math.round(totalRating / totalMeals),
      totalProtein,
      totalCarbs,
      totalFats,
      dailyTrends
    };
  }
};

module.exports = db;
