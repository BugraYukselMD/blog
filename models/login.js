const mongoose = require('mongoose');
const { isEmail } = require('validator');

const loginSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Mail Adresi alanı boş bırakılamaz!'],
        validate: [isEmail, 'Geçerli bir mail adresi giriniz!']
    },
    password: {
        type: String,
        required: [true, 'Şifre alanı boş bırakılamaz!']
    }
});


module.exports = mongoose.model('Login', loginSchema);