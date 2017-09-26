const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app});

app.get('/', function (req, res) {
    res.render('index.njk', {title: "Space Co - Home"});
});

app.get('/product', function(req, res){
    res.render('product.njk', {
        title: "Space Co - Products",
        items: [
            {id:    "earth-free-orbit",
             title: "Earth Free Orbit",
             price: "124999.99",
             image: "/img/products/product-free-orbit.jpg",
             description:"Go for an exciting float around the Earth in this package, see the stars like no earther has!"},
            {id:    "moon-base-stay",
             title: "Moon Base Stay",
             price: "249999.99",
             image: "/img/products/product-moon.jpg",
             description:"A two-week stay on our all inclusive Moon Base, help Space Co. help you!"},
            {id:    "mars-one-way",
             title: "Mars One-Way",
             price: "999999.99",
             image: "/img/products/product-mars.jpg",
             description:"For the bold! Our one way trip to Mars has everything you could ever ask for! Head on the journey of your life!"},
        ]
    });
});

app.get('/about', function(req, res) {
    res.render('about.njk', {title: "Space Co - About"});
});


app.get('/contact', function(req, res){
    res.render('contact.njk', {title: "Space Co - Contact"});
});

app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
