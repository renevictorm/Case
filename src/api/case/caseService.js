const Case = require('./case')

Case.methods(['get', 'post','put', 'delete'])

Case.updateOptions({new:true, runValidators:true})

module.exports= Case