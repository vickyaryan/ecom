const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const strip = require('strip')(process.env.STRIPE_SECRET_KEY);

// Process strip payments => /api/v1/payment/process

exports.processPayment = catchAsyncErrors( async (req, res, next) => {

    const paymentIntent = await strip.paymentIntent.create({
        amount: req.body.amount,
        currency: 'usd',

        metadata: { integration_check : 'accept_a_payment' }
    })

    re.status(200).json({
        success: true,
        client_Secret: paymentIntent.client_Secret
    })
})

// Send stripe  API key => /api/v1/stripeapi

exports.sendStripApi = catchAsyncErrors( async (req, res, next) => {

    re.status(200).json({
        stripeApikey: process.env.STRIPE_API_KEY
    })
})