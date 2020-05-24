const 
express = require('express');
app = express();

// template engine
hbs = require('express-handlebars')

// path
path = require('path');

// change layouts folder name to main, change partials folder name to elements
app
.engine('handlebars', hbs({ defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/main'), partialsDir:(__dirname, 'views/elements')}));
.set('view engine', 'handlebars')


//routing, renders index.html as homepage when a GET request is made
const contact = 'contact';

app.get('/', (req, res) => {
    const array = [
        {
            user1: {
                username: 'helloworld',
                age: 20,
                phone: 08324732
            }
        },

        {
            user2: {
                username: 'peanutbutter',
                age: 49,
                phone: 823074193
            }
        },

        {
            user3: {
                username: 'avocado',
                age: 34,
                phone: 1239084
            }
        },

        {
            user4: {
                username: 'boba',
                age: 12,
                phone: 4390482
            }
        }
    ];

    // using math.random to get a random user from the array
    const getUser = ({
        user: array[Math.floor(Math.random() * array.length)]
    });

    //send a user to home
    res.send(getUser);

});

app.get("/about", (req, res) => {
    res.render('about', { 
        title: 'about',
        name: 'me',
        description: 'lorem ipsum'
    });
});



app.listen(8000, () => {
    console.log("Server is starting at port ", 8000);
});


