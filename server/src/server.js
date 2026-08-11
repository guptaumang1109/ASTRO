import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';
import { protect } from './middlewares/auth.js';
import { getCurrentUser } from './controllers/userController.js';

const app = express();

await connectDB() ;

//STRIPE WEBHOOKS
app.post('/api/stripe' , express.raw({type : 'application/json'}), stripeWebhooks);

//MIDDLEWARE & CORS
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));
app.use(express.json());

//SESSION MIDDLEWARE
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(session({
    name: 'astro_session',
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'astro-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 30 * 24 * 60 * 60 // 30 days in seconds
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
    }
}));

//ROUTES
app.get('/' , (req,res) => res.send('Server is Live'));
app.get('/api/me', protect, getCurrentUser);
app.use('/api/user' , userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message' , messageRouter);
app.use('/api/credit' , creditRouter);

//ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
});

const PORT = process.env.PORT || 3000 ;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

