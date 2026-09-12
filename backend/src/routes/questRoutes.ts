import { Router } from 'express';
import {
  QuestController,
  createQuestSchema,
  updateQuestSchema,
} from '../controllers/questController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', QuestController.getQuests);
router.post('/', validateBody(createQuestSchema), QuestController.createQuest);
router.get('/:id', QuestController.getQuestById);
router.put('/:id', validateBody(updateQuestSchema), QuestController.updateQuest);
router.delete('/:id', QuestController.deleteQuest);
router.post('/:id/complete', QuestController.completeQuest);

export default router;
