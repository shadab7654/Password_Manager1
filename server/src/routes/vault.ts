import express from 'express';

import { getVault, updateVault } from '../controllers';

const router = express.Router();

router.get('/', getVault);
router.post('/', updateVault);

export default router;
