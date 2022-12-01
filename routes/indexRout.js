const {Router}=require('express');
const router=new Router();

const fakeDataController=require('../controllers/fakeDataController');

router.get('/data', fakeDataController.getData );

module.exports=router;