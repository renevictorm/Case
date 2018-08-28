const restful = require ('node-restful')
const mongoose = restful.mongoose 
//SALT_WORK_FACTOR = 2;
//const bcrypt = require('bcrypt');

const caseSchema = new mongoose.Schema(
{
    merchantCnpj: {type: String, require:true},
    checkoutCode: {type: Number, require:true},
    cipheredCardNumber: {type: String, require:true},
    amountInCents: {type: Number, require:true},
    installments: {type: Number, require:true},
    aquirerName: {type: String, enum:['Stone', 'Cielo', 'Rede', 'GetNet','Redecard','Bin','Elavon'] ,require:true},
    paymentMethod: {type: String, enum: ['Voucher', 'Débito à Vista', 'Crédito à Vista','Crédito Parcelado','Crédito Parcelado Loja'] ,require:true},
    cardBrandName: {type: String, enum:['Elo Debito', 'Sodexo Refeicao','Sodexo','Elo', 'Visa','Maestro','Mastercard','Alelo Refeicao','Electron','Alelo','Credz'],require:true},
    status: {type: String, enum:['Aprovado', 'Reprovado'],require:true},
    statusInfo: {type: String,require:true},
    CreatedAt: {type: Date, require:true},
    AcquirerAuthorizationDateTime: {type: Date, require:true}

})
/* 

//Essa é uma alternativa a utilizar apenas uma substituição simples... 
//Aqui é feito um hash com os números do cartão exceto os últimos 4 números do cartão e guarda apenas a hash mais os últimos dígitos.

caseSchema.pre('save', function(next) {
    var caso = this;

   
    if (!caso.isModified('cipheredCardNumber')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) 
    {
        if (err) return next(err);

        // hash the password along with our new salt
        var final = caso.cipheredCardNumber.slice(caso.cipheredCardNumber.length -4, caso.cipheredCardNumber.length);
        var str = caso.cipheredCardNumber.slice(0, caso.cipheredCardNumber.length-4);
        bcrypt.hash(str, salt, function(err, hash) 
        {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            caso.cipheredCardNumber = hash + final;
            next();
        });
    });
});*/



//Apenas substitui os dígitos (exceto os últimos 4 ) para * com o objetvo de não guardar dados do cartão dos cliente no DB.
caseSchema.pre('save', function(next) 
{
    var caso = this;

   
    if (!caso.isModified('cipheredCardNumber')) return next();

    
    var final = caso.cipheredCardNumber.slice(caso.cipheredCardNumber.length -4, caso.cipheredCardNumber.length);
    caso.cipheredCardNumber = "************" + final;
     next();
      
});

//Validação do CNPJ
caseSchema.path('merchantCnpj').validate(function(merchantCnpj) 
{   
    cnpjSplit = merchantCnpj.split("");  
    //Checando o primeiro dígito
    
    weightsOne = [5,4,3,2,9,8,7,6,5,4,3,2 ];
    checkerOne = 0;
    digitResultOne = 0;
    
    for(i=0; i<12; i++) 
    {  
        digitResultOne = digitResultOne +( parseInt(cnpjSplit[i]) * weightsOne[i] )
    }

    if ((digitResultOne%11)>=2){checkerOne = 11-(digitResultOne%11)}else{checkerOne = 0}

    if ( (checkerOne)!= (parseInt(cnpjSplit[12]))){return false} //se for false não faz sentido calcular o segundo dígito
    
    
    //Checando o segundo dígito
    weightsTwo = [6,5,4,3,2,9,8,7,6,5,4,3,2 ];
    checkerTwo = 0;
    digitResultTwo = 0;
    
    for(i=0; i<13; i++) 
    {  
        digitResultTwo = digitResultTwo +( parseInt(cnpjSplit[i]) * weightsTwo[i] )
    }
    
    if ((digitResultTwo%11)>=2){checkerTwo = 11-(digitResultTwo%11)}else{checkerTwo = 0}


    if ( (checkerTwo) == (parseInt(cnpjSplit[13]))) {  return true }else{return false}

}, '{PATH} falhou na validação.');



//Validação do checkoutCode
caseSchema.path('checkoutCode').validate(function(checkoutCode) 
{ 
    if(checkoutCode>99999 || checkoutCode<0 ){ return false;}else{return true}

}, '{PATH} falhou na validação.');



//Validação do checkoutCode
caseSchema.path('amountInCents').validate(function(amountInCents) 
{ 
    if(amountInCents<0 ){ return false;}else{return true}

}, '{PATH} falhou na validação.');


//Validação dos installments and paymentMethod
caseSchema.path('installments').validate(function(installments) 
{   
    var caso = this;

    if(installments>1 )
    { 
        if(caso.paymentMethod =="Crédito Parcelado" || caso.paymentMethod == 'Crédito Parcelado Loja'){return true;}else{return false;}
        
    }

    
    if(installments<=0 )
    {
        return false;

    }if(installments == 1)
    {
        if(caso.paymentMethod =='Voucher' || caso.paymentMethod == 'Débito à Vista' || caso.paymentMethod == 'Crédito à Vista'){return true;}else{return false;}

    }

}, '{PATH} falhou na validação. o número de parcelas deve ser maior que 0 e deve corresponder ao modo de pagamento, à vista apenas uma parcela e parcelado mais de uma');

module.exports = restful.model('Case', caseSchema)

