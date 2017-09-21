import './css/normalize.css'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

const siteheader = new SiteHeader([
    {address: '',
     name: 'Home'},
    {address: 'product',
     name: 'Product'},
    {address: 'about',
     name: 'About'},
    {address: 'contact',
     name: 'Contact'},]);
siteheader.render();

const sitefooter = new SiteFooter()
sitefooter.render();
