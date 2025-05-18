const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 헤더에서 토큰 가져오기
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: '인증이 필요합니다.' });
        }

        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
}; 