import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length > 100;
        console.log('zha testing', token);
        let decodedData;
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        } else {
            // decodedData = jwt.decode(token);
            req.userId = token; //google outh new lib returns sub directly
        }
        next();
    }catch (error) {
        console.log(error);
    }
}
export default auth;