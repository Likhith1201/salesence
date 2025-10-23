import { Router, type Router as RouterType } from 'express';
import { db } from '@scraper/db';
const router: RouterType = Router();

router.get('/', async (_req,res)=>{
  try{ await db.$queryRaw`SELECT 1`; res.json({ok:true, ts:new Date().toISOString(), db:'up'}); }
  catch(_e){ res.status(503).json({ok:false, db:'down'}); }
});

export default router;
