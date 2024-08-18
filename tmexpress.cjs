const express = require('express')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const fsExtra = require('fs-extra')
const app = express()
const stream = require('stream')
const util = require('util')
const basicAuth = require('basic-auth')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const nodemailer = require('nodemailer')
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ewpekrrizvktcwrinuqf.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cGVrcnJpenZrdGN3cmludXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMTE4NTMsImV4cCI6MjAzOTU4Nzg1M30.WK0mwr53ooz07u5dMgdDv6oeKupUkuR00XoKYj1be54'
const supabase = createClient(supabaseUrl, supabaseKey)
cloudinary.config({
	cloud_name: 'da9bojsxp',
	api_key: '684617786892636',
	api_secret: 'judU4-WKa_8p0zYCyEhRYfbargM',
})


// Middleware to protect a route with basic auth
const authMiddleware = (req, res, next) => {
	const user = basicAuth(req)

	// Replace with your own username and password
	const username = 'Mousa'
	const password = 'TripleM'

	if (!user || user.name !== username || user.pass !== password) {
		res.set('WWW-Authenticate', 'Basic realm="example"')
		return res.status(401).send('Access denied')
	}

	next()
}
// Routes
const indexRouter = require('./routes/index.cjs')
const adminRouter = require('./routes/jsonload.cjs')
const vehiclesRouter = require('./routes/vehicles.cjs')
const importRouter = require('./routes/import.cjs')
const aboutRouter = require('./routes/about.cjs')
const contactRouter = require('./routes/contact.cjs')
console.log('CUR DIR:::: ', __dirname)
 
// Use routes
app.use('/', (req, res, next) => {
	//	console.log('Handling request for /')
	indexRouter(req, res, next)
})

app.use('/admin', authMiddleware, (req, res, next) => {
	//console.log('Handling request for /admin')
	adminRouter(req, res, next)
})

app.use('/vehicles', (req, res, next) => {
	//	console.log('Handling request for /vehicles')
	vehiclesRouter(req, res, next)
})
// Use routes
app.use('/import', (req, res, next) => {
	//	console.log('Handling request for /')
	importRouter(req, res, next)
})

app.use('/contact', (req, res, next) => {
	//console.log('Handling request for /admin')
	contactRouter(req, res, next)
})

app.use('/about', (req, res, next) => {
	//	console.log('Handling request for /vehicles')
	aboutRouter(req, res, next)
})
app.set('view engine', 'ejs')
app.set('views', './public')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(
	cors({
		origin: '*', // Or use '*' to allow all origins
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as per your requirements
		//allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers as per your requirements
	})
)
// Set the view engine to EJS
// Static files
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	req.ind = 0 // Initialize req.ind

	next()
})

