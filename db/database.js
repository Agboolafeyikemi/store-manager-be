let users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin@12',
    role: ['admin'],
  },
  {
    id: 2,
    username: 'sa1',
    password: 'sa@1234',
    role: ['sa'],
  },
]

let products = [
  { id: 1, title: 'Iphone 6', category: 'Phone', quantity: 3, price: 250 },
]

exports.database = {
  users,
  products,
}
