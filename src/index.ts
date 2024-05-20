import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import { envConfig } from './shared/config/env'
import router from './routes'

const PORT = envConfig.PORT;

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.use('/api', router)


app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})
