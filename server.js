import express from 'express';
import path from 'path';

const app = express();

app.use('/static', express.static(path.resolve('frontend', 'static')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('frontend', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('server started'));