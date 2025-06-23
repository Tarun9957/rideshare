const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const drivers = [
  {
    name: "Michael Johnson",
    photo: "/placeholder-user.jpg",
    rating: 4.9,
    phone: "+1 (555) 123-4567",
    car: {
      model: "Toyota Camry",
      color: "Silver",
      licensePlate: "ABC-123"
    },
    isOnline: true,
    currentLocation: {
      latitude: 34.0522,
      longitude: -118.2437
    }
  },
  {
    name: "Jessica Williams",
    photo: "/placeholder-user.jpg",
    rating: 4.8,
    phone: "+1 (555) 987-6543",
    car: {
      model: "Honda Accord",
      color: "Black",
      licensePlate: "XYZ-789"
    },
    isOnline: true,
    currentLocation: {
      latitude: 34.0522,
      longitude: -118.2437
    }
  },
  {
    name: "Chris Brown",
    photo: "/placeholder-user.jpg",
    rating: 4.7,
    phone: "+1 (555) 555-5555",
    car: {
      model: "Ford Fusion",
      color: "White",
      licensePlate: "LMN-456"
    },
    isOnline: true,
    currentLocation: {
      latitude: 34.0522,
      longitude: -118.2437
    }
  }
];

async function seedDrivers() {
  const driversCollection = collection(db, "drivers");
  for (const driver of drivers) {
    await addDoc(driversCollection, driver);
  }
  console.log("Drivers seeded successfully!");
}

seedDrivers();
