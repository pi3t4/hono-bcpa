import { Hono } from 'hono'

const app = new Hono()

// ----------------------
// In-memory user store
// ----------------------
const users = [
  { id: '1', name: 'Dawit', email: 'Dawit@gmail.com', password: 'dawit123' },
  { id: '2', name: 'Biruk', email: 'Biruk@gmail.com', password: 'Biruk1902' },
]

// ----------------------
// Root Route
// ----------------------
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// ----------------------
// 1. Get All Users
// ----------------------
app.get('/users', (c) => {
  return c.json(users)
})

// ----------------------
// 2. Get User by ID
// ----------------------
app.get('/users/:id', (c) => {
  const id = c.req.param('id')

  const user = users.find((u) => u.id === id)

  if (!user) {
    return c.json({ error: 'User was not found' }, 404)
  }

  return c.json(user)
})

// ----------------------
// 3. Signup
// ----------------------
app.post('/signup', async (c) => {
  const body = await c.req.json()

  const emailExists = users.some((u) => u.email === body.email)

  if (emailExists) {
    return c.json(
      { error: 'Someone already took that email, try another one!' },
      409
    )
  }

  const Id = (users.length + 1).toString()

  const newUser = {
    id: Id,
    name: body.name,
    email: body.email,
    password: body.password,
  }

  users.push(newUser)

  return c.json(
    {
      message: 'You signed up successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    201
  )
})

// ----------------------
// 4. Signin
// ----------------------
app.post('/signin', async (c) => {
  const body = await c.req.json()

  const user = users.find(
    (u) => u.email === body.email && u.password === body.password
  )

  if (!user) {
    return c.json(
      { error: 'that email or password is not right' },
      401
    )
  }

  return c.json({
    message: 'You are now logged in :)',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
})

export default app