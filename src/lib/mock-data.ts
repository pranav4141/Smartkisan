export const MOCK_USER = {
  id: "USR782910",
  name: "Rajesh Kumar",
  village: "Bishunpur",
  district: "Siwan",
  state: "Bihar",
  farm_size: "4.5 Acres",
  phone: "+91 98765 43210",
  email: "rajesh1234@gmail.com",
  joined_date: "March 2023",
  preferred_language: "Hindi",
  primary_crops: ["Wheat", "Rice", "Maize"],
  kisan_credit_card: "XXXX-XXXX-1234"
};

export const MOCK_FARMS = [
  { id: "f1", name: "North Meadow", location: "Siwan, Bihar", soil_type: "Loamy", area: "2.5 Acres" },
  { id: "f2", name: "Riverside Plot", location: "Siwan, Bihar", soil_type: "Clay", area: "2.0 Acres" }
];

export const MOCK_DEVICES = [
  { id: "d1", name: "Main Pump Controller", farm_id: "f1", sim_number: "+91 9876543210", status: "ON", last_active: "5 mins ago" },
  { id: "d2", name: "Drip Irrigation Unit", farm_id: "f2", sim_number: "+91 9876543211", status: "OFF", last_active: "2 hours ago" }
];

export const MOCK_CROP_ADVISORY = [
  { 
    id: "c1", 
    crop_name: "Wheat", 
    season: "Rabi (Oct-Mar)", 
    fertilizer: "NPK 12:32:16", 
    irrigation: "Every 15-20 days",
    description: "Standard staple crop with steady market demand.",
    advice: {
      fertilizer_details: ["Basal: DAP 50kg/acre", "Top Dress: Urea 25kg/acre"],
      irrigation_details: ["1st: Crown Root Initiation", "2nd: Tillering", "3rd: Jointing"]
    }
  },
  { 
    id: "c2", 
    crop_name: "Rice (Paddy)", 
    season: "Kharif (Jun-Nov)", 
    fertilizer: "Urea, DAP, Zinc", 
    irrigation: "Maintain 2-5cm standing water",
    description: "High water requirement, ideal for monsoon season.",
    advice: {
      fertilizer_details: ["Basal: DAP + Zinc Sulphate", "Top Dress: Urea in 3 splits"],
      irrigation_details: ["Transplanting stage", "Panicle Initiation", "Flowering stage"]
    }
  },
  { 
    id: "c3", 
    crop_name: "Maize (Corn)", 
    season: "Year-round", 
    fertilizer: "Nitrogen intensive", 
    irrigation: "Sensitive to waterlogging",
    description: "High profit potential for industrial use and poultry feed.",
    advice: {
      fertilizer_details: ["High Nitrogen basal dose", "Potash at knee-high stage"],
      irrigation_details: ["Knee-high stage", "Tasseling stage", "Silking stage"]
    }
  },
  { 
    id: "c4", 
    crop_name: "Makhana (Foxnut)", 
    season: "Dec-Aug", 
    fertilizer: "Organic manure preferred", 
    irrigation: "Stagnant shallow water (1-2 ft)",
    description: "Superfood with massive export potential. Native to North Bihar.",
    advice: {
      fertilizer_details: ["Cow dung manure", "Neem cake for pest control"],
      irrigation_details: ["Maintain pond level", "Regular cleaning of weeds"]
    }
  },
  { 
    id: "c5", 
    crop_name: "Potato", 
    season: "Rabi (Oct-Feb)", 
    fertilizer: "High Potash (K)", 
    irrigation: "Light but frequent",
    description: "Cash crop with quick returns and cold storage options.",
    advice: {
      fertilizer_details: ["Balanced NPK", "High Potash for tuber size"],
      irrigation_details: ["Stolon formation", "Tuberization", "Bulking stage"]
    }
  }
];

export const MOCK_MARKET_DATA = [
  { crop_name: "Wheat", market_name: "Siwan Mandi", price_per_quintal: 2275, state: "Bihar", updated_at: "2024-05-22T10:00:00Z" },
  { crop_name: "Wheat", market_name: "Patna Mandi", price_per_quintal: 2310, state: "Bihar", updated_at: "2024-05-22T09:30:00Z" },
  { crop_name: "Paddy (Rice)", market_name: "Siwan Mandi", price_per_quintal: 2183, state: "Bihar", updated_at: "2024-05-22T08:15:00Z" },
  { crop_name: "Potato", market_name: "Siwan Mandi", price_per_quintal: 1450, state: "Bihar", updated_at: "2024-05-22T07:45:00Z" },
  { crop_name: "Onion", market_name: "Patna Mandi", price_per_quintal: 1800, state: "Bihar", updated_at: "2024-05-22T11:20:00Z" },
  { crop_name: "Tomato", market_name: "Siwan Mandi", price_per_quintal: 1200, state: "Bihar", updated_at: "2024-05-22T06:30:00Z" },
  { crop_name: "Maize", market_name: "Chhapra Mandi", price_per_quintal: 2090, state: "Bihar", updated_at: "2024-05-22T10:45:00Z" },
  { crop_name: "Mango (Langra)", market_name: "Patna Mandi", price_per_quintal: 4200, state: "Bihar", updated_at: "2024-05-22T09:15:00Z" },
  { crop_name: "Cauliflower", market_name: "Siwan Mandi", price_per_quintal: 1600, state: "Bihar", updated_at: "2024-05-22T08:00:00Z" },
];

export const MOCK_POSTS = [
  {
    id: "p1",
    author: "Sunil Verma",
    text: "Has anyone tried the new bio-fertilizer for Maize? Looking for results in loamy soil.",
    comments: ["I tried it last season, results were good for yield but watch out for pests.", "Works great if applied after first rain."],
    likes: 12,
    created_at: "2 hours ago"
  }
];

export const MOCK_LOGS = [
  { id: "l1", device_id: "d1", action: "Turned ON", timestamp: "2024-05-22T06:30:00Z", source: "Schedule" },
  { id: "l2", device_id: "d1", action: "Turned OFF", timestamp: "2024-05-22T07:15:00Z", source: "Schedule" },
  { id: "l3", device_id: "d2", action: "Turned ON", timestamp: "2024-05-21T18:00:00Z", source: "Manual App" },
  { id: "l4", device_id: "d2", action: "Turned OFF", timestamp: "2024-05-21T18:45:00Z", source: "Manual App" },
];

export const MOCK_SCHEDULES = [
  { id: "s1", name: "Morning Water", time: "06:30 AM", duration: "45 mins", active: true, days: ["Daily"] },
  { id: "s2", name: "Evening Sprinkler", time: "05:00 PM", duration: "30 mins", active: false, days: ["Mon", "Wed", "Fri"] },
];

export const MOCK_FINANCE = {
  total_profit: "₹1,42,800",
  total_loss: "₹18,400",
  net_growth: "+14.2%",
  history: [
    { month: "Jan", profit: 12000, loss: 2000 },
    { month: "Feb", profit: 15000, loss: 3000 },
    { month: "Mar", profit: 18000, loss: 1500 },
    { month: "Apr", profit: 22000, loss: 4500 },
    { month: "May", profit: 28000, loss: 2000 },
    { month: "Jun", profit: 47800, loss: 5400 },
  ],
  prediction: "Your projected revenue for the upcoming Wheat harvest is ₹3.2 Lakhs, based on current high mandi rates in Siwan and Patna. We recommend early storage to capitalize on further price hikes predicted in July."
};
