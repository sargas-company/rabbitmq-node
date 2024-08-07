import { Router } from 'express';
import { sampleServiceController } from '../controllers';

const router = Router();

router.get('/', sampleServiceController.getSomeData);

export { router as sampleServiceRouter };
