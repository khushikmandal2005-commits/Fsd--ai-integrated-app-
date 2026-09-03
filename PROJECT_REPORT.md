# 🎓 Project Report: MessBites AI
## AI-Powered Cafeteria & Mess Menu Nutrition Scanner

---

## 1. Executive Summary
**Project Title**: MessBites AI  
**Developer**: Khushi Mandal  
**Domain**: Full-Stack Web Development, Artificial Intelligence (Computer Vision & NLP), HealthTech  
**Target Audience**: College Students, Hostel Diners, Cafeteria Managers  

MessBites AI is an intelligent web-based application designed to bridge the gap between college mess meal availability and student nutritional tracking. By scanning daily cafeteria menu boards or meal plates using computer vision or natural language input, the system evaluates calories, macronutrients, glycemic load, allergen warnings, and computes a standardized **0–100 Mess Health Rating**.

---

## 2. Problem Statement & Motivation
Most college students rely on campus mess halls for 3 meals a day. However, mess menus often present significant dietary challenges:
- High Carbohydrate & Low Protein Ratios (excessive rice/potatoes/bhaturas).
- Lack of calorie and macronutrient transparency.
- Difficulty for student athletes or fitness-conscious individuals to track daily BMR goals.

MessBites AI solves this by automating menu recognition and providing instant, actionable nutritional feedback in under 2 seconds.

---

## 3. System Architecture & Features

```
[ User Input: Camera Stream / Image Upload / NLP Text Input ]
                            │
                            ▼
     [ Client AI Engine & Express API Bridge (aiEngine.js) ]
       ├── Food Knowledge Base & Serving Scaler
       ├── 0-100 Mess Health Rating Algorithm
       ├── Allergen & Dietary Warning Engine
       └── BMR Daily Target Tracking System
                            │
                            ▼
     [ Interactive UI: Glassmorphism Dashboard + Chart.js ]
       ├── Nutrition Breakdown & Interactive Portion Adjuster
       ├── Analytics Trend Charts & Goal Tracker
       └── CSV Nutrition Report Exporter
```

### Key Technical Modules:
1. **Multi-Modal Scanner**:
   - Live HTML5 WebCam Stream capture.
   - File Upload (JPG/PNG menu board & food plate images).
   - Natural Language Parser ("Chole + 2 Roti + Rice").
2. **Nutritional Engine**:
   - Calculates Calories (kcal), Protein (g), Carbohydrates (g), Fats (g), and Fiber (g).
   - Dynamic Mess Score Algorithm (Protein Bonus, Fiber Index, Fat Penalty).
3. **Allergen & Health Warning System**:
   - Identifies Gluten, Dairy, High Sugar, and Heavy Oiliness in dishes.
4. **Analytics & Goal Tracker**:
   - Chart.js visualization of daily calorie intake and macronutrient ratios.
   - One-click CSV report export for evaluation presentation.

---

## 4. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | HTML5, Tailwind CSS 3, FontAwesome 6, Chart.js |
| **Client-Side AI Engine** | ES6 JavaScript, WebCam API, Canvas API |
| **Backend API Server** | Node.js, Express.js, Multer |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) + Knowledge Base |
| **Persistence** | Browser LocalStorage / JSON Database |

---

## 5. Algorithmic Rating Logic

```
Base Rating = 70
+ Protein Contribution:  (Protein ≥ 20g ? +12 : +6)
+ Fiber Bonus:           (Fiber ≥ 6g ? +10 : -8)
+ Carb/Protein Ratio:    (Ratio 2.5–4.5 ? +8 : -12)
- Fat/Oil Penalty:       (Fats > 25g ? -10 : 0)
Final Score = Clamp(Base + Bonuses - Penalties, 35, 98)
```

---

## 6. Conclusion & Future Scope
MessBites AI successfully provides a practical, user-friendly, and scientifically grounded solution to student cafeteria nutrition management. Future developments will include multi-language support (Hindi/Regional menu OCR) and direct integration with college mess administrative management systems.
