import jwt from 'jsonwebtoken';

const generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET_KEY ,
        { expiresIn: user.expiresIn ||process.env.JWT_EXPIRATION }
    );
    return token;
}

const validateToken = (token) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        return decoded;
    } catch (error) {
        console.log(`Error! ${error.name}`);
        return null;
    }
};

export {generateAuthToken , validateToken }