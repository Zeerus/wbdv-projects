import '../font-awesome-4.7.0/css/font-awesome.css'
import '../css/float-grid.css'
import '../css/base-styles.css'
import './SiteHeader.css'
import './SiteHeader.html'
const nunjucks = require('nunjucks');

nunjucks.configure('./', {autoescape: true});

export default class SiteHeader {
    constructor(sections) {
        this.sections = sections;
    }

    render() {
        var headerAnchor = document.getElementById('site-header');
        headerAnchor.innerHTML = nunjucks.render('./SiteHeader.html', {sections: this.sections});
    }
}
