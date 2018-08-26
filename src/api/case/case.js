const restful = require ('node-restful')
const mongoose = restful.mongoose 

const caseSchema = new mongoose.Schema({
    merchantCnpj: {type: String, require:false},
    checkoutCode: {type: Number, require:false},
    cipheredCardNumber: {type: String, require:false},
    amountInCents: {type: Number, require:false},
    installments: {type: Number, require:false},
    aquirerName: {type: String, enum:['Stone', 'Cielo', 'Rede', 'GetNet','Redecard','Bin','Elavon'] ,require:false},
    paymentMethod: {type: String, enum: ['Voucher', 'Débito à Vista', 'Crédito à Vista','Crédito Parcelado','Crédito Parcelado Loja'] ,require:false},
    cardBrandName: {type: String, require:false},
    status: {type: String, require:false},
    statusInfo: {type: String, require:false},
    CreatedAt: {type: Date, require:false},
    AcquirerAuthorizationDateTime: {type: Date, require:false}

})


//Validação do CNPJ
caseSchema.path('merchantCnpj').validate(function(merchantCnpj) 
{   cnpjSplit = merchantCnpj.split("");  
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

module.exports = restful.model('Case', caseSchema)

/*
caseSchema.path('amountInCents').validate(function(amountInCents, ) 
{ 
    if(amountInCents<0 ){ return false;}else{return true}

}, '{PATH} falhou na validação.');

module.exports = restful.model('Case', caseSchema) */