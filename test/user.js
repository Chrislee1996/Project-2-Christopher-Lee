const bcrypstjs = require('bcryptjs')
const User = require('../models/user')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const assert = chai.assert

chai.use(chaiHttp)



