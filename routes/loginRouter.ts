import {Router} from 'express';

const router = Router();

router.get('/', (req, res, next) => {
    res.send('login router 2');
});

export default router;
