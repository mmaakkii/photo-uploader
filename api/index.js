const express = require('express')
const morgan = require('morgan')
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors')

const uploadDir = path.join(__dirname, `./photos/`);

let photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, uploadDir)
   },
   filename: function (req, file, cb) {
        cb(null, "Photo" + '_' + Date.now() + path.extname(file.originalname));
   }
})

const upload = multer({dest: 'photos/', storage: photoStorage});

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/photos", express.static('photos'));

app.get('/photos', (req, res) => {
    let files = fs.readdirSync('./photos')
    const allComments = JSON.parse(fs.readFileSync('./data/comments.json'))
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    files = files.map(item => {
        return {
            imageId: item,
            imageUrl: `${baseUrl}${item}`,
            commentsCount: allComments[item]?.length || 0
        }
    })

    res.json({
        success: true,
        photos: files
    })
})

app.post('/upload', upload.single("file"), (req, res) => {
    if (!req.file) {
        res.json({
            success: false,
            message: 'No file received'
        })
    } else {
        if (!req.file.mimetype.includes('image')) {
            return res.json({
                success: false,
                message: 'You can only upload images'
            })
        }
        res.json({
            success: true,
            message: 'File uploaded successfully'
        })
    }
});

app.post('/comments', (req, res) => {
    const { comment, photo } = req.body
    const allComments = JSON.parse(fs.readFileSync('./data/comments.json'))
    const photoComments = allComments[photo] 
    if (photoComments) {
        photoComments.push(comment)
        allComments[photo] = photoComments
    } else {
        allComments[photo] = [comment]
    }
    fs.writeFileSync('./data/comments.json', JSON.stringify(allComments), 'utf-8')
    res.json({
        success: true,
        comments: photoComments || [comment]
    })
})

app.get('/comments/:photo', (req, res) => {
    const { photo } = req.params
    const allComments = JSON.parse(fs.readFileSync('./data/comments.json'))
    const photoComments = allComments[photo]
    res.json({
        success: true,
        comments: photoComments || []
    })
})






const PORT = 4000

app.listen(PORT, error => {
    if(!error) 
        console.log(`Server running at port: ${PORT}`)
    else 
        console.log("Error occurred, server can't start", error);
    
})