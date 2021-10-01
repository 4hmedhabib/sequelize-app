const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const User = require('./models/user/User');
const Product = require('./models/products/Product');

const sequelize = require('./db/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send({ message: 'Welcome' });
});

app.get('/users/', (req, res) => {
	User.findAll()
		.then((users) => {
			if (users.length < 1) {
				return res.send({ message: 'Sorry not users registered' });
			}
			return res.send(users);
		})
		.catch((err) => {
			res.send(err);
		});
});

app.get('/users/:id', (req, res) => {
	User.findAll({ where: { id: req.params.id } })
		.then((user) => {
			res.send(user);
		})
		.catch((err) => {
			res.send(err);
		});
});

app.post('/users', (req, res) => {
	User.create({
		name: req.body.name,
		email: req.body.email
	})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
});

app.put('/users/:id', (req, res) => {
	const id = req.params.id;
	User.findByPk(id)
		.then((user) => {
			if (!user) {
				return res.send({ message: 'User does not exist!' });
			}
			user.name = req.body.name;
			user.email = req.body.email;
			return user.save();
		})
		.then((result) => {
			res.send({ ...result, message: 'Successfully Updated' });
		})
		.catch((err) => {
			res.send(err);
		});
});

app.delete('/users/:id', (req, res) => {
	const id = req.params.id;
	User.findByPk(id)
		.then((user) => {
			if (!user) {
				return res.send({ message: 'User does not exist!' });
			}
			return user.destroy();
		})
		.then((result) => {
			res.send({ result, message: `${result.name} has been successfully deleted!` });
		})
		.catch((err) => {
			res.send(err);
		});
});

app.get('/users/:id/products', (req, res) => {
	Product.findAll({
		attributes: [ 'name' ],
		include: [ { model: User, required: true, where: { id: req.params.id }, attributes: [ 'name' ] } ]
	})
		.then((products) => {
			return res.send(products);
		})
		.catch((err) => res.send(err));
});

// Product Routes
app.get('/products', (req, res) => {
	Product.findAll({ include: [ { model: User } ] })
		.then((products) => {
			if (products.length < 1) {
				return res.send({ message: 'Sorry products is empty!' });
			}
			return res.send({ products });
		})
		.catch((err) => {
			res.send(err);
		});
});

app.post('/products', (req, res) => {
	Product.create({
		name: req.body.name,
		price: req.body.price,
		userId: req.body.userId
	})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			return res.send(err);
		});
});

app.get('/products/:id', (req, res) => {
	const id = req.params.id;
	Product.findByPk(id)
		.then((product) => {
			res.send(res.send(product));
		})
		.catch((err) => {
			res.send(err);
		});
});

app.put('/products/:id', (req, res) => {
	const id = req.params.id;
	Product.findByPk(id)
		.then((product) => {
			if (!product) {
				res.send({ message: "Can't find this product" });
			}

			product.name = req.body.name;
			product.price = req.body.price;
			return product.save();
		})
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
});

app.delete('/products/:id', (req, res) => {});

User.hasMany(Product);
Product.belongsTo(User);

sequelize
	// .sync({ force: true })
	.sync()
	.then((result) => {
		console.log(result);
		console.log('Success!');
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		});
	})
	.catch((err) => console.log('ERR!'));
