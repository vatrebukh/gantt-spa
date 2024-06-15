import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use('/static', express.static(path.resolve('frontend', 'static')));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('frontend', 'index.html'));
});

app.listen(process.env.PORT || port, () => console.log(`server started on port ${port}`));