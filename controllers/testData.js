const chance=require('chance');
const {faker}=require('@faker-js/faker');
const {english_Alphabet, russian_Alphabet, french_Alphabet}=require('./alphabets');

const countries={
    russ:'ru',
    engl:'en',
    fren:'fr'
};

class FakeData {

    constructor({seed, page, size, err=0, local=countries[engl]}){        
        this.page=page || 0;
        this.size=size || 10;
        this.seed=seed+(this.page+this.size);
        this.err=err;
        this.local=local;
        this.chance=new chance(this.seed);
        this.faker=faker;
        this.faker.setLocale(this.local);
        this.faker.mersenne.seed(this.seed);
    }

    generateRandomData(){
        let users=[];
        let seed=this.seed>0?this.seed-1:this.seed+1;
        let startGen=this.page*this.size;
        let endGen=this.size+startGen;
        for(let i=startGen; i<endGen; i++){
            let oneUser={
                id:this.faker.datatype.uuid(),
                name:this.faker.name.fullName(),
                address: `${this.faker.address.city()} ${this.faker.address.street()} ${this.faker.address.buildingNumber()}`,
                phoneNumber: this.faker.phone.number()
            };
             if(this.err>1){                
                 for(let i=0;i<this.err; i++){  
                   // oneUser=this.randomConverter(oneUser);
                   oneUser=this.test(oneUser)
                } 
            } 
            users.push(oneUser);
        }

        
        if(this.err>0&&this.err<1  ){
            users=this.probabilisticErr(users);
        }
        return {users};
    };

    test(user){        
        let keys=Object.keys(user);
        let ranKey=this.chance.pickone(keys);
        return this.test2(ranKey, user)
    }
    test2(key, user){
        let converter=this.chance.pickone([
            "replaceLetters",
            "deleteLetters",
            "addLetters"]);
            
         if(user[key].length<=10){
            user[key]+=this.randomWord(1);
        }else if(user[key]>=50){
            return user;
        }else{
            user[key]=this[converter](user[key]);
        } 
        
        return user;
    }

    getCountryLocale(){
      return  this.local==countries.russ?'ru':this.local==countries.fren?'fr':'en';
    };

    getLocalChar(){
        return this.local==countries.russ?russian_Alphabet:this.local==countries.fren?french_Alphabet:english_Alphabet;
    }

    getLocalCharRand (){
        let char=this.getLocalChar();
        let id=this.chance.natural({min:0, max: char.length-1});
        return char[id];
    };

   /*  generateFakeUsers(funct){
        let startGen=this.page*this.size;
        let endGen=this.size+startGen;
        for(let i=startGen; i<endGen; i++){
            funct()
        }
    }; */

    probabilisticErr(usersArr){
        for(let i=0;i<usersArr.length;i++){
            let weig=this.chance.n(()=>this.err, usersArr.length);
            let user=this.chance.weighted(usersArr,weig);
            user=this.randomConverter(user)
        }
        return usersArr;
    };
    
    randomConverter(user){ 
        let keyRand=this.generageRandomKey(user);
       
        return this.userRandomConverter(keyRand, user);
    };

    userRandomConverter(key, user){
        
        let converter=this.chance.pickone([
            "replaceLetters",
            "deleteLetters",
            "addLetters"]);
        if(user[key].length<=10){
            user[key]+=this.randomWord(1);
        }else if(user[key]>=50){
            return user;
        }else{
            user[key]=this[converter](user[key]);
            
        }
        return user;
    };

    randomWord(len){
        let word='';
        for(let i=0;i<len;i++){
            word+=this.getLocalCharRand();
        }
        return word;
    };

    generageRandomKey(obj){
        
        let keys=Object.keys(obj);
        let ranKey=this.chance.pickone(keys);
        
        return ranKey;
    };

    replaceLetters(str){
        if(str.length<=1) {
            return this.randomWord(5);
        }
            let first=this.chance.natural({min:0, max:str.length-1});
            let second=this.chance.natural({min:0, max:str.length-1});
            
            /* return str.split('').map((el, ind)=>{
            ind===first? str[second]:ind===second?str[first]:el;
            }).join('');  */
        
        
        
        let newStr=str.split('').map((el, ind)=>{
            ind===first? str[second]:ind===second?str[first]:el;
        }).join('') 
        return newStr
               
    };

    deleteLetters(str){
        if(str.length===0) return this.randomWord(10);

        let id=0;
        if(str.length>1){
            id=this.chance.natural({min:0, max:str.length-1});
        }
        /* let newStr=str.split('').filter((el, ind)=>ind!==id).join(''); */
        return str.split('').filter((el, ind)=>ind!==id).join('');
    };

    addLetters(str){
        let char=this.getLocalCharRand();
        let id=0;
        if(str.length>1){
            id=this.chance.natural({min:0, max:str.length-1});
        }
        /* let newStr=str.split('').map((el, ind)=>(ind===id?el+char:el)).join(''); */
        return str.split('').map((el, ind)=>(ind===id?el+char:el)).join('');
    }

  

   
}

module.exports=FakeData;
