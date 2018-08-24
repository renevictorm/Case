const restful = require ('node-restful')
constmongoose = restful.mongoose 

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

module.exports = restful.model('Case', caseSchema)
