import 'dotenv/config'
import express from "express";
import connectToDB from './database/db.js';
import authRoutes from "./routes/auth-routes.js"
import homeRoutes from "./routes/home-routes.js"
import adminRoutes from "./routes/admin-routes.js"
import uploadImageRoutes from "./routes/image-routes.js"

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is now listening to PORT ${PORT}`);
})