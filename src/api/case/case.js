const restful = require ('node-restful')
const mongoose = restful.mongoose 

const caseSchema = new mongoose.Schema({
    merchantCnpj: {type: String, require:true},
    checkoutCode: {type: Number, require:true},
    cipheredCardNumber: {type: String, require:true},
    amountInCents: {type: Number, require:true},
    installments: {type: Number, require:true},
    aquirerName: {type: String, require:true},
    paymentMehod: {type: String, require:true},
    cardBrandName: {type: String, require:true},
    status: {type: String, require:true},
    statusInfo: {type: String, require:true},
    CreatedAt: {type: Date, require:true},
    AcquirerAuthorizationDateTime: {type: Date, require:true}

})

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



module.exports = restful.model('Case', caseSchema)
