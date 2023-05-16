import {Router} from 'express';

const router = Router();

router.get('/', (req, res, next) => {
    console.log('sign up router 2');
    res.send('sign up router 2'); 
});

export default router;
