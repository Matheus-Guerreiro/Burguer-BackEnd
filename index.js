const express = require("express")
const uuid = require("uuid")
const cors = require('cors')

const port = process.env.PORT || "1337"
const app = express()
app.use(express.json())

app.use(cors())


const orders = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex( order => order.id === id)

   if(index < 0){
    return response.status(404).json({error: "User not found"})
   }

   request.userIndex = index
   request.userId = id

   next()
}

const methodAndUrl = (request, response, next) => {
    console.log(`[${request.method}]-${request.url}`)

    next()
}

app.get('/orders', methodAndUrl, (request, response) => {

    return response.json(orders)
})

app.post('/orders', methodAndUrl, (request, response) => {
   const { order, clientName, price, status} = request.body

   const newOrder = { id: uuid.v4(), order, clientName, price, status } 

   orders.push(newOrder)

   return response.json(newOrder)
})

app.put('/orders/:id', checkUserId, methodAndUrl, (request, response) => {
   const { order, clientName, price, status } = request.body
   const index = request.userIndex
   const id = request.userId

   const updateOrder = { id, order, clientName, price, status}


   orders[index] = updateOrder


    return response.json(updateOrder)
})


app.delete('/orders/:id', checkUserId, methodAndUrl, (request, response) => {
    const index = request.userIndex
    const id = request.userId

   orders.splice(index,1)


    return response.status(204).json()
})


app.get('/orders/:id', checkUserId, methodAndUrl, (request, response) => {

   const id = request.userId

   const order = orders.find( order => order.id === id)

    return response.json(order)
})


app.patch('/orders/:id', checkUserId, methodAndUrl, (request, response) => {

   const id = request.userId

   const index = orders.find( order => order.id === id)

   const updateOrder = index.status = "Pronto"

   if(index < 0){
    return response.status(404).json({error: "User not found"})
   }

   orders[index] = updateOrder


    return response.json({message: "Ready order"})
})




app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})