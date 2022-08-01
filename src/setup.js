const AboutUsFooter = require('./app/models/about_us_footer');
const SystemStore = require('./app/models/system_store');
const LocalStorage = require('LocalStorage'); //import LocalStorage
localStorage = new LocalStorage('./scratch');

    const aboutUsFooter = AboutUsFooter.find({});
    const systemStore = SystemStore.find({});
localStorage.setItem('aboutUsFooter', aboutUsFooter);
console.log(localStorage.getItem('aboutUsFooter'));