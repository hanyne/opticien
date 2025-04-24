const mongoose = require('mongoose');
const LensStock = require('./models/LensStock');

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initialLensStock = [
  { name: 'Galaxy® CR Dark G15 D70 B6', stock: 50 },
  { name: 'Galaxy® CR Brun D70 B6', stock: 30 },
  { name: 'Galaxy® CR Dark Gray D70 B6', stock: 40 },
  { name: 'Galaxy® CR Dark G15 D80 B6', stock: 20 },
  { name: 'Galaxy® CR Brun D80 B6', stock: 25 },
  { name: 'Galaxy® Gris (0.00) 0.00 D70', stock: 60 },
  { name: 'Galaxy® Gris "New" (0.00) 0.00 D70', stock: 55 },
  { name: 'Galaxy® 56 Blue Max (0.00) 0.00 D70', stock: 35 },
  { name: 'Galaxy® Brun Blue Max (0.00) 0.00 D70', stock: 45 },
  { name: 'Galaxy® Gris Blue Max (0.00) 0.00 D70', stock: 50 },
  { name: 'Galaxy® 56 Asph Blue Max (0.00) 0.00 D72', stock: 15 },
];

const seedLensStock = async () => {
  try {
    await LensStock.deleteMany({});
    await LensStock.insertMany(initialLensStock);
    console.log('Lens stock seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedLensStock();