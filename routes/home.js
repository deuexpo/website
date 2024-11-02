import ElemPage from '#root/elems/page.js';
import Template from '#root/modules/template.js';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tpl = new Template('routes/home');
    tpl.set('text', 'Home page content');

    const page = new ElemPage(req);
    page.set('content', tpl);
    page.set('h1', 'Header 1');
    page.set('title', 'Home page');
    page.set('description', 'Home page description');
    res.send(await page.render());
  } catch (err) {
    next(err);
  }
});

export default router;
