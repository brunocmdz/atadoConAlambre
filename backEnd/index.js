require('./model/user');
require('./model/item');

const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const sequelize = require('./config/database');
const User = require('./model/user');
const { getUser, registerUser, getUserByEmail, login, setUserState } = require('./controller/controller');
const { getItems, createItem, deleteItems, updateItem } = require('./controller/itemController');
const { isAuth, isAdmin } = require('./midlewares/auth');

app.use(express.json());

// Middleware para configurar los headers CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Rutas de usuario
app.get('/users', isAuth, isAdmin, getUser);
app.get('/users/:email', getUserByEmail);
app.post('/users/regist/', registerUser);
app.post('/users/login/', login);
app.put('/users/state', isAuth, isAdmin, setUserState);

// Rutas de herramientas y materiales (Items)
app.get('/items', getItems);
app.post('/items', createItem);
app.delete('/items', deleteItems);
app.put('/items/:id', updateItem);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true, force: false });

    const adminExists = await User.findOne({ where: { email: 'admin@atado.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@atado.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        state: true,
        role: 'admin',
        isAdmin: true
      });
    }

    console.log(`El servidor esta corriendo en el puerto ${port}`);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
});