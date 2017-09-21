import '../font-awesome-4.7.0/css/font-awesome.css'
import '../css/float-grid.css'
import '../css/base-styles.css'
import './SiteFooter.css'
import './SiteFooter.html'
const nunjucks = require('nunjucks');

nunjucks.configure('./', {autoescape: true});

export default class SiteFooter {
    constructor() {
    }

    render() {
        var footer = document.getElementById('site-footer');
        footer.innerHTML = nunjucks.render('./SiteFooter.html');

    }
}
