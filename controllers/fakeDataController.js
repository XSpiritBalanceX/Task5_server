const FakeData=require('./fakeData');
const Test=require('./testData')

class FakeDataController{
    async getData(req, res){
        try{
            const {seed, page, size, err=0, local='en'}=req.query;
            /* const fakeData=new FakeData({
                seed:Number(seed),
                page:Number(page),
                size:Number(size),
                err:parseFloat(err),
                local:local
            }); */
            const fakeData=new FakeData({
                seed:Number(seed),
                page:Number(page),
                size:Number(size),
                err:parseFloat(err),
                local:local
            });
            //fakeData.generateRandomData()
            res.json(fakeData.generateRandomData());
        }catch (e){
            return res.status(500).json({message:'Something went wrong, please try again'});
        }
    }
}

module.exports=new FakeDataController();