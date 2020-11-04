exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./e2e/login.spec.js', './e2e/giftcards.spec.js']
};