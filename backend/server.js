const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트 임포트
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/board');

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/board', boardRoutes);

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB 연결 성공'))
.catch((err) => console.error('MongoDB 연결 실패:', err));

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 