app.post('/upload', async (req, res) => {
	console.log('Upload request received')
	//console.log('Request body:', req.body)
	  if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).send('No files were uploaded.')
		}
	//console.log('Request files:', req.files)
	req.ind = 0 // Reset the index for each new submission
	 const files = Object.values(req.files.images); // Assuming 'images' is the field name
	//console.log('CUR FILES: ', req.files)
	try {
		const {
			make,
			model,
			year,
			price,
			mileage,
			engine,
			transmission,
			drive,
			exterior,
			interior,
			fuelEconomy,
			features,
			comments,
			vin,
		} = req.body
		// Define dir here

		//const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
		// Ensure the target directory exists
		//await fs.promises.mkdir(dir, { recursive: true })

		//console.log('UPLOADED: ', orderedFiles) // This will log the array of uploaded files in the correct order

		const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
		console.log('Processing Images...')

		// Process and upload images directly to Cloudinary
		const processedFiles = await Promise.all(
			files.map(async (file, index) => {
				try {
					// Process the image in memory
					const processedImageBuffer = await sharp(file.data)
						.resize(1024, 1024, { fit: 'cover' })
						.jpeg({ quality: 90 })
						.toBuffer()

					// Upload the processed image buffer directly to Cloudinary
					const uploadResult = await new Promise((resolve, reject) => {
						const uploadStream = cloudinary.uploader.upload_stream(
							{
								folder: `vehicles/${make}_${model}_${vin}`,
								public_id: `${index}`,
								format: 'jpg',
							},
							(error, result) => {
								if (error) {
									console.error('Error uploading to Cloudinary:', error)
									reject(error)
								} else {
									resolve(result)
								}
							}
						)

						const readableStream = require('stream').Readable.from(processedImageBuffer)
						readableStream.pipe(uploadStream)
					})

					// Return the Cloudinary URL
					return uploadResult.secure_url
				} catch (error) {
					console.error('Error processing image:', error)
					throw new Error('Failed to process and upload image')
				}
			})
		)

		// Join the Cloudinary URLs into a single string separated by commas (if multiple images)
		const imgPath = processedFiles.join(',')
		console.log('Processed.')
		console.log('Beginning Database Insertion...')

		// Insert data into Supabase
		const { data, error } = await supabase.from('Vehicles').insert([
			{
				make,
				model,
				year,
				price,
				mileage,
				engine,
				transmission,
				drive,
				exterior,
				interior,
				fuelEconomy,
				features,
				comments,
				vin,
				img: imgPath,
			},
		])

		if (error) throw error

		console.log('Data inserted into Supabase database successfully')
		res.json({ message: 'Data inserted into Supabase database' })
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred on the server.')
	} finally {
		// No need to clean up local files since we're not using the filesystem
		console.log('Form submission completed.')
	}
})
		
app.get('/listings', async (req, res) => {
	// Connect to your SQLite database and fetch listings
	// Respond with JSON data
	console.log("Fetching Listings...")
 try {
    const { data, error } = await supabase
      .from('Vehicles') // Assuming your table is named 'Vehicles'
      .select('*');

    if (error) {
      console.error('Error fetching listings:', error);
      return res.status(500).send('An error occurred on the server.');
    }

    res.json({ cars: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('An unexpected error occurred on the server.');
  }
});
// Route to handle individual car details
app.get('/cars/:make/:model/:vin', async (req, res) => {
	console.log("Pulling Listing...")
	// Extract make, model, and vin from the request parameters
	const { make, model, vin } = req.params

	// Query the database for the specific car details using the make, model, and vin
	 try {
    const { data, error } = await supabase
      .from('Vehicles') // Assuming your table is named 'Vehicles'
      .select('*')
      .eq('make', make)
      .eq('model', model)
      .eq('vin', vin)
      .single();

    if (error) {
      console.error('Error fetching car details:', error);
      return res.status(500).send('An error occurred on the server.');
    }

    if (!data) {
      return res.status(404).send('Car not found');
    }

    res.render('product', {
      year: data.year,
      make: data.make,
      model: data.model,
      price: data.price,
      mileage: data.mileage,
      engine: data.engine,
      transmission: data.transmission,
      drive: data.drive,
      exterior: data.exterior,
      interior: data.interior,
      fuelEconomy: data.fuelEconomy,
      features: data.features,
      comments: data.comments,
      vin: data.vin,
      img: data.img,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('An unexpected error occurred on the server.');
	 }
	console.log("Loaded Listing.")
})
// Handle form submission
/*
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com', // SMTP server for Gmail
	port: 587, // Port for TLS/STARTTLS
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'dmouse188@gmail.com', // Your Gmail address
		pass: 'your-email-password', // Your Gmail app password or OAuth2 token
	},
})

    // Email options
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender address
        to: 'virtual-email@yourdomain.com', // List of receivers
        subject: subject, // Subject line
        text: message, // Plain text body
        html: `<p>${message}</p>` // HTML body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});*/
app.use(
	express.static(path.join(__dirname, 'public'), {
		setHeaders: (res, path) => {
			if (path.endsWith('.js')) {
				res.set('Content-Type', 'application/javascript')
			}
			else if (path.endsWith('.css')) {
				res.set('Content-Type', 'text/css')
			} else if (path.endsWith('.svg')) {
				res.set('Content-Type', 'image/svg+xml')
			} // Add more MIME types as necessary
		},
	})
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
module.exports = app
