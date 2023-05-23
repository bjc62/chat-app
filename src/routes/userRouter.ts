import {Router} from 'express';
import {User} from '../entity/User';
import {AppDataSource} from '../connection/dataSource';

const router = Router();

router.get('/:userEmail', async (req, res, next) => {
    console.log(`req.params: ${req.params.userEmail}`);
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({email: req.params.userEmail});
        if(user) {
            res.send(`user with email found: ${user?.email}`);
        } else {
            throw new Error(`User with email not found. ${req.params.userEmail}`);
        }
    } catch (error) {
        res.send(`error: ${error}`);
    }
});

export default router;